import { useState } from 'react';
import { ArrowUpRight, Layers, ShieldAlert, Satellite, Video } from 'lucide-react';
import { PROJECTS } from '../data/resume';
import { FraudSimulator } from './FraudSimulator';
import { SatRetrievalLab } from './SatRetrievalLab';

interface SystemsSectionProps {
  onNavigate: (sectionId: string) => void;
}

const ERROR_DIAGNOSTICS = [
  {
    id: 'scale',
    label: '640 -> 1280px scaling',
    delta: '+28% mAP@50:95',
    detail: 'Raised validation mAP@50:95 from 0.345 to 0.443 and small-object recall by 18–26 pp on IDD (41K+ images, 507K+ boxes).',
  },
  {
    id: 'splits',
    label: 'Leak-free sequence splits',
    delta: '41K+ IDD frames',
    detail: 'Partitioned driving sequences strictly by video session in Pandas/PyTorch (W&B) so near-duplicate frames never leak across splits.',
  },
  {
    id: 'tracking',
    label: 'ByteTrack + polygon ROI',
    delta: '94–100% count accuracy',
    detail: 'Hungarian-matched directional vehicle counts against ground truth across 1080p streams at 39–41 FPS on an RTX 4050.',
  },
  {
    id: 'serving',
    label: 'FastAPI + Gradio calibration',
    delta: 'Dockerized REST API',
    detail: 'Packaged inference and live polygon ROI gate calibration into a Dockerized FastAPI microservice paired with a Gradio UI.',
  },
];

export function SystemsSection({ onNavigate }: SystemsSectionProps) {
  const [activeDiagnostic, setActiveDiagnostic] = useState(ERROR_DIAGNOSTICS[0].id);

  const trafficProject = PROJECTS[0];
  const fraudProject = PROJECTS[1];
  const satProject = PROJECTS[2];

  const selectedDiag =
    ERROR_DIAGNOSTICS.find((item) => item.id === activeDiagnostic) ?? ERROR_DIAGNOSTICS[0];

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

      {/* System 01: YOLOv8 Traffic Pipeline Architecture + Interactive Diagnostics */}
      <article
        id="traffic-architecture"
        aria-labelledby="sys-01-title"
        className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-6 lg:flex-row lg:items-start lg:justify-between">
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

          <button
            type="button"
            onClick={() => onNavigate('hero')}
            className="inline-flex h-10 shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-xs font-medium text-[var(--text-primary)] transition-[transform,border-color,background-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
          >
            <Layers size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Calibrate in hero viewport</span>
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {/* 4-Stage Pipeline Flow */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trafficProject.pipelineSteps.map((step) => (
            <div
              key={step.stage}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4"
            >
              <div className="font-mono text-xs font-medium text-[var(--accent)]">{step.stage}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Error-Analysis & Engineering Breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="space-y-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
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

            <div className="mt-5 flex flex-wrap gap-1.5">
              {trafficProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4">
            <div className="font-mono text-xs text-[var(--text-muted)]">
              Ablation &amp; calibration notes
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {ERROR_DIAGNOSTICS.map((diag) => {
                const selected = diag.id === activeDiagnostic;
                return (
                  <button
                    key={diag.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveDiagnostic(diag.id)}
                    className={`rounded-lg border px-3 py-2 text-left transition-[transform,border-color,background-color] duration-150 ease-out active:scale-[0.97] ${
                      selected
                        ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="text-xs font-medium">{diag.label}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-[var(--accent)] tabular-nums">
                      {diag.delta}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 border-t border-[var(--border-subtle)] pt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              {selectedDiag.detail}
            </p>
          </div>
        </div>
      </article>

      {/* System 02: Real-Time Credit Card Fraud Detection Workbench */}
      <article
        id="fraud-workbench"
        aria-labelledby="sys-02-title"
        className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
      >
        <div className="border-b border-[var(--border-subtle)] pb-6">
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

        <div className="mt-6">
          <FraudSimulator />
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-6 lg:flex-row lg:items-center lg:justify-between">
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
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
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
        className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8"
      >
        <div className="border-b border-[var(--border-subtle)] pb-6">
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

        <div className="mt-6">
          <SatRetrievalLab />
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-6 lg:flex-row lg:items-center lg:justify-between">
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
                className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
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
