import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal, Cpu, ArrowUpRight, CheckCircle, Radio, Orbit, Layers } from 'lucide-react';
import { Github } from './Icons';
import { projectsData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';
import ProjectModal from './ProjectModal';
import MagneticButton from './MagneticButton';

export default function BespokeProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const scholarProject = projectsData.find(p => p.id === 'scholarbridge');
  const fraudProject = projectsData.find(p => p.id === 'fraud-detection');
  const campusProject = projectsData.find(p => p.id === 'campus-navigator');

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-12 max-w-2xl text-left"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Featured Projects</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-950 tracking-tight text-balance">
            Featured Projects &amp; Systems.
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed text-pretty">
            Production-grade web software, real-time transaction anomaly detection pipelines, and algorithmic graph routing networks built from first principles.
          </p>
        </motion.div>

        {/* Asymmetric Showcase */}
        <div className="space-y-8">
          {/* 1. SCHOLARBRIDGE: Full-Width Flagship Showcase */}
          {scholarProject && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                className="p-6 sm:p-10"
                spotlightColor="rgba(99, 102, 241, 0.08)"
                tilt={true}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live in Production
                      </span>
                      <span className="text-xs font-mono text-slate-500">React 19 &bull; Three.js &bull; Vercel</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-950">
                      {scholarProject.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-pretty">
                      {scholarProject.description}
                    </p>

                    {/* Architecture Badges */}
                    <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80">
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                        System Architecture
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {scholarProject.architecture}
                      </p>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {scholarProject.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-mono shadow-2xs hover:border-slate-300 hover:scale-[1.02] transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <MagneticButton distance={0.25}>
                        <a
                          href={scholarProject.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Launch App</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </MagneticButton>

                      <MagneticButton distance={0.25}>
                        <a
                          href={scholarProject.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source Code</span>
                        </a>
                      </MagneticButton>

                      <button
                        onClick={() => setSelectedProject(scholarProject)}
                        className="text-xs text-sky-700 hover:text-sky-900 font-medium cursor-pointer pl-1 hover:underline transition-all"
                      >
                        Inspect Architecture &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Right Interactive Mockup Container */}
                  <div className="lg:col-span-5 w-full">
                    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono text-slate-500">
                        <span>Platform Telemetry</span>
                        <span className="text-emerald-600 font-semibold">ONLINE &bull; VERCEL</span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-600">Vector Search</span>
                          <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">Sub-50ms Scored Heuristics</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-600">Dynamic Matching</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">Multi-Attribute Filters</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-600">UI Motion Physics</span>
                          <span className="text-xs font-mono font-bold text-slate-900">Framer Spring Dynamics</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 text-center">
                        scholarbridge-mauve.vercel.app
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          )}

          {/* 2 & 3: Credit Card Fraud Detection & RAIT Campus Navigator (2-Column Asymmetric Row) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Credit Card Fraud Detection ML Pipeline */}
            {fraudProject && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <SpotlightCard
                  className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
                  spotlightColor="rgba(14, 165, 233, 0.08)"
                  tilt={true}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full font-medium">
                        Machine Learning &bull; Scikit-Learn
                      </span>
                      <span className="text-xs font-mono text-slate-500 tabular-nums">ROC-AUC: 0.984</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-950">
                      {fraudProject.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                      {fraudProject.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {fraudProject.metrics.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center hover:bg-slate-100/70 transition-colors">
                          <div className="text-[10px] font-mono text-slate-400">{m.label}</div>
                          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5 tabular-nums">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                    <MagneticButton distance={0.25}>
                      <a
                        href={fraudProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>ML Pipeline</span>
                      </a>
                    </MagneticButton>

                    <button
                      onClick={() => setSelectedProject(fraudProject)}
                      className="text-xs text-sky-700 hover:text-sky-900 font-medium cursor-pointer ml-auto hover:underline transition-all"
                    >
                      Architecture &rarr;
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            )}

            {/* RAIT Campus Navigator */}
            {campusProject && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <SpotlightCard
                  className="p-6 sm:p-8 flex flex-col justify-between text-left h-full"
                  spotlightColor="rgba(16, 185, 129, 0.08)"
                  tilt={true}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                        DAA Graph Engine &bull; RAIT
                      </span>
                      <span className="text-xs font-mono text-slate-500">Heuristics: Euclidean A*</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-950">
                      {campusProject.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                      {campusProject.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {campusProject.metrics.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center hover:bg-slate-100/70 transition-colors">
                          <div className="text-[10px] font-mono text-slate-400">{m.label}</div>
                          <div className="text-xs font-bold text-slate-900 font-mono mt-0.5 tabular-nums">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-6">
                    {campusProject.liveDemo && campusProject.liveDemo !== '#' && (
                      <MagneticButton distance={0.25}>
                        <a
                          href={campusProject.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Live App</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </MagneticButton>
                    )}

                    <MagneticButton distance={0.25}>
                      <a
                        href={campusProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    </MagneticButton>

                    <button
                      onClick={() => setSelectedProject(campusProject)}
                      className="text-xs text-sky-700 hover:text-sky-900 font-medium cursor-pointer ml-auto hover:underline transition-all"
                    >
                      Inspect Blueprint &rarr;
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Project Blueprint Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
