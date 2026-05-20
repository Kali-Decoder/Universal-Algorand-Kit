import algosdk from 'algosdk';
import * as dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

async function main() {
    const algodUrl = process.env.ALGORAND_ALGOD_URL || 'https://testnet-api.algonode.cloud';
    const algodToken = process.env.ALGORAND_ALGOD_TOKEN || '';
    const algodPort = '';
    const algodClient = new algosdk.Algodv2(algodToken, algodUrl, algodPort);

    const deployerMnemonic = process.env.DEPLOYER_MNEMONIC;
    if (!deployerMnemonic) {
        throw new Error("DEPLOYER_MNEMONIC not found in .env");
    }
    const deployerAccount = algosdk.mnemonicToSecretKey(deployerMnemonic);
    console.log("Deployer address:", deployerAccount.addr);

    const relayerAddress = "MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA";
    const appId = 762834559;

    const method = new algosdk.ABIMethod({
        name: "set_relayer_authorization",
        args: [
            { type: "address", name: "relayer" },
            { type: "bool", name: "authorized" }
        ],
        returns: { type: "void" }
    });

    const params = await algodClient.getTransactionParams().do();
    
    // Prepare Box Reference
    const relayerAddrBytes = algosdk.decodeAddress(relayerAddress).publicKey;
    const prefix = Buffer.from("relayer_");
    const boxKey = Buffer.concat([prefix, relayerAddrBytes]);

    const composer = new algosdk.AtomicTransactionComposer();
    composer.addMethodCall({
        appID: appId,
        method: method,
        methodArgs: [relayerAddress, true],
        sender: deployerAccount.addr,
        suggestedParams: params,
        signer: algosdk.makeBasicAccountTransactionSigner(deployerAccount),
        appAccounts: [relayerAddress],
        boxes: [
            {
                appIndex: 0,
                name: boxKey,
            }
        ]
    });

    try {
        console.log("Submitting transaction...");
        const result = await composer.execute(algodClient, 4);
        console.log("Transaction successful!");
        console.log("TX ID:", result.txIDs[0]);
    } catch (error: any) {
        console.error("Error authorizing relayer:");
        if (error.response && error.response.text) {
            console.error(error.response.text);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

main();
