import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PROFILE } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { RollingLabel } from './RollingLabel';

interface HeroProps {
  onExploreSystems: () => void;
}

const STACK_MARKS = ['PyTorch', 'FastAPI', 'Docker', 'Weights & Biases'];

export function Hero({ onExploreSystems }: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const lensY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const lensScale = useTransform(scrollYProgress, [0, 1], [1, 0.91]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-[var(--bg-base)] pt-14 pb-5"
    >
      {/* Sculptural dark optical centerpiece emerging from top center */}
      <motion.div
        aria-hidden="true"
        style={reducedMotion ? undefined : { y: lensY, scale: lensScale }}
        className="pointer-events-none mx-auto flex w-full max-w-[440px] items-start justify-center px-6"
      >
        {!imgError ? (
          <img
            src="/assets/asset.gif"
            alt=""
            onError={() => setImgError(true)}
            draggable={false}
            style={{
              outline: 'none',
              WebkitMaskImage:
                'radial-gradient(ellipse 68% 72% at 50% 44%, black 42%, transparent 96%)',
              maskImage:
                'radial-gradient(ellipse 68% 72% at 50% 44%, black 42%, transparent 96%)',
            }}
            className="h-[200px] w-full object-contain sm:h-[230px] lg:h-[250px]"
          />
        ) : (
          <svg
            viewBox="0 0 400 320"
            className="h-[220px] w-full sm:h-[260px]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="obsidian-lens-fallback" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="48%" stopColor="#262626" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="145" r="130" fill="url(#obsidian-lens-fallback)" />
            <circle cx="200" cy="145" r="96" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="200" cy="145" r="64" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" />
            <circle cx="200" cy="145" r="32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          </svg>
        )}
      </motion.div>

      {/* Overlapping centered monumental display headline */}
      <motion.div
        style={reducedMotion ? undefined : { opacity: textOpacity, y: textY }}
        className="relative z-10 mx-auto -mt-4 w-full max-w-5xl px-4 text-center"
      >
        <h1
          id="hero-heading"
          className="text-5xl font-normal tracking-[-0.045em] leading-[0.95] sm:text-7xl md:text-[84px] lg:text-[96px]"
        >
          <span className="block overflow-hidden pb-1">
            <motion.span
              initial={reducedMotion ? false : { y: '108%' }}
              animate={{ y: '0%' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
              }
              className="block text-[var(--text-primary)]"
            >
              Ship real models
            </motion.span>
          </span>
          <span className="mt-1 block overflow-hidden pb-2">
            <motion.span
              initial={reducedMotion ? false : { y: '108%' }}
              animate={{ y: '0%' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
              }
              className="block text-[var(--text-secondary)]"
            >
              not notebook demos.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }
          }
          className="mx-auto mt-4 max-w-[54ch] font-mono text-xs text-[var(--text-secondary)]"
        >
          {PROFILE.name} · B.Tech CSE (AI &amp; ML, 8.98 CGPA) · Mumbai, IN
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-5 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#systems"
            onClick={(e) => {
              e.preventDefault();
              onExploreSystems();
            }}
            className="group inline-flex h-10 items-center whitespace-nowrap rounded-[4px] bg-[var(--accent)] px-5 font-mono text-xs font-semibold text-[var(--accent-ink)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-hover)] active:scale-[0.97]"
          >
            <RollingLabel>Explore interactive labs</RollingLabel>
          </a>

          <a
            href={PROFILE.resumeUrl}
            download="Shreyas_Bhavsar_Resume.pdf"
            className="group inline-flex h-10 items-center whitespace-nowrap rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-base)]/80 px-5 font-mono text-xs text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:bg-[var(--bg-elevated)] active:scale-[0.97]"
          >
            <RollingLabel>Download resume</RollingLabel>
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom Monochrome Production Stack Bar */}
      <div className="relative z-10 mx-auto mt-5 w-full max-w-6xl px-4 sm:px-6">
        <div className="text-center font-mono text-[10px] text-[var(--text-muted)]">
          PRODUCTION STACK
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-16 gap-y-2 border-t border-[var(--border-subtle)] pt-3 text-xs font-medium text-[var(--text-secondary)]">
          {STACK_MARKS.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
