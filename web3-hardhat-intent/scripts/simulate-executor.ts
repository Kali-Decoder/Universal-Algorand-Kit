import algosdk from "algosdk";
import * as dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const mnemonic = process.env.ALGORAND_RELAYER_MNEMONIC || process.env.RELAYER_MNEMONIC || "";
const relayerAccount = algosdk.mnemonicToSecretKey(mnemonic);
const executorAppId = Number(process.env.EXECUTOR_APP_ID || 0);
const todoAppId = Number(process.env.TODO_APP_ID || 0);

const ethUserAddress = "0xdAF0182De86F904918Db8d07c7340A1EfcDF8244";
const userBytes = new Uint8Array(32);
userBytes.set(Buffer.from(ethUserAddress.slice(2), "hex"), 12);

function arc4Selector(signature: string): Uint8Array {
  const digest = crypto.createHash("sha512-256").update(signature).digest();
  return new Uint8Array(digest.subarray(0, 4));
}

const todoIdType = algosdk.ABIType.from("string");
const textType = algosdk.ABIType.from("string");

const innerMethodSelector = arc4Selector("add_todo(byte[],string,string)void");
const innerArgs = [
  userBytes,
  new Uint8Array(todoIdType.encode("0")),
  new Uint8Array(textType.encode("Direct test")),
];

const executorSelector = arc4Selector("execute_with_data(address,uint64,byte[],byte[])void");
const byteArrayType = algosdk.ABIType.from("byte[]");

const appIdBuff = Buffer.alloc(8);
appIdBuff.writeBigUInt64BE(BigInt(todoAppId));

const methodSelectorArg = new Uint8Array(byteArrayType.encode(innerMethodSelector));
const appArgsBlob = Buffer.concat(innerArgs.slice(1).map((arg) => Buffer.from(arg)));
const appArgsArg = new Uint8Array(byteArrayType.encode(appArgsBlob));

const appArgs = [
  executorSelector,
  userBytes,
  new Uint8Array(appIdBuff),
  methodSelectorArg,
  appArgsArg,
];

const relayerAddress = algosdk.decodeAddress(relayerAccount.addr);
const relayerBoxName = Buffer.concat([
  Buffer.from("relayer_"),
  Buffer.from(relayerAddress.publicKey),
]);

const userBoxName = Buffer.concat([Buffer.from("nonce_"), Buffer.from(userBytes)]);

async function main() {
  try {
    const suggestedParams = await algod.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      from: relayerAccount.addr,
      appIndex: executorAppId,
      appArgs: appArgs.map((arg) => arg),
      suggestedParams,
      boxes: [
        { appIndex: 0, name: new Uint8Array(relayerBoxName) },
        { appIndex: 0, name: new Uint8Array(userBoxName) },
      ],
      foreignApps: [todoAppId],
    });

    const signed = txn.signTxn(relayerAccount.sk);
    
    console.log("🔍 Simulating transaction with exec trace...\n");
    
    const simRequest = new algosdk.modelsv2.SimulateRequest({
      txnGroups: [
        new algosdk.modelsv2.SimulateRequestTransactionGroup({
          txns: [algosdk.decodeObj(signed) as any],
        }),
      ],
      execTraceConfig: new algosdk.modelsv2.SimulateTraceConfig({
        enable: true,
        scratchChange: true,
        stackChange: true,
      }),
    });

    const simResult = await algod.simulateTransactions(simRequest).do();
    
    if (simResult.txnGroups[0].failureMessage) {
      console.log("❌ Simulation failed:");
      console.log(simResult.txnGroups[0].failureMessage);
      console.log("\n📊 Execution trace:");
      
      const trace = simResult.txnGroups[0].txnResults[0].execTrace;
      if (trace && trace.approvalProgramTrace) {
        const lines = trace.approvalProgramTrace;
        // Show last 20 lines before failure
        const startIdx = Math.max(0, lines.length - 20);
        for (let i = startIdx; i < lines.length; i++) {
          console.log(`  ${i}: ${JSON.stringify(lines[i])}`);
        }
      }
    } else {
      console.log("✅ Simulation succeeded!");
    }
  } catch (err: any) {
    console.log("❌ ERROR:", err.message);
  }
}

main();
