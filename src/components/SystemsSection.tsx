import { useState } from 'react';
import { ArrowUpRight, Github, Layers, Satellite, ShieldAlert, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { FraudSimulator } from './FraudSimulator';
import { SatRetrievalLab } from './SatRetrievalLab';

interface SystemsSectionProps {
  onNavigate: (sectionId: string) => void;
}

const SCALE_BUCKETS = [
  {
    id: 'large',
    label: 'Large (Bus / Truck)',
    baselineWidth: 78,
    scaledWidth: 84,
    gain: '+6 pp',
  },
  {
    id: 'medium',
    label: 'Medium (Car / Auto)',
    baselineWidth: 62,
    scaledWidth: 76,
    gain: '+14 pp',
  },
  {
    id: 'small',
    label: 'Small & Distant (2-Wheeler)',
    baselineWidth: 38,
    scaledWidth: 62,
    gain: '+24 pp',
  },
];

export function SystemsSection({ onNavigate }: SystemsSectionProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const reducedMotion = useReducedMotion();

  const trafficProject = PROJECTS[0];
  const fraudProject = PROJECTS[1];
  const satProject = PROJECTS[2];

  const selectedStep = trafficProject.pipelineSteps[activeStepIndex] ?? trafficProject.pipelineSteps[0];

  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs text-[var(--accent)]">Interactive engineering workbenches</p>
          <h2
            id="systems-heading"
            className="mt-2 text-3xl font-medium tracking-tight text-[var(--text-primary)] md:text-4xl"
          >
            Production ML &amp; vision systems
          </h2>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Jump to system">
          <a
            href="#traffic-architecture"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('traffic-architecture');
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <Video size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>01 Traffic YOLOv8</span>
          </a>
          <a
            href="#fraud-workbench"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('fraud-workbench');
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <ShieldAlert size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>02 Fraud API</span>
          </a>
          <a
            href="#sat-retrieval"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('sat-retrieval');
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <Satellite size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>03 ISRO SatRetrieval</span>
          </a>
        </div>
      </div>

      {/* System 01: YOLOv8 Traffic Pipeline & W&B Ablation Comparison */}
      <article
        id="traffic-architecture"
        aria-labelledby="sys-01-title"
        className="border-t border-[var(--border-subtle)] py-14 first:border-t-0 first:pt-10 lg:py-20"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)] tabular-nums">
              <span className="text-[var(--accent)]">{trafficProject.index}</span>
              <span>{trafficProject.period}</span>
              <span>{trafficProject.category}</span>
            </div>
            <h3
              id="sys-01-title"
              className="mt-2 text-2xl font-medium tracking-tight text-[var(--text-primary)]"
            >
              {trafficProject.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{trafficProject.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('hero')}
              className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 text-xs font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
            >
              <Layers size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>Calibrate in hero viewport</span>
            </button>

            {trafficProject.repoUrl && (
              <a
                href={trafficProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 text-xs font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
              >
                <Github size={15} strokeWidth={1.5} aria-hidden="true" />
                <span>View source</span>
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Visual Comparison Workbench */}
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:grid-cols-12">
          {/* Left: W&B 640px vs 1280px Scaling & Recall Chart */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  W&amp;B ablation: 640px baseline vs 1280px scaling
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px] text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-[var(--text-muted)]/55" aria-hidden="true" />
                    <span>640px</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)]">
                    <span className="h-2 w-2 rounded-sm bg-[var(--accent)]" aria-hidden="true" />
                    <span>1280px</span>
                  </span>
                </div>
              </div>

              {/* Validation mAP@50:95 Comparison */}
              <div className="mt-4 space-y-2 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Validation mAP@50:95 (IDD 41K+ images)
                  </span>
                  <span className="font-mono font-medium text-[var(--accent)] tabular-nums">
                    0.345 -&gt; 0.443 (+28%)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-14 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      0.345
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-[var(--bg-base)]">
                      <motion.div
                        initial={reducedMotion ? false : { width: 0 }}
                        whileInView={{ width: '58%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full bg-[var(--text-muted)]/55"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-14 font-mono text-[11px] font-medium text-[var(--text-primary)] tabular-nums">
                      0.443
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-[var(--bg-base)]">
                      <motion.div
                        initial={reducedMotion ? false : { width: 0 }}
                        whileInView={{ width: '74%' }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full bg-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* IDD Scale-Bucket Recall Gain */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">
                    IDD scale-bucket recall gain (507K+ boxes)
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                    +18–26 pp small-object range
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {SCALE_BUCKETS.map((bucket) => (
                    <div key={bucket.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-primary)]">{bucket.label}</span>
                        <span className="font-mono text-[11px] font-medium text-[var(--accent)] tabular-nums">
                          {bucket.gain}
                        </span>
                      </div>
                      <div className="relative h-2.5 w-full overflow-hidden rounded-sm bg-[var(--bg-base)]">
                        <motion.div
                          initial={reducedMotion ? false : { width: 0 }}
                          whileInView={{ width: `${bucket.scaledWidth}%` }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                        />
                        <div
                          className="absolute inset-y-0 left-0 bg-[var(--text-muted)]/60"
                          style={{ width: `${bucket.baselineWidth}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-3.5">
              <div className="pr-4">
                <div className="text-xs text-[var(--text-muted)]">Directional ROI count match</div>
                <div className="mt-0.5 font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
                  94–100% (Hungarian)
                </div>
              </div>
              <div className="pl-4">
                <div className="text-xs text-[var(--text-muted)]">1080p runtime (RTX 4050)</div>
                <div className="mt-0.5 font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
                  39–41 FPS · FastAPI + Gradio
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive 4-Stage Pipeline Timeline */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t border-[var(--border-subtle)] pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div>
              <div className="font-mono text-xs text-[var(--text-muted)]">
                Pipeline stages
              </div>
              <div className="mt-3 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                {trafficProject.pipelineSteps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  return (
                    <button
                      key={step.stage}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`flex w-full items-start justify-between gap-3 py-3 text-left transition-colors duration-150 ${
                        isActive
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="font-mono text-xs font-medium text-[var(--accent)]">
                            {step.stage}
                          </span>
                        </div>
                        <p className="mt-1 pl-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {step.detail}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-muted)]">
              Active stage:{' '}
              <span className="font-mono text-[var(--text-primary)]">{selectedStep.stage}</span> —{' '}
              {selectedStep.detail}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--text-secondary)] lg:max-w-3xl">
            {trafficProject.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 lg:max-w-sm lg:justify-end">
            {trafficProject.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* System 02: Real-Time Credit Card Fraud Detection Workbench */}
      <article
        id="fraud-workbench"
        aria-labelledby="sys-02-title"
        className="border-t border-[var(--border-subtle)] py-14 lg:py-20"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)] tabular-nums">
              <span className="text-[var(--accent)]">{fraudProject.index}</span>
              <span>{fraudProject.period}</span>
              <span>{fraudProject.category}</span>
            </div>
            <h3
              id="sys-02-title"
              className="mt-2 text-2xl font-medium tracking-tight text-[var(--text-primary)]"
            >
              {fraudProject.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{fraudProject.subtitle}</p>
          </div>

          {fraudProject.repoUrl && (
            <a
              href={fraudProject.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 text-xs font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
            >
              <Github size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>View source</span>
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </div>

        <FraudSimulator />

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--text-secondary)] lg:max-w-3xl">
            {fraudProject.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            {fraudProject.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* System 03: ISRO BAH 2026 SatRetrieval */}
      <article
        id="sat-retrieval"
        aria-labelledby="sys-03-title"
        className="border-t border-[var(--border-subtle)] pt-14 lg:pt-20"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)] tabular-nums">
              <span className="text-[var(--accent)]">{satProject.index}</span>
              <span>{satProject.period}</span>
              <span>{satProject.category}</span>
            </div>
            <h3
              id="sys-03-title"
              className="mt-2 text-2xl font-medium tracking-tight text-[var(--text-primary)]"
            >
              {satProject.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{satProject.subtitle}</p>
          </div>

          <span className="inline-flex h-9 shrink-0 items-center self-start rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 font-mono text-xs text-[var(--text-secondary)]">
            ISRO BAH 2026 · Team submission
          </span>
        </div>

        <SatRetrievalLab />

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--text-secondary)] lg:max-w-3xl">
            {satProject.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            {satProject.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
