import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import Minus from 'lucide-react/dist/esm/icons/minus.js';
const faqs = [
  {
    question: 'What is Universal Algo Kit?',
    answer: 'Universal Algo Kit is an infrastructure SDK designed to make Algorand the universal execution layer for multi-chain applications.',
  },
  {
    question: 'How do cross-chain intents work?',
    answer: 'Users submit intents on source chains. Gateway contracts emit intent events, relayers forward requests, and AlgoExecutor executes on Algorand.',
  },
  {
    question: 'Do users need to switch networks?',
    answer: 'No. Users interact from their source chain while execution happens on Algorand.',
  },
  {
    question: 'How long does execution take?',
    answer: 'The full lifecycle typically completes in 10–30 seconds depending on network conditions.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20"
        >
          <div>
            <p className="text-[var(--color-muted-2)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Got questions?</p>
            <h2 className="section-headline text-white">
              Frequently<br />asked<br /><span className="text-white/25">questions.</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-[var(--color-muted)] text-sm leading-relaxed">
              Still have questions? We're available on Discord and Twitter — or drop us an email.
            </p>
            <a
              href="https://github.com/Kali-Decoder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--color-accent)] text-sm font-semibold mt-3 hover:gap-2.5 transition-all duration-200"
            >
              Contact us →
            </a>
          </div>
        </motion.div>

        <div className="border-t border-white/[0.07]">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border-b border-white/[0.07]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span
                  className="font-semibold text-[0.95rem] leading-snug transition-colors duration-200"
                  style={{ color: openIndex === i ? 'var(--color-text)' : 'var(--color-muted-7)' }}
                >
                  {faq.question}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: openIndex === i ? 'var(--color-accent)' : 'var(--white-05)',
                    border: `1px solid ${openIndex === i ? 'var(--color-accent)' : 'var(--white-10)'}`,
                  }}
                >
                  {openIndex === i ? (
                    <Minus size={12} className="text-black" />
                  ) : (
                    <Plus size={12} className="text-white/60 group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.65, 0.05, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed pb-6 max-w-2xl">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
