import algosdk from "algosdk";

export async function sendAlgorandAppCall(params: {
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

  if (params.hasInnerTxn) {
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

