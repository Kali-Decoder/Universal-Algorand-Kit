import algosdk from "algosdk";
import * as dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const ownerMnemonic = process.env.DEPLOYER_MNEMONIC || "";
const relayerMnemonic = process.env.ALGORAND_RELAYER_MNEMONIC || process.env.RELAYER_MNEMONIC || "";

const ownerAccount = algosdk.mnemonicToSecretKey(ownerMnemonic);
const relayerAccount = algosdk.mnemonicToSecretKey(relayerMnemonic);
const executorAppId = Number(process.env.EXECUTOR_APP_ID || 0);

function arc4Selector(signature: string): Uint8Array {
  const digest = crypto.createHash("sha512-256").update(signature).digest();
  return new Uint8Array(digest.subarray(0, 4));
}

async function main() {
  console.log("🔐 Re-authorizing relayer with correct ARC4 Bool encoding\n");
  console.log(`Owner: ${ownerAccount.addr}`);
  console.log(`Relayer: ${relayerAccount.addr}`);
  console.log(`Executor App: ${executorAppId}\n`);

  // set_relayer_authorization(address relayer, bool authorized)
  const selector = arc4Selector("set_relayer_authorization(address,bool)void");
  
  // Relayer address (32 bytes)
  const relayerAddress = algosdk.decodeAddress(relayerAccount.addr).publicKey;
  
  // ARC4 Bool: 0x80 = true, 0x00 = false
  const authorized = new Uint8Array([0x80]); // TRUE in ARC4 Bool format
  
  const appArgs = [selector, relayerAddress, authorized];

  const relayerBoxName = Buffer.concat([
    Buffer.from("relayer_"),
    Buffer.from(relayerAddress),
  ]);

  const suggestedParams = await algod.getTransactionParams().do();
  
  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from: ownerAccount.addr,
    appIndex: executorAppId,
    appArgs,
    suggestedParams,
    boxes: [
      { appIndex: 0, name: new Uint8Array(relayerBoxName) },
    ],
  });

  const signed = txn.signTxn(ownerAccount.sk);
  
  console.log("📤 Sending authorization transaction...");
  const { txId } = await algod.sendRawTransaction(signed).do();
  console.log(`Transaction ID: ${txId}`);
  
  console.log("⏳ Waiting for confirmation...");
  await algosdk.waitForConfirmation(algod, txId, 4);
  
  console.log("✅ Relayer authorized successfully!");
  
  const box = await algod.getApplicationBoxByName(executorAppId, relayerBoxName).do();
  console.log(`\n📦 Box value: 0x${Buffer.from(box.value).toString("hex")}`);
  console.log(`   Expected: 0x80 (ARC4 Bool true)`);
  console.log(`   Match: ${Buffer.from(box.value).toString("hex") === "80" ? "✅" : "❌"}`);
}

main().catch(console.error);
