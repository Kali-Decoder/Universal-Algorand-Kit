import { useState } from 'react';
import { motion } from 'framer-motion';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Link2 from 'lucide-react/dist/esm/icons/link-2.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import Globe from 'lucide-react/dist/esm/icons/globe.js';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down.js';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Instant finality (no reorg risk)',
    label: 'No forks, no rollbacks',
    description: 'Once executed, a transaction is final forever. Critical for cross-chain intents where rollback breaks UX.',
    stat: 'Final on execute',
  },
  {
    icon: <Link2 size={20} />,
    title: 'Ultra-low & predictable fees',
    label: 'Consistent costs',
    description: 'Enables micro-transactions, high-frequency intent execution, and better UX for users coming from expensive chains.',
    stat: 'Low fees',
  },
  {
    icon: <Shield size={20} />,
    title: 'High throughput & scalability',
    label: 'Fast block production',
    description: 'Handles thousands of TPS, ideal for relayer-driven execution bursts and many cross-chain intents in parallel.',
    stat: 'High TPS',
  },
  {
    icon: <TrendingDown size={20} />,
    title: 'Secure & decentralized (PPoS)',
    label: 'Pure Proof of Stake',
    description: 'Random validator selection via cryptographic sortition reduces centralization and resists attacks for trustless execution.',
    stat: 'PPoS',
  },
  {
    icon: <Globe size={20} />,
    title: 'Stateless smart contract execution',
    label: 'AVM efficiency',
    description: 'Supports stateless + stateful contracts with low overhead and built-in inner transactions.',
    stat: 'AVM + inner tx',
  },
  {
    icon: <Zap size={20} />,
    title: 'Native atomic transfers',
    label: 'All-or-nothing',
    description: 'Transaction groups execute atomically, crucial for intent settlement and multi-step DeFi actions.',
    stat: 'Atomic groups',
  },
  {
    icon: <Shield size={20} />,
    title: 'Simplicity for developers',
    label: 'No cross-chain complexity',
    description: 'Deploy once on Algorand, avoid multi-chain contracts, bridging, and fragmented liquidity logic.',
    stat: 'Deploy once',
  },
];

export default function WhyAlgorand() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="why-algorand" className="py-24 md:py-32 bg-[var(--color-surface-2)]">
      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[var(--color-muted-2)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Why Algorand</p>
            <h2 className="section-headline text-white">
              Why build on<br />
              <span className="in-seconds-gradient">Algorand?</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 self-start md:self-auto">
            <span className="text-[var(--color-accent)] text-sm">●</span>
            <span className="text-[var(--color-muted)] text-[0.72rem] font-medium">Built on Algorand</span>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/[0.07]">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative border-b border-white/[0.07] cursor-default overflow-hidden transition-colors duration-300"
            style={{ background: hovered === i ? 'var(--accent-03)' : 'transparent' }}
          >
            <div className="px-5 md:px-8 lg:px-12 py-5 md:py-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                <div className="flex items-center gap-4 md:w-[42%] shrink-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      color: hovered === i ? 'var(--color-accent)' : 'var(--color-muted-2)',
                      background: hovered === i ? 'var(--accent-12)' : 'var(--white-04)',
                      border: `1px solid ${hovered === i ? 'var(--accent-25)' : 'var(--white-08)'}`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className="font-extrabold text-lg md:text-xl tracking-tight leading-tight transition-colors duration-300"
                      style={{ color: hovered === i ? 'var(--color-text)' : 'var(--color-muted-7)' }}
                    >
                      {feature.title}
                    </h3>
                    <span className="text-[var(--color-muted-2)] text-[0.72rem] font-medium">{feature.label}</span>
                  </div>
                </div>

                <p
                  className="text-[0.85rem] leading-relaxed md:flex-1 transition-all duration-500"
                  style={{
                    color: hovered === i ? 'var(--color-muted-5)' : 'var(--color-muted-3)',
                    transform: hovered === i ? 'translateY(0)' : 'translateY(3px)',
                  }}
                >
                  {feature.description}
                </p>

                <div className="md:w-36 shrink-0 flex md:justify-end">
                  <span
                    className="text-[0.72rem] font-bold font-mono px-3 py-1.5 rounded-lg transition-all duration-300"
                    style={{
                      color: hovered === i ? 'var(--color-accent)' : 'var(--color-muted-2)',
                      background: hovered === i ? 'var(--accent-08)' : 'var(--white-03)',
                      border: `1px solid ${hovered === i ? 'var(--accent-20)' : 'var(--white-06)'}`,
                    }}
                  >
                    {feature.stat}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-500"
              style={{
                background: 'var(--color-accent)',
                opacity: hovered === i ? 0.6 : 0,
                transform: hovered === i ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[var(--accent-04)] border border-[var(--accent-15)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-08)] border border-[var(--accent-20)] flex items-center justify-center text-[var(--color-accent)] text-2xl shrink-0">●</div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-white font-bold text-lg mb-1">Algorand as the execution layer</div>
            <div className="text-[var(--color-muted)] text-sm">Universal Algo Kit executes cross-chain intents on Algorand, enabling multi-chain applications without deploying on every network.</div>
          </div>
          <a
            href="/docs"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold text-[0.8rem] px-5 py-2.5 rounded-full transition-all duration-200 shrink-0"
          >
            Read docs <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
