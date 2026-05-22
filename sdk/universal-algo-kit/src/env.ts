import type { UniversalAlgoKitConfig } from "./types.js";

export function envToConfig(env: Record<string, string | undefined>): UniversalAlgoKitConfig {
  return {
    evm: {
      rpcUrl: env.SOMNIA_TESTNET_RPC_URL || env.EVM_RPC_URL || "https://dream-rpc.somnia.network/",
      gatewayAddress: env.ARC_GATEWAY_ADDRESS || "",
      privateKey: env.PRIVATE_KEY || env.EVM_PRIVATE_KEY,
    },
    algorand: {
      algodUrl:
        env.ALGORAND_ALGOD_URL ||
        env.ALGORAND_TESTNET_ALGOD_URL ||
        "https://testnet-api.algonode.cloud",
      algodToken: env.ALGORAND_ALGOD_TOKEN || "",
      indexerUrl:
        env.ALGORAND_INDEXER_URL ||
        env.ALGORAND_TESTNET_INDEXER_URL ||
        "https://testnet-idx.algonode.cloud",
      indexerToken: env.ALGORAND_INDEXER_TOKEN || "",
      relayerMnemonic: env.ALGORAND_RELAYER_MNEMONIC || env.RELAYER_MNEMONIC,
    },
    targets: {
      counterAddress: env.COUNTER_ADDRESS,
      todoAddress: env.TODO_ADDRESS,
    },
    appIds: {
      counterAppId: env.COUNTER_APP_ID ? Number(env.COUNTER_APP_ID) : undefined,
      todoAppId: env.TODO_APP_ID ? Number(env.TODO_APP_ID) : undefined,
      executorAppId: env.EXECUTOR_APP_ID ? Number(env.EXECUTOR_APP_ID) : undefined,
    },
    relayer: {
      pollIntervalMs: env.RELAYER_POLL_INTERVAL ? Number(env.RELAYER_POLL_INTERVAL) : undefined,
      confirmations: env.RELAYER_CONFIRMATIONS ? Number(env.RELAYER_CONFIRMATIONS) : undefined,
      lookbackBlocks: env.RELAYER_LOOKBACK_BLOCKS ? Number(env.RELAYER_LOOKBACK_BLOCKS) : undefined,
      maxRetries: env.RELAYER_MAX_RETRIES ? Number(env.RELAYER_MAX_RETRIES) : undefined,
    },
  };
}

