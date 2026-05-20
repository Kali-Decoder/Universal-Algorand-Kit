import algosdk from 'algosdk';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const algodToken = '';
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = '';
    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    const relayerMnemonic = process.env.ALGORAND_RELAYER_MNEMONIC;
    if (!relayerMnemonic) {
        throw new Error('RELAYER_MNEMONIC not found in environment');
    }

    const relayerAccount = algosdk.mnemonicToSecretKey(relayerMnemonic);
    const appId = 762834559;
    const relayerAddress = relayerAccount.addr;

    console.log('Using Relayer Address:', relayerAddress);

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

    const txn = algosdk.makeApplicationNoOpTxn(
        relayerAccount.addr,
        params,
        appId,
        appArgs,
        [relayerAddress],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        boxes
    );

    const signedTxn = txn.signTxn(relayerAccount.sk);
    try {
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        console.log('Transaction ID:', txId);
        const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log('Transaction confirmed in round', result['confirmed-round']);
    } catch (err: any) {
        console.error('Error broadcasting transaction:', err.response ? err.response.text : err.message);
    }
}

main().catch(console.error);
