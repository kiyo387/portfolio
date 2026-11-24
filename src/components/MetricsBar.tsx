import { METRICS } from '../data/resume';

export function MetricsBar() {
  return (
    <section
      aria-label="Verified engineering benchmarks"
      className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[var(--border-subtle)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {METRICS.map((metric) => (
          <div key={metric.id} className="px-4 py-6 sm:px-6 lg:px-7">
            <div className="font-mono text-2xl font-medium tracking-tight text-[var(--text-primary)] tabular-nums md:text-3xl">
              {metric.value}
            </div>
            <div className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
              {metric.label}
            </div>
            <div className="mt-1 font-mono text-xs text-[var(--text-muted)] tabular-nums">
              {metric.context}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
