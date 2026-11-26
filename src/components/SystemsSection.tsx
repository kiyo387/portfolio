import { ArrowUpRight, Github, Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS, type ProjectEntry } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { FraudSimulator } from './FraudSimulator';
import { RollingLabel } from './RollingLabel';
import { SatRetrievalLab } from './SatRetrievalLab';
import { VisionViewport } from './VisionViewport';

export type LabProjectId = ProjectEntry['id'];

interface SystemsSectionProps {
  activeLabId: LabProjectId;
  onSelectLab: (id: LabProjectId) => void;
}

const LAB_SHORT_LABELS: Record<LabProjectId, string> = {
  'traffic-cv': '01. Traffic YOLOv8',
  'fraud-api': '02. Fraud Scoring API',
  'isro-satretrieval': '03. ISRO SatRetrieval',
};

export function SystemsSection({ activeLabId, onSelectLab }: SystemsSectionProps) {
  const reducedMotion = useReducedMotion();
  const activeProject = PROJECTS.find((p) => p.id === activeLabId) ?? PROJECTS[0];

  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          [ 05 / 07 ] — INTERACTIVE WORKBENCHES
        </p>
        <motion.h2
          id="systems-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-3 text-4xl font-normal tracking-[-0.04em] leading-[1.0] text-[var(--text-primary)] sm:text-6xl"
        >
          How the pipelines run
        </motion.h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
          Switch between all three live simulations — calibrate YOLOv8 ROI gates, tune FastAPI fraud thresholds, or re-rank ISRO satellite retrievals.
        </p>
      </div>

      {/* Honey-style Split Dark App Window with Red Corner Reticles */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
        className="mt-12 overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] lg:grid lg:grid-cols-12"
      >
        {/* Left Sidebar */}
        <aside className="flex flex-col justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/65 p-5 lg:col-span-4 lg:border-r lg:border-b-0 xl:col-span-3">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-primary)]">
                <Terminal size={14} strokeWidth={1.5} className="text-[var(--accent)]" aria-hidden="true" />
                <span>Shreyas_Labs</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">3 LIVE</span>
            </div>

            <div role="tablist" aria-label="Select interactive ML lab" className="mt-4 space-y-1.5">
              {PROJECTS.map((project) => {
                const isActive = project.id === activeLabId;
                return (
                  <button
                    key={project.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => onSelectLab(project.id)}
                    className={`relative flex w-full flex-col rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                      isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="lab-sidebar-active"
                        aria-hidden="true"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 450, damping: 34 }
                        }
                        className="absolute inset-0 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 font-mono text-xs font-medium">
                      <span
                        className={`h-1.5 w-1.5 rounded-[2px] ${
                          isActive ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>{LAB_SHORT_LABELS[project.id]}</span>
                    </span>
                    <span className="relative z-10 mt-1 pl-3.5 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                      {project.headlineMetric}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Lab Spec Summary */}
          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              <span>{activeProject.period}</span>
              <span className="text-[var(--accent)]">{activeProject.category}</span>
            </div>

            <h3 className="mt-2 text-base font-medium leading-snug text-[var(--text-primary)]">
              {activeProject.title}
            </h3>

            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--text-secondary)]">
              {activeProject.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {activeProject.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5">
              {activeProject.repoUrl ? (
                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-9 w-full items-center justify-between rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 font-mono text-xs text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Github size={14} strokeWidth={1.5} aria-hidden="true" />
                    <RollingLabel>VIEW SOURCE</RollingLabel>
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
              ) : (
                <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-center font-mono text-[11px] text-[var(--text-muted)]">
                  ISRO BAH 2026 · Team submission
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Stage Framed by 4 Coral-Red Corner Reticles */}
        <div className="relative p-5 sm:p-8 lg:col-span-8 xl:col-span-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <span className="h-4 w-4 border-t-2 border-l-2 border-[var(--accent)]" />
              <span className="h-4 w-4 border-t-2 border-r-2 border-[var(--accent)]" />
            </div>
            <div className="flex justify-between">
              <span className="h-4 w-4 border-b-2 border-l-2 border-[var(--accent)]" />
              <span className="h-4 w-4 border-r-2 border-b-2 border-[var(--accent)]" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLabId}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10"
            >
              {activeLabId === 'traffic-cv' && <VisionViewport />}
              {activeLabId === 'fraud-api' && <FraudSimulator />}
              {activeLabId === 'isro-satretrieval' && <SatRetrievalLab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
