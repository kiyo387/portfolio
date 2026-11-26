import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { PROFILE } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ScrollManifestoProps {
  onExploreLabs: () => void;
}

const ABOUT_WORDS: { text: string; accent?: boolean }[] = [
  { text: 'Shreyas' },
  { text: 'Bhavsar' },
  { text: 'is' },
  { text: 'an' },
  { text: 'AI/ML' },
  { text: 'and' },
  { text: 'Computer' },
  { text: 'Vision' },
  { text: 'student' },
  { text: '(8.98' },
  { text: 'CGPA)' },
  { text: 'building' },
  { text: 'end-to-end' },
  { text: 'Python', accent: true },
  { text: 'pipelines' },
  { text: '—' },
  { text: 'from' },
  { text: 'leak-free' },
  { text: 'data' },
  { text: 'splits' },
  { text: 'and' },
  { text: 'PyTorch', accent: true },
  { text: 'training' },
  { text: 'to' },
  { text: 'sub-2ms', accent: true },
  { text: 'Dockerized' },
  { text: 'REST' },
  { text: 'APIs.' },
];

const CAPABILITIES = [
  'Computer Vision',
  'Multi-Object Tracking',
  'Anomaly Scoring',
  'Cross-Modal ViT',
  'FAISS HNSW Search',
  'FastAPI Microservices',
  'Threshold Calibration',
  'Docker Deployment',
];

const WHEEL_SLOTS = [...CAPABILITIES, ...CAPABILITIES];
const SLOT_COUNT = WHEEL_SLOTS.length;
const STEP_DEG = 360 / SLOT_COUNT;

function getSignedSlotDelta(slotIndex: number, active: number): number {
  const raw = (((slotIndex - active) % SLOT_COUNT) + SLOT_COUNT) % SLOT_COUNT;
  return raw > SLOT_COUNT / 2 ? raw - SLOT_COUNT : raw;
}

function WheelSlot({
  label,
  slotIndex,
  activeFloat,
  radius,
}: {
  label: string;
  slotIndex: number;
  activeFloat: MotionValue<number>;
  radius: number;
}) {
  const transform = useTransform(activeFloat, (active) => {
    const d = getSignedSlotDelta(slotIndex, active);
    if (Math.abs(d) > 3.8) return 'translate3d(0, -9999px, 0)';
    const thetaDeg = d * STEP_DEG;
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const y = radius * Math.sin(thetaRad);
    const z = radius * (Math.cos(thetaRad) - 1);
    return `perspective(900px) translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${(-thetaDeg).toFixed(2)}deg)`;
  });

  const opacity = useTransform(activeFloat, (active) => {
    const absD = Math.abs(getSignedSlotDelta(slotIndex, active));
    if (absD >= 3.6) return 0;
    if (absD <= 0.5) return 1 - 0.52 * Math.pow(absD / 0.5, 1.8);
    if (absD <= 1.0) return 0.48 - 0.20 * ((absD - 0.5) / 0.5);
    return 0.28 * Math.pow(1 - (absD - 1.0) / 2.6, 1.45);
  });

  return (
    <motion.div
      data-wheel-slot={slotIndex}
      style={{ transform, opacity, transformOrigin: 'left center' }}
      className="pointer-events-none absolute inset-x-0 top-1/2 -mt-[0.58em] whitespace-nowrap text-[26px] font-normal tracking-[-0.035em] leading-[1.15] text-[var(--text-primary)] will-change-[transform,opacity] sm:text-[38px] md:text-[44px] lg:text-[46px] xl:text-[52px]"
    >
      {label}
    </motion.div>
  );
}

function ScrubWord({
  word,
  accent,
  progress,
  range,
}: {
  word: string;
  accent?: boolean;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.26em] inline-block ${accent ? 'text-[var(--accent)]' : ''}`}
    >
      {word}
    </motion.span>
  );
}

function PinnedAbout({ onExploreLabs }: ScrollManifestoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative min-h-[185vh]">
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl">
          <span className="inline-block rounded-[3px] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-ink)]">
            ABOUT
          </span>

          <p className="mt-5 text-2xl font-normal tracking-[-0.03em] leading-[1.24] text-[var(--text-primary)] sm:text-3xl lg:text-[32px]">
            {ABOUT_WORDS.map((item, idx) => {
              const start = idx / ABOUT_WORDS.length;
              const end = Math.min(1, start + 1.8 / ABOUT_WORDS.length);
              return (
                <ScrubWord
                  key={`${item.text}-${idx}`}
                  word={item.text}
                  accent={item.accent}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </p>

          <button
            type="button"
            onClick={onExploreLabs}
            className="mt-8 inline-flex h-10 items-center justify-between gap-8 border border-[var(--border-strong)] px-4 font-mono text-[11px] text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
          >
            <span>EXPLORE LIVE LABS</span>
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StaticAbout({ onExploreLabs }: ScrollManifestoProps) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 sm:py-28">
      <span className="inline-block rounded-[3px] bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-ink)]">
        ABOUT
      </span>

      <p className="mt-5 text-2xl font-normal tracking-[-0.03em] leading-[1.24] text-[var(--text-primary)] sm:text-3xl">
        {ABOUT_WORDS.map((item, idx) => (
          <span
            key={`${item.text}-${idx}`}
            className={`mr-[0.26em] inline-block ${item.accent ? 'text-[var(--accent)]' : ''}`}
          >
            {item.text}
          </span>
        ))}
      </p>

      <button
        type="button"
        onClick={onExploreLabs}
        className="mt-8 inline-flex h-10 items-center justify-between gap-8 border border-[var(--border-strong)] px-4 font-mono text-[11px] text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
      >
        <span>EXPLORE LIVE LABS</span>
        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

function CapabilitiesWheelSection({
  isDesktop,
  reducedMotion,
}: {
  isDesktop: boolean;
  reducedMotion: boolean;
}) {
  const wheelSectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wheelSectionRef,
    offset: ['start end', 'end start'],
  });
  const activeFloat = useTransform(
    scrollYProgress,
    isDesktop ? [0, 0.28, 0.72, 1] : [0.1, 0.9],
    isDesktop ? [-1.5, 0, CAPABILITIES.length - 1, CAPABILITIES.length + 0.5] : [0, CAPABILITIES.length - 1]
  );

  const isPinned = isDesktop && !reducedMotion;

  return (
    <div
      ref={wheelSectionRef}
      id="capabilities-wheel-section"
      className={
        isPinned
          ? 'relative min-h-[230vh] border-t border-[var(--border-subtle)]'
          : 'border-t border-[var(--border-subtle)]'
      }
    >
      <div className={isPinned ? 'sticky top-0 flex min-h-[100dvh] items-center' : ''}>
        <div
          className={
            isPinned
              ? 'mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8'
              : 'mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28'
          }
        >
          <div className="flex items-center gap-8 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
            <span>[ 02 / 07 ]</span>
            <span>CAPABILITIES</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-normal tracking-[-0.035em] leading-[1.08] text-[var(--text-primary)] sm:text-4xl">
                Real-world vision, anomaly scoring, and cross-modal search.
              </h2>
              <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-[var(--text-secondary)]">
                From auditing 41K+ IDD urban traffic frames and calibrating XGBoost ensembles at a 0.17% fraud rate to indexing 24,050 multi-sensor satellite vectors for ISRO BAH 2026.
              </p>
              <a
                href={PROFILE.resumeUrl}
                download="Shreyas_Bhavsar_Resume.pdf"
                className="mt-8 inline-flex h-10 items-center justify-between gap-8 border border-[var(--border-strong)] px-4 font-mono text-[11px] text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
              >
                <span>DOWNLOAD RESUME</span>
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>

            <div className="lg:col-span-7 lg:pl-12">
              {reducedMotion ? (
                <ul className="space-y-2 text-2xl font-normal tracking-[-0.035em] leading-[1.15] text-[var(--text-primary)] sm:text-4xl">
                  {CAPABILITIES.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
              ) : (
                <>
                  <ul className="sr-only">
                    {CAPABILITIES.map((cap) => (
                      <li key={cap}>{cap}</li>
                    ))}
                  </ul>
                  <div
                    aria-hidden="true"
                    className="relative h-[270px] overflow-hidden select-none sm:h-[360px] lg:h-[410px]"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                    }}
                  >
                    {WHEEL_SLOTS.map((cap, idx) => (
                      <WheelSlot
                        key={`${cap}-${idx}`}
                        label={cap}
                        slotIndex={idx}
                        activeFloat={activeFloat}
                        radius={isDesktop ? 182 : 128}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollManifesto({ onExploreLabs }: ScrollManifestoProps) {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return true;
    }
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <section aria-label="About and capabilities">
      <div className="sr-only" id="about-manifesto-label">
        About Shreyas Bhavsar
      </div>

      {isDesktop && !reducedMotion ? (
        <PinnedAbout onExploreLabs={onExploreLabs} />
      ) : (
        <StaticAbout onExploreLabs={onExploreLabs} />
      )}

      <CapabilitiesWheelSection isDesktop={isDesktop} reducedMotion={reducedMotion} />
    </section>
  );
}
