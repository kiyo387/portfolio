import React, { useEffect } from 'react';
import { X, Download, Printer, ExternalLink, Mail, MapPin, GraduationCap, Briefcase, Award } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo, resumeData, projectsData } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (window.__lenis) {
        window.__lenis.stop();
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      if (window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden print:p-0 print:static"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity cursor-pointer print:hidden"
      />

      {/* Modal Container */}
      <div 
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-2xl z-10 max-h-[90vh] overflow-y-auto overscroll-contain no-scrollbar print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold tracking-wide">CURRICULUM VITAE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="pt-6 space-y-6 print:pt-0 text-slate-700 print:text-black">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 print:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-950 print:text-black tracking-tight">
                  {personalInfo.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 print:text-slate-700 mt-0.5 font-medium">
                  B.Tech in Computer Science and Engineering (AIML) &bull; RAIT Navi Mumbai
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500 print:text-slate-600 space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Navi Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5 flex-wrap">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${personalInfo.personalEmail}`} className="hover:underline text-slate-700">
                    {personalInfo.personalEmail}
                  </a>
                  <span className="text-slate-300">&bull;</span>
                  <a href={`mailto:${personalInfo.institutionalEmail}`} className="hover:underline text-slate-500 text-[11px]">
                    {personalInfo.institutionalEmail}
                  </a>
                </div>
                <div className="flex items-center sm:justify-end gap-2 pt-0.5">
                  <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                    github.com/{personalInfo.githubUsername}
                  </a>
                  <span>&bull;</span>
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div>
            <h2 className="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold mb-2">
              Profile Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              {resumeData.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold mb-3">
              Education
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm font-semibold text-slate-950">
                  Ramrao Adik Institute of Technology (RAIT), D.Y. Patil University
                </h3>
                <span className="text-xs font-mono text-sky-700 font-medium">
                  2025 – 2029
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Bachelor of Technology in Computer Science and Engineering (AIML) &bull; Navi Mumbai, India
              </div>
              <p className="text-xs text-slate-600 pt-1.5 leading-relaxed">
                Current: 2nd Year (Semester III). Coursework: Artificial Intelligence, Machine Learning Foundations, Data Structures &amp; Algorithms (DAA), Object-Oriented Programming in Java, Database Management Systems, Operating Systems.
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold mb-3">
              Technical Proficiencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {resumeData.skillsList.map((group, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-mono text-slate-950 font-bold">
                    {group.category}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {group.items}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2 className="text-xs font-mono text-slate-800 uppercase tracking-wider font-bold mb-3">
              Selected Projects
            </h2>
            <div className="space-y-3">
              {projectsData.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-semibold text-slate-950">
                      {proj.title}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">
                      {proj.techStack.join(' • ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {proj.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 font-mono print:hidden">
          Official Portfolio Document &bull; Shreyas Jayesh Bhavsar
        </div>
      </div>
    </div>
  );
}
