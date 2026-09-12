import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import UnifiedSpatialScene from './components/UnifiedSpatialScene';
import FloatingNav from './components/FloatingNav';
import EditorialHero from './components/EditorialHero';
import BespokeProjects from './components/BespokeProjects';
import TechnicalSkills from './components/TechnicalSkills';
import AcademicTimeline from './components/AcademicTimeline';
import ContactSection from './components/ContactSection';
import ResumeModal from './components/ResumeModal';
import SpecialCursor from './components/SpecialCursor';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    // Respect user's motion preferences or coarse pointer (mobile touchscreens)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 relative selection:bg-sky-100 selection:text-sky-900 antialiased font-sans">
      {/* Dynamic Special Cursor with Fluid Spring Physics */}
      <SpecialCursor />

      {/* 1. Continuous 3D Spatial WebGL Universe */}
      <UnifiedSpatialScene />

      {/* 2. Micro Ambient Coordinates Pattern & Subtle Noise Grain */}
      <div className="fixed inset-0 pearl-grid pearl-noise pointer-events-none opacity-50 z-0" />

      {/* 3. Main Application Flow */}
      <div className="relative z-10">
        <FloatingNav onOpenResume={() => setIsResumeOpen(true)} />

        <main>
          <EditorialHero onOpenResume={() => setIsResumeOpen(true)} />
          <BespokeProjects />
          <TechnicalSkills />
          <AcademicTimeline />
          <ContactSection />
        </main>
      </div>

      {/* 4. Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
