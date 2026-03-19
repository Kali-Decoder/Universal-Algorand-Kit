import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const algorandTestnet = defineChain({
  id: 420420417,
  name: 'Algorand Testnet',
  nativeCurrency: { name: 'WND', symbol: 'WND', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-api.algonode.cloud'] },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://assethub-paseo.subscan.io',
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [algorandTestnet],
  transports: {
    [algorandTestnet.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID as string }),
  ],
})
