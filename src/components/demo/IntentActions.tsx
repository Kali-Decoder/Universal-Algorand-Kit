import Minus from 'lucide-react/dist/esm/icons/minus.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2.js';
import type { CounterAction, IntentStep } from '../../lib/hooks/useCounterIntent';

interface IntentActionsProps {
  step: IntentStep;
  isConnected: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function IntentActions({
  step,
  isConnected,
  onIncrement,
  onDecrement,
}: IntentActionsProps) {
  const busy = step !== 'idle' && step !== 'settled' && step !== 'error';

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface-1)] p-6">
      <p className="text-white font-bold text-lg mb-1">Send counter intent</p>
      <p className="text-[var(--color-muted)] text-sm mb-6">
        Sign a transaction on Somnia. The relayer detects the gateway event and settles on Algorand.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={onIncrement}
          disabled={!isConnected || busy}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold text-black bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Increment
        </button>
        <button
          onClick={onDecrement}
          disabled={!isConnected || busy}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Minus size={18} />}
          Decrement
        </button>
      </div>

      {!isConnected && (
        <p className="text-[var(--color-muted-3)] text-xs mt-4">
          Connect a wallet on Somnia Testnet to send intents.
        </p>
      )}
    </div>
  );
}

export type { CounterAction };
