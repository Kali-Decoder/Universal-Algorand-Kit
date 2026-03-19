import { useState, useEffect, useRef } from 'react';
import Bell from 'lucide-react/dist/esm/icons/bell.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2.js';
import { formatUSDC } from '../../lib/utils/format';

interface Notification {
  id: string;
  title: string;
  body: string;
  txHash: string;
  timestamp: number;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dummy: Notification[] = [
      {
        id: 'n-1',
        title: 'Transfer confirmed',
        body: `Sent $${formatUSDC(450_000_000n)} · Fee $${formatUSDC(1_350_000n)}`,
        txHash: '0x2a9d6f7c8b0e1f23456789abcdef0123456789abcdef0123456789abcdef01',
        timestamp: Date.now() - 1000 * 60 * 12,
        read: false,
      },
      {
        id: 'n-2',
        title: 'Transfer confirmed',
        body: `Sent $${formatUSDC(120_000_000n)} · Fee $${formatUSDC(360_000n)}`,
        txHash: '0x6f5e4d3c2b1a0099887766554433221100ffeeddccbbaa998877665544332211',
        timestamp: Date.now() - 1000 * 60 * 45,
        read: false,
      },
    ];
    setNotifications(dummy);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleOpen() {
    setOpen((v) => !v);
    if (!open) markAllRead();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative text-[#8e9191] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#bdf500] rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-[#0a0a0a] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-[#8e9191] hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#8e9191] text-sm">
              No transfers yet. Send your first remittance!
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <CheckCircle2 size={15} className="text-[#bdf500] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{n.title}</p>
                    <p className="text-[#8e9191] text-xs mt-0.5">{n.body}</p>
                    {n.txHash && (
                      <a
                        href={`https://assethub-paseo.subscan.io/extrinsic/${n.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#bdf500] text-[0.7rem] hover:underline mt-1 inline-block"
                      >
                        View on explorer →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
