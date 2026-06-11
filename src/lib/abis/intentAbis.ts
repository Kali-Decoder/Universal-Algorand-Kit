export const arcGatewayAbi = [
  {
    type: 'function',
    name: 'forwardIntent',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'target', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'forwardIntentWithData',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'target', type: 'address' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getNonce',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'IntentForwardedWithData',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'target', type: 'address', indexed: true },
      { name: 'data', type: 'bytes', indexed: false },
      { name: 'nonce', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const counterCalldataAbi = [
  {
    type: 'function',
    name: 'increment',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'decrement',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;
