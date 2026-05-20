import algosdk from 'algosdk';
import * as dotenv from 'dotenv';

dotenv.config();

const TODOLIST_APP_ID = 762834537;
const EXECUTOR_APP_ID = 762834559;
const RELAYER_MNEMONIC = process.env.ALGORAND_RELAYER_MNEMONIC || "";

async function run() {
    if (!RELAYER_MNEMONIC) {
        console.error("ALGORAND_RELAYER_MNEMONIC is not set in .env");
        return;
    }

    const relayerAccount = algosdk.mnemonicToSecretKey(RELAYER_MNEMONIC);
    console.log("Relayer Address:", relayerAccount.addr);

    const client = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

    try {
        console.log("\n--- Authorizing Relayer ---");
        const params = await client.getTransactionParams().do();
        
        // Method: set_relayer_authorization(address,bool)void
        const authAbi = new algosdk.ABIMethod({
            name: "set_relayer_authorization",
            args: [{ type: "address" }, { type: "bool" }],
            returns: { type: "void" }
        });

        // Use the proper address encoding for ABI (32 bytes)
        const addrBytes = algosdk.decodeAddress(relayerAccount.addr).publicKey;

        const authTx = algosdk.makeApplicationNoOpTxnFromObject({
            from: relayerAccount.addr,
            suggestedParams: params,
            appIndex: EXECUTOR_APP_ID,
            appArgs: [
                authAbi.getSelector(),
                addrBytes,
                new Uint8Array([1]) // true (ABI bool)
            ],
        });

        const signedAuthTx = authTx.signTxn(relayerAccount.sk);
        const { txId: authTxId } = await client.sendRawTransaction(signedAuthTx).do();
        console.log("Authorization TX ID:", authTxId);
        await algosdk.waitForConfirmation(client, authTxId, 4);
        console.log("Authorization Success");
    } catch (err: any) {
        console.log("Authorization Error (might already be authorized or failed logic):", err.message);
    }

    try {
        console.log("\n--- Adding Todo Item ---");
        const params = await client.getTransactionParams().do();
        
        // Let's check the app's ABI if possible or assume Method name
        // The error suggests "err" was executed, meaning the selector might not match.
        // Let's try with the manual selector but check the match logic in the error: 
        // "match label2 label3 label4; err" - this means it expects one of 3 selectors.
        
        const addAbi = new algosdk.ABIMethod({
            name: "add_todo",
            args: [{ type: "address" }, { type: "string" }, { type: "string" }], // Changed byte[] to address just in case
            returns: { type: "void" }
        });

        const userAddr = relayerAccount.addr;
        const todoId = "t" + Math.floor(Date.now() / 1000); // Shorter ID
        const text = "Direct test";
        
        const appArgs = [
            addAbi.getSelector(),
            algosdk.decodeAddress(userAddr).publicKey,
            algosdk.ABIType.from("string").encode(todoId),
            algosdk.ABIType.from("string").encode(text)
        ];

        const addTx = algosdk.makeApplicationNoOpTxnFromObject({
            from: relayerAccount.addr,
            suggestedParams: params,
            appIndex: TODOLIST_APP_ID,
            appArgs: appArgs,
        });

        const signedAddTx = addTx.signTxn(relayerAccount.sk);
        const { txId: addTxId } = await client.sendRawTransaction(signedAddTx).do();
        console.log("Add Todo TX ID:", addTxId);
        await algosdk.waitForConfirmation(client, addTxId, 4);
        console.log("Add Todo Success");
    } catch (err: any) {
        console.error("Add Todo Error:", err.message);
    }
}

run();
