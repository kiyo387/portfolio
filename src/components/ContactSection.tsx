import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { PROFILE } from '../data/resume';

export function ContactSection() {
  const [copiedField, setCopiedField] = useState<'email' | 'draft' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [statusMessage, setStatusMessage] = useState('');

  const handleCopy = async (value: string, field: 'email' | 'draft', label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setStatusMessage(`Copied ${label} to clipboard.`);
      window.setTimeout(() => {
        setCopiedField((curr) => (curr === field ? null : curr));
      }, 2000);
    } catch {
      setStatusMessage(`Could not access clipboard. Value: ${value}`);
    }
  };

  const validate = () => {
    const next: { name?: string; email?: string; message?: string } = {};
    if (!senderName.trim()) next.name = 'Name is required.';
    if (!senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      next.email = 'Enter a valid email address.';
    }
    if (!message.trim()) next.message = 'Add a short note about the role or project.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent(`AI/ML Internship Inquiry — ${senderName.trim()}`);
    const body = encodeURIComponent(
      `Hi Shreyas,\n\n${message.trim()}\n\nFrom: ${senderName.trim()} (${senderEmail.trim()})`
    );
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setStatusMessage('Opening your email client with the pre-filled inquiry.');
    window.location.href = buildMailtoHref();
  };

  const handleCopyDraft = () => {
    if (!validate()) return;
    const draft = `To: ${PROFILE.email}\nSubject: AI/ML Internship Inquiry — ${senderName.trim()}\n\nHi Shreyas,\n\n${message.trim()}\n\nFrom: ${senderName.trim()} (${senderEmail.trim()})`;
    void handleCopy(draft, 'draft', 'formatted message');
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/45"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="contact-heading"
              className="text-3xl font-medium tracking-tight text-[var(--text-primary)] md:text-4xl"
            >
              Get in touch
            </h2>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--text-secondary)]">
              Available for AI/ML and Computer Vision internships. Reach out directly by email, LinkedIn, GitHub, or the inquiry form.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Mail size={16} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="truncate font-mono text-sm text-[var(--text-primary)] hover:underline"
                  >
                    {PROFILE.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopy(PROFILE.email, 'email', 'email address')}
                  aria-label="Copy email address"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97]"
                >
                  {copiedField === 'email' ? (
                    <Check size={15} strokeWidth={1.5} className="text-[var(--status-ok)]" aria-hidden="true" />
                  ) : (
                    <Copy size={15} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
              </div>

              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 transition-colors duration-150 hover:border-[var(--border-strong)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Linkedin size={16} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  <span className="truncate font-mono text-sm text-[var(--text-primary)]">
                    linkedin.com/in/shreyas-bhavsar-053b8440a
                  </span>
                </div>
                <ArrowUpRight size={15} strokeWidth={1.5} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
              </a>

              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 transition-colors duration-150 hover:border-[var(--border-strong)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Github size={16} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  <span className="truncate font-mono text-sm text-[var(--text-primary)]">
                    github.com/kiyo387
                  </span>
                </div>
                <ArrowUpRight size={15} strokeWidth={1.5} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span>{PROFILE.location}</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={PROFILE.resumeUrl}
                download="Shreyas_Bhavsar_Resume.pdf"
                className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:bg-[var(--bg-elevated)] active:scale-[0.97]"
              >
                <Download size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>Download resume</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-xs font-medium text-[var(--text-primary)]">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="Recruiter or engineering lead"
                    className="h-11 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                  {errors.name && (
                    <span id="contact-name-error" role="alert" className="text-xs text-[var(--status-warn)]">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-xs font-medium text-[var(--text-primary)]">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => {
                      setSenderEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="you@company.com"
                    className="h-11 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                  {errors.email && (
                    <span id="contact-email-error" role="alert" className="text-xs text-[var(--status-warn)]">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-xs font-medium text-[var(--text-primary)]">
                  Role or project context <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-help'}
                  placeholder="Share internship timeline, team focus, or ML problem space"
                  className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <span id="contact-message-help" className="text-xs text-[var(--text-muted)]">
                  Opens your local mail app or copies a formatted message ready to paste.
                </span>
                {errors.message && (
                  <span id="contact-message-error" role="alert" className="text-xs text-[var(--status-warn)]">
                    {errors.message}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-hover)] active:scale-[0.97]"
                >
                  <Send size={15} strokeWidth={1.5} aria-hidden="true" />
                  <span>Get in touch</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)] px-4 text-sm font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:bg-[var(--bg-elevated)] active:scale-[0.97]"
                >
                  {copiedField === 'draft' ? (
                    <Check size={15} strokeWidth={1.5} className="text-[var(--status-ok)]" aria-hidden="true" />
                  ) : (
                    <Copy size={15} strokeWidth={1.5} aria-hidden="true" />
                  )}
                  <span>{copiedField === 'draft' ? 'Message copied' : 'Copy formatted message'}</span>
                </button>
              </div>

              <div role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-[var(--text-secondary)]">
                {statusMessage}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
