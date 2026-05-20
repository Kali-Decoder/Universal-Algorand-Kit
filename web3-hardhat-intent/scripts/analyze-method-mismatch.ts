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

// What we're sending
const innerMethodSelector = arc4Selector("add_todo(byte[],string,string)void");
console.log("🔍 Method selector we're sending:");
console.log(`   Signature: add_todo(byte[],string,string)void`);
console.log(`   Selector: 0x${Buffer.from(innerMethodSelector).toString("hex")}`);

// What TodoList expects
const expectedSelector1 = arc4Selector("add_todo(string,string)void");
console.log("\n📋 Method selector TodoList expects:");
console.log(`   Signature: add_todo(string,string)void`);
console.log(`   Selector: 0x${Buffer.from(expectedSelector1).toString("hex")}`);

console.log("\n❌ Mismatch detected!");
console.log("   TodoList contract expects 2 parameters (todo_id, text)");
console.log("   We're sending 3 parameters (user, todo_id, text)");

console.log("\n💡 Solution Options:");
console.log("   1. Update TodoList contract to accept user parameter");
console.log("   2. Use Counter app (already working)");
console.log("   3. Create new app compatible with Executor pattern");

// Let's also check what the actual TodoList methods are
console.log("\n📖 TodoList ARC56 Methods:");
const arc56 = require("../../executor/projects/executor/smart_contracts/artifacts/todo/TodoList.arc56.json");
arc56.methods.forEach((method: any) => {
  const sig = `${method.name}(${method.args.map((a: any) => a.type).join(",")})${method.returns.type}`;
  const sel = arc4Selector(sig);
  console.log(`   ${sig}`);
  console.log(`   → 0x${Buffer.from(sel).toString("hex")}`);
});
