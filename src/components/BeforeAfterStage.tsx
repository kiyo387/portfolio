import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const BEFORE_CARDS = [
  {
    index: '[01]',
    title: 'SMALL-OBJECT BLINDNESS.',
    detail:
      '640px YOLOv8 drops distant motorcycles and auto-rickshaws across dense IDD intersections (0.345 validation mAP@50:95).',
    positionClass: 'md:ml-[6%] md:-rotate-6',
  },
  {
    index: '[02]',
    title: 'IMBALANCE COLLAPSE.',
    detail:
      'At a 0.17% fraud base rate, un-calibrated classifiers either miss real anomalies or drown ops teams in false alerts.',
    positionClass: 'md:mx-auto md:rotate-3',
  },
  {
    index: '[03]',
    title: 'SPECKLE AMBIGUITY.',
    detail:
      'Raw cosine search on C-band SAR backscatter ranks metallic dock clutter above the true optical satellite tile.',
    positionClass: 'md:ml-auto md:mr-[6%] md:-rotate-3',
  },
];

const ENGINEERED_CARDS = [
  {
    index: '[01]',
    title: '1280PX + BYTETRACK ROI.',
    detail:
      '0.443 validation mAP@50:95 (+28%), +18–26 pp small-object recall, and 94–100% Hungarian-matched counts at 39–41 FPS.',
    positionClass: 'md:ml-[6%]',
  },
  {
    index: '[02]',
    title: 'SUB-1.8MS PR-CALIBRATED API.',
    detail:
      'RobustScaler + SMOTE + XGBoost tuned on Precision-Recall curves (0.984 ROC-AUC, 0.865 PR-AUC) inside Dockerized FastAPI.',
    positionClass: 'md:ml-auto md:mr-[6%]',
  },
  {
    index: '[03]',
    title: 'CROMA VIT + K-RECIPROCAL HNSW.',
    detail:
      '24,050-vector FAISS HNSW index with k-reciprocal re-ranking across Sentinel-1/2, Landsat, LISS-3, and RISAT imagery.',
    positionClass: 'md:mx-auto',
  },
];

function StaticBeforeAfterStage() {
  return (
    <section
      id="before-after-stage"
      aria-labelledby="before-after-heading"
      className="honey-starfield border-y border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-8 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          <span>[ 04 / 07 ]</span>
          <span>BEFORE &amp; AFTER</span>
        </div>

        <h2
          id="before-after-heading"
          className="my-14 text-center text-5xl font-semibold tracking-[-0.045em] leading-[0.94] text-[var(--text-primary)] sm:text-7xl lg:text-[88px]"
        >
          BEFORE
        </h2>

        <div className="space-y-12 md:space-y-20">
          {BEFORE_CARDS.map((card) => (
            <div
              key={card.title}
              className={`w-full max-w-[340px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[0_0_50px_-18px_rgba(244,72,73,0.18)] ${card.positionClass}`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{card.title}</span>
                <span className="text-[var(--accent)]">{card.index}</span>
              </div>
              <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <h3 className="my-16 text-center text-5xl font-semibold tracking-[-0.045em] leading-[0.94] text-[var(--text-primary)] sm:text-7xl lg:text-[88px]">
          <span className="text-[var(--accent)]">//</span> ENGINEERED
        </h3>

        <div className="space-y-12 md:space-y-20">
          {ENGINEERED_CARDS.map((card) => (
            <div
              key={card.title}
              className={`w-full max-w-[360px] rounded-lg border border-[var(--accent)]/55 bg-[var(--bg-surface)] p-6 shadow-[0_0_70px_-16px_rgba(244,72,73,0.34)] ${card.positionClass}`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{card.title}</span>
                <span className="text-[var(--accent)]">{card.index}</span>
              </div>
              <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-primary)]/90">
                {card.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyBeforeAfterStage() {
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ['start 0.72', 'end 0.34'],
  });

  const beforeOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.16]);
  const beforeScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.95]);
  const strikeScaleX = useTransform(scrollYProgress, [0.08, 0.78], [0, 1]);
  const strikeOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 0.9]);
  const engineeredOpacity = useTransform(scrollYProgress, [0.15, 1], [0.16, 1]);
  const engineeredScale = useTransform(scrollYProgress, [0.15, 1], [0.95, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 1], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0.15, 1], [0.8, 1.05]);
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);

  return (
    <section
      id="before-after-stage"
      aria-labelledby="before-after-heading"
      className="honey-starfield relative border-y border-[var(--border-subtle)] bg-[var(--bg-base)]"
    >
      {/* Sticky backdrop stage stays pinned behind BEFORE and ENGINEERED cards */}
      <div className="pointer-events-none sticky top-0 z-0 flex h-[100dvh] flex-col justify-between overflow-hidden px-4 pt-20 pb-10 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          <div className="flex items-center gap-8">
            <span>[ 04 / 07 ]</span>
            <span>BEFORE &amp; AFTER</span>
          </div>

          <div className="relative h-4 w-56 text-right">
            <motion.span
              style={{ opacity: phase1Opacity }}
              className="absolute inset-0 text-[var(--text-secondary)]"
            >
              PHASE 01 // BASELINE BOTTLENECKS
            </motion.span>
            <motion.span
              style={{ opacity: phase2Opacity }}
              className="absolute inset-0 text-[var(--accent)]"
            >
              PHASE 02 // ENGINEERED SYSTEMS
            </motion.span>
          </div>
        </div>

        <div className="relative mx-auto flex flex-col items-center justify-center text-center">
          <motion.div
            aria-hidden="true"
            style={{ opacity: glowOpacity, scale: glowScale }}
            className="pointer-events-none absolute h-56 w-80 rounded-full bg-[radial-gradient(circle,rgba(244,72,73,0.24)_0%,transparent_70%)] will-change-[transform,opacity] sm:h-72 sm:w-[480px]"
          />

          <h2
            id="before-after-heading"
            className="relative text-5xl font-semibold tracking-[-0.045em] leading-[0.94] sm:text-7xl lg:text-[92px]"
          >
            <motion.span
              data-stage-word="before"
              style={{ opacity: beforeOpacity, scale: beforeScale }}
              className="relative inline-block text-[var(--text-primary)] will-change-[transform,opacity]"
            >
              BEFORE
              <motion.span
                aria-hidden="true"
                data-stage-strike="true"
                style={{ scaleX: strikeScaleX, opacity: strikeOpacity }}
                className="pointer-events-none absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 origin-left bg-[var(--accent)]"
              />
            </motion.span>

            <motion.span
              data-stage-word="engineered"
              style={{ opacity: engineeredOpacity, scale: engineeredScale }}
              className="mt-1 block text-[var(--text-primary)] will-change-[transform,opacity]"
            >
              <span className="text-[var(--accent)]">//</span> ENGINEERED
            </motion.span>
          </h2>
        </div>

        <div aria-hidden="true" className="h-4" />
      </div>

      {/* Scrolling Cards Foreground Layer */}
      <div className="relative z-10 mx-auto -mt-[18vh] max-w-6xl px-4 pb-[24vh] sm:px-6 lg:px-8">
        <div className="space-y-14 md:space-y-24">
          {BEFORE_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full max-w-[340px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 p-6 shadow-[0_0_50px_-18px_rgba(244,72,73,0.18)] ${card.positionClass}`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{card.title}</span>
                <span className="text-[var(--accent)]">{card.index}</span>
              </div>
              <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
                {card.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Open midpoint clearing anchors BEFORE -> // ENGINEERED transition */}
        <div
          ref={transitionRef}
          data-stage-divider="true"
          className="h-[58vh] md:h-[68vh]"
          aria-hidden="true"
        />

        <div className="space-y-14 md:space-y-24">
          {ENGINEERED_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full max-w-[360px] rounded-lg border border-[var(--accent)]/55 bg-[var(--bg-surface)]/95 p-6 shadow-[0_0_70px_-16px_rgba(244,72,73,0.34)] ${card.positionClass}`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{card.title}</span>
                <span className="text-[var(--accent)]">{card.index}</span>
              </div>
              <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-primary)]/90">
                {card.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BeforeAfterStage() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <StaticBeforeAfterStage /> : <StickyBeforeAfterStage />;
}
