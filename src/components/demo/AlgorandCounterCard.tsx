import ExternalLink from 'lucide-react/dist/esm/icons/external-link.js';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2.js';
import { intentConfig } from '../../lib/intentConfig';

interface AlgorandCounterCardProps {
  value: number | null | undefined;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AlgorandCounterCard({
  value,
  isLoading,
  isError,
  onRefresh,
  isRefreshing,
}: AlgorandCounterCardProps) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 border border-[var(--accent-20)]"
      style={{
        background:
          'linear-gradient(145deg, var(--accent-08) 0%, var(--color-surface-1) 55%)',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-[0.15em] mb-1">
            Algorand Testnet
          </p>
          <p className="text-white font-bold text-lg">Counter App</p>
          <p className="text-[var(--color-muted-3)] text-xs mt-1 font-mono">
            App ID {intentConfig.counterAppId}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] text-[var(--color-muted)] hover:text-white transition-colors"
          title="Refresh counter"
        >
          {isRefreshing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-[var(--color-muted)] text-sm mb-2">Current value</p>
        {isLoading ? (
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading from Algod…</span>
          </div>
        ) : isError ? (
          <p className="text-red-400 text-sm">Could not read counter state</p>
        ) : (
          <p className="text-[4rem] md:text-[5rem] font-black font-mono leading-none text-[var(--color-accent)]">
            {value ?? '—'}
          </p>
        )}
      </div>

      <a
        href={`${intentConfig.algorandExplorer}/application/${intentConfig.counterAppId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[var(--color-accent)] text-sm font-medium hover:underline"
      >
        View on AlgoExplorer
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
