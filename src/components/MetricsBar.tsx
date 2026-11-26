import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { METRICS } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTweenedNumber } from '../hooks/useTweenedNumber';

function BenchmarkDisplay({ id, fallback }: { id: string; fallback: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();

  const mapVal = useTweenedNumber(id === 'map' && inView ? 0.443 : 0, 650);
  const latencyVal = useTweenedNumber(id === 'latency' && inView ? 1.8 : 0, 650);
  const faissVal = useTweenedNumber(id === 'faiss' && inView ? 24050 : 0, 750);
  const fpsVal = useTweenedNumber(id === 'fps' && inView ? 41 : 0, 650);

  let rendered = fallback;
  if (!reducedMotion) {
    if (id === 'map') rendered = `${mapVal.toFixed(3)} mAP`;
    else if (id === 'latency') rendered = `Under ${latencyVal.toFixed(1)} ms`;
    else if (id === 'faiss') rendered = `${Math.round(faissVal).toLocaleString('en-US')} Vectors`;
    else if (id === 'fps') {
      const low = Math.max(0, Math.round(fpsVal) - 2);
      rendered = inView ? `${low}–${Math.round(fpsVal)} FPS` : '0 FPS';
    }
  }

  return (
    <div
      ref={ref}
      className="text-5xl font-normal tracking-[-0.045em] leading-none text-[var(--text-primary)] tabular-nums sm:text-7xl lg:text-[84px]"
    >
      {rendered}
    </div>
  );
}

export function MetricsBar() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Verified engineering benchmarks"
      className="mx-auto max-w-7xl border-t border-[var(--border-subtle)] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="flex items-center gap-8 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
        <span>[ 03 / 07 ]</span>
        <span>BENCHMARKS</span>
      </div>

      <motion.h2
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
        className="mx-auto mt-10 max-w-3xl text-center text-4xl font-normal tracking-[-0.04em] leading-[1.02] text-[var(--text-primary)] sm:text-6xl"
      >
        Built for messy data, measured in milliseconds.
      </motion.h2>

      <div className="mx-auto mt-16 max-w-2xl space-y-16 text-center lg:mt-20 lg:space-y-20">
        {METRICS.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="inline-flex items-start justify-center gap-2">
              <span className="mt-1 font-mono text-xs text-[var(--accent)] tabular-nums">
                0{idx + 1}
              </span>
              <BenchmarkDisplay id={metric.id} fallback={metric.value} />
            </div>
            <div className="mt-3 font-mono text-xs text-[var(--text-secondary)]">
              {metric.label}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              {metric.context}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
