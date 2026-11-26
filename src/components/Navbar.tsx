import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { PROFILE } from '../data/resume';
import { RollingLabel } from './RollingLabel';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  onNavigate: (sectionId: string) => void;
}

const LEFT_LINKS = [
  { id: 'systems', label: 'LABS' },
  { id: 'pipeline', label: 'STACK' },
  { id: 'principles', label: 'PRINCIPLES' },
  { id: 'credentials', label: 'CREDENTIALS' },
] as const;

type NavSectionId = (typeof LEFT_LINKS)[number]['id'];

export function Navbar({ theme, onToggleTheme, onOpenPalette, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId | null>(null);

  useEffect(() => {
    const visibleRatios = new Map<NavSectionId, number>();

    const updateActive = () => {
      if (window.scrollY < 260) {
        setActiveSection(null);
        return;
      }
      let bestId: NavSectionId | null = null;
      let bestRatio = 0;
      for (const link of LEFT_LINKS) {
        const ratio = visibleRatios.get(link.id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = link.id;
        }
      }
      if (bestId) setActiveSection(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as NavSectionId;
          visibleRatios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        updateActive();
      },
      { rootMargin: '-20% 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );

    for (const link of LEFT_LINKS) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (window.scrollY < 260) setActiveSection(null);
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
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[var(--bg-base)]/90 via-[var(--bg-base)]/55 to-transparent backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        {/* Far Left: 2-line Swiss micro-lockup */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="group flex flex-col leading-tight transition-opacity duration-150 hover:opacity-80"
        >
          <span className="font-sans text-[11px] font-semibold tracking-tight text-[var(--text-primary)]">
            SHREYAS BHAVSAR
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            AI &amp; ML — © 2026
          </span>
        </a>

        {/* Center-Left Nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {LEFT_LINKS.map((item) => {
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
                className={`font-mono text-[11px] transition-colors duration-150 ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Center-Right Micro Links */}
        <div className="hidden items-center gap-5 font-mono text-[11px] lg:flex">
          <a
            href={PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            GITHUB
          </a>
          <a
            href={PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            LINKEDIN
          </a>
          <a
            href={PROFILE.resumeUrl}
            download="Shreyas_Bhavsar_Resume.pdf"
            className="text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            RESUME PDF
          </a>
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command menu (Ctrl+K)"
            className="text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            CTRL+K
          </button>
        </div>

        {/* Far Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to daylight theme' : 'Switch to dark theme'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97]"
          >
            {theme === 'dark' ? (
              <Sun size={14} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Moon size={14} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="group hidden h-8 items-center whitespace-nowrap rounded-[4px] bg-[var(--accent)] px-3 font-mono text-[11px] font-semibold text-[var(--accent-ink)] transition-[transform,background-color] duration-150 ease-out hover:bg-[var(--accent-hover)] active:scale-[0.97] sm:inline-flex"
          >
            <RollingLabel>GET IN TOUCH</RollingLabel>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-[transform,border-color] duration-150 ease-out active:scale-[0.97] md:hidden"
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
            {LEFT_LINKS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`flex h-10 items-center rounded-[4px] px-3 font-mono text-xs transition-colors duration-150 hover:bg-[var(--bg-surface)] ${
                  activeSection === item.id
                    ? 'font-medium text-[var(--accent)]'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenPalette();
                }}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 font-mono text-xs text-[var(--text-primary)]"
              >
                CTRL+K
              </button>
              <button
                type="button"
                onClick={() => handleLinkClick('contact')}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[4px] bg-[var(--accent)] px-3 font-mono text-xs font-semibold text-[var(--accent-ink)]"
              >
                GET IN TOUCH
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
