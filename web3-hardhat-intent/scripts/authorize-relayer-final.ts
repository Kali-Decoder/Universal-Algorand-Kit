import algosdk from 'algosdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const algodToken = '';
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = '';
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    const deployerMnemonic = process.env.DEPLOYER_MNEMONIC;
    if (!deployerMnemonic) {
        throw new Error('DEPLOYER_MNEMONIC not found in environment');
    }

    const deployerAccount = algosdk.mnemonicToSecretKey(deployerMnemonic);
    const appId = 762834559;
    const relayerAddress = 'MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA';

    console.log('🔐 Authorizing relayer in Executor app...');
    console.log(`📱 Deployer: ${deployerAccount.addr}`);
    console.log(`🔑 Relayer: ${relayerAddress}`);
    console.log(`⏳ Submitting transaction...`);

    const params = await algodClient.getTransactionParams().do();

    // Selector for "set_relayer_authorization(address,bool)void"
    const selector = new Uint8Array([0x03, 0x15, 0xe8, 0xce]);
    const relayerBytes = algosdk.decodeAddress(relayerAddress).publicKey;
    const isAuthorized = new Uint8Array([1]); // true

    const appArgs = [
        selector,
        relayerBytes,
        isAuthorized
    ];

    // The box name is "relayer_" + public key
    const prefix = new TextEncoder().encode("relayer_");
    const boxName = new Uint8Array(prefix.length + relayerBytes.length);
    boxName.set(prefix);
    boxName.set(relayerBytes, prefix.length);

    const boxes = [
        {
            appIndex: 0,
            name: boxName,
        },
    ];

    // Build transaction WITHOUT foreign accounts to avoid balance check on relayer
    const txn = algosdk.makeApplicationNoOpTxn(
        deployerAccount.addr,
        params,
        appId,
        appArgs,
        undefined,  // NO foreign accounts - box access doesn't require this
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        boxes
    );

    const signedTxn = txn.signTxn(deployerAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`✅ Authorization successful!`);
    console.log(`📋 Transaction ID: ${txId}`);

    const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
    console.log(`✨ Confirmed in round ${result['confirmed-round']}`);
}

main().catch(console.error);
