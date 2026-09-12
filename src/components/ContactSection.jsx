import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowUp, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import MagneticButton from './MagneticButton';

export default function ContactSection() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80">
      <div className="max-w-3xl mx-auto">
        {/* Header (Left-aligned as requested) */}
        <div className="flex flex-col mb-12 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5 text-sky-600" />
            <span>Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-950 tracking-tight">
            Start a Conversation.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Actively seeking Summer 2026 engineering internships, academic research partnerships, and discussions on intelligent software systems.
          </p>
        </div>

        {/* Centered Contact Channels Card */}
        <div className="mb-20 text-left">
          <SpotlightCard
            className="p-6 sm:p-8"
            spotlightColor="rgba(2, 132, 199, 0.08)"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono text-slate-500">
              <span className="uppercase tracking-wider">Contact Channels</span>
              <span className="text-slate-400">Direct Inquiries</span>
            </div>

            <div className="space-y-4 mt-5">
              {/* Personal Email */}
              <div>
                <div className="text-[11px] font-mono text-slate-400">Personal Email</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <a
                    href={`mailto:${personalInfo.personalEmail}`}
                    className="text-sm font-semibold text-slate-950 hover:text-sky-600 transition-colors truncate"
                  >
                    {personalInfo.personalEmail}
                  </a>
                  <button
                    onClick={() => copyToClipboard(personalInfo.personalEmail, 'personal')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                    aria-label="Copy Personal Email"
                    title="Copy Personal Email"
                  >
                    {copiedKey === 'personal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Institutional Email */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-mono text-slate-400">Institutional Email (RAIT)</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <a
                    href={`mailto:${personalInfo.institutionalEmail}`}
                    className="text-sm font-semibold text-slate-950 hover:text-sky-600 transition-colors truncate"
                  >
                    {personalInfo.institutionalEmail}
                  </a>
                  <button
                    onClick={() => copyToClipboard(personalInfo.institutionalEmail, 'institutional')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                    aria-label="Copy Institutional Email"
                    title="Copy Institutional Email"
                  >
                    {copiedKey === 'institutional' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-mono text-slate-400">LinkedIn Profile</div>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-sky-700 hover:text-sky-900 transition-colors inline-flex items-center gap-1.5 mt-1 group"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              {/* GitHub */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-mono text-slate-400">GitHub Repository</div>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-slate-900 hover:text-sky-600 transition-colors inline-flex items-center gap-1.5 mt-1 group"
                >
                  <Github className="w-4 h-4" />
                  <span>github.com/{personalInfo.githubUsername}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Minimalist Pearl Footer */}
        <footer className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{personalInfo.name}</span>
            <span>&bull;</span>
            <span>B.Tech CSE (AIML) &bull; RAIT &apos;29</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-950 transition-colors"
            >
              GitHub
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-950 transition-colors"
            >
              LinkedIn
            </a>
            <MagneticButton distance={0.35}>
              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer inline-flex"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </section>
  );
}
