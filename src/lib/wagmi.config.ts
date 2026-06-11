import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { defineChain } from 'viem';
import { intentConfig } from './intentConfig';

export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: { http: [intentConfig.somniaRpc] },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: intentConfig.somniaExplorer,
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(intentConfig.somniaRpc),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID as string,
    }),
  ],
});
