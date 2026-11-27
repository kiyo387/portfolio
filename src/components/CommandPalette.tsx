import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Copy,
  Download,
  Github,
  Linkedin,
  Search,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/resume';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

interface CommandItem {
  id: string;
  group: 'Navigation' | 'Actions';
  label: string;
  hint: string;
  keywords: string;
  icon: ReactNode;
  run: () => void;
}

function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text).catch(() => {});
  }
}

function triggerResumeDownload() {
  const link = document.createElement('a');
  link.href = PROFILE.resumeUrl;
  link.download = 'Shreyas_Bhavsar_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: CommandPaletteProps) {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo<CommandItem[]>(() => {
    const nav = (id: string, label: string, hint: string, keywords: string): CommandItem => ({
      id: `nav-${id}`,
      group: 'Navigation',
      label,
      hint,
      keywords,
      icon: <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />,
      run: () => {
        onNavigate(id);
        onClose();
      },
    });

    return [
      nav('hero', 'Vision Calibration Lab', '#hero', 'home hero yolov8 traffic vision'),
      nav('systems', 'Systems & Architecture', '#systems', 'projects systems yolov8'),
      nav('fraud-workbench', 'Fraud Scoring Workbench', '#fraud-workbench', 'fastapi xgboost threshold pr-auc'),
      nav('sat-retrieval', 'ISRO SatRetrieval Lab', '#sat-retrieval', 'sar optical faiss croma satellite'),
      nav('pipeline', 'ML Skill Pipeline', '#pipeline', 'skills python pytorch docker'),
      nav('credentials', 'Education & Kaggle', '#credentials', 'rait cgpa kaggle certifications'),
      nav('contact', 'Contact & Resume', '#contact', 'email linkedin github contact'),
      {
        id: 'action-resume',
        group: 'Actions',
        label: 'Download resume',
        hint: 'PDF',
        keywords: 'cv pdf resume download shreyas',
        icon: <Download size={16} strokeWidth={1.5} aria-hidden="true" />,
        run: () => {
          triggerResumeDownload();
          onClose();
        },
      },
      {
        id: 'action-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: PROFILE.email,
        keywords: 'mail email copy address',
        icon: <Copy size={16} strokeWidth={1.5} aria-hidden="true" />,
        run: () => {
          copyText(PROFILE.email);
          onClose();
        },
      },
      {
        id: 'action-linkedin',
        group: 'Actions',
        label: 'Open LinkedIn profile',
        hint: 'linkedin.com',
        keywords: 'linkedin social profile network shreyas',
        icon: <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" />,
        run: () => {
          window.open(PROFILE.linkedinUrl, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
      {
        id: 'action-github',
        group: 'Actions',
        label: 'Open GitHub profile',
        hint: 'github.com/kiyo387',
        keywords: 'github code repositories profile kiyo387',
        icon: <Github size={16} strokeWidth={1.5} aria-hidden="true" />,
        run: () => {
          window.open(PROFILE.githubUrl, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ];
  }, [onClose, onNavigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Save prior focus on open, focus search input, and restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();

    return () => {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      if (prev && typeof prev.focus === 'function') {
        prev.focus();
      }
    };
  }, [isOpen]);

  // Clamp activeIndex when filtered list shrinks
  useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(Math.max(0, filtered.length - 1));
    }
  }, [activeIndex, filtered.length]);

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
      return;
    }

    if (event.key === 'Enter') {
      const target = filtered[activeIndex];
      if (target) {
        event.preventDefault();
        target.run();
      }
      return;
    }

    if (event.key === 'Tab' && dialogRef.current) {
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const navItems = filtered.filter((item) => item.group === 'Navigation');
  const actionItems = filtered.filter((item) => item.group === 'Actions');

  const renderGroup = (title: string, items: CommandItem[], indexOffset: number) => {
    if (items.length === 0) return null;
    return (
      <div className="py-1.5">
        <div className="px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">{title}</div>
        <div className="mt-0.5 space-y-0.5">
          {items.map((item, localIdx) => {
            const idx = indexOffset + localIdx;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                id={`cmd-option-${item.id}`}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => item.run()}
                className={`relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-100 active:scale-[0.97] ${
                  isActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive &&
                  (reducedMotion ? (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                    />
                  ) : (
                    <motion.div
                      layoutId="cmd-active-row"
                      aria-hidden="true"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)]"
                    />
                  ))}

                <span className="relative z-10 flex min-w-0 items-center gap-2.5">
                  <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}>
                    {item.icon}
                  </span>
                  <span className="truncate font-medium">{item.label}</span>
                </span>

                <span className="relative z-10 shrink-0 font-mono text-xs text-[var(--text-muted)]">
                  {item.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const activeOptionId = filtered[activeIndex] ? `cmd-option-${filtered[activeIndex].id}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={handleKeyDown}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
          <Search size={16} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
          <label htmlFor="command-search" className="sr-only">
            Search commands
          </label>
          <input
            ref={inputRef}
            id="command-search"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-listbox"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            placeholder="Type a section or action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command menu"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-[0.97]"
          >
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div
          id="command-listbox"
          role="listbox"
          aria-label="Commands"
          className="max-h-[60vh] overflow-y-auto px-2 py-2"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No matching commands for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {renderGroup('Navigation', navItems, 0)}
              {renderGroup('Actions', actionItems, navItems.length)}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-2 font-mono text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span>Up/Down navigate</span>
            <span>Enter select</span>
          </div>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
