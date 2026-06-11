import CheckCircle from 'lucide-react/dist/esm/icons/check-circle.js';
import Circle from 'lucide-react/dist/esm/icons/circle.js';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2.js';
import type { IntentStep } from '../../lib/hooks/useCounterIntent';

const steps = [
  { id: 'signing', label: 'Sign on Somnia', detail: 'ArcGateway emits intent event' },
  { id: 'source-confirmed', label: 'Source confirmed', detail: 'Intent logged on Somnia' },
  { id: 'relayer-pending', label: 'Relayer settles', detail: 'Off-chain relayer calls Algorand' },
  { id: 'settled', label: 'Algorand updated', detail: 'Counter state persisted on ledger' },
] as const;

const stepOrder: IntentStep[] = [
  'signing',
  'source-confirmed',
  'relayer-pending',
  'settled',
];

function stepIndex(step: IntentStep) {
  return stepOrder.indexOf(step);
}

interface FlowPipelineProps {
  step: IntentStep;
}

export default function FlowPipeline({ step }: FlowPipelineProps) {
  const activeIndex = step === 'idle' || step === 'error' ? -1 : stepIndex(step);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface-1)] p-5 md:p-6">
      <p className="text-[var(--color-muted-2)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
        Cross-chain flow
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((item, index) => {
          const done = activeIndex > index;
          const active = activeIndex === index;

          return (
            <div key={item.id} className="relative flex md:flex-col gap-3 md:gap-2">
              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute top-5 left-[calc(50%+1.25rem)] right-0 h-px ${
                    done ? 'bg-[var(--color-accent)]' : 'bg-white/[0.08]'
                  }`}
                />
              )}
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    done
                      ? 'bg-[var(--accent-12)] border-[var(--accent-30)] text-[var(--color-accent)]'
                      : active
                        ? 'bg-[var(--accent-08)] border-[var(--accent-25)] text-[var(--color-accent)]'
                        : 'bg-white/[0.03] border-white/[0.08] text-[var(--color-muted-3)]'
                  }`}
                >
                  {done ? (
                    <CheckCircle size={18} />
                  ) : active ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Circle size={16} />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${active || done ? 'text-white' : 'text-[var(--color-muted)]'}`}>
                    {item.label}
                  </p>
                  <p className="text-[var(--color-muted-3)] text-xs mt-0.5">{item.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
