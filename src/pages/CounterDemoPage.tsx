import { useQueryClient } from '@tanstack/react-query';
import { useAlgorandCounter } from '../lib/hooks/useAlgorandCounter';
import { useCounterIntent } from '../lib/hooks/useCounterIntent';
import { intentConfig } from '../lib/intentConfig';
import AlgorandCounterCard from '../components/demo/AlgorandCounterCard';
import FlowPipeline from '../components/demo/FlowPipeline';
import IntentActions from '../components/demo/IntentActions';
import IntentStatus from '../components/demo/IntentStatus';
import SetupGuide from '../components/demo/SetupGuide';

export default function CounterDemoPage() {
  const queryClient = useQueryClient();
  const { data: counterValue, isLoading, isError, isFetching } = useAlgorandCounter();
  const {
    step,
    error,
    sourceTxHash,
    algoTxNote,
    settlementMs,
    nonce,
    sendIntent,
    reset,
    isConnected,
  } = useCounterIntent();

  const handleAction = async (action: 'increment' | 'decrement') => {
    await sendIntent(action, counterValue ?? null);
    await queryClient.invalidateQueries({ queryKey: ['algorand-counter'] });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-[var(--color-accent)] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
          EVM → Algorand intent demo
        </p>
        <h2 className="text-white font-extrabold text-2xl md:text-3xl tracking-tight mb-2">
          Counter cross-chain flow
        </h2>
        <p className="text-[var(--color-muted)] text-sm md:text-base max-w-2xl">
          Sign an increment or decrement intent on Somnia via{' '}
          <span className="text-white/80 font-mono text-xs">ArcGateway</span>. The relayer
          settles the matching ARC-4 call on Algorand app{' '}
          <span className="text-white/80 font-mono text-xs">{intentConfig.counterAppId}</span>.
        </p>
      </div>

      <SetupGuide />

      <FlowPipeline step={step} />

      <div className="grid lg:grid-cols-2 gap-6">
        <AlgorandCounterCard
          value={counterValue}
          isLoading={isLoading}
          isError={isError}
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ['algorand-counter'] })}
          isRefreshing={isFetching}
        />

        <div className="space-y-6">
          <IntentActions
            step={step}
            isConnected={isConnected}
            onIncrement={() => handleAction('increment')}
            onDecrement={() => handleAction('decrement')}
          />
          <IntentStatus
            step={step}
            error={error}
            sourceTxHash={sourceTxHash}
            algoTxNote={algoTxNote}
            settlementMs={settlementMs}
            nonce={nonce}
            onReset={reset}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface-1)] p-5">
        <p className="text-[var(--color-muted-2)] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
          Deployed addresses
        </p>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[var(--color-muted-3)] text-xs">ArcGateway (Somnia)</dt>
            <dd className="text-white font-mono text-xs break-all mt-1">{intentConfig.gatewayAddress}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-muted-3)] text-xs">Counter target (EVM)</dt>
            <dd className="text-white font-mono text-xs break-all mt-1">{intentConfig.counterAddress}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
