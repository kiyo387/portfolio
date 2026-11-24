import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { ArrowUpDown, MoveHorizontal, Radar, Satellite } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type ScenarioId = 'harbor' | 'estuary' | 'urban';

interface RetrievalCandidate {
  id: string;
  tileId: string;
  sensor: 'Sentinel-2' | 'Landsat' | 'LISS-3';
  regionNote: string;
  rawRank: number;
  reRankedRank: number;
  rawScore: number;
  reRankedScore: number;
  isTrueMatch: boolean;
}

interface ScenarioConfig {
  id: ScenarioId;
  label: string;
  sensor: string;
  coordinates: string;
  cropTransform: string;
  cropOrigin: string;
  candidates: RetrievalCandidate[];
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'harbor',
    label: 'Harbor & Piers · Sentinel-1',
    sensor: 'Sentinel-1 IW VV/VH',
    coordinates: '18.9388° N, 72.8354° E',
    cropTransform: 'scale(1)',
    cropOrigin: '50% 50%',
    candidates: [
      {
        id: 'harbor-s2-a',
        tileId: 'S2A_T43QBB_0412',
        sensor: 'Sentinel-2',
        regionNote: 'Breakwater & container berth geometry',
        rawRank: 2,
        reRankedRank: 1,
        rawScore: 0.874,
        reRankedScore: 0.946,
        isTrueMatch: true,
      },
      {
        id: 'harbor-ls-b',
        tileId: 'LC09_L2SP_148047',
        sensor: 'Landsat',
        regionNote: 'Specular dock echo false positive',
        rawRank: 1,
        reRankedRank: 3,
        rawScore: 0.881,
        reRankedScore: 0.819,
        isTrueMatch: false,
      },
      {
        id: 'harbor-l3-c',
        tileId: 'R2_LISS3_096058',
        sensor: 'LISS-3',
        regionNote: 'Adjacent shipping channel sector',
        rawRank: 3,
        reRankedRank: 2,
        rawScore: 0.842,
        reRankedScore: 0.891,
        isTrueMatch: true,
      },
      {
        id: 'harbor-s2-d',
        tileId: 'S2B_T43QBB_0198',
        sensor: 'Sentinel-2',
        regionNote: 'Cloud-masked coastal terminal',
        rawRank: 4,
        reRankedRank: 4,
        rawScore: 0.798,
        reRankedScore: 0.785,
        isTrueMatch: false,
      },
    ],
  },
  {
    id: 'estuary',
    label: 'Estuary Channels · RISAT',
    sensor: 'RISAT-2B Stripmap',
    coordinates: '19.0176° N, 72.9120° E',
    cropTransform: 'scale(1.48)',
    cropOrigin: '22% 36%',
    candidates: [
      {
        id: 'estuary-s2-a',
        tileId: 'S2B_T43QCB_1104',
        sensor: 'Sentinel-2',
        regionNote: 'Tidal mudflat & mangrove channel bend',
        rawRank: 3,
        reRankedRank: 1,
        rawScore: 0.836,
        reRankedScore: 0.934,
        isTrueMatch: true,
      },
      {
        id: 'estuary-l3-b',
        tileId: 'R2_LISS3_097059',
        sensor: 'LISS-3',
        regionNote: 'Brackish water backscatter ambiguity',
        rawRank: 1,
        reRankedRank: 4,
        rawScore: 0.869,
        reRankedScore: 0.792,
        isTrueMatch: false,
      },
      {
        id: 'estuary-ls-c',
        tileId: 'LC08_L2SP_148046',
        sensor: 'Landsat',
        regionNote: 'Secondary creek confluence tile',
        rawRank: 2,
        reRankedRank: 2,
        rawScore: 0.851,
        reRankedScore: 0.878,
        isTrueMatch: true,
      },
      {
        id: 'estuary-s2-d',
        tileId: 'S2A_T43QCB_0772',
        sensor: 'Sentinel-2',
        regionNote: 'Downstream silt plume perimeter',
        rawRank: 4,
        reRankedRank: 3,
        rawScore: 0.812,
        reRankedScore: 0.841,
        isTrueMatch: true,
      },
    ],
  },
  {
    id: 'urban',
    label: 'Urban Arterial Grid · Sentinel-1',
    sensor: 'Sentinel-1 IW Dual-Pol',
    coordinates: '19.0760° N, 72.8777° E',
    cropTransform: 'scale(1.56)',
    cropOrigin: '78% 68%',
    candidates: [
      {
        id: 'urban-s2-a',
        tileId: 'S2A_T43QBB_2041',
        sensor: 'Sentinel-2',
        regionNote: 'Orthogonal expressway & rail corridor',
        rawRank: 2,
        reRankedRank: 1,
        rawScore: 0.865,
        reRankedScore: 0.952,
        isTrueMatch: true,
      },
      {
        id: 'urban-ls-b',
        tileId: 'LC09_L2SP_148048',
        sensor: 'Landsat',
        regionNote: 'Double-bounce rooftop dihedral clutter',
        rawRank: 1,
        reRankedRank: 3,
        rawScore: 0.879,
        reRankedScore: 0.824,
        isTrueMatch: false,
      },
      {
        id: 'urban-l3-c',
        tileId: 'R2_LISS3_096060',
        sensor: 'LISS-3',
        regionNote: 'Industrial warehouse grid sector',
        rawRank: 4,
        reRankedRank: 2,
        rawScore: 0.819,
        reRankedScore: 0.903,
        isTrueMatch: true,
      },
      {
        id: 'urban-s2-d',
        tileId: 'S2B_T43QBB_1890',
        sensor: 'Sentinel-2',
        regionNote: 'High-density mid-rise block',
        rawRank: 3,
        reRankedRank: 4,
        rawScore: 0.834,
        reRankedScore: 0.808,
        isTrueMatch: false,
      },
    ],
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export function SatRetrievalLab() {
  const reducedMotion = useReducedMotion();
  const comparatorRef = useRef<HTMLDivElement | null>(null);

  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('harbor');
  const [split, setSplit] = useState<number>(52);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [reRanked, setReRanked] = useState<boolean>(true);
  const [sarError, setSarError] = useState<boolean>(false);
  const [opticalError, setOpticalError] = useState<boolean>(false);

  const scenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0];

  const sortedCandidates = [...scenario.candidates].sort((a, b) =>
    reRanked ? a.reRankedRank - b.reRankedRank : a.rawRank - b.rawRank
  );

  const updateSplitFromClientX = (clientX: number) => {
    const container = comparatorRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = clamp(
      Math.round(((clientX - rect.left) / rect.width) * 100),
      5,
      95
    );
    setSplit(pct);
  };

  const handleDividerPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingSplit(true);
    updateSplitFromClientX(e.clientX);
  };

  const handleDividerPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingSplit) return;
    updateSplitFromClientX(e.clientX);
  };

  const handleDividerPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingSplit) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDraggingSplit(false);
  };

  const imageZoomStyle = {
    transform: scenario.cropTransform,
    transformOrigin: scenario.cropOrigin,
  };

  const zoomTransitionClass = reducedMotion
    ? ''
    : 'transition-transform duration-300 ease-out';

  return (
    <div className="space-y-4">
      {/* Compact workbench bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Satellite
            size={16}
            strokeWidth={1.5}
            className="text-[var(--accent)]"
            aria-hidden="true"
          />
          <span>CROMA ViT-Base · FAISS HNSW (24,050 vectors)</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] tabular-nums">
          <span
            className="h-2 w-2 rounded-full bg-[var(--status-ok)]"
            aria-hidden="true"
          />
          <span>{scenario.coordinates}</span>
        </div>
      </div>

      {/* Scenario Selector */}
      <div
        role="group"
        aria-label="Satellite query scenarios"
        className="flex flex-wrap items-center gap-2"
      >
        {SCENARIOS.map((item) => {
          const active = item.id === activeScenarioId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveScenarioId(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] ${
                active
                  ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Radar
                size={16}
                strokeWidth={1.5}
                className={active ? 'text-[var(--accent)]' : undefined}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main split workbench: Comparator left, FAISS HNSW ranking right */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Split-curtain comparator */}
        <div className="lg:col-span-7">
          <div
            ref={comparatorRef}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--bg-base)] select-none"
          >
            {/* Right / Base Layer: Retrieved Sentinel-2 Optical Match */}
            <div className="absolute inset-0 overflow-hidden">
              {!opticalError ? (
                <img
                  src="/assets/optical-port-match.png"
                  alt={`Retrieved Sentinel-2 optical match for ${scenario.label}`}
                  onError={() => setOpticalError(true)}
                  draggable={false}
                  style={imageZoomStyle}
                  className={`h-full w-full object-cover ${zoomTransitionClass}`}
                />
              ) : (
                /* Clean optical fallback texture */
                <svg
                  viewBox="0 0 800 500"
                  aria-hidden="true"
                  style={imageZoomStyle}
                  className={`h-full w-full bg-[var(--bg-elevated)] ${zoomTransitionClass}`}
                >
                  <defs>
                    <pattern
                      id="optical-tile-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-[var(--border-subtle)]"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="500" fill="url(#optical-tile-grid)" />
                  <path
                    d="M 0 320 Q 190 250 360 280 T 800 220 L 800 500 L 0 500 Z"
                    fill="currentColor"
                    className="text-[var(--bg-surface)]"
                  />
                  <path
                    d="M 280 280 L 340 180 M 390 270 L 455 165 M 500 255 L 560 155"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-[var(--border-strong)]"
                  />
                </svg>
              )}
            </div>

            {/* Left / Clipped Layer: SAR Backscatter Query */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              {!sarError ? (
                <img
                  src="/assets/sar-port-query.png"
                  alt={`SAR backscatter query patch for ${scenario.label}`}
                  onError={() => setSarError(true)}
                  draggable={false}
                  style={imageZoomStyle}
                  className={`h-full w-full object-cover ${zoomTransitionClass}`}
                />
              ) : (
                /* Clean SAR backscatter speckle/swath fallback texture */
                <svg
                  viewBox="0 0 800 500"
                  aria-hidden="true"
                  style={imageZoomStyle}
                  className={`h-full w-full bg-[var(--bg-base)] ${zoomTransitionClass}`}
                >
                  <defs>
                    <pattern
                      id="sar-swath-grid"
                      width="24"
                      height="24"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="4" cy="4" r="1" fill="currentColor" className="text-[var(--text-muted)]/35" />
                      <circle cx="16" cy="14" r="0.8" fill="currentColor" className="text-[var(--text-secondary)]/30" />
                    </pattern>
                  </defs>
                  <rect width="800" height="500" fill="url(#sar-swath-grid)" />
                  <path
                    d="M 0 320 Q 190 250 360 280 T 800 220"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-[var(--text-primary)]/75"
                  />
                  <path
                    d="M 280 280 L 340 180 M 390 270 L 455 165 M 500 255 L 560 155"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-[var(--accent)]"
                  />
                </svg>
              )}
            </div>

            {/* Layer badges */}
            <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)]/85 px-2.5 py-1 font-mono text-xs text-[var(--text-primary)]">
              SAR · {scenario.sensor}
            </div>
            <div className="pointer-events-none absolute top-3 right-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-base)]/85 px-2.5 py-1 font-mono text-xs text-[var(--text-primary)]">
              Optical · Sentinel-2
            </div>

            {/* Pointer-draggable vertical divider */}
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--accent)]"
              style={{ left: `${split}%` }}
            />
            <button
              type="button"
              aria-label="Drag SAR and optical comparison divider"
              onPointerDown={handleDividerPointerDown}
              onPointerMove={handleDividerPointerMove}
              onPointerUp={handleDividerPointerUp}
              onPointerCancel={handleDividerPointerUp}
              style={{ left: `${split}%` }}
              className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--bg-surface)] text-[var(--accent)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--bg-elevated)] active:scale-[0.97]"
            >
              <MoveHorizontal size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          {/* Range slider control */}
          <div className="mt-3 flex flex-col gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3.5 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="sar-optical-split"
                className="font-medium text-[var(--text-secondary)]"
              >
                SAR / Optical split curtain
              </label>
              <span className="font-mono text-[var(--text-primary)] tabular-nums">
                {split}% SAR · {100 - split}% Optical
              </span>
            </div>
            <input
              id="sar-optical-split"
              type="range"
              min={5}
              max={95}
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>

        {/* FAISS HNSW + k-Reciprocal Re-Ranking panel */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3.5 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  FAISS HNSW Top-4 Candidates
                </div>
                <div className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                  Index size: 24,050 vectors
                </div>
              </div>

              <button
                type="button"
                aria-pressed={reRanked}
                onClick={() => setReRanked((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] ${
                  reRanked
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]'
                    : 'border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <ArrowUpDown size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>k-Reciprocal Re-Ranking</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {sortedCandidates.map((candidate) => {
                const rank = reRanked
                  ? candidate.reRankedRank
                  : candidate.rawRank;
                const score = reRanked
                  ? candidate.reRankedScore
                  : candidate.rawScore;
                const delta = candidate.rawRank - candidate.reRankedRank;

                return (
                  <motion.div
                    key={candidate.id}
                    layout={!reducedMotion}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 34 }
                    }
                    className={`rounded-lg border p-2.5 ${
                      rank === 1
                        ? 'border-[var(--accent)] bg-[var(--bg-surface)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-6 items-center justify-center rounded bg-[var(--bg-elevated)] font-mono text-xs font-medium text-[var(--text-primary)] tabular-nums">
                          #{rank}
                        </span>
                        <span className="font-mono text-xs font-medium text-[var(--text-primary)]">
                          {candidate.tileId}
                        </span>
                        <span className="rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)]">
                          {candidate.sensor}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            candidate.isTrueMatch
                              ? 'bg-[var(--status-ok)]'
                              : 'bg-[var(--status-warn)]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="font-medium text-[var(--text-primary)]">
                          {score.toFixed(3)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--text-secondary)]">
                      <span className="truncate">{candidate.regionNote}</span>
                      {reRanked && delta !== 0 && (
                        <span
                          className={`shrink-0 font-mono tabular-nums ${
                            delta > 0
                              ? 'text-[var(--status-ok)]'
                              : 'text-[var(--status-warn)]'
                          }`}
                        >
                          {delta > 0 ? `+${delta} rank` : `${delta} rank`}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2.5 text-xs text-[var(--text-muted)]">
            <span>
              Mode:{' '}
              <strong className="font-medium text-[var(--text-secondary)]">
                {reRanked ? 'k-Reciprocal Jaccard + Cosine' : 'Raw Cosine Baseline'}
              </strong>
            </span>
            <span className="font-mono tabular-nums">k = 20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
