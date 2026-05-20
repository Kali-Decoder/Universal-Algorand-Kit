import algosdk from "algosdk";
import * as dotenv from "dotenv";

dotenv.config();

const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const ownerMnemonic = process.env.DEPLOYER_MNEMONIC || "";
const ownerAccount = algosdk.mnemonicToSecretKey(ownerMnemonic);
const executorAppId = Number(process.env.EXECUTOR_APP_ID || 0);
const executorAddress = algosdk.getApplicationAddress(executorAppId);

async function main() {
  console.log("💰 Funding Executor app account\n");
  console.log(`Owner: ${ownerAccount.addr}`);
  console.log(`Executor App: ${executorAppId}`);
  console.log(`Executor Address: ${executorAddress}\n`);

  // Send 0.5 ALGO to cover box storage
  const suggestedParams = await algod.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: ownerAccount.addr,
    to: executorAddress,
    amount: 500_000, // 0.5 ALGO
    suggestedParams,
  });

  const signed = txn.signTxn(ownerAccount.sk);
  console.log("📤 Sending payment...");
  
  const { txId } = await algod.sendRawTransaction(signed).do();
  console.log(`Transaction ID: ${txId}`);
  
  console.log("⏳ Waiting for confirmation...");
  await algosdk.waitForConfirmation(algod, txId, 4);
  
  console.log("✅ Executor app funded successfully!");
  
  // Check balance
  const accountInfo = await algod.accountInformation(executorAddress).do();
  console.log(`\n💰 Executor balance: ${accountInfo.amount / 1_000_000} ALGO`);
}

main().catch(console.error);
