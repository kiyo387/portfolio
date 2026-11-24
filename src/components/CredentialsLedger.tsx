import { CERTIFICATIONS, EDUCATION } from '../data/resume';

export function CredentialsLedger() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2
          id="credentials-heading"
          className="text-3xl font-medium tracking-tight text-[var(--text-primary)] md:text-4xl"
        >
          Education &amp; certifications
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Education Ledger */}
          <div className="lg:col-span-7">
            <div className="border-t border-[var(--border-strong)] pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium text-[var(--text-primary)]">
                  {EDUCATION.institution}
                </h3>
                <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                  {EDUCATION.period}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{EDUCATION.degree}</p>

              <div className="mt-4 inline-flex items-baseline gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2">
                <span className="text-xs text-[var(--text-muted)]">CGPA</span>
                <span className="font-mono text-base font-medium text-[var(--accent)] tabular-nums">
                  {EDUCATION.cgpa}
                </span>
              </div>

              <div className="mt-6">
                <div className="text-xs font-medium text-[var(--text-muted)]">
                  Relevant coursework
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {EDUCATION.coursework.map((course) => (
                    <span
                      key={course}
                      className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)]"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
                <div className="text-xs font-medium text-[var(--text-muted)]">
                  Secondary education
                </div>
                <div className="mt-2 flex flex-wrap gap-6 text-sm text-[var(--text-secondary)]">
                  {EDUCATION.secondary.map((item) => (
                    <span key={item.level} className="tabular-nums">
                      {item.level} ({item.year})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications Ledger */}
          <div className="lg:col-span-5">
            <div className="border-t border-[var(--border-strong)] pt-5">
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Certifications</h3>
              <div className="mt-4 divide-y divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={`${cert.issuer}-${cert.title}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        {cert.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--text-muted)]">{cert.issuer}</div>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-[var(--text-secondary)] tabular-nums">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
