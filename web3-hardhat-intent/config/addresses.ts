/**
 * Contract Addresses Configuration
 * 
 * This file stores all deployed contract addresses for easy reference.
 * Source-chain addresses and Algorand app ids are loaded from environment variables with fallback defaults.
 */

export const CONTRACT_ADDRESSES = {
  // Counter Contract (Somnia source / Algorand target mapping)
  COUNTER: process.env.COUNTER_ADDRESS || "",
  
  // Todo Contract (Somnia source / Algorand target mapping)
  TODO: process.env.TODO_ADDRESS || "",
  
  // Arc Executor (Algorand settlement)
  ARC_EXECUTOR: process.env.ARC_EXECUTOR_ADDRESS || "",
  
  ARC_GATEWAY: process.env.ARC_GATEWAY_ADDRESS || "",

  COUNTER_APP_ID: Number(process.env.COUNTER_APP_ID || 0),
  TODO_APP_ID: Number(process.env.TODO_APP_ID || 0),
  ALGORAND_ALGOD_URL: process.env.ALGORAND_ALGOD_URL || "https://testnet-api.algonode.cloud",
  ALGORAND_INDEXER_URL: process.env.ALGORAND_INDEXER_URL || "https://testnet-idx.algonode.cloud",
} as const;

/**
 * Validate that required addresses are set
 */
export function validateAddresses() {
  const missing: string[] = [];
  
  if (!CONTRACT_ADDRESSES.COUNTER) missing.push("COUNTER_ADDRESS");
  if (!CONTRACT_ADDRESSES.TODO) missing.push("TODO_ADDRESS");
  if (!CONTRACT_ADDRESSES.ARC_EXECUTOR) missing.push("ARC_EXECUTOR_ADDRESS");
  if (!CONTRACT_ADDRESSES.ARC_GATEWAY) missing.push("ARC_GATEWAY_ADDRESS");
  if (!CONTRACT_ADDRESSES.COUNTER_APP_ID) missing.push("COUNTER_APP_ID");
  if (!CONTRACT_ADDRESSES.TODO_APP_ID) missing.push("TODO_APP_ID");
  
  if (missing.length > 0) {
    console.warn("⚠️  Missing contract addresses in .env:", missing.join(", "));
  }
  
  return missing.length === 0;
}
