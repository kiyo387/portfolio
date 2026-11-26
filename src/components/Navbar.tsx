import { useEffect, useState } from 'react';
import { Download, Github, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'systems', label: 'Systems' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
] as const;

type NavSectionId = (typeof NAV_LINKS)[number]['id'];

export function Navbar({ theme, onToggleTheme, onOpenPalette, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const visibleRatios = new Map<NavSectionId, number>();

    const updateActive = () => {
      if (window.scrollY < 240) {
        setActiveSection(null);
        return;
      }
      let bestId: NavSectionId | null = null;
      let bestRatio = 0;
      for (const link of NAV_LINKS) {
        const ratio = visibleRatios.get(link.id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = link.id;
        }
      }
      if (bestId) {
        setActiveSection(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as NavSectionId;
          visibleRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        updateActive();
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (window.scrollY < 240) setActiveSection(null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="flex items-center gap-2.5 rounded-lg py-1.5 pr-2 text-sm font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-150 hover:text-[var(--accent)]"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs font-medium text-[var(--accent)]">
            {PROFILE.monogram}
          </span>
          <span>{PROFILE.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                  handleLinkClick(item.id);
                }}
                className={`relative rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? 'font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    aria-hidden="true"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 450, damping: 34 }
                    }
                    className="absolute inset-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command menu (Ctrl+K)"
            className="hidden h-9 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97] sm:inline-flex"
          >
            <Search size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>Commands</span>
            <kbd className="rounded border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
              Ctrl K
            </kbd>
          </button>

          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97] md:inline-flex"
          >
            <Github size={16} strokeWidth={1.5} aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to daylight theme' : 'Switch to dark theme'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97]"
          >
            {theme === 'dark' ? (
              <Sun size={16} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Moon size={16} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>

          <a
            href={PROFILE.resumeUrl}
            download="Shreyas_Bhavsar_Resume.pdf"
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-[var(--accent)] px-3.5 text-sm font-medium text-[var(--accent-ink)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-hover)] active:scale-[0.97] sm:inline-flex"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Download resume</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out active:scale-[0.97] md:hidden"
          >
            {mobileOpen ? (
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={16} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`flex h-11 items-center rounded-lg px-3 text-sm transition-colors duration-150 hover:bg-[var(--bg-surface)] ${
                  activeSection === item.id
                    ? 'font-medium text-[var(--accent)]'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenPalette();
                }}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)]"
              >
                <Search size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>Commands</span>
              </button>
              <a
                href={PROFILE.resumeUrl}
                download="Shreyas_Bhavsar_Resume.pdf"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--accent)] px-3 text-sm font-medium text-[var(--accent-ink)]"
              >
                <Download size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>Download resume</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
