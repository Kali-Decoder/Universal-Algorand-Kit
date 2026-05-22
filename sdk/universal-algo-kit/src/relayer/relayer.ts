import { Contract, JsonRpcProvider } from "ethers";
import algosdk from "algosdk";
import type { UniversalAlgoKitConfig } from "../types.js";
import { UniversalAlgoKitError } from "../errors.js";
import { ARC_GATEWAY_ABI } from "../evm/abis.js";
import { arc4Selector, uint64ToBigEndianBytes } from "./arc4.js";
import { evmUserToAlgorandBytes } from "./address.js";
import { sendAlgorandAppCall } from "./algorand.js";
import { parseCounterCalldata, parseTodoCalldata } from "./intent-parsers.js";

type BoxRef = { appIndex: number; name: Uint8Array };

async function executeWithRetry<T>(fn: () => Promise<T>, retries: number) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  // unreachable
  throw new Error("executeWithRetry: exhausted");
}

export class AlgorandIntentRelayer {
  private readonly config: UniversalAlgoKitConfig;

  private provider!: JsonRpcProvider;
  private gateway!: Contract;
  private algod!: algosdk.Algodv2;
  private indexer?: algosdk.Indexer;
  private relayerAccount!: algosdk.Account;

  private lastProcessedBlock = 0;
  private readonly processedIntents = new Set<string>();

  constructor(config: UniversalAlgoKitConfig) {
    this.config = config;
  }

  async init() {
    const evm = this.config.evm;
    if (!evm.rpcUrl) throw new UniversalAlgoKitError("CONFIG", "Missing `evm.rpcUrl`");
    if (!evm.gatewayAddress) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `evm.gatewayAddress` / ARC_GATEWAY_ADDRESS");
    }

    const algo = this.config.algorand;
    if (!algo.algodUrl) throw new UniversalAlgoKitError("CONFIG", "Missing `algorand.algodUrl`");
    if (!algo.relayerMnemonic) {
      throw new UniversalAlgoKitError(
        "CONFIG",
        "Missing `algorand.relayerMnemonic` / ALGORAND_RELAYER_MNEMONIC (required for settlement)"
      );
    }

    this.provider = new JsonRpcProvider(evm.rpcUrl);
    this.gateway = new Contract(evm.gatewayAddress, ARC_GATEWAY_ABI, this.provider);
    this.algod = new algosdk.Algodv2(algo.algodToken ?? "", algo.algodUrl, "");
    if (algo.indexerUrl) {
      this.indexer = new algosdk.Indexer(algo.indexerToken ?? "", algo.indexerUrl, "");
    }
    this.relayerAccount = algosdk.mnemonicToSecretKey(algo.relayerMnemonic);
  }

  async start() {
    await this.init();

    const currentBlock = await this.provider.getBlockNumber();
    const lookback = this.config.relayer?.lookbackBlocks ?? 50;
    this.lastProcessedBlock = Math.max(0, currentBlock - lookback);

    // eslint-disable-next-line no-console
    console.log(`🤖 Relayer started (from block ${this.lastProcessedBlock + 1}, lookback=${lookback})`);
    // eslint-disable-next-line no-console
    console.log(`✅ Algorand relayer address: ${this.relayerAccount.addr}`);

    const pollInterval = this.config.relayer?.pollIntervalMs ?? 5000;
    while (true) {
      await this.pollOnce();
      await new Promise((r) => setTimeout(r, pollInterval));
    }
  }

  async pollOnce() {
    const confirmations = this.config.relayer?.confirmations ?? 3;
    const currentBlock = await this.provider.getBlockNumber();
    const safeBlock = currentBlock - confirmations;
    if (safeBlock <= this.lastProcessedBlock) return;

    const events = await this.gateway.queryFilter("*", this.lastProcessedBlock + 1, safeBlock);
    for (const e of events) {
      await this.handleIntent(e as any);
    }
    this.lastProcessedBlock = safeBlock;
  }

  private allowedTargets(): Set<string> {
    const configured = this.config.relayer?.allowedTargets?.filter(Boolean).map((s) => s.toLowerCase());
    if (configured && configured.length) return new Set(configured);

    const derived = [
      this.config.targets?.counterAddress,
      this.config.targets?.todoAddress,
    ]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase());
    return new Set(derived);
  }

  private resolveTargetAppId(target: string): number {
    const addr = target.toLowerCase();
    const { counterAddress, todoAddress } = this.config.targets ?? {};
    const { counterAppId, todoAppId } = this.config.appIds ?? {};

    if (counterAddress && addr === counterAddress.toLowerCase() && counterAppId) return counterAppId;
    if (todoAddress && addr === todoAddress.toLowerCase() && todoAppId) return todoAppId;
    throw new UniversalAlgoKitError("CONFIG", `No Algorand app id configured for target ${target}`);
  }

  private get executorAppId(): number {
    const id = this.config.appIds?.executorAppId;
    if (!id) throw new UniversalAlgoKitError("CONFIG", "Missing `appIds.executorAppId` / EXECUTOR_APP_ID");
    return id;
  }

  private validateTarget(target: string) {
    if (!this.allowedTargets().has(target.toLowerCase())) {
      throw new UniversalAlgoKitError("VALIDATION", `Unauthorized target ${target}`);
    }
  }

  private buildCounterAppArgs(eventData?: string): Uint8Array[] {
    if (!eventData || eventData === "0x") return [arc4Selector("increment()uint64")];
    const parsed = parseCounterCalldata(eventData);
    if (!parsed) throw new UniversalAlgoKitError("RELAYER", "Unable to parse counter calldata");
    if (parsed.name === "increment") return [arc4Selector("increment()uint64")];
    if (parsed.name === "decrement") return [arc4Selector("decrement()uint64")];
    throw new UniversalAlgoKitError("RELAYER", `Unsupported counter intent: ${parsed.name}`);
  }

  private buildTodoInnerAppArgs(userBytes: Uint8Array, nonce: number, eventData?: string): Uint8Array[] {
    const todoIdType = algosdk.ABIType.from("string");
    const textType = algosdk.ABIType.from("string");
    const byteArrayType = algosdk.ABIType.from("byte[]");

    if (!eventData || eventData === "0x") {
      throw new UniversalAlgoKitError("RELAYER", "Todo intents require calldata");
    }
    const parsed = parseTodoCalldata(eventData);
    if (!parsed) throw new UniversalAlgoKitError("RELAYER", "Unable to parse todo calldata");

    switch (parsed.name) {
      case "addTodo": {
        const text = String(parsed.args[0]);
        return [
          arc4Selector("add_todo(byte[],string,string)void"),
          new Uint8Array(byteArrayType.encode(userBytes)),
          new Uint8Array(todoIdType.encode(String(nonce))),
          new Uint8Array(textType.encode(text)),
        ];
      }
      case "toggleTodo": {
        const todoId = Number(parsed.args[0]);
        return [
          arc4Selector("toggle_todo(byte[],string)void"),
          new Uint8Array(byteArrayType.encode(userBytes)),
          new Uint8Array(todoIdType.encode(String(todoId))),
        ];
      }
      case "deleteTodo": {
        const todoId = Number(parsed.args[0]);
        return [
          arc4Selector("delete_todo(byte[],string)void"),
          new Uint8Array(byteArrayType.encode(userBytes)),
          new Uint8Array(todoIdType.encode(String(todoId))),
        ];
      }
      default:
        throw new UniversalAlgoKitError("RELAYER", `Unsupported todo intent: ${parsed.name}`);
    }
  }

  private buildExecutorCallArgs(userBytes: Uint8Array, targetAppId: number, innerAppArgs: Uint8Array[]) {
    const selector = arc4Selector("execute_with_data(address,uint64,byte[],byte[],byte[],byte[])void");

    const userArg = userBytes;
    const appIdArg = uint64ToBigEndianBytes(targetAppId);

    const byteArrayType = algosdk.ABIType.from("byte[]");
    const methodSelectorArg = new Uint8Array(byteArrayType.encode(innerAppArgs[0]));
    const arg1 = new Uint8Array(byteArrayType.encode(innerAppArgs[1] ?? new Uint8Array()));
    const arg2 = new Uint8Array(byteArrayType.encode(innerAppArgs[2] ?? new Uint8Array()));
    const arg3 = new Uint8Array(byteArrayType.encode(innerAppArgs[3] ?? new Uint8Array()));

    return [selector, userArg, appIdArg, methodSelectorArg, arg1, arg2, arg3];
  }

  private buildExecutorBoxes(params: {
    userBytes: Uint8Array;
    targetAppId: number;
    nonce: number;
  }): { boxes: BoxRef[]; foreignApps: number[] } {
    const relayerAddress = algosdk.decodeAddress(this.relayerAccount.addr);
    const relayerBoxName = new Uint8Array(
      Buffer.concat([Buffer.from("relayer_"), Buffer.from(relayerAddress.publicKey)])
    );

    const userBoxName = new Uint8Array(Buffer.concat([Buffer.from("nonce_"), params.userBytes]));

    const todoBoxName = new Uint8Array(
      Buffer.concat([Buffer.from("todos_"), params.userBytes, Buffer.from(String(params.nonce))])
    );

    return {
      boxes: [
        { appIndex: 0, name: relayerBoxName },
        { appIndex: 0, name: userBoxName },
        { appIndex: params.targetAppId, name: todoBoxName },
      ],
      foreignApps: [params.targetAppId],
    };
  }

  private async handleIntent(event: any) {
    const { user, target, nonce } = event.args ?? {};
    if (!user || !target || nonce === undefined) return;

    const intentId = `${user}-${nonce.toString()}`;
    if (this.processedIntents.has(intentId)) return;

    const start = Date.now();
    try {
      this.validateTarget(target);

      const data = event.args.data as string | undefined;
      if (data && data.length < 10) {
        throw new UniversalAlgoKitError("VALIDATION", "Invalid calldata");
      }

      const targetAppId = this.resolveTargetAppId(target);
      const userBytes = evmUserToAlgorandBytes(user);

      const todoLike =
        !!this.config.targets?.todoAddress &&
        target.toLowerCase() === this.config.targets.todoAddress.toLowerCase();

      let appId: number;
      let appArgs: Uint8Array[];
      let boxes: BoxRef[] | undefined;
      let foreignApps: number[] | undefined;
      let hasInnerTxn = false;

      if (todoLike) {
        const innerArgs = this.buildTodoInnerAppArgs(userBytes, Number(nonce), data);
        appArgs = this.buildExecutorCallArgs(userBytes, targetAppId, innerArgs);
        appId = this.executorAppId;
        const boxInfo = this.buildExecutorBoxes({
          userBytes,
          targetAppId,
          nonce: Number(nonce),
        });
        boxes = boxInfo.boxes;
        foreignApps = boxInfo.foreignApps;
        hasInnerTxn = true;
      } else {
        appArgs = this.buildCounterAppArgs(data);
        appId = targetAppId;
      }

      const maxRetries = this.config.relayer?.maxRetries ?? 3;
      const txId = await executeWithRetry(
        () =>
          sendAlgorandAppCall({
            algod: this.algod,
            sender: this.relayerAccount.addr,
            secretKey: this.relayerAccount.sk,
            appId,
            appArgs,
            boxes,
            foreignApps,
            hasInnerTxn,
          }),
        maxRetries
      );

      const ms = Date.now() - start;
      // eslint-disable-next-line no-console
      console.log(`✅ Intent ${intentId} settled on Algorand: ${txId} (${ms}ms)`);
      this.processedIntents.add(intentId);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(`❌ Intent ${intentId} failed: ${err?.message ?? String(err)}`);
    }
  }
}

