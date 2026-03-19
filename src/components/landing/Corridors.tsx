import { motion } from 'framer-motion';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
const gateways = [
  { id: 'eth', fromFlag: 'Ethereum', toFlag: 'Algorand', label: 'Ethereum → Algorand', rate: 'Gateway', volume: 'Intent events', fee: 'Relayed', popular: true },
  { id: 'poly', fromFlag: 'Polygon', toFlag: 'Algorand', label: 'Polygon → Algorand', rate: 'Gateway', volume: 'Intent events', fee: 'Relayed', popular: true },
  { id: 'avax', fromFlag: 'Avalanche', toFlag: 'Algorand', label: 'Avalanche → Algorand', rate: 'Gateway', volume: 'Intent events', fee: 'Relayed', popular: false },
  { id: 'bnb', fromFlag: 'BNB Chain', toFlag: 'Algorand', label: 'BNB Chain → Algorand', rate: 'Gateway', volume: 'Intent events', fee: 'Relayed', popular: false },
];

export default function Corridors() {
  return (
    <section id="corridors" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-[#060606]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-18"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Gateway coverage</p>
            <h2 className="section-headline text-white">
              Built for<br />multi-chain<br /><span className="text-white/25">intent routing.</span>
            </h2>
          </div>
          <p className="text-[#8e9191] text-[0.9rem] leading-relaxed max-w-xs">
            Gateway contracts capture intents on external chains and route execution to Algorand.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gateways.map((corridor, i) => (
            <motion.div
              key={corridor.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(189,245,0,0.2)] hover:bg-[#0f0f0f]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xl">
                  {corridor.fromFlag}
                  <ArrowUpRight size={12} className="text-white/30" />
                  {corridor.toFlag}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
                  <span className="text-[#bdf500] text-[0.65rem] font-semibold">Active</span>
                </div>
              </div>

              <h3 className="text-white font-bold text-sm mb-1 tracking-tight">{corridor.label}</h3>
              <p className="text-[#747878] text-[0.72rem] mb-4 font-mono">
                Role: {corridor.rate}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div>
                  <div className="text-[#4a4d4d] text-[0.65rem] mb-0.5">Events</div>
                  <div className="text-white text-xs font-bold font-mono">{corridor.volume}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#4a4d4d] text-[0.65rem] mb-0.5">Status</div>
                  <div className="text-[#bdf500] text-xs font-bold font-mono">{corridor.fee}</div>
                </div>
              </div>

              {corridor.popular && (
                <div className="absolute -top-2 right-4 bg-[#bdf500] text-black text-[0.6rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full">
                  Popular
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
