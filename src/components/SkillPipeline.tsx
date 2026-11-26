import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PIPELINE_STAGES, PROJECTS, type PipelineStage } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SkillPipelineProps {
  onNavigate: (sectionId: string) => void;
}

type StageFilter = 'all' | PipelineStage['id'];

const PROJECT_LOOKUP = Object.fromEntries(
  PROJECTS.map((project) => [
    project.id,
    {
      label: `${project.index} ${project.title.split(' with ')[0].split(' & ')[0]}`,
      anchor: project.sectionAnchor,
    },
  ])
);

export function SkillPipeline({ onNavigate }: SkillPipelineProps) {
  const [activeStage, setActiveStage] = useState<StageFilter>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('PyTorch');
  const reducedMotion = useReducedMotion();

  const visibleStages =
    activeStage === 'all'
      ? PIPELINE_STAGES
      : PIPELINE_STAGES.filter((stage) => stage.id === activeStage);

  const allSkills = PIPELINE_STAGES.flatMap((stage) => stage.skills);
  const currentSkill = allSkills.find((s) => s.name === selectedSkill) ?? allSkills[0];

  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-heading"
      className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pb-28"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            id="pipeline-heading"
            className="text-3xl font-normal tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl"
          >
            End-to-end ML stack
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Select any tool to inspect its role and open the matching lab above.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter pipeline stage"
          className="inline-flex flex-wrap gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1"
        >
          {(['all', ...PIPELINE_STAGES.map((s) => s.id)] as StageFilter[]).map((stageId) => {
            const label =
              stageId === 'all'
                ? 'All'
                : PIPELINE_STAGES.find((s) => s.id === stageId)?.title.split(' & ')[0] ?? stageId;
            const isActive = activeStage === stageId;

            return (
              <button
                key={stageId}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveStage(stageId)}
                className={`relative rounded-[4px] px-3 py-1.5 font-mono text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-[var(--accent-ink)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pipeline-stage-pill"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 32 }
                    }
                    className="absolute inset-0 rounded-[4px] bg-[var(--accent)]"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:grid-cols-12">
        <div className="divide-y divide-[var(--border-subtle)] p-5 sm:p-6 lg:col-span-7">
          {visibleStages.map((stage) => (
            <div
              key={stage.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="shrink-0 sm:w-44">
                <div className="font-mono text-xs text-[var(--accent)] tabular-nums">
                  Stage {stage.code}
                </div>
                <h3 className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                  {stage.title}
                </h3>
              </div>

              <div className="flex flex-1 flex-wrap gap-1.5">
                {stage.skills.map((skill) => {
                  const isSelected = skill.name === currentSkill.name;
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedSkill(skill.name)}
                      className={`inline-flex h-8 items-center rounded-[4px] border px-2.5 font-mono text-xs transition-[transform,border-color,background-color,color] duration-150 ease-out active:scale-[0.97] ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent)] font-medium text-[var(--accent-ink)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          aria-live="polite"
          className="flex flex-col justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/40 p-5 sm:p-6 lg:col-span-5 lg:border-t-0 lg:border-l"
        >
          <div>
            <div className="font-mono text-xs text-[var(--accent)]">
              Selected · {currentSkill.name}
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-primary)]">
              {currentSkill.usage}
            </p>
          </div>

          <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
            <div className="text-xs text-[var(--text-muted)]">Open matching lab</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {currentSkill.projectIds.length > 0 ? (
                currentSkill.projectIds.map((pid) => {
                  const target = PROJECT_LOOKUP[pid];
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => onNavigate(target.anchor)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 font-mono text-xs text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out hover:border-[var(--accent)] active:scale-[0.97]"
                    >
                      <span>{target.label}</span>
                      <ArrowUpRight size={13} strokeWidth={1.5} className="text-[var(--accent)]" aria-hidden="true" />
                    </button>
                  );
                })
              ) : (
                <span className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)]">
                  Coursework foundation
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
