import { ethers } from "ethers";
import algosdk from "algosdk";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";

dotenv.config();

// -------------------- CONFIG --------------------
const SOURCE_RPC =
  process.env.SOMNIA_TESTNET_RPC_URL ||
  "https://dream-rpc.somnia.network/";

const ALGORAND_ALGOD_URL =
  process.env.ALGORAND_ALGOD_URL ||
  process.env.ALGORAND_TESTNET_ALGOD_URL ||
  "https://testnet-api.algonode.cloud";

const ALGORAND_ALGOD_TOKEN = process.env.ALGORAND_ALGOD_TOKEN || "";

const ALGORAND_INDEXER_URL =
  process.env.ALGORAND_INDEXER_URL ||
  process.env.ALGORAND_TESTNET_INDEXER_URL ||
  "https://testnet-idx.algonode.cloud";

const ALGORAND_INDEXER_TOKEN = process.env.ALGORAND_INDEXER_TOKEN || "";

const RELAYER_MNEMONIC =
  process.env.ALGORAND_RELAYER_MNEMONIC || process.env.RELAYER_MNEMONIC || "";

const ARC_GATEWAY_ADDRESS = process.env.ARC_GATEWAY_ADDRESS!;

const COUNTER_ADDRESS = (process.env.COUNTER_ADDRESS || "").toLowerCase();
const TODO_ADDRESS = (process.env.TODO_ADDRESS || "").toLowerCase();

const COUNTER_APP_ID = Number(process.env.COUNTER_APP_ID || 0);
const TODO_APP_ID = Number(process.env.TODO_APP_ID || 0);
const EXECUTOR_APP_ID = Number(process.env.EXECUTOR_APP_ID || 0);

const TARGET_APP_IDS = new Map<string, number>([
  [COUNTER_ADDRESS, COUNTER_APP_ID],
  [TODO_ADDRESS, TODO_APP_ID],
]);

const POLL_INTERVAL = Number(process.env.RELAYER_POLL_INTERVAL || 5000);
const CONFIRMATIONS = 3;
const MAX_RETRIES = 3;

// -------------------- STORAGE --------------------
const INTENT_HISTORY_FILE = path.resolve(
  __dirname,
  "../../public/intent-history.json"
);

// -------------------- SECURITY --------------------
const ALLOWED_TARGETS = new Set([
  COUNTER_ADDRESS,
  TODO_ADDRESS,
]);

const userRateLimit = new Map<string, number>();
const userNonces = new Map<string, number>();

// -------------------- ABIs --------------------
const ARC_GATEWAY_ABI = [
  "event IntentForwarded(address indexed user, address indexed target, uint256 nonce, uint256 timestamp)",
  "event IntentForwardedWithData(address indexed user, address indexed target, bytes data, uint256 nonce, uint256 timestamp)",
];

const COUNTER_ABI = [
  "function increment() external",
  "function decrement() external",
  "function getCounter() external view returns (uint256)",
];

const TODO_ABI = [
  "function addTodo(string memory text) external returns (uint256)",
  "function toggleTodo(uint256 id) external",
  "function deleteTodo(uint256 id) external",
];

// -------------------- UTIL --------------------
async function executeWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function checkRateLimit(user: string) {
  const count = userRateLimit.get(user) || 0;
  if (count > 10) throw new Error("Rate limit exceeded");
  userRateLimit.set(user, count + 1);
}

function validateNonce(user: string, nonce: number) {
  if (!userNonces.has(user)) {
    // First time seeing this user in this relayer process; assume the event
    // nonce is the next expected and seed state accordingly.
    userNonces.set(user, nonce - 1);
  }
  const last = userNonces.get(user) || 0;
  if (nonce !== last + 1) {
    throw new Error("Invalid nonce order");
  }
  userNonces.set(user, nonce);
}

function validateTarget(target: string) {
  if (!ALLOWED_TARGETS.has(target.toLowerCase())) {
    throw new Error("Unauthorized target");
  }
}

function validateCalldata(data?: string) {
  if (data && data.length < 10) {
    throw new Error("Invalid calldata");
  }
}

function toUint64Bytes(value: number | bigint): Uint8Array {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(value));
  return new Uint8Array(buffer);
}

function arc4Selector(signature: string): Uint8Array {
  const digest = crypto.createHash("sha512-256").update(signature).digest();
  return new Uint8Array(digest.subarray(0, 4));
}

function getAlgorandMnemonic() {
  if (!RELAYER_MNEMONIC) {
    throw new Error(
      "Missing ALGORAND_RELAYER_MNEMONIC or RELAYER_MNEMONIC for Algorand settlement"
    );
  }
  return RELAYER_MNEMONIC;
}

function parseTargetAppId(target: string) {
  const appId = TARGET_APP_IDS.get(target.toLowerCase());
  if (!appId) {
    throw new Error(`No Algorand app id configured for target ${target}`);
  }
  return appId;
}

function sourceUserToAlgorandBytes(user: string): Uint8Array {
  // Convert Ethereum address (20 bytes) to 32-byte format for Algorand
  // Pad with zeros on the left to make it 32 bytes
  const ethAddress = ethers.getBytes(ethers.getAddress(user)); // 20 bytes
  const padded = new Uint8Array(32);
  padded.set(ethAddress, 12); // Place 20-byte address at offset 12, leaving 12 bytes of zero padding
  return padded;
}

function parseTodoIntent(data: string) {
  console.log(`🔍 Parsing todo calldata: ${data.slice(0, 50)}...`);
  console.log(`   Selector: ${data.slice(0, 10)}`);
  
  // Manual decode based on selector
  const selector = data.slice(0, 10);
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  
  // addTodo(string): 0x95ffebf5
  if (selector === "0x95ffebf5") {
    const decoded = abiCoder.decode(["string"], "0x" + data.slice(10));
    console.log(`   ✅ Decoded addTodo: ${decoded[0]}`);
    return {
      name: "addTodo",
      args: [decoded[0]],
    };
  }
  
  // toggleTodo(uint256): 0xdc00282c
  if (selector === "0xdc00282c") {
    const decoded = abiCoder.decode(["uint256"], "0x" + data.slice(10));
    console.log(`   ✅ Decoded toggleTodo: ${decoded[0]}`);
    return {
      name: "toggleTodo",
      args: [decoded[0]],
    };
  }
  
  // deleteTodo(uint256): 0x6e3c6738
  if (selector === "0x6e3c6738") {
    const decoded = abiCoder.decode(["uint256"], "0x" + data.slice(10));
    console.log(`   ✅ Decoded deleteTodo: ${decoded[0]}`);
    return {
      name: "deleteTodo",
      args: [decoded[0]],
    };
  }
  
  throw new Error(`Unknown todo function selector: ${selector}`);
}

function parseCounterIntent(data: string) {
  const iface = new ethers.Interface(COUNTER_ABI);
  return iface.parseTransaction({ data });
}

async function sendAlgorandAppCall(params: {
  algod: algosdk.Algodv2;
  sender: string;
  secretKey: Uint8Array;
  appId: number;
  appArgs: Uint8Array[];
  boxes?: { appIndex: number; name: Uint8Array }[];
  foreignApps?: number[];
  hasInnerTxn?: boolean;
}) {
  const suggestedParams = await params.algod.getTransactionParams().do();
  
  // If the app call will create inner transactions, we need to cover their fees
  if (params.hasInnerTxn) {
    // Base fee (1000) + inner txn fee (1000) = 2000 minimum
    suggestedParams.fee = 2000;
    suggestedParams.flatFee = true;
  }
  
  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: params.sender,
    appIndex: params.appId,
    appArgs: params.appArgs,
    suggestedParams,
    boxes: params.boxes,
    foreignApps: params.foreignApps,
  });
  const signed = txn.signTxn(params.secretKey);
  const { txId } = await params.algod.sendRawTransaction(signed).do();
  await algosdk.waitForConfirmation(params.algod, txId, 4);
  return txId;
}

function buildCounterAppArgs(eventData?: string): Uint8Array[] {
  if (!eventData || eventData === "0x") {
    return [arc4Selector("increment()uint64")];
  }

  const parsed = parseCounterIntent(eventData);
  if (!parsed) {
    throw new Error("Unable to parse counter calldata");
  }

  if (parsed.name === "increment") {
    return [arc4Selector("increment()uint64")];
  }

  if (parsed.name === "decrement") {
    return [arc4Selector("decrement()uint64")];
  }

  throw new Error(`Unsupported counter intent: ${parsed.name}`);
}

function buildTodoInnerAppArgs(userBytes: Uint8Array, nonce: number, eventData?: string): Uint8Array[] {
  const todoIdType = algosdk.ABIType.from("string");
  const textType = algosdk.ABIType.from("string");
  const byteArrayType = algosdk.ABIType.from("byte[]");

  if (!eventData || eventData === "0x") {
    throw new Error("Todo intents require calldata");
  }

  const parsed = parseTodoIntent(eventData);
  if (!parsed) {
    throw new Error("Unable to parse todo calldata");
  }

  switch (parsed.name) {
    case "addTodo": {
      const text = String(parsed.args[0]);
      return [
        arc4Selector("add_todo(byte[],string,string)void"),
        new Uint8Array(byteArrayType.encode(userBytes)), // ARC4 encode user bytes
        new Uint8Array(todoIdType.encode(String(nonce))),
        new Uint8Array(textType.encode(text)),
      ];
    }
    case "toggleTodo": {
      const todoId = Number(parsed.args[0]);
      return [
        arc4Selector("toggle_todo(byte[],string)void"),
        new Uint8Array(byteArrayType.encode(userBytes)), // ARC4 encode user bytes
        new Uint8Array(todoIdType.encode(String(todoId))),
      ];
    }
    case "deleteTodo": {
      const todoId = Number(parsed.args[0]);
      return [
        arc4Selector("delete_todo(byte[],string)void"),
        new Uint8Array(byteArrayType.encode(userBytes)), // ARC4 encode user bytes
        new Uint8Array(todoIdType.encode(String(todoId))),
      ];
    }
    default:
      throw new Error(`Unsupported todo intent: ${parsed.name}`);
  }
}

function buildExecutorCallArgs(userBytes: Uint8Array, targetAppId: number, innerAppArgs: Uint8Array[]): Uint8Array[] {
  // Build arguments for: execute_with_data(address user, uint64 target_app, byte[] method_selector, byte[] arg1, byte[] arg2, byte[] arg3)
  const selector = arc4Selector("execute_with_data(address,uint64,byte[],byte[],byte[],byte[])void");
  
  // Parameter 1: address (raw 32 bytes for ARC4 address type)
  const userArg = userBytes;
  
  // Parameter 2: uint64 (raw 8 bytes big-endian for ARC4 uint64)
  const appIdBuff = Buffer.alloc(8);
  appIdBuff.writeBigUInt64BE(BigInt(targetAppId));
  const appIdArg = new Uint8Array(appIdBuff);
  
  // Parameter 3: byte[] method_selector (2-byte length prefix + data)
  const byteArrayType = algosdk.ABIType.from("byte[]");
  const methodSelector = innerAppArgs[0];
  const methodSelectorArg = new Uint8Array(byteArrayType.encode(methodSelector));
  
  // Parameters 4-6: Individual arguments (already ARC4-encoded from buildTodoInnerAppArgs)
  // Wrap each in byte[] encoding (2-byte length prefix + data)
  const arg1 = innerAppArgs[1] ? new Uint8Array(byteArrayType.encode(innerAppArgs[1])) : new Uint8Array(byteArrayType.encode(new Uint8Array(0)));
  const arg2 = innerAppArgs[2] ? new Uint8Array(byteArrayType.encode(innerAppArgs[2])) : new Uint8Array(byteArrayType.encode(new Uint8Array(0)));
  const arg3 = innerAppArgs[3] ? new Uint8Array(byteArrayType.encode(innerAppArgs[3])) : new Uint8Array(byteArrayType.encode(new Uint8Array(0)));

  return [selector, userArg, appIdArg, methodSelectorArg, arg1, arg2, arg3];
}

// -------------------- RELAYER --------------------
class ArcRelayer {
  sourceProvider: ethers.JsonRpcProvider;
  algorandClient: algosdk.Algodv2;
  algorandIndexer: algosdk.Indexer;
  relayerAccount: algosdk.Account;
  gateway: ethers.Contract;

  lastProcessedBlock = 0;
  processedIntents = new Set<string>();

  constructor() {
    const dir = path.dirname(INTENT_HISTORY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(INTENT_HISTORY_FILE)) {
      fs.writeFileSync(INTENT_HISTORY_FILE, JSON.stringify([], null, 2));
    }

    this.sourceProvider = new ethers.JsonRpcProvider(SOURCE_RPC);
    this.algorandClient = new algosdk.Algodv2(
      ALGORAND_ALGOD_TOKEN,
      ALGORAND_ALGOD_URL,
      ""
    );
    this.algorandIndexer = new algosdk.Indexer(
      ALGORAND_INDEXER_TOKEN,
      ALGORAND_INDEXER_URL,
      ""
    );
    this.relayerAccount = algosdk.mnemonicToSecretKey(getAlgorandMnemonic());

    this.gateway = new ethers.Contract(
      ARC_GATEWAY_ADDRESS,
      ARC_GATEWAY_ABI,
      this.sourceProvider
    );
  }

  async start() {
    console.log("🤖 Secure Relayer Started");
    console.log(`🔌 Source RPC: ${SOURCE_RPC || "not set"}`);
    console.log(`🔌 Algod URL: ${ALGORAND_ALGOD_URL || "not set"}`);
    console.log(`🔌 Indexer URL: ${ALGORAND_INDEXER_URL || "not set"}`);
    await this.verifyAuthorization();

    const currentBlock = await this.sourceProvider.getBlockNumber();
    // Start from a few blocks in the past to catch recent intents
    const lookbackBlocks = Number(process.env.RELAYER_LOOKBACK_BLOCKS || 50);
    this.lastProcessedBlock = Math.max(0, currentBlock - lookbackBlocks);
    console.log(
      `👂 Listening to source chain from block ${this.lastProcessedBlock + 1} (lookback: ${lookbackBlocks} blocks)`
    );

    while (true) {
      await this.poll();
      await this.sleep(POLL_INTERVAL);
    }
  }

  async verifyAuthorization() {
    const sourceNet = await this.sourceProvider.getNetwork();
    console.log(`🌐 Source chainId: ${sourceNet.chainId.toString()}`);

    const gatewayCode = await this.sourceProvider.getCode(ARC_GATEWAY_ADDRESS);
    if (gatewayCode === "0x") {
      console.log("⚠️  ARC_GATEWAY_ADDRESS has no contract code on source chain");
    }

    // Check Executor app authorization
    try {
      const executorInfo = await this.algorandClient.getApplicationByID(EXECUTOR_APP_ID).do();
      console.log(`✅ Executor app exists (${EXECUTOR_APP_ID})`);
      
      // Try to check if relayer is authorized (this is optional - authorization will be checked on first call)
      console.log(`💡 Relayer address: ${this.relayerAccount.addr}`);
      console.log(`⚠️  Note: Ensure relayer is authorized in Executor app via set_relayer_authorization()`);
    } catch (err) {
      console.log(`⚠️  Could not verify Executor app (${EXECUTOR_APP_ID}): ${err}`);
    }

    for (const [target, appId] of TARGET_APP_IDS.entries()) {
      if (!appId) continue;
      try {
        await this.algorandClient.getApplicationByID(appId).do();
      } catch {
        console.log(`⚠️  No Algorand app found for ${target} (appId=${appId})`);
      }
    }

    console.log(`✅ Algorand relayer address: ${this.relayerAccount.addr}`);
  }

  async poll() {
    const currentBlock = await this.sourceProvider.getBlockNumber();
    const safeBlock = currentBlock - CONFIRMATIONS;

    if (safeBlock <= this.lastProcessedBlock) return;

    const events = await this.gateway.queryFilter(
      "*",
      this.lastProcessedBlock + 1,
      safeBlock
    );

    for (const e of events) {
      await this.handleIntent(e);
    }

    this.lastProcessedBlock = safeBlock;
  }

  async handleIntent(event: any) {
    const { user, target, nonce } = event.args;
    const intentId = `${user}-${nonce}`;
    const startTime = Date.now();
    const userBytes = sourceUserToAlgorandBytes(user);
    const targetAppId = parseTargetAppId(target);

    if (this.processedIntents.has(intentId)) return;

    try {
      // ---------------- SECURITY CHECKS ----------------
      checkRateLimit(user);
      validateNonce(user, Number(nonce));
      validateTarget(target);

      const withData = !!event.args.data;
      const data = event.args.data;

      validateCalldata(data);

      console.log(
        `📨 Intent: ${intentId} target=${target} nonce=${nonce} data=${data ? data.length : 0} bytes`
      );
      console.log(`⏱️  Received intent at: ${new Date(startTime).toISOString()}`);

      const todoLike = target.toLowerCase() === TODO_ADDRESS;
      
      let appId: number;
      let appArgs: Uint8Array[];
      let boxes: { appIndex: number; name: Uint8Array }[] | undefined;
      let foreignApps: number[] | undefined;

      if (todoLike) {
        // TodoList: route through Executor with nonce tracking
        const innerAppArgs = buildTodoInnerAppArgs(userBytes, Number(nonce), data);
        appArgs = buildExecutorCallArgs(userBytes, targetAppId, innerAppArgs);
        appId = EXECUTOR_APP_ID;
        
        // Include box references for Executor app
        // Box key format: "relayer_" + 32-byte address
        const relayerAddress = algosdk.decodeAddress(this.relayerAccount.addr);
        const relayerBoxName = new Uint8Array(
          Buffer.concat([
            Buffer.from("relayer_"),
            Buffer.from(relayerAddress.publicKey)
          ])
        );
        
        // User nonce box: "nonce_" + 32-byte user address
        const userBoxName = new Uint8Array(
          Buffer.concat([
            Buffer.from("nonce_"),
            userBytes
          ])
        );
        
        // TodoList box: "todos_" + user + todo_id
        const todoBoxName = new Uint8Array(
          Buffer.concat([
            Buffer.from("todos_"),
            userBytes,
            Buffer.from(String(nonce))
          ])
        );
        
        boxes = [
          { appIndex: 0, name: relayerBoxName },
          { appIndex: 0, name: userBoxName },
          { appIndex: targetAppId, name: todoBoxName }, // TodoList box
        ];
        
        // Include TodoList app as foreign app (needed for inner transaction in Executor)
        foreignApps = [targetAppId];
        
        console.log(`🔀 Routing TodoList intent through Executor (app ${EXECUTOR_APP_ID})`);
        console.log(`   Relayer box: ${Buffer.from(relayerBoxName).toString('hex').slice(0, 40)}...`);
        console.log(`   User box: ${Buffer.from(userBoxName).toString('hex').slice(0, 40)}...`);
        console.log(`   Todo box: ${Buffer.from(todoBoxName).toString('hex').slice(0, 40)}...`);
      } else {
        // Counter: call directly (no Executor needed for simple no-arg calls)
        appArgs = buildCounterAppArgs(data);
        appId = targetAppId;
        console.log(`📱 Calling Counter app directly (app ${targetAppId})`);
      }

      const txId = await executeWithRetry(() =>
        sendAlgorandAppCall({
          algod: this.algorandClient,
          sender: this.relayerAccount.addr,
          secretKey: this.relayerAccount.sk,
          appId,
          appArgs,
          boxes,
          foreignApps,
          hasInnerTxn: todoLike, // Executor creates inner txn for TodoList
        })
      );

      const endTime = Date.now();
      const elapsedMs = endTime - startTime;
      console.log(`⏱️  Executed on destination in ${elapsedMs} ms`);

      console.log("✅ Success", txId);

      this.processedIntents.add(intentId);
    } catch (err: any) {
      console.error("❌ Error:", err.message);
    }
  }

  sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

// -------------------- RUN --------------------
(async () => {
  try {
    const relayer = new ArcRelayer();
    await relayer.start();
  } catch (err) {
    console.error("Relayer crashed:", err);
    process.exit(1);
  }
})();
