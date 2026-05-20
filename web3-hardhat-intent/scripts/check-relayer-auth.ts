import algosdk from "algosdk";
import * as dotenv from "dotenv";

dotenv.config();

const mnemonic = process.env.ALGORAND_RELAYER_MNEMONIC || process.env.RELAYER_MNEMONIC || "";
const account = algosdk.mnemonicToSecretKey(mnemonic);
const pubKey = algosdk.decodeAddress(account.addr).publicKey;

console.log("Relayer address:", account.addr);
console.log("Public key (hex):", Buffer.from(pubKey).toString("hex"));
console.log("Box name (base64):", Buffer.concat([Buffer.from("relayer_"), Buffer.from(pubKey)]).toString("base64"));

// Check if box exists
const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const executorAppId = Number(process.env.EXECUTOR_APP_ID || 0);

algod.getApplicationBoxByName(executorAppId, Buffer.concat([Buffer.from("relayer_"), Buffer.from(pubKey)]))
  .do()
  .then((box: any) => {
    console.log("\n✅ Relayer box exists!");
    console.log("Box value (hex):", Buffer.from(box.value).toString("hex"));
    console.log("Box value (bool):", box.value[0] === 1 ? "true" : "false");
  })
  .catch((err: any) => {
    console.log("\n❌ Relayer box NOT found!");
    console.log("Error:", err.message);
  });
