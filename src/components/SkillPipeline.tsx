import { useState } from 'react';
import { motion } from 'motion/react';
import { PIPELINE_STAGES, PROJECTS, type PipelineStage } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

type StageFilter = 'all' | PipelineStage['id'];

const PROJECT_NAME_MAP = Object.fromEntries(
  PROJECTS.map((project) => [project.id, `${project.index} ${project.title.split(' with ')[0].split(' & ')[0]}`])
);

export function SkillPipeline() {
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
      className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/45"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="pipeline-heading"
              className="text-3xl font-medium tracking-tight text-[var(--text-primary)] md:text-4xl"
            >
              End-to-end ML stack
            </h2>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-[var(--text-secondary)]">
              Select a pipeline stage or tool to inspect where it runs across production training, evaluation, and FastAPI deployment.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter pipeline stage"
            className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1"
          >
            {(['all', ...PIPELINE_STAGES.map((s) => s.id)] as StageFilter[]).map((stageId) => {
              const label =
                stageId === 'all'
                  ? 'All stages'
                  : PIPELINE_STAGES.find((s) => s.id === stageId)?.title ?? stageId;
              const isActive = activeStage === stageId;

              return (
                <button
                  key={stageId}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveStage(stageId)}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
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
                      className="absolute inset-0 rounded-lg bg-[var(--accent)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleStages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-medium text-[var(--text-primary)]">
                  {stage.title}
                </h3>
                <span className="font-mono text-xs text-[var(--accent)] tabular-nums">
                  Stage {stage.code}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                {stage.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {stage.skills.map((skill) => {
                  const isSelected = skill.name === currentSkill.name;
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedSkill(skill.name)}
                      className={`inline-flex h-9 items-center rounded-lg border px-3 font-mono text-xs transition-[transform,border-color,background-color,color] duration-150 ease-out active:scale-[0.97] ${
                        isSelected
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] font-medium'
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

        {/* Inspector bar for selected skill */}
        <div
          aria-live="polite"
          className="mt-6 flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <span className="font-mono text-xs text-[var(--accent)]">{currentSkill.name}</span>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">{currentSkill.usage}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentSkill.projectIds.length > 0 ? (
              currentSkill.projectIds.map((pid) => (
                <span
                  key={pid}
                  className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
                >
                  {PROJECT_NAME_MAP[pid]}
                </span>
              ))
            ) : (
              <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)]">
                Coursework foundation
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
