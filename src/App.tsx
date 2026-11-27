import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { BeforeAfterStage } from './components/BeforeAfterStage';
import { CommandPalette } from './components/CommandPalette';
import { ContactSection } from './components/ContactSection';
import { CredentialsLedger } from './components/CredentialsLedger';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { Navbar } from './components/Navbar';
import { PrinciplesSection } from './components/PrinciplesSection';
import { ScrollManifesto } from './components/ScrollManifesto';
import { SkillPipeline } from './components/SkillPipeline';
import { SystemsSection, type LabProjectId } from './components/SystemsSection';
import { PROFILE } from './data/resume';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeLabId, setActiveLabId] = useState<LabProjectId>('traffic-cv');
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion || paletteOpen || contactOpen) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, paletteOpen, contactOpen]);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [contactOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      let scrollTargetId = sectionId;
      if (sectionId === 'contact') {
        setContactOpen(true);
        return;
      }
      if (sectionId === 'traffic-architecture') {
        setActiveLabId('traffic-cv');
        scrollTargetId = 'systems';
      } else if (sectionId === 'fraud-workbench') {
        setActiveLabId('fraud-api');
        scrollTargetId = 'systems';
      } else if (sectionId === 'sat-retrieval') {
        setActiveLabId('isro-satretrieval');
        scrollTargetId = 'systems';
      }

      const target = document.getElementById(scrollTargetId);
      if (!target) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(target, { offset: -64 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--accent-ink)]"
      >
        Skip to content
      </a>

      <Navbar
        onOpenPalette={() => setPaletteOpen(true)}
        onNavigate={handleNavigate}
      />

      <main id="main-content">
        <Hero onExploreSystems={() => handleNavigate('systems')} />

        {/* Elevated #151515 rounded sheet with subtle crimson top rim glow */}
        <div className="relative rounded-t-[40px] border-t border-[var(--border-subtle)] bg-[var(--bg-sheet)] md:rounded-t-[72px]">
          <div
            aria-hidden="true"
            className="honey-rim-glow pointer-events-none absolute inset-x-0 top-0 h-48 rounded-t-[40px] md:rounded-t-[72px]"
          />

          <ScrollManifesto onExploreLabs={() => handleNavigate('systems')} />
          <MetricsBar />
          <BeforeAfterStage />
          <SystemsSection activeLabId={activeLabId} onSelectLab={setActiveLabId} />
          <PrinciplesSection />
          <SkillPipeline onNavigate={handleNavigate} />
          <CredentialsLedger />
          <ContactSection
            open={contactOpen}
            onOpen={() => setContactOpen(true)}
            onClose={() => setContactOpen(false)}
          />
        </div>
      </main>

      {/* Monumental 100vw cropped wordmark footer */}
      <footer className="overflow-hidden bg-[#000000] pt-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-6 font-mono text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © 2026 {PROFILE.name} · {PROFILE.role} · {PROFILE.location}
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors duration-150 hover:text-white"
            >
              LINKEDIN
            </a>
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors duration-150 hover:text-white"
            >
              GITHUB
            </a>
            <span className="tabular-nums">CTRL+K</span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="w-full translate-y-[8%] select-none text-center font-sans text-[21.5vw] font-semibold leading-[0.76] tracking-[-0.06em] text-white"
        >
          shreyas
        </div>
      </footer>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
