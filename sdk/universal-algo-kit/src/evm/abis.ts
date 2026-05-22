export const ARC_GATEWAY_ABI = [
  "function requestIntent(address target, bytes data) payable",
  "function forwardIntentWithData(address target, bytes data)",
  "event IntentForwarded(address indexed user, address indexed target, uint256 nonce, uint256 timestamp)",
  "event IntentForwardedWithData(address indexed user, address indexed target, bytes data, uint256 nonce, uint256 timestamp)",
] as const;

export const COUNTER_ABI = [
  "function increment() external",
  "function decrement() external",
  "function getCounter() external view returns (uint256)",
] as const;

export const TODO_ABI = [
  "function addTodo(string text) external returns (uint256)",
  "function toggleTodo(uint256 id) external",
  "function deleteTodo(uint256 id) external",
] as const;

