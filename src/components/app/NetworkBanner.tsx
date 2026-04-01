import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.js';
import { useWallet } from '../../lib/hooks/useWallet';

export default function NetworkBanner() {
  const { isConnected, isCorrectNetwork, switchToAlgorand } = useWallet();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--warn-10)] border-b border-[var(--warn-30)] backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-[var(--color-warn)] text-sm">
        <AlertTriangle size={16} className="shrink-0" />
        <span>You're connected to the wrong network. RemitStar runs on Algorand Testnet.</span>
      </div>
      <button
        onClick={switchToAlgorand}
        className="shrink-0 bg-[var(--color-warn)] hover:bg-[var(--color-warn-2)] text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
      >
        Switch Network
      </button>
    </div>
  );
}
