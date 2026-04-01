import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Bell from 'lucide-react/dist/esm/icons/bell.js';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import Check from 'lucide-react/dist/esm/icons/check.js';

function AppStoreBadge({ store }: { store: 'apple' | 'google' }) {
  const isApple = store === 'apple';

  return (
    <div
      className="relative flex items-center gap-3.5 px-5 py-3.5 rounded-2xl overflow-hidden cursor-not-allowed select-none"
      style={{
        background: 'var(--white-03)',
        border: '1px solid var(--white-07)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--black-20)' }}
      />

      {isApple ? (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 fill-white opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.18 23.77c.24.13.5.19.78.17l.06-.04L13.64 12 4.02.1l-.06-.03C3.7.05 3.44.01 3.18.15c-.52.28-.78.87-.78 1.69v20.3c0 .81.26 1.4.78 1.63z" fill="var(--color-google-red)"/>
          <path d="M17.09 15.83l-2.95-2.95-1.5 1.5 3.07 3.07 4.1-2.36a1.24 1.24 0 0 0 0-2.18l-4.1-2.36 1.5 1.5 2.95 2.95-3.07 1.77z" fill="var(--color-google-yellow)"/>
          <path d="M3.18.15c.24-.13.5-.19.78-.17l.06.04 9.62 9.63-2.95 2.95L3.18.15z" fill="var(--color-google-blue)"/>
          <path d="M3.24 23.94l.06-.04 7.39-7.39 2.95 2.95L3.24 23.94z" fill="var(--color-google-green)"/>
        </svg>
      )}

      <div className="relative opacity-40">
        <p className="text-white text-[0.6rem] font-medium leading-none mb-0.5">
          {isApple ? 'Download on the' : 'Get it on'}
        </p>
        <p className="text-white text-[0.95rem] font-bold leading-none">
          {isApple ? 'App Store' : 'Google Play'}
        </p>
      </div>

      <span
        className="ml-auto text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
        style={{ color: 'var(--color-accent)', background: 'var(--accent-10)', border: '1px solid var(--accent-20)' }}
      >
        Soon
      </span>
    </div>
  );
}

function NotifyForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 py-3"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent-12)', border: '1px solid var(--accent-30)' }}
          >
            <Check size={14} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">You're on the list!</p>
            <p className="text-[var(--color-muted-2)] text-[0.75rem]">We'll notify you when the app launches.</p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="flex gap-2 w-full max-w-sm"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 bg-transparent text-white text-sm outline-none rounded-xl px-4 py-2.5 min-w-0"
            style={{
              background: 'var(--white-04)',
              border: '1px solid var(--white-10)',
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-black font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <Bell size={13} />
            Notify me
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function AppDownload() {
  const features = [
    { icon: Zap, label: 'Instant transfers in ~6 seconds' },
    { icon: Shield, label: 'Non-custodial — your keys, your funds' },
    { icon: Smartphone, label: 'iOS & Android native experience' },
  ];

  return (
    <section className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, var(--accent-03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--black-14100) 0%, var(--black-10100) 100%)',
            border: '1px solid var(--white-08)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 5%, var(--accent-40) 50%, transparent 95%)' }}
          />
          <div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--accent-06) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--accent-04) 0%, transparent 70%)' }}
          />

          <div className="relative grid lg:grid-cols-2 gap-0">
            <div className="px-8 md:px-12 lg:px-16 py-14 md:py-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                    style={{ color: 'var(--color-accent)', background: 'var(--accent-08)', border: '1px solid var(--accent-20)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    Coming Soon
                  </span>
                </div>

                <h2 className="section-headline text-white mb-5">
                  The app<br />is coming.
                </h2>

                <p className="text-[var(--color-muted)] text-[0.92rem] leading-relaxed mb-8 max-w-[34ch]">
                  We're putting the final touches on the RemitStar mobile experience. Be the first to know when it's ready.
                </p>

                <div className="space-y-3 mb-10">
                  {features.map(({ icon: Icon, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'var(--accent-08)', border: '1px solid var(--accent-18)' }}
                      >
                        <Icon size={12} className="text-[var(--color-accent)]" />
                      </div>
                      <span className="text-[var(--color-muted-5)] text-[0.85rem]">{label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mb-10">
                  <p className="text-[var(--color-muted-2)] text-[0.72rem] font-semibold uppercase tracking-wider mb-3">
                    Get notified at launch
                  </p>
                  <NotifyForm />
                </div>

                <div className="flex flex-wrap gap-3">
                  <AppStoreBadge store="apple" />
                  <AppStoreBadge store="google" />
                </div>
              </motion.div>
            </div>

            <div className="relative flex items-center justify-center py-16 lg:py-10 lg:min-h-[560px] overflow-visible">
              <div
                className="absolute inset-y-0 left-0 w-px"
                style={{ background: 'linear-gradient(180deg, transparent, var(--white-06) 30%, var(--white-06) 70%, transparent)' }}
              />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  {/* Phone shell */}
                  <div
                    className="relative w-[260px] rounded-[3rem] overflow-hidden"
                    style={{
                      background: 'linear-gradient(160deg, var(--color-surface-5) 0%, var(--color-surface-1) 100%)',
                      border: '1.5px solid var(--white-12)',
                      boxShadow: '0 60px 120px var(--black-90), 0 0 0 1px var(--white-04) inset, 0 0 80px var(--accent-08)',
                    }}
                  >
                    {/* Screen glare */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-20 rounded-t-[3rem]"
                      style={{ background: 'linear-gradient(160deg, var(--white-05) 0%, transparent 60%)' }}
                    />

                    {/* Dynamic island */}
                    <div className="relative z-30 flex justify-center pt-3.5 pb-1">
                      <div
                        className="w-24 h-6 rounded-full flex items-center justify-center gap-1.5"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-surface-6)]" />
                        <div className="w-3 h-3 rounded-full bg-[var(--color-surface-7)]" />
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 pb-1">
                      <span className="text-white text-[0.55rem] font-semibold">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5 items-end h-2.5">
                          {[2, 3, 4, 5].map((h, i) => (
                            <div key={i} className="w-0.5 rounded-sm bg-white" style={{ height: `${h * 2}px` }} />
                          ))}
                        </div>
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M1.5 8.5C5.5 4.5 18.5 4.5 22.5 8.5L20.3 10.7C17.3 7.7 6.7 7.7 3.7 10.7L1.5 8.5zm4.2 4.2C7.4 11 16.6 11 18.3 12.7l-2.2 2.2c-.9-.9-7.3-.9-8.2 0L5.7 12.7zm4.2 4.2L12 15l2.1 1.9L12 19 9.9 16.9z"/></svg>
                        <div className="flex items-center gap-0.5">
                          <div className="w-5 h-2.5 rounded-sm border border-white/50 p-px flex">
                            <div className="bg-white rounded-[1px] w-3/4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="px-5 pt-3 pb-6">

                      {/* Header */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-[var(--color-muted-4)] text-[0.58rem] tracking-wide">Good morning</p>
                          <p className="text-white text-[0.95rem] font-bold leading-tight">Ana Martinez</p>
                        </div>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, var(--accent-25), var(--accent-08))', border: '1.5px solid var(--accent-30)' }}
                        >
                          <span className="text-[var(--color-accent)] text-[0.7rem] font-black">AM</span>
                        </div>
                      </div>

                      {/* Balance card */}
                      <div
                        className="rounded-2xl p-4 mb-4 relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-14) 0%, var(--accent-04) 50%, var(--black-00) 100%)',
                          border: '1px solid var(--accent-20)',
                        }}
                      >
                        <div
                          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                          style={{ background: 'var(--accent-12)' }}
                        />
                        <p className="text-[var(--color-muted)] text-[0.55rem] uppercase tracking-widest mb-1.5">Total Balance</p>
                        <div className="flex items-end gap-1.5 mb-2">
                          <p className="text-white text-[1.9rem] font-black font-mono leading-none">$2,400</p>
                          <span className="text-[var(--color-accent)] text-[0.6rem] font-bold mb-1">USDC</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse inline-block" />
                          <p className="text-[var(--color-accent)] text-[0.58rem] font-medium">Algorand · Live</p>
                        </div>

                        {/* Mini chart */}
                        <div className="flex items-end gap-0.5 mt-3 h-8">
                          {[40, 55, 45, 60, 50, 70, 65, 80, 72, 88, 76, 100].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${h}%`,
                                background: i === 11 ? 'var(--color-accent)' : `rgba(var(--accent-rgb), ${0.1 + i * 0.04})`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { icon: '↑', label: 'Send', active: true },
                          { icon: '↓', label: 'Receive', active: false },
                          { icon: '⟳', label: 'Swap', active: false },
                        ].map((action) => (
                          <div
                            key={action.label}
                            className="rounded-xl py-2.5 flex flex-col items-center gap-1"
                            style={{
                              background: action.active ? 'var(--accent-10)' : 'var(--white-03)',
                              border: `1px solid ${action.active ? 'var(--accent-25)' : 'var(--white-06)'}`,
                            }}
                          >
                            <span className={`text-sm font-bold ${action.active ? 'text-[var(--color-accent)]' : 'text-white/40'}`}>{action.icon}</span>
                            <span className={`text-[0.5rem] font-semibold ${action.active ? 'text-[var(--color-accent)]' : 'text-white/30'}`}>{action.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recent transfers */}
                      <p className="text-[var(--color-muted-3)] text-[0.52rem] uppercase tracking-widest mb-2.5">Recent Transfers</p>
                      <div className="space-y-1.5">
                        {[
                          { flag: '🇵🇪', name: 'Maria G.', city: 'Lima', amount: 'S/ 742', time: '6s', color: 'var(--accent-70)' },
                          { flag: '🇲🇽', name: 'Carlos R.', city: 'CDMX', amount: 'MX$ 1.8k', time: '7s', color: 'var(--accent-50)' },
                          { flag: '🇵🇭', name: 'Jose L.', city: 'Manila', amount: '₱ 5.5k', time: '5s', color: 'var(--accent-40)' },
                        ].map((tx, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5"
                            style={{ background: 'var(--white-025)', border: '1px solid var(--white-05)' }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                                style={{ background: 'var(--white-04)' }}
                              >
                                {tx.flag}
                              </div>
                              <div>
                                <p className="text-white text-[0.6rem] font-semibold leading-none">{tx.name}</p>
                                <p className="text-[var(--color-muted-3)] text-[0.5rem] mt-0.5">{tx.city}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-[0.62rem] font-bold font-mono leading-none">{tx.amount}</p>
                              <p className="text-[var(--color-accent)] text-[0.5rem] mt-0.5">{tx.time} ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Home indicator */}
                    <div className="flex justify-center pb-2 pt-1">
                      <div className="w-20 h-1 rounded-full bg-white/15" />
                    </div>
                  </div>

                  {/* Side buttons */}
                  <div
                    className="absolute -right-[3px] top-24 w-[3px] h-10 rounded-r-sm"
                    style={{ background: 'var(--white-06)' }}
                  />
                  <div
                    className="absolute -left-[3px] top-20 w-[3px] h-7 rounded-l-sm"
                    style={{ background: 'var(--white-06)' }}
                  />
                  <div
                    className="absolute -left-[3px] top-32 w-[3px] h-7 rounded-l-sm"
                    style={{ background: 'var(--white-06)' }}
                  />
                  <div
                    className="absolute -left-[3px] top-44 w-[3px] h-12 rounded-l-sm"
                    style={{ background: 'var(--white-06)' }}
                  />
                </motion.div>

                {/* Floating badge — delivery */}
                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="absolute -top-4 -right-16 rounded-2xl px-4 py-3"
                  style={{
                    background: 'var(--black-696)',
                    border: '1px solid var(--accent-30)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 16px 48px var(--black-80), 0 0 0 1px var(--accent-05) inset',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    <p className="text-[var(--color-muted-4)] text-[0.48rem] uppercase tracking-widest">Confirmed</p>
                  </div>
                  <p className="text-[var(--color-accent)] text-[0.8rem] font-bold font-mono">5.8s</p>
                </motion.div>

                {/* Floating badge — fee */}
                <motion.div
                  animate={{ y: [0, 9, 0], x: [0, -3, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute -bottom-6 -left-16 rounded-2xl px-4 py-3"
                  style={{
                    background: 'var(--black-696)',
                    border: '1px solid var(--white-09)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 16px 48px var(--black-60)',
                  }}
                >
                  <p className="text-[var(--color-muted-4)] text-[0.48rem] uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-white text-[0.8rem] font-bold font-mono">$0.60</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
