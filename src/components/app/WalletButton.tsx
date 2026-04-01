import Wallet from 'lucide-react/dist/esm/icons/wallet.js';
import LogOut from 'lucide-react/dist/esm/icons/log-out.js';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.js';
import { useWallet } from '../../lib/hooks/useWallet';

export default function WalletButton() {
  const { isConnected, isCorrectNetwork, connect, disconnect, switchToAlgorand, shortAddress } = useWallet();

  if (!isConnected) {
    return (
      <button
        onClick={() => connect()}
        className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold px-4 py-2 rounded-xl transition-all text-sm"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchToAlgorand}
        className="flex items-center gap-2 bg-[var(--warn-10)] hover:bg-[var(--warn-20)] border border-[var(--warn-30)] text-[var(--color-warn)] font-bold px-4 py-2 rounded-xl transition-all text-sm"
      >
        <AlertTriangle size={16} />
        Switch Network
      </button>
    );
  }

  const wndBalance = '12.482';

  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
      <div className="flex items-center gap-2 bg-[var(--color-surface-1)] border border-white/[0.12] rounded-xl px-3 py-2">
        <span className="text-[var(--color-muted)] text-xs font-mono">{wndBalance} WND</span>
        <span className="w-px h-3 bg-white/[0.1]" />
        <span className="text-white text-sm font-mono font-medium">{shortAddress}</span>
      </div>
      <button
        onClick={() => disconnect()}
        className="text-[var(--color-muted)] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]"
        title="Disconnect"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
