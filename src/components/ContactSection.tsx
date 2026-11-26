import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, X } from 'lucide-react';
import { PROFILE } from '../data/resume';
import { RollingLabel } from './RollingLabel';

interface ContactSectionProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function ContactSection({ open, onOpen, onClose }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-[#000000] text-white">
      {/* 50/50 Black / White Split Climax Bar */}
      <div className="grid grid-cols-1 border-y border-white/15 md:grid-cols-2">
        <div className="flex items-center justify-center bg-[#000000] px-6 py-8 text-center text-2xl font-medium tracking-[-0.03em] text-white sm:py-10 sm:text-4xl">
          WHERE DO WE START?
        </div>

        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="group flex items-center justify-center gap-2 bg-[#ffffff] px-6 py-8 text-center text-2xl font-semibold tracking-[-0.03em] text-[#000000] transition-colors duration-150 hover:bg-[#e8e8e4] active:scale-[0.99] sm:py-10 sm:text-4xl"
        >
          <span id="contact-heading">GET IN TOUCH</span>
          <span className="inline-flex items-center -space-x-1" aria-hidden="true">
            <ArrowUpRight className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2} />
            <ArrowUpRight className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2} />
            <ArrowUpRight className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2} />
          </span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="contact-dialog-title"
        onClose={onClose}
        onClick={(e) => {
          if (e.target === dialogRef.current) onClose();
        }}
        className="contact-dialog m-auto w-[min(92vw,520px)] rounded-2xl border border-white/10 bg-[#0d0d0d] p-0 text-white"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="contact-dialog-title" className="sr-only">
              Get in touch
            </h2>
            <p className="max-w-[42ch] text-sm leading-relaxed text-zinc-400">
              Available for AI/ML and Computer Vision internships. Reach out directly by email, LinkedIn, or GitHub.
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close contact dialog"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-black text-zinc-400 transition-[transform,border-color,color] duration-150 ease-out hover:border-white/25 hover:text-white active:scale-[0.97]"
            >
              <X size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-[#f44849]" aria-hidden="true" />
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="truncate font-mono text-sm text-white hover:underline"
                >
                  {PROFILE.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => void handleCopy()}
                aria-label="Copy email address"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-black text-zinc-400 transition-[transform,border-color,color] duration-150 ease-out hover:border-white/25 hover:text-white active:scale-[0.97]"
              >
                {copied ? (
                  <Check size={15} strokeWidth={1.5} className="text-[#22c55e]" aria-hidden="true" />
                ) : (
                  <Copy size={15} strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
            </div>

            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3 transition-colors duration-150 hover:border-white/25"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Linkedin size={16} strokeWidth={1.5} className="shrink-0 text-[#f44849]" aria-hidden="true" />
                <span className="truncate font-mono text-sm text-white">
                  linkedin.com/in/shreyas-bhavsar-053b8440a
                </span>
              </div>
              <ArrowUpRight size={15} strokeWidth={1.5} className="shrink-0 text-zinc-400" aria-hidden="true" />
            </a>

            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3 transition-colors duration-150 hover:border-white/25"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Github size={16} strokeWidth={1.5} className="shrink-0 text-[#f44849]" aria-hidden="true" />
                <span className="truncate font-mono text-sm text-white">github.com/kiyo387</span>
              </div>
              <ArrowUpRight size={15} strokeWidth={1.5} className="shrink-0 text-zinc-400" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-6">
            <a
              href={PROFILE.resumeUrl}
              download="Shreyas_Bhavsar_Resume.pdf"
              className="group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-[4px] border border-white/20 bg-[#0d0d0d] px-4 font-mono text-xs font-medium text-white transition-[transform,border-color,background-color] duration-150 ease-out hover:bg-[#1a1a1a] active:scale-[0.97]"
            >
              <Download size={15} strokeWidth={1.5} aria-hidden="true" />
              <RollingLabel>Download resume</RollingLabel>
            </a>
          </div>
        </div>
      </dialog>
    </section>
  );
}
