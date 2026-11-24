import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { CommandPalette } from './components/CommandPalette';
import { ContactSection } from './components/ContactSection';
import { CredentialsLedger } from './components/CredentialsLedger';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { Navbar } from './components/Navbar';
import { SkillPipeline } from './components/SkillPipeline';
import { SystemsSection } from './components/SystemsSection';
import { PROFILE } from './data/resume';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('portfolio-theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (reducedMotion || paletteOpen) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
  }, [reducedMotion, paletteOpen]);

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

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(target, { offset: -72 });
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--accent-ink)]"
      >
        Skip to content
      </a>

      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
        onNavigate={handleNavigate}
      />

      <main id="main-content">
        <Hero onExploreSystems={() => handleNavigate('systems')} />
        <MetricsBar />
        <SystemsSection onNavigate={handleNavigate} />
        <SkillPipeline />
        <CredentialsLedger />
        <ContactSection />
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            {PROFILE.name} · {PROFILE.role} · {PROFILE.location}
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              LinkedIn
            </a>
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              GitHub
            </a>
            <span className="font-mono tabular-nums">Press Ctrl+K for command menu</span>
          </div>
        </div>
      </footer>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
