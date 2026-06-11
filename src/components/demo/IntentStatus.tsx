import ExternalLink from 'lucide-react/dist/esm/icons/external-link.js';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle.js';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.js';
import { intentConfig } from '../../lib/intentConfig';
import type { IntentStep } from '../../lib/hooks/useCounterIntent';

interface IntentStatusProps {
  step: IntentStep;
  error: string | null;
  sourceTxHash: string | null;
  algoTxNote: string | null;
  settlementMs: number | null;
  nonce: bigint | undefined;
  onReset: () => void;
}

export default function IntentStatus({
  step,
  error,
  sourceTxHash,
  algoTxNote,
  settlementMs,
  nonce,
  onReset,
}: IntentStatusProps) {
  if (step === 'idle') {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface-1)] p-5">
        <p className="text-[var(--color-muted)] text-sm">
          Gateway nonce:{' '}
          <span className="text-white font-mono">{nonce !== undefined ? String(nonce) : '—'}</span>
        </p>
        <p className="text-[var(--color-muted-3)] text-xs mt-2">
          Each intent increments your nonce on Somnia for replay protection.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface-1)] p-5 space-y-3">
      {step === 'settled' && (
        <div className="flex items-start gap-2 text-emerald-400">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Intent settled on Algorand</p>
            {algoTxNote && <p className="text-sm text-emerald-300/80 mt-1">{algoTxNote}</p>}
            {settlementMs !== null && (
              <p className="text-xs text-emerald-300/60 mt-1">
                Relayer settlement: {(settlementMs / 1000).toFixed(1)}s after source confirmation
              </p>
            )}
          </div>
        </div>
      )}

      {step === 'error' && error && (
        <div className="flex items-start gap-2 text-red-400">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Intent failed</p>
            <p className="text-sm mt-1 break-words">{error}</p>
          </div>
        </div>
      )}

      {(step === 'signing' || step === 'source-confirmed' || step === 'relayer-pending') && (
        <p className="text-[var(--color-accent)] text-sm font-medium animate-pulse">
          {step === 'signing' && 'Waiting for wallet signature…'}
          {step === 'source-confirmed' && 'Somnia transaction confirmed'}
          {step === 'relayer-pending' && 'Waiting for relayer to settle on Algorand…'}
        </p>
      )}

      {sourceTxHash && (
        <a
          href={`${intentConfig.somniaExplorer}/tx/${sourceTxHash}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-white text-xs font-mono break-all"
        >
          Somnia tx: {sourceTxHash}
          <ExternalLink size={12} />
        </a>
      )}

      {(step === 'settled' || step === 'error') && (
        <button
          onClick={onReset}
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          Send another intent
        </button>
      )}
    </div>
  );
}
