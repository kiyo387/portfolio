const PRINCIPLES = [
  'GARBAGE IN, GARBAGE OUT — DATA QUALITY BEATS MODEL COMPLEXITY EVERY TIME.',
  'SPLIT BY GROUP OR TIME BEFORE PREPROCESSING TO PREVENT DATA LEAKAGE.',
  'NEVER TRUST ACCURACY ON IMBALANCED DATA — OPTIMIZE PR-AUC AND CALIBRATION.',
  'START WITH A SIMPLE BASELINE BEFORE SCALING TO DEEP ARCHITECTURES.',
  'SCALE INPUT RESOLUTION AND RECEPTIVE FIELD WHEN SMALL OBJECTS DISAPPEAR.',
  'BENCHMARK INFERENCE LATENCY ON TARGET HARDWARE, NOT JUST VALIDATION LOSS.',
];

const MARQUEE_TOKENS = [
  'ENGINEERING PRINCIPLES',
  'ENGINEERING PRINCIPLES',
  'ENGINEERING PRINCIPLES',
  'ENGINEERING PRINCIPLES',
];

export function PrinciplesSection() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-heading"
      className="border-t border-[var(--border-subtle)] pt-16 pb-10 lg:pt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          <span>[ 06 / 07 ]</span>
          <span>PRINCIPLES</span>
        </div>
      </div>

      {/* Giant Muted Marquee */}
      <div className="mt-6 overflow-hidden py-4" aria-hidden="true">
        <div className="animate-honey-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {[...MARQUEE_TOKENS, ...MARQUEE_TOKENS].map((label, idx) => (
            <div key={`${label}-${idx}`} className="flex items-center gap-10">
              <span className="honey-marquee-text font-sans text-6xl font-semibold tracking-[-0.04em] sm:text-8xl lg:text-[116px]">
                {label}
              </span>
              <span className="h-4 w-4 shrink-0 bg-[var(--accent)]" />
            </div>
          ))}
        </div>
      </div>

      <h2 id="principles-heading" className="sr-only">
        Engineering principles
      </h2>

      {/* Monospace Numbered 001-006 Rules Slab */}
      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10">
          <ol className="space-y-4 font-mono text-sm leading-relaxed sm:text-base lg:text-lg">
            {PRINCIPLES.map((rule, idx) => (
              <li
                key={rule}
                className="flex items-baseline gap-4 text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              >
                <span className="shrink-0 text-[var(--accent)] tabular-nums">
                  {String(idx + 1).padStart(3, '0')}.
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
