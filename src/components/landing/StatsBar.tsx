import { formatUSDC } from '../../lib/utils/format';

export default function StatsBar() {
  const nonce = 12842n;
  const totalAssets = 12_500_000_000000n;

  const stats = [
    { label: 'Intents Processed', value: nonce.toString() },
    { label: 'Executor TVL', value: `$${formatUSDC(totalAssets)}` },
    { label: 'Avg. Execution', value: '10–30s' },
    { label: 'Supported Chains', value: '4+' },
    { label: 'Execution Layer', value: 'Algorand' },
    { label: 'Relayer Uptime', value: '99.98%' },
    { label: 'Gateways', value: 'Ethereum, Polygon, Avalanche, BNB' },
    { label: 'Identity', value: 'Unified Algo Account' },
  ];

  return (
    <div className="border-y border-white/[0.07] bg-[#060606] overflow-hidden">
      <div className="stats-marquee flex py-4">
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 px-8">
            <span className="text-[#747878] text-[0.72rem] font-medium whitespace-nowrap">{stat.label}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[#bdf500] text-[0.78rem] font-bold font-mono whitespace-nowrap">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
