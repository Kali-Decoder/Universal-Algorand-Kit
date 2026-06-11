import { useCallback, useState } from 'react';
import { encodeFunctionData } from 'viem';
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';
import { arcGatewayAbi, counterCalldataAbi } from '../abis/intentAbis';
import { fetchAlgorandCounterValue, waitForCounterChange } from '../algorand/counter';
import { intentConfig } from '../intentConfig';
import { somniaTestnet } from '../wagmi.config';

export type IntentStep =
  | 'idle'
  | 'signing'
  | 'source-confirmed'
  | 'relayer-pending'
  | 'settled'
  | 'error';

export type CounterAction = 'increment' | 'decrement';

export function useCounterIntent() {
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<IntentStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sourceTxHash, setSourceTxHash] = useState<string | null>(null);
  const [algoTxNote, setAlgoTxNote] = useState<string | null>(null);
  const [settlementMs, setSettlementMs] = useState<number | null>(null);

  const { data: nonce, refetch: refetchNonce } = useReadContract({
    address: intentConfig.gatewayAddress,
    abi: arcGatewayAbi,
    functionName: 'getNonce',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setSourceTxHash(null);
    setAlgoTxNote(null);
    setSettlementMs(null);
  }, []);

  const sendIntent = useCallback(
    async (action: CounterAction, currentCounter: number | null) => {
      if (!isConnected || !address) {
        setError('Connect your wallet on Somnia Testnet first.');
        setStep('error');
        return;
      }

      if (chainId !== somniaTestnet.id) {
        await switchChainAsync({ chainId: somniaTestnet.id });
      }

      reset();
      setStep('signing');
      setError(null);

      try {
        const calldata = encodeFunctionData({
          abi: counterCalldataAbi,
          functionName: action,
        });

        const hash = await writeContractAsync({
          address: intentConfig.gatewayAddress,
          abi: arcGatewayAbi,
          functionName: 'forwardIntentWithData',
          args: [intentConfig.counterAddress, calldata],
          chainId: somniaTestnet.id,
        });

        setSourceTxHash(hash);
        setStep('source-confirmed');
        setStep('relayer-pending');

        const baseline =
          currentCounter !== null && currentCounter !== undefined
            ? currentCounter
            : await fetchAlgorandCounterValue();
        const result = await waitForCounterChange(baseline as number, {
          timeoutMs: 45_000,
          intervalMs: 2000,
        });

        setSettlementMs(result.elapsedMs);
        setAlgoTxNote(`Counter updated to ${result.value} on Algorand`);
        setStep('settled');
        await refetchNonce();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Intent failed';
        setError(message);
        setStep('error');
      }
    },
    [
      address,
      chainId,
      isConnected,
      refetchNonce,
      reset,
      switchChainAsync,
      writeContractAsync,
    ]
  );

  return {
    step,
    error,
    sourceTxHash,
    algoTxNote,
    settlementMs,
    nonce,
    sendIntent,
    reset,
    isConnected,
    address,
    chainId,
  };
}
