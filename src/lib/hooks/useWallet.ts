import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { somniaTestnet } from '../wagmi.config';

const SOMNIA_CHAIN_ID = somniaTestnet.id;

export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectNetwork = chainId === SOMNIA_CHAIN_ID;

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  function connectWallet(connectorIndex = 0) {
    const connector = connectors[connectorIndex] ?? connectors[0];
    if (connector) connect({ connector, chainId: SOMNIA_CHAIN_ID });
  }

  function switchToSomnia() {
    switchChain({ chainId: SOMNIA_CHAIN_ID });
  }

  return {
    address,
    isConnected,
    chainId,
    isCorrectNetwork,
    isConnecting,
    isSwitching,
    connect: connectWallet,
    disconnect,
    switchToSomnia,
    switchToAlgorand: switchToSomnia,
    shortAddress,
    networkName: somniaTestnet.name,
  };
}
