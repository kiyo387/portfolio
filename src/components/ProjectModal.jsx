import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Radio, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Github } from './Icons';

export default function ProjectModal({ project, onClose }) {
  const [telemetryTick, setTelemetryTick] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Pause Lenis smooth scrolling so wheel events go directly to the modal
    if (window.__lenis) {
      window.__lenis.stop();
    }

    const interval = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);
    }, 1200);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      if (window.__lenis) {
        window.__lenis.start();
      }
      clearInterval(interval);
    };
  }, [onClose]);

  if (!project) return null;

  const isFraudProject = project.id === 'fraud-detection';

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog (Frosted Pearl White Material) */}
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] z-10 max-h-[85vh] overflow-y-auto overscroll-contain no-scrollbar text-slate-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 font-medium">
                {isFraudProject && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />}
                {project.badge}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {project.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-950">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {project.subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-6 text-xs sm:text-sm text-slate-700">
          <div>
            <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
              Overview &amp; Problem
            </h4>
            <p className="leading-relaxed text-slate-700">
              {project.description}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-center">
                <div className="text-sm sm:text-base font-bold text-slate-950 font-heading">
                  {m.value}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Credit Card Fraud Detection Telemetry Dashboard */}
          {isFraudProject && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-sky-200 space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-xs text-sky-700 pb-2 border-b border-sky-100">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                  <span>TRANSACTION ANOMALY INFERENCE &bull; FRAUD CLASSIFIER</span>
                </span>
                <span className="text-slate-500 text-[10px]">TXN INFERENCE #{98200 + telemetryTick}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block">ROC-AUC:</span>
                  <span className="text-slate-900 font-semibold">0.984 Score</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block">Imbalance:</span>
                  <span className="text-rose-700 font-semibold">0.17% (SMOTE)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block">Inference:</span>
                  <span className="text-sky-700 font-semibold">&lt; 1.8ms per txn</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-400 block">Precision-Recall:</span>
                  <span className="text-emerald-700 font-semibold">0.865 AUPRC</span>
                </div>
              </div>
            </div>
          )}

          {/* Architecture */}
          <div>
            <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
              System Architecture &amp; Technical Formulation
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono">
              {project.architecture}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5 font-medium">
              Engineering Implementation Details
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
              Technologies &amp; Protocols
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-mono text-slate-700 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Authored by Shreyas Bhavsar
          </span>

          <div className="flex items-center gap-2.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            )}

            {project.liveDemo && project.liveDemo !== '#' && project.liveDemo !== project.github && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md"
              >
                <span>Open Live Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
