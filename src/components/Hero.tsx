import { ArrowDownRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { VisionViewport } from './VisionViewport';

interface HeroProps {
  onExploreSystems: () => void;
}

export function Hero({ onExploreSystems }: HeroProps) {
  const reducedMotion = useReducedMotion();

  const enterProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const },
      };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
    >
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div {...enterProps} className="lg:col-span-5 flex flex-col items-start">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
            <span
              className="h-2 w-2 rounded-full bg-[var(--status-ok)]"
              aria-hidden="true"
            />
            <span>{PROFILE.name} · Mumbai, IN · {PROFILE.availability}</span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl font-medium tracking-tight text-[var(--text-primary)] leading-[1.08] md:text-5xl"
          >
            Engineering vision &amp; ML pipelines that ship
          </h1>

          <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-[var(--text-secondary)]">
            B.Tech AI &amp; ML student (8.98 CGPA) building PyTorch object trackers, sub-2ms fraud APIs, and cross-modal satellite indices.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#systems"
              onClick={(e) => {
                e.preventDefault();
                onExploreSystems();
              }}
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-hover)] active:scale-[0.97]"
            >
              <span>Explore systems</span>
              <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>

            <a
              href={PROFILE.resumeUrl}
              download="Shreyas_Bhavsar_Resume.pdf"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:bg-[var(--bg-elevated)] active:scale-[0.97]"
            >
              <Download size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>Download resume</span>
            </a>
          </div>
        </motion.div>

        <div className="lg:col-span-7">
          <VisionViewport />
        </div>
      </div>
    </section>
  );
}
