import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';
import MagneticButton from './MagneticButton';

export default function EditorialHero({ onOpenResume }) {
  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">

        {/* Monumental Hero Headline Lockup */}
        <div className="pt-2 sm:pt-4 text-left max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl sm:rounded-full bg-slate-100/90 border border-slate-200 text-slate-700 text-[11px] sm:text-xs font-mono mb-4 shadow-2xs max-w-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="leading-snug">B.Tech CSE (AIML) &bull; RAIT Navi Mumbai</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-slate-950 tracking-tight leading-[1.08] sm:leading-[1.05] text-balance"
          >
            Shreyas Jayesh <br />
            <span className="text-onyx-gradient">Bhavsar.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg text-slate-600 max-w-2xl leading-relaxed mt-4 font-normal text-pretty"
          >
            19-year-old undergraduate at <strong className="text-slate-900 font-semibold">RAIT Navi Mumbai (Batch 2025–2029, Semester III)</strong>. An ML enthusiast who does vibe coding in his free time, engineering intelligent software across credit card fraud detection pipelines, shortest-path graph engines, and production web applications.
          </motion.p>

          {/* Primary Action CTAs & Profiles */}
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6 flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
            <MagneticButton distance={0.25} className="w-full sm:w-auto">
              <a
                href="#projects"
                onClick={(e) => {
                  if (window.__lenis) {
                    e.preventDefault();
                    const el = document.getElementById('projects');
                    if (el) window.__lenis.scrollTo(el, { offset: -70, duration: 1.2 });
                  }
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs group cursor-pointer w-full sm:w-auto"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </MagneticButton>

            <MagneticButton distance={0.25} className="w-full sm:w-auto">
              <button
                onClick={onOpenResume}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium transition-colors shadow-2xs cursor-pointer w-full sm:w-auto"
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Curriculum Vitae</span>
              </button>
            </MagneticButton>

            <div className="flex items-center gap-1.5 pt-1 sm:pt-0 sm:ml-2">
              <MagneticButton distance={0.35}>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors inline-flex"
                  aria-label="GitHub Profile"
                  title="GitHub Profile (kiyo387)"
                >
                  <Github className="w-4 h-4" />
                </a>
              </MagneticButton>

              <MagneticButton distance={0.35}>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors inline-flex"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Highlights Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-8 pt-8 border-t border-slate-200/80"
        >
          {personalInfo.highlights.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all text-left"
            >
              <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase tracking-wider truncate">
                {item.label}
              </div>
              <div className="text-xs sm:text-base font-bold text-slate-950 font-heading mt-0.5 sm:mt-1 tabular-nums">
                {item.value}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                {item.detail}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
