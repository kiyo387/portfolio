import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, FileText, ExternalLink, Orbit } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { personalInfo } from '../data/portfolioData';
import MagneticButton from './MagneticButton';

export default function FloatingNav({ onOpenResume }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLockedRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const safetyTimerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 20);

      // If user clicked a nav link, preserve the target pill until smooth scroll completes
      if (isLockedRef.current) {
        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = setTimeout(() => {
          isLockedRef.current = null;
        }, 180);
        ticking = false;
        return;
      }

      // Check if user has scrolled near bottom of page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection('contact');
        ticking = false;
        return;
      }

      // If in upper hero area, deactivate pill smoothly
      if (window.scrollY < 320) {
        setActiveSection('hero');
        ticking = false;
        return;
      }

      // Mid-viewport anchor line (35% from top of screen)
      const anchorY = window.innerHeight * 0.35;
      const sectionIds = ['projects', 'skills', 'timeline', 'contact'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= anchorY && rect.bottom > anchorY) {
            setActiveSection(id);
            break;
          }
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    const handleScrollEnd = () => {
      if (isLockedRef.current) {
        isLockedRef.current = null;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  const handleNavClick = (e, sectionId) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setActiveSection(sectionId);
    isLockedRef.current = sectionId;

    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);

    if (window.__lenis) {
      if (sectionId === 'hero') {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          window.__lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
        }
      }
    } else {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetEl = document.getElementById(sectionId);
        if (targetEl) {
          const y = targetEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }

    // Safety timeout: unlock after 2800ms maximum
    safetyTimerRef.current = setTimeout(() => {
      isLockedRef.current = null;
    }, 2800);
  };

  const navLinks = [
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Timeline', href: '#timeline', id: 'timeline' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4 pointer-events-none">
      <div className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 px-4 py-2.5 rounded-full transition-all duration-300 ${
        isScrolled 
          ? 'glass-pill shadow-lg shadow-slate-900/5' 
          : 'bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm'
      }`}>
        {/* Brand */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, 'hero')}
          className="flex items-center gap-2.5 group select-none pr-1"
        >
          <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold font-heading text-slate-950 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              {personalInfo.preferredName}
            </span>
            <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5">
              RAIT &apos;29
            </span>
          </div>
        </a>

        {/* Desktop Links with Smooth Sliding Indicator */}
        <nav className="hidden md:flex items-center gap-1 text-xs relative">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative px-3.5 py-1.5 rounded-full font-medium transition-colors duration-200 select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-slate-950 shadow-xs z-0"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 34,
                      mass: 0.85,
                    }}
                  />
                )}
                <span className="relative z-10 block transition-colors duration-200">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <MagneticButton distance={0.3} className="hidden sm:inline-flex">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors inline-flex"
              aria-label="GitHub Profile"
              title="GitHub (kiyo387)"
            >
              <Github className="w-4 h-4" />
            </a>
          </MagneticButton>

          <MagneticButton distance={0.3} className="hidden sm:inline-flex">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors inline-flex"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </MagneticButton>

          <MagneticButton distance={0.25}>
            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden xs:inline">CV</span>
            </button>
          </MagneticButton>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100 md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="pointer-events-auto fixed inset-0 bg-slate-950/25 backdrop-blur-xs md:hidden z-40 transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-5 shadow-2xl md:hidden z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Navigation Index</span>
            <span className="text-[10px] text-slate-400 font-mono">RAIT &apos;29</span>
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link.id);
                }}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100 hover:text-slate-950 active:bg-slate-200 transition-colors text-left"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-slate-950 font-medium">
                GitHub
              </a>
              <span>&bull;</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-950 font-medium">
                LinkedIn
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="px-3 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 font-medium hover:bg-sky-100 cursor-pointer"
            >
              Curriculum Vitae
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
