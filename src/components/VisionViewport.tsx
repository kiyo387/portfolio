import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { Crosshair, Eye, Layers, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTweenedNumber } from '../hooks/useTweenedNumber';

type ModelScale = '640' | '1280';
type RoiPresetId = 'full' | 'northbound' | 'exit' | 'custom';

interface Point {
  x: number;
  y: number;
}

interface Detection {
  id: string;
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  trail: Point[];
  minScale: ModelScale;
}

interface RoiPreset {
  id: Exclude<RoiPresetId, 'custom'>;
  label: string;
  points: [Point, Point, Point, Point];
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 562;
const HANDLE_MIN_X = 40;
const HANDLE_MAX_X = 960;
const HANDLE_MIN_Y = 36;
const HANDLE_MAX_Y = 530;

const DETECTIONS: Detection[] = [
  {
    id: '#01',
    label: 'Car',
    confidence: 0.94,
    box: { x: 210, y: 314, w: 126, h: 74 },
    trail: [
      { x: 335, y: 344 },
      { x: 304, y: 348 },
      { x: 285, y: 350 },
    ],
    minScale: '640',
  },
  {
    id: '#02',
    label: 'Bus',
    confidence: 0.96,
    box: { x: 492, y: 198, w: 98, h: 90 },
    trail: [
      { x: 568, y: 214 },
      { x: 554, y: 228 },
      { x: 545, y: 237 },
    ],
    minScale: '640',
  },
  {
    id: '#03',
    label: 'Auto-Rickshaw',
    confidence: 0.91,
    box: { x: 130, y: 404, w: 120, h: 128 },
    trail: [
      { x: 226, y: 422 },
      { x: 206, y: 444 },
      { x: 196, y: 456 },
    ],
    minScale: '640',
  },
  {
    id: '#04',
    label: 'Car',
    confidence: 0.93,
    box: { x: 690, y: 425, w: 170, h: 110 },
    trail: [
      { x: 855, y: 505 },
      { x: 812, y: 491 },
      { x: 790, y: 484 },
    ],
    minScale: '640',
  },
  {
    id: '#05',
    label: 'Two-Wheeler',
    confidence: 0.85,
    box: { x: 396, y: 342, w: 38, h: 68 },
    trail: [
      { x: 405, y: 428 },
      { x: 410, y: 403 },
      { x: 413, y: 387 },
    ],
    minScale: '1280',
  },
  {
    id: '#06',
    label: 'Two-Wheeler',
    confidence: 0.82,
    box: { x: 338, y: 395, w: 40, h: 78 },
    trail: [
      { x: 344, y: 488 },
      { x: 351, y: 461 },
      { x: 355, y: 445 },
    ],
    minScale: '1280',
  },
  {
    id: '#07',
    label: 'Auto-Rickshaw',
    confidence: 0.80,
    box: { x: 400, y: 246, w: 46, h: 48 },
    trail: [
      { x: 405, y: 250 },
      { x: 415, y: 259 },
      { x: 420, y: 265 },
    ],
    minScale: '1280',
  },
  {
    id: '#08',
    label: 'Two-Wheeler',
    confidence: 0.84,
    box: { x: 656, y: 350, w: 40, h: 68 },
    trail: [
      { x: 682, y: 350 },
      { x: 678, y: 366 },
      { x: 676, y: 376 },
    ],
    minScale: '1280',
  },
];

const ROI_PRESETS: RoiPreset[] = [
  {
    id: 'full',
    label: 'Full Intersection',
    points: [
      { x: 65, y: 110 },
      { x: 935, y: 110 },
      { x: 935, y: 525 },
      { x: 65, y: 525 },
    ],
  },
  {
    id: 'northbound',
    label: 'Northbound Lane',
    points: [
      { x: 105, y: 150 },
      { x: 505, y: 150 },
      { x: 535, y: 525 },
      { x: 70, y: 525 },
    ],
  },
  {
    id: 'exit',
    label: 'Exit Ramp',
    points: [
      { x: 520, y: 165 },
      { x: 910, y: 165 },
      { x: 935, y: 510 },
      { x: 555, y: 510 },
    ],
  },
];

const SCALE_METRICS: Record<
  ModelScale,
  { map: string; recall: string; fps: string }
> = {
  '640': {
    map: '0.345',
    recall: 'Baseline',
    fps: '41 FPS',
  },
  '1280': {
    map: '0.443 (+28%)',
    recall: '+22 pp',
    fps: '39 FPS',
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function VisionViewport() {
  const reducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [scale, setScale] = useState<ModelScale>('1280');
  const [showTracks, setShowTracks] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<RoiPresetId>('full');
  const [roiPoints, setRoiPoints] = useState<[Point, Point, Point, Point]>(
    () => ROI_PRESETS[0].points.map((p) => ({ ...p })) as [Point, Point, Point, Point]
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('#02');
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(max-width: 639px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 639px)');
    setIsCompact(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsCompact(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const activeDetections = DETECTIONS.filter(
    (d) => scale === '1280' || d.minScale === '640'
  );

  const selectedDet =
    activeDetections.find((d) => d.id === selectedId) ?? activeDetections[0];

  const detectionsWithRoi = activeDetections.map((det) => {
    const centroid: Point = {
      x: det.box.x + det.box.w / 2,
      y: det.box.y + det.box.h / 2,
    };
    const inRoi = pointInPolygon(centroid, roiPoints);
    return { ...det, centroid, inRoi };
  });

  const inRoiCount = detectionsWithRoi.filter((d) => d.inRoi).length;
  const directionalMatch =
    inRoiCount === 0
      ? 94
      : Math.min(
          100,
          94 + Math.round((inRoiCount / activeDetections.length) * 6)
        );
  const metrics = SCALE_METRICS[scale];
  const tweenedMap = useTweenedNumber(scale === '1280' ? 0.443 : 0.345);
  const tweenedFps = useTweenedNumber(scale === '1280' ? 39 : 41);
  const tweenedDirectional = useTweenedNumber(directionalMatch);

  const handleSelectPreset = (preset: RoiPreset) => {
    setActivePreset(preset.id);
    setRoiPoints(
      preset.points.map((p) => ({ ...p })) as [Point, Point, Point, Point]
    );
  };

  const updateVertexFromPointer = (index: number, clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = clamp(
      Math.round(((clientX - rect.left) / rect.width) * VIEWBOX_W),
      HANDLE_MIN_X,
      HANDLE_MAX_X
    );
    const y = clamp(
      Math.round(((clientY - rect.top) / rect.height) * VIEWBOX_H),
      HANDLE_MIN_Y,
      HANDLE_MAX_Y
    );

    setActivePreset('custom');
    setRoiPoints((prev) => {
      const next = prev.map((p, idx) => (idx === index ? { x, y } : p));
      return next as [Point, Point, Point, Point];
    });
  };

  const handleVertexPointerDown = (
    index: number,
    e: PointerEvent<SVGCircleElement>
  ) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIndex(index);
    updateVertexFromPointer(index, e.clientX, e.clientY);
  };

  const handleVertexPointerMove = (
    index: number,
    e: PointerEvent<SVGCircleElement>
  ) => {
    if (draggingIndex !== index) return;
    updateVertexFromPointer(index, e.clientX, e.clientY);
  };

  const handleVertexPointerUp = (
    index: number,
    e: PointerEvent<SVGCircleElement>
  ) => {
    if (draggingIndex !== index) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDraggingIndex(null);
  };

  const handleVertexKeyDown = (
    index: number,
    e: KeyboardEvent<SVGCircleElement>
  ) => {
    const step = e.shiftKey ? 24 : 10;
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowLeft') dx = -step;
    else if (e.key === 'ArrowRight') dx = step;
    else if (e.key === 'ArrowUp') dy = -step;
    else if (e.key === 'ArrowDown') dy = step;
    else return;

    e.preventDefault();
    setActivePreset('custom');
    setRoiPoints((prev) => {
      const next = prev.map((p, idx) =>
        idx === index
          ? {
              x: clamp(p.x + dx, HANDLE_MIN_X, HANDLE_MAX_X),
              y: clamp(p.y + dy, HANDLE_MIN_Y, HANDLE_MAX_Y),
            }
          : p
      );
      return next as [Point, Point, Point, Point];
    });
  };

  const polygonPointsAttr = roiPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 sm:p-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2">
          <Crosshair
            size={16}
            strokeWidth={1.5}
            className="text-[var(--accent)]"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            YOLOv8 + ByteTrack calibration
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] tabular-nums">
          <span
            className="h-2 w-2 rounded-full bg-[var(--status-ok)]"
            aria-hidden="true"
          />
          <span>RTX 4050 · {Math.round(tweenedFps)} FPS</span>
        </div>
      </div>

      {/* Top controls: Scale segmented toggle + ByteTrack trails toggle */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div
          role="group"
          aria-label="YOLOv8 inference resolution"
          className="inline-flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-1"
        >
          {(
            [
              { id: '640', label: '640px Baseline' },
              { id: '1280', label: '1280px High-Res Scaling' },
            ] as const
          ).map((option) => {
            const active = scale === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScale(option.id)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-[transform,color] duration-150 ease-out active:scale-[0.97] ${
                  active
                    ? 'text-[var(--accent-ink)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="vision-scale-pill"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 500, damping: 35 }
                    }
                    className="absolute inset-0 rounded-lg bg-[var(--accent)]"
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-pressed={showTracks}
          onClick={() => setShowTracks((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] ${
            showTracks
              ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Eye
            size={16}
            strokeWidth={1.5}
            className={showTracks ? 'text-[var(--accent)]' : undefined}
            aria-hidden="true"
          />
          <span>ByteTrack IDs &amp; trails</span>
        </button>
      </div>

      {/* Optical calibration viewport */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--bg-base)] select-none">
        {!imgError ? (
          <img
            src="/assets/idd-traffic-frame.png"
            alt="IDD urban traffic intersection frame with calibrated YOLOv8 bounding boxes and polygon ROI gate"
            onError={() => setImgError(true)}
            draggable={false}
            className="h-full w-full object-cover"
          />
        ) : (
          /* Resilient optical sensor grid fallback if frame image fails to load */
          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            aria-hidden="true"
            className="h-full w-full bg-[var(--bg-base)]"
          >
            <defs>
              <pattern
                id="vision-calibration-grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-[var(--border-subtle)]"
                />
              </pattern>
            </defs>
            <rect
              width={VIEWBOX_W}
              height={VIEWBOX_H}
              fill="url(#vision-calibration-grid)"
            />
            {/* Perspective roadway lane geometry */}
            <path
              d="M 40 562 L 360 100 L 640 100 L 960 562"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[var(--border-strong)]"
            />
            <line
              x1="500"
              y1="100"
              x2="500"
              y2="562"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="16 14"
              className="text-[var(--border-strong)]"
            />
            <line
              x1="120"
              y1="340"
              x2="880"
              y2="340"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="8 10"
              className="text-[var(--border-subtle)]"
            />
          </svg>
        )}

        {/* Subtle corner reticle ticks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 flex flex-col justify-between"
        >
          <div className="flex justify-between">
            <span className="h-3.5 w-3.5 border-t-2 border-l-2 border-[var(--text-primary)]/60" />
            <span className="h-3.5 w-3.5 border-t-2 border-r-2 border-[var(--text-primary)]/60" />
          </div>
          <div className="flex justify-between">
            <span className="h-3.5 w-3.5 border-b-2 border-l-2 border-[var(--text-primary)]/60" />
            <span className="h-3.5 w-3.5 border-r-2 border-b-2 border-[var(--text-primary)]/60" />
          </div>
        </div>

        {/* Calibration laser scanline */}
        {!reducedMotion && (
          <div
            aria-hidden="true"
            className="animate-optical-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[var(--accent)]/12 to-transparent"
          />
        )}

        {/* Interactive SVG overlay: ROI polygon, detections, tracks, draggable handles */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="absolute inset-0 h-full w-full touch-none"
          aria-label="Interactive detection and ROI calibration overlay"
        >
          {/* Polygon ROI Gate */}
          <polygon
            points={polygonPointsAttr}
            fill="var(--accent)"
            fillOpacity={0.11}
            stroke="var(--accent)"
            strokeWidth={2}
            strokeDasharray="8 5"
          />

          {/* Detections and ByteTrack trails */}
          {detectionsWithRoi.map((det) => {
            const isSelected = det.id === selectedDet.id;
            const boxStroke = det.inRoi ? 'var(--accent)' : 'var(--text-secondary)';
            const boxOpacity = det.inRoi ? 1 : 0.45;
            const trailPoints = [...det.trail, det.centroid]
              .map((p) => `${p.x},${p.y}`)
              .join(' ');
            const labelText = isCompact
              ? det.id
              : showTracks
                ? `${det.id} ${det.label} ${det.confidence.toFixed(2)}`
                : `${det.label} ${det.confidence.toFixed(2)}`;
            const tagWidth = isCompact ? 34 : Math.max(82, labelText.length * 7.2 + 14);
            const tagY = det.box.y > 28 ? det.box.y - 22 : det.box.y + 4;

            return (
              <motion.g
                key={det.id}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: boxOpacity }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.25, ease: [0.23, 1, 0.32, 1] }
                }
                onClick={() => setSelectedId(det.id)}
                className="cursor-pointer"
              >
                {showTracks && (
                  <g>
                    <polyline
                      points={trailPoints}
                      fill="none"
                      stroke={boxStroke}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {det.trail.map((pt, idx) => (
                      <circle
                        key={`${det.id}-t-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={2.5}
                        fill={boxStroke}
                        opacity={0.45 + idx * 0.2}
                      />
                    ))}
                  </g>
                )}

                <rect
                  x={det.box.x}
                  y={det.box.y}
                  width={det.box.w}
                  height={det.box.h}
                  rx={4}
                  fill="none"
                  stroke={boxStroke}
                  strokeWidth={isSelected && isCompact ? 2.75 : det.inRoi ? 2.25 : 1.5}
                />

                <circle
                  cx={det.centroid.x}
                  cy={det.centroid.y}
                  r={3.5}
                  fill={det.inRoi ? 'var(--status-ok)' : 'var(--text-muted)'}
                />

                <rect
                  x={det.box.x}
                  y={tagY}
                  width={tagWidth}
                  height={20}
                  rx={4}
                  fill="var(--bg-base)"
                  fillOpacity={0.88}
                  stroke={boxStroke}
                  strokeWidth={1}
                />
                <text
                  x={det.box.x + (isCompact ? 6 : 7)}
                  y={tagY + 13.5}
                  fill="var(--text-primary)"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {labelText}
                </text>
              </motion.g>
            );
          })}

          {/* 4 draggable ROI polygon vertex handles */}
          {roiPoints.map((pt, index) => {
            const isDragging = draggingIndex === index;
            return (
              <g key={`roi-handle-${index}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isDragging ? 11 : 8}
                  fill="var(--bg-base)"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  className="pointer-events-none"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={22}
                  fill="transparent"
                  tabIndex={0}
                  role="slider"
                  aria-label={`ROI vertex ${index + 1} at x ${pt.x}, y ${pt.y}`}
                  aria-valuetext={`${pt.x}, ${pt.y}`}
                  onPointerDown={(e) => handleVertexPointerDown(index, e)}
                  onPointerMove={(e) => handleVertexPointerMove(index, e)}
                  onPointerUp={(e) => handleVertexPointerUp(index, e)}
                  onPointerCancel={(e) => handleVertexPointerUp(index, e)}
                  onKeyDown={(e) => handleVertexKeyDown(index, e)}
                  className="cursor-grab focus:outline-none active:cursor-grabbing"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ROI Presets + Live Gate Readout */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
        <div
          role="group"
          aria-label="ROI gate presets"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Layers size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>ROI gate:</span>
          </span>
          {ROI_PRESETS.map((preset) => {
            const active = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelectPreset(preset)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] ${
                  active
                    ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          {activePreset === 'custom' && (
            <button
              type="button"
              onClick={() => handleSelectPreset(ROI_PRESETS[0])}
              aria-label="Reset custom ROI polygon"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 text-xs text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97]"
            >
              <RotateCcw size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          <span className="text-[var(--text-secondary)]">
            In ROI:{' '}
            <strong className="font-medium text-[var(--text-primary)]">
              {inRoiCount} / {activeDetections.length}
            </strong>
          </span>
          <span className="text-[var(--text-secondary)]">
            Directional match:{' '}
            <strong className="font-medium text-[var(--status-ok)]">
              {Math.round(tweenedDirectional)}%
            </strong>
          </span>
        </div>
      </div>

      {isCompact && (
        <div
          aria-live="polite"
          className="mt-2.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 font-mono text-xs text-[var(--text-secondary)] tabular-nums"
        >
          <span>
            Selected {selectedDet.id} · {selectedDet.label}
          </span>
          <span className="text-[var(--text-primary)]">
            conf {selectedDet.confidence.toFixed(2)}
          </span>
        </div>
      )}

      {/* Telemetry footer strip */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-3">
        <div className="pr-3">
          <div className="text-xs text-[var(--text-muted)]">mAP@50:95</div>
          <div className="mt-0.5 font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
            {tweenedMap.toFixed(3)}
            {scale === '1280' && (
              <span className="ml-1.5 text-xs text-[var(--accent)]">(+28%)</span>
            )}
          </div>
        </div>
        <div className="px-3">
          <div className="text-xs text-[var(--text-muted)]">Small-object recall</div>
          <div className="mt-0.5 font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
            {metrics.recall}
          </div>
        </div>
        <div className="pl-3">
          <div className="text-xs text-[var(--text-muted)]">Throughput</div>
          <div className="mt-0.5 font-mono text-sm font-medium text-[var(--text-primary)] tabular-nums">
            {Math.round(tweenedFps)} FPS
          </div>
        </div>
      </div>
    </div>
  );
}
