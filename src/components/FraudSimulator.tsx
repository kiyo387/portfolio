import { useMemo, useState } from 'react';
import { Activity, Clock, CreditCard, ShieldAlert, ShieldCheck, SlidersHorizontal, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTweenedNumber } from '../hooks/useTweenedNumber';

type PresetId = 'grocery' | 'probe' | 'electronics';

interface TransactionPreset {
  id: PresetId;
  label: string;
  shortLabel: string;
  rawAmount: number;
  hourOfDay: number;
  baseLogit: number;
  note: string;
}

const PRESETS: TransactionPreset[] = [
  {
    id: 'grocery',
    label: 'Routine Grocery · ₹1,450 · 14:00',
    shortLabel: 'Routine Grocery',
    rawAmount: 1450,
    hourOfDay: 14,
    baseLogit: -2.75,
    note: 'In-distribution daytime retail basket',
  },
  {
    id: 'probe',
    label: 'Card-Testing Micro-Probe · ₹49 · 03:15',
    shortLabel: 'Card-Testing Micro-Probe',
    rawAmount: 49,
    hourOfDay: 3,
    baseLogit: 0.575,
    note: 'Borderline score — flips across 0.70 cutoff',
  },
  {
    id: 'electronics',
    label: 'High-Velocity Electronics · ₹68,900 · 02:40',
    shortLabel: 'High-Velocity Electronics',
    rawAmount: 68900,
    hourOfDay: 2,
    baseLogit: 2.31,
    note: 'Out-of-hours high-ticket anomaly vector',
  },
];

interface OperatingPoint {
  precision: number;
  recall: number;
  flagRatePct: number;
}

const BASE_FRAUD_RATE = 0.0017;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function evaluateOperatingPoint(threshold: number): OperatingPoint {
  const t = clamp(threshold, 0.1, 0.95);
  // Smooth calibrated Precision-Recall tradeoff consistent with PR-AUC 0.865 on 0.17% positive rate
  const recall = clamp(0.96 - 0.56 * Math.pow((t - 0.1) / 0.85, 1.45), 0.35, 0.98);
  const precision = clamp(0.41 + 0.57 * Math.pow((t - 0.1) / 0.85, 0.62), 0.38, 0.985);
  const flagRatePct = (BASE_FRAUD_RATE * recall) / precision * 100;
  return { precision, recall, flagRatePct };
}

function scoreTransaction(preset: TransactionPreset, rawAmount: number, hourOfDay: number) {
  const safeAmount = Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : 1;
  // RobustScaler-inspired heavy-tail amount effect + off-hours shift
  const amountDelta = Math.log10(safeAmount / preset.rawAmount);
  const microProbeBoost = safeAmount <= 100 ? 0.34 : 0;
  const baselineMicroBoost = preset.rawAmount <= 100 ? 0.34 : 0;
  const highTicketBoost = safeAmount >= 25000 ? 0.38 * Math.log10(safeAmount / 25000 + 1) : 0;
  const baselineHighBoost =
    preset.rawAmount >= 25000 ? 0.38 * Math.log10(preset.rawAmount / 25000 + 1) : 0;

  const isNight = (h: number) => (h >= 0 && h <= 5 ? 1 : h >= 22 ? 0.45 : 0);
  const hourShift = (isNight(hourOfDay) - isNight(preset.hourOfDay)) * 0.62;

  const logit =
    preset.baseLogit +
    amountDelta * 0.55 +
    (microProbeBoost - baselineMicroBoost) +
    (highTicketBoost - baselineHighBoost) +
    hourShift;

  const probability = clamp(1 / (1 + Math.exp(-logit)), 0.005, 0.992);

  // Deterministic simulated latency strictly inside 1.3–1.7 ms (< 1.8 ms SLA)
  const hash = Math.abs(Math.round(safeAmount * 7 + hourOfDay * 31 + preset.id.length * 13));
  const latencyMs = Number((1.32 + (hash % 39) * 0.01).toFixed(2));

  return {
    probability: Number(probability.toFixed(4)),
    latencyMs,
  };
}

const CHART_WIDTH = 360;
const CHART_HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
const PLOT_W = CHART_WIDTH - PAD.left - PAD.right;
const PLOT_H = CHART_HEIGHT - PAD.top - PAD.bottom;

function toSvgX(recall: number): number {
  return PAD.left + clamp(recall, 0, 1) * PLOT_W;
}

function toSvgY(precision: number): number {
  return PAD.top + (1 - clamp(precision, 0, 1)) * PLOT_H;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function FraudSimulator() {
  const reducedMotion = useReducedMotion();
  const [threshold, setThreshold] = useState<number>(0.7);
  const [activePresetId, setActivePresetId] = useState<PresetId>('probe');
  const [rawAmount, setRawAmount] = useState<number>(49);
  const [hourOfDay, setHourOfDay] = useState<number>(3);

  const activePreset = useMemo(
    () => PRESETS.find((item) => item.id === activePresetId) ?? PRESETS[1],
    [activePresetId]
  );

  const operatingPoint = useMemo(() => evaluateOperatingPoint(threshold), [threshold]);

  const { curvePath, areaPath } = useMemo(() => {
    const samples: { x: number; y: number }[] = [{ x: toSvgX(0), y: toSvgY(0.99) }];
    for (let t = 0.95; t >= 0.1; t -= 0.05) {
      const pt = evaluateOperatingPoint(t);
      samples.push({ x: toSvgX(pt.recall), y: toSvgY(pt.precision) });
    }
    samples.push({ x: toSvgX(1), y: toSvgY(0.12) });

    const line = samples
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ');
    const baseLineY = toSvgY(0).toFixed(1);
    const area = `${line} L ${samples[samples.length - 1].x.toFixed(1)} ${baseLineY} L ${samples[0].x.toFixed(1)} ${baseLineY} Z`;

    return { curvePath: line, areaPath: area };
  }, []);

  const prediction = useMemo(
    () => scoreTransaction(activePreset, rawAmount, hourOfDay),
    [activePreset, rawAmount, hourOfDay]
  );

  const tweenedPrecision = useTweenedNumber(operatingPoint.precision * 100);
  const tweenedRecall = useTweenedNumber(operatingPoint.recall * 100);
  const tweenedFlagRate = useTweenedNumber(operatingPoint.flagRatePct);
  const tweenedProbability = useTweenedNumber(prediction.probability);

  const flagged = prediction.probability >= threshold;
  const decision = flagged ? 'FLAG_FOR_VERIFICATION' : 'AUTO_APPROVE';

  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          fraud_probability: prediction.probability,
          fraud_probability_pct: `${(prediction.probability * 100).toFixed(2)}%`,
          threshold: Number(threshold.toFixed(2)),
          decision,
          latency_ms: prediction.latencyMs,
        },
        null,
        2
      ),
    [prediction.probability, prediction.latencyMs, threshold, decision]
  );

  const handleSelectPreset = (preset: TransactionPreset) => {
    setActivePresetId(preset.id);
    setRawAmount(preset.rawAmount);
    setHourOfDay(preset.hourOfDay);
  };

  const markerX = toSvgX(operatingPoint.recall);
  const markerY = toSvgY(operatingPoint.precision);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Threshold Calibration & Precision-Recall Curve */}
      <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <SlidersHorizontal size={16} strokeWidth={1.5} className="text-[var(--accent)]" aria-hidden="true" />
              <span>Threshold calibration</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              <span className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5">
                0.984 ROC-AUC
              </span>
              <span className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[var(--accent)]">
                0.865 PR-AUC
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            Trained with RobustScaler, SMOTE (0.17% fraud base rate), and XGBoost / Random Forest ensembles. Tune the operating cutoff on the Precision-Recall frontier.
          </p>

          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="fraud-threshold"
                className="text-xs font-medium text-[var(--text-primary)]"
              >
                Decision threshold
              </label>
              <span className="font-mono text-sm font-medium text-[var(--accent)] tabular-nums">
                {threshold.toFixed(2)}
              </span>
            </div>

            <input
              id="fraud-threshold"
              type="range"
              min={0.1}
              max={0.95}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2.5 h-2 w-full cursor-pointer accent-[var(--accent)]"
            />

            <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              <span>0.10 (high recall)</span>
              <button
                type="button"
                onClick={() => setThreshold(0.7)}
                className="rounded px-1.5 py-0.5 text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] active:scale-[0.97]"
              >
                0.70 default
              </button>
              <span>0.95 (high precision)</span>
            </div>
          </div>

          {/* Precision-Recall SVG Plot */}
          <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
              <span>Precision-Recall Curve (PR-AUC 0.865)</span>
              <span>0.17% positive baseline</span>
            </div>

            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              role="img"
              aria-label={`Precision-Recall curve with PR-AUC 0.865. At threshold ${threshold.toFixed(2)}, precision is ${(operatingPoint.precision * 100).toFixed(1)}% and recall is ${(operatingPoint.recall * 100).toFixed(1)}%.`}
              className="h-auto w-full overflow-visible select-none"
            >
              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((tick) => {
                const y = toSvgY(tick);
                const x = toSvgX(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={PAD.left}
                      y1={y}
                      x2={PAD.left + PLOT_W}
                      y2={y}
                      stroke="var(--border-subtle)"
                      strokeWidth={1}
                    />
                    <line
                      x1={x}
                      y1={PAD.top}
                      x2={x}
                      y2={PAD.top + PLOT_H}
                      stroke="var(--border-subtle)"
                      strokeWidth={1}
                    />
                    <text
                      x={PAD.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-[var(--text-muted)] font-mono text-[9px] tabular-nums"
                    >
                      {tick.toFixed(2)}
                    </text>
                    <text
                      x={x}
                      y={PAD.top + PLOT_H + 13}
                      textAnchor="middle"
                      className="fill-[var(--text-muted)] font-mono text-[9px] tabular-nums"
                    >
                      {tick.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Axes */}
              <line
                x1={PAD.left}
                y1={PAD.top}
                x2={PAD.left}
                y2={PAD.top + PLOT_H}
                stroke="var(--border-strong)"
                strokeWidth={1}
              />
              <line
                x1={PAD.left}
                y1={PAD.top + PLOT_H}
                x2={PAD.left + PLOT_W}
                y2={PAD.top + PLOT_H}
                stroke="var(--border-strong)"
                strokeWidth={1}
              />

              {/* Axis labels */}
              <text
                x={PAD.left + PLOT_W / 2}
                y={CHART_HEIGHT - 3}
                textAnchor="middle"
                className="fill-[var(--text-secondary)] font-mono text-[10px]"
              >
                Recall
              </text>
              <text
                x={11}
                y={PAD.top + PLOT_H / 2}
                textAnchor="middle"
                transform={`rotate(-90 11 ${PAD.top + PLOT_H / 2})`}
                className="fill-[var(--text-secondary)] font-mono text-[10px]"
              >
                Precision
              </text>

              {/* Curve Fill & Stroke */}
              <path d={areaPath} fill="var(--accent)" fillOpacity={0.09} />
              <path
                d={curvePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Live Crosshair & Operating Point Marker */}
              <line
                x1={markerX}
                y1={PAD.top}
                x2={markerX}
                y2={PAD.top + PLOT_H}
                stroke="var(--text-muted)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <line
                x1={PAD.left}
                y1={markerY}
                x2={PAD.left + PLOT_W}
                y2={markerY}
                stroke="var(--text-muted)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle
                cx={markerX}
                cy={markerY}
                r={5.5}
                fill="var(--accent)"
                stroke="var(--bg-surface)"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>

        {/* Calibrated Readouts */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-4">
          <div className="pr-3">
            <div className="text-[11px] text-[var(--text-muted)]">Precision</div>
            <div className="mt-0.5 font-mono text-base font-medium text-[var(--text-primary)] tabular-nums">
              {tweenedPrecision.toFixed(1)}%
            </div>
          </div>
          <div className="px-3">
            <div className="text-[11px] text-[var(--text-muted)]">Recall</div>
            <div className="mt-0.5 font-mono text-base font-medium text-[var(--text-primary)] tabular-nums">
              {tweenedRecall.toFixed(1)}%
            </div>
          </div>
          <div className="pl-3">
            <div className="text-[11px] text-[var(--text-muted)]">Flag rate</div>
            <div className="mt-0.5 font-mono text-base font-medium text-[var(--accent)] tabular-nums">
              {tweenedFlagRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Right: FastAPI POST /predict Live Microservice Simulator */}
      <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-xs text-[var(--text-primary)]">
                <Zap size={16} strokeWidth={1.5} className="text-[var(--accent)]" aria-hidden="true" />
                <span>POST /predict</span>
              </span>
              <span className="text-xs text-[var(--text-secondary)]">FastAPI microservice</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] tabular-nums">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-ok)]" aria-hidden="true" />
              <span>{prediction.latencyMs.toFixed(2)} ms (&lt; 1.8 ms)</span>
            </div>
          </div>

          {/* Clickable Transaction Presets */}
          <div className="mt-4">
            <div className="text-xs font-medium text-[var(--text-secondary)]">
              Transaction presets
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {PRESETS.map((preset) => {
                const isSelected = preset.id === activePresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-[transform,border-color,background-color] duration-150 ease-out active:scale-[0.97] ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-medium tabular-nums">
                        <CreditCard
                          size={16}
                          strokeWidth={1.5}
                          className={isSelected ? 'shrink-0 text-[var(--accent)]' : 'shrink-0 text-[var(--text-muted)]'}
                          aria-hidden="true"
                        />
                        <span className="truncate">{preset.label}</span>
                      </div>
                      <div className="mt-0.5 pl-6 text-[11px] text-[var(--text-muted)]">
                        {preset.note}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Payload Inputs */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
              <label
                htmlFor="fraud-amount"
                className="block text-xs font-medium text-[var(--text-secondary)]"
              >
                Raw amount (INR)
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="font-mono text-sm text-[var(--text-muted)]" aria-hidden="true">
                  ₹
                </span>
                <input
                  id="fraud-amount"
                  type="number"
                  min={1}
                  max={500000}
                  step={1}
                  value={rawAmount}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setRawAmount(Number.isFinite(next) ? Math.max(0, next) : 0);
                  }}
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1.5 font-mono text-sm text-[var(--text-primary)] tabular-nums focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="fraud-hour"
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]"
                >
                  <Clock size={16} strokeWidth={1.5} className="text-[var(--text-muted)]" aria-hidden="true" />
                  <span>Hour of day</span>
                </label>
                <span className="font-mono text-xs font-medium text-[var(--text-primary)] tabular-nums">
                  {formatHour(hourOfDay)}
                </span>
              </div>
              <input
                id="fraud-hour"
                type="range"
                min={0}
                max={23}
                step={1}
                value={hourOfDay}
                onChange={(e) => setHourOfDay(Number(e.target.value))}
                className="mt-3 h-2 w-full cursor-pointer accent-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Live Decision Telemetry & JSON Response */}
        <div
          aria-live="polite"
          className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Activity size={16} strokeWidth={1.5} className="text-[var(--text-muted)]" aria-hidden="true" />
              <span>Inference response</span>
              <span className="font-mono text-[var(--text-primary)] tabular-nums">
                ({(tweenedProbability * 100).toFixed(1)}%)
              </span>
            </div>

            <motion.span
              key={decision}
              initial={reducedMotion ? false : { opacity: 0.65, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium tabular-nums"
              style={{
                color: flagged ? 'var(--status-warn)' : 'var(--status-ok)',
                borderColor: flagged ? 'var(--status-warn)' : 'var(--status-ok)',
                backgroundColor: 'var(--bg-base)',
              }}
            >
              {flagged ? (
                <ShieldAlert size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
              )}
              <span>{decision}</span>
            </motion.span>
          </div>

          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[var(--text-primary)] tabular-nums">
            <code>{payloadPreview}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
