import { AlgorandIntentRelayer } from "./relayer/relayer.js";
import { EvmIntentSender } from "./evm/sender.js";
import type { UniversalAlgoKitConfig } from "./types.js";

export function createUniversalAlgoKit(config: UniversalAlgoKitConfig) {
  const sender = new EvmIntentSender(config);
  const relayer = new AlgorandIntentRelayer(config);

  return {
    config,
    sender,
    relayer,
  };
}

