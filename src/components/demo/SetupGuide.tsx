import Terminal from 'lucide-react/dist/esm/icons/terminal.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import { useState } from 'react';

export default function SetupGuide() {
  const [copied, setCopied] = useState(false);
  const relayerCmd = 'cd web3-hardhat-intent && npm run relayer';

  const copy = async () => {
    await navigator.clipboard.writeText(relayerCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
          <Terminal size={18} />
        </div>
        <div>
          <p className="text-white font-semibold">Before you demo</p>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            Start the relayer in a separate terminal. It watches Somnia gateway events and submits Algorand app calls.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-black/50 border border-white/[0.08] p-4 flex items-center justify-between gap-3">
        <code className="text-[var(--color-accent)] text-xs md:text-sm font-mono break-all">
          {relayerCmd}
        </code>
        <button
          onClick={copy}
          className="shrink-0 p-2 rounded-lg hover:bg-white/[0.06] text-[var(--color-muted)] hover:text-white transition-colors"
          title="Copy command"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
        <li>1. Configure <code className="text-white/80">web3-hardhat-intent/.env</code> with gateway + app IDs</li>
        <li>2. Run the relayer command above</li>
        <li>3. Connect MetaMask to Somnia Testnet (chain 50312)</li>
        <li>4. Click Increment — watch the Algorand counter update in ~4–6s</li>
      </ul>
    </div>
  );
}
