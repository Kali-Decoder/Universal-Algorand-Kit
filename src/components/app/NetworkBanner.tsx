import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.js';
import { useWallet } from '../../lib/hooks/useWallet';

export default function NetworkBanner() {
  const { isConnected, isCorrectNetwork, switchToSomnia } = useWallet();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="bg-[var(--warn-10)] border-b border-[var(--warn-30)] backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-[var(--color-warn)] text-sm">
        <AlertTriangle size={16} className="shrink-0" />
        <span>Wrong network — switch to Somnia Testnet to send cross-chain intents.</span>
      </div>
      <button
        onClick={switchToSomnia}
        className="shrink-0 bg-[var(--color-warn)] hover:bg-[var(--color-warn-2)] text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
      >
        Switch Network
      </button>
    </div>
  );
}
