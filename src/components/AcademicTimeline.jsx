import React, { useState } from 'react';
import { Milestone, Compass, GraduationCap, Code, BookOpen, ArrowDownUp } from 'lucide-react';
import { journeyTimeline } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';

export default function AcademicTimeline() {
  const [isChronological, setIsChronological] = useState(true);

  const displayedTimeline = isChronological
    ? [...journeyTimeline].sort((a, b) => a.order - b.order)
    : [...journeyTimeline].sort((a, b) => b.order - a.order);

  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto">
        {/* Header with Sort Order Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
              <Milestone className="w-3.5 h-3.5 text-sky-600" />
              <span>Academic Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-950 tracking-tight">
              Academic &amp; Engineering Path.
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              From coding inception in 2025 to production software launches and machine learning systems at RAIT Navi Mumbai.
            </p>
          </div>

          {/* Chronological vs Latest-First Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-mono self-start sm:self-auto shrink-0 shadow-2xs">
            <button
              onClick={() => setIsChronological(true)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                isChronological
                  ? 'bg-white text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              2025 &rarr; Present
            </button>
            <button
              onClick={() => setIsChronological(false)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isChronological
                  ? 'bg-white text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Latest First
            </button>
          </div>
        </div>

        {/* Vertical Timeline Path */}
        <div className="relative pl-6 sm:pl-8 border-l border-slate-200 space-y-10 text-left">
          {displayedTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Orb node on timeline axis */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 transition-transform group-hover:scale-125 shadow-xs ${
                  item.statusType === 'active'
                    ? 'border-emerald-600 ring-4 ring-emerald-500/15'
                    : item.statusType === 'shipped'
                    ? 'border-indigo-600'
                    : item.statusType === 'foundational'
                    ? 'border-amber-600'
                    : 'border-slate-950'
                }`}
              >
                {item.statusType === 'active' && (
                  <span className="absolute inset-0.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                )}
              </div>

              <SpotlightCard
                className="p-6 sm:p-7"
                spotlightColor="rgba(2, 132, 199, 0.08)"
              >
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      0{item.order}
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100/80">
                      {item.period}
                    </span>
                    <span className="text-xs font-mono text-slate-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.stage}
                    </span>
                    <span className="text-xs font-mono text-slate-500 hidden md:inline">
                      • {item.institution}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="self-start sm:self-auto">
                    {item.statusType === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full font-medium shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {item.status}
                      </span>
                    ) : item.statusType === 'shipped' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {item.status}
                      </span>
                    ) : item.statusType === 'foundational' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {item.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtitle / Institution for mobile */}
                <div className="text-xs text-slate-500 font-mono mt-2 md:hidden">
                  {item.institution}
                </div>

                {/* Milestone Role Title */}
                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-950 mt-3 tracking-tight">
                  {item.role}
                </h3>

                {/* Focus Area Pill */}
                {item.focus && (
                  <div className="mt-1.5 text-xs font-mono text-sky-800 font-medium">
                    <span className="text-slate-400 font-normal">Focus: </span>
                    {item.focus}
                  </div>
                )}

                {/* Detailed Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Milestone Key Deliverable Callout */}
                {item.milestone && (
                  <div className="mt-3.5 p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/70 text-xs font-mono text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                    <span className="truncate">{item.milestone}</span>
                  </div>
                )}

                {/* Highlights / Skills Acquired */}
                <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-slate-100">
                  {item.highlights.map((hl, hIdx) => (
                    <span
                      key={hIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-700"
                    >
                      {hl}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
