import { motion } from 'framer-motion';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';

const steps = [
  {
    number: '01',
    title: 'Submit an intent',
    description: 'A user initiates an action on a supported source chain. A gateway contract records the intent and emits an event.',
    detail: 'Gateway contracts',
  },
  {
    number: '02',
    title: 'Relayers forward',
    description: 'Relayers detect the intent event, validate the payload, and forward the execution request to Algorand.',
    detail: 'Relayer network',
  },
  {
    number: '03',
    title: 'Execute on Algorand',
    description: 'AlgoExecutor verifies authorized relayers, decodes calldata, and executes the application call on Algorand.',
    detail: '10–30s end to end',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20"
        >
          <div>
            <p className="text-[var(--color-muted-2)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Intent-based execution</p>
            <h2 className="section-headline text-white">3 steps.<br />Any chain.<br /><span className="text-white/25">One execution layer.</span></h2>
          </div>
          <a
            href="/demo/counter"
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold text-[0.8rem] px-6 py-3 rounded-full transition-all duration-200 self-start md:self-auto shrink-0"
          >
            Try demo <ArrowUpRight size={14} />
          </a>
        </motion.div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col md:flex-row md:items-center gap-5 md:gap-10 py-8 border-b border-white/[0.07] cursor-default hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-colors duration-300"
            >
              <div className="flex items-center gap-5 md:gap-8 md:w-1/3">
                <span className="text-[2.5rem] md:text-[3.5rem] font-black text-white/[0.04] leading-none font-mono tabular-nums shrink-0 w-20 md:w-28 text-center">
                  {step.number}
                </span>
                <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight leading-tight">{step.title}</h3>
              </div>

              <p className="text-[var(--color-muted)] text-[0.88rem] leading-relaxed md:flex-1 md:max-w-lg">{step.description}</p>

              <div className="md:w-48 shrink-0 flex md:justify-end">
                <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full text-[var(--color-accent)] bg-[var(--accent-07)] border border-[var(--accent-18)]">
                  <span className="w-1 h-1 rounded-full animate-pulse bg-[var(--color-accent)]" />
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
