export type EvmGatewayConfig = {
  rpcUrl: string;
  gatewayAddress: string;
  /**
   * Private key with 0x prefix (recommended) or without.
   * If omitted, read-only operations are allowed but sending intents is not.
   */
  privateKey?: string;
};

export type AlgorandConfig = {
  algodUrl: string;
  algodToken?: string;
  indexerUrl?: string;
  indexerToken?: string;
  /**
   * 25-word mnemonic for the relayer settlement account.
   */
  relayerMnemonic?: string;
};

export type TargetAddressesConfig = {
  counterAddress?: string;
  todoAddress?: string;
};

export type AppIdsConfig = {
  counterAppId?: number;
  todoAppId?: number;
  executorAppId?: number;
};

export type UniversalAlgoKitConfig = {
  evm: EvmGatewayConfig;
  algorand: AlgorandConfig;
  targets?: TargetAddressesConfig;
  appIds?: AppIdsConfig;
  relayer?: {
    pollIntervalMs?: number;
    confirmations?: number;
    lookbackBlocks?: number;
    maxRetries?: number;
    allowedTargets?: string[];
  };
};

