import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, Network, Binary, ShieldCheck } from 'lucide-react';
import { skillsData } from '../data/portfolioData';
import SpotlightCard from './SpotlightCard';

export default function TechnicalSkills() {
  const [activeDomain, setActiveDomain] = useState('all');

  const categories = skillsData.categories;
  const filtered = activeDomain === 'all'
    ? categories
    : categories.filter((c) => c.id === activeDomain);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Header & Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5 text-sky-600" />
              <span>Skills &amp; Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-950 tracking-tight text-balance">
              Technical Skills.
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed text-pretty">
              Mathematical modeling, low-level memory mechanics, and reactive web interfaces cultivated through coursework and production builds at RAIT Navi Mumbai.
            </p>
          </div>

          {/* Filter Pills with Spring Indicator */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl sm:rounded-full bg-white border border-slate-200 text-xs shadow-2xs self-start md:self-auto relative w-full sm:w-auto">
            <button
              onClick={() => setActiveDomain('all')}
              className={`relative px-3 py-1.5 rounded-full transition-colors cursor-pointer font-medium select-none ${
                activeDomain === 'all'
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {activeDomain === 'all' && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-slate-950 shadow-xs z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">All Domains</span>
            </button>

            {categories.map((cat) => {
              const isActive = activeDomain === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveDomain(cat.id)}
                  className={`relative px-3.5 py-1.5 rounded-full transition-colors cursor-pointer font-medium select-none ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full bg-slate-950 shadow-xs z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.title.split(',')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((category) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <SpotlightCard
                  className="p-4 sm:p-8 text-left flex flex-col justify-between h-full"
                  spotlightColor="rgba(2, 132, 199, 0.07)"
                  tilt={true}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-950">
                        {category.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {category.skills.length} Capabilities
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 mb-6 text-pretty">
                      {category.description}
                    </p>

                    {/* Skill Nodes */}
                    <div className="space-y-2.5">
                      {category.skills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/80 hover:translate-x-0.5 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 font-mono">
                              {skill.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed text-pretty">
                            {skill.context}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
