import { CERTIFICATIONS, EDUCATION, PROFILE } from '../data/resume';

export function CredentialsLedger() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="rounded-t-[40px] bg-[var(--accent)] text-black md:rounded-t-[64px]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex items-center gap-8 font-mono text-[11px] text-black/75 tabular-nums">
          <span>[ 07 / 07 ]</span>
          <span>CREDENTIALS &amp; ANSWERS</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2
              id="credentials-heading"
              className="text-4xl font-normal tracking-[-0.04em] leading-[0.98] text-black sm:text-5xl lg:text-[56px]"
            >
              Credentials &amp; quick answers.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8">
            <div>
              <span className="inline-block bg-black px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]">
                001
              </span>
              <h3 className="mt-3 text-lg font-medium tracking-tight text-black">
                Where &amp; what do I study?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/80">
                {EDUCATION.institution} ({EDUCATION.period}). {EDUCATION.degree} —{' '}
                <strong className="font-semibold text-black tabular-nums">
                  CGPA {EDUCATION.cgpa}
                </strong>
                . Coursework: {EDUCATION.coursework.join(', ')}. Secondary:{' '}
                {EDUCATION.secondary.map((s) => `${s.level} (${s.year})`).join(' | ')}.
              </p>
            </div>

            <div>
              <span className="inline-block bg-black px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]">
                002
              </span>
              <h3 className="mt-3 text-lg font-medium tracking-tight text-black">
                What certifications are verified?
              </h3>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-black/80">
                {CERTIFICATIONS.map((cert) => (
                  <p key={`${cert.issuer}-${cert.title}`}>
                    <strong className="font-medium text-black">{cert.issuer}:</strong> {cert.title}{' '}
                    <span className="font-mono text-xs text-black/70 tabular-nums">
                      ({cert.date})
                    </span>
                  </p>
                ))}
              </div>
            </div>

            <div>
              <span className="inline-block bg-black px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]">
                003
              </span>
              <h3 className="mt-3 text-lg font-medium tracking-tight text-black">
                What roles am I targeting?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/80">
                {PROFILE.availability} across Computer Vision, Applied ML, and backend inference engineering — shipping evaluated, Dockerized Python &amp; FastAPI systems ({PROFILE.location} or remote).
              </p>
            </div>

            <div>
              <span className="inline-block bg-black px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]">
                004
              </span>
              <h3 className="mt-3 text-lg font-medium tracking-tight text-black">
                Where is the source &amp; resume?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/80">
                Public project repositories are hosted on{' '}
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black underline underline-offset-4 hover:opacity-75"
                >
                  github.com/kiyo387
                </a>
                , profile on{' '}
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black underline underline-offset-4 hover:opacity-75"
                >
                  LinkedIn
                </a>
                , and the full CV is available as a{' '}
                <a
                  href={PROFILE.resumeUrl}
                  download="Shreyas_Bhavsar_Resume.pdf"
                  className="font-medium text-black underline underline-offset-4 hover:opacity-75"
                >
                  PDF download
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
