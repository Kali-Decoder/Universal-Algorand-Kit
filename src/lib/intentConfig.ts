export const intentConfig = {
  somniaRpc:
    import.meta.env.VITE_SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network/',
  gatewayAddress: (import.meta.env.VITE_ARC_GATEWAY_ADDRESS ||
    '0x96DBFD24b4d6aC9f0D00E9fFb59d7b76C3ae34af') as `0x${string}`,
  counterAddress: (import.meta.env.VITE_COUNTER_ADDRESS ||
    '0x425Fb305CDA77baD1F1565B0feCf5DC27F5bF766') as `0x${string}`,
  counterAppId: Number(import.meta.env.VITE_COUNTER_APP_ID || 762834496),
  algodUrl:
    import.meta.env.VITE_ALGORAND_ALGOD_URL ||
    'https://testnet-api.algonode.cloud',
  somniaExplorer:
    import.meta.env.VITE_SOMNIA_EXPLORER ||
    'https://shannon-explorer.somnia.network',
  algorandExplorer:
    import.meta.env.VITE_ALGORAND_EXPLORER ||
    'https://testnet.algoexplorer.io',
} as const;

export function isIntentConfigComplete() {
  return Boolean(
    intentConfig.gatewayAddress &&
      intentConfig.counterAddress &&
      intentConfig.counterAppId > 0
  );
}
