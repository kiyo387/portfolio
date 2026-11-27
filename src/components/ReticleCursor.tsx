import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

function getCursorTag(target: Element): string {
  const explicit = target.getAttribute('data-cursor');
  if (explicit) return explicit;
  if (target.matches('a[download]')) return 'PDF';
  if (target instanceof HTMLAnchorElement && target.target === '_blank') return 'OPEN';
  if (target.matches('a[href^="mailto:"]')) return 'MAIL';
  if (target.getAttribute('aria-label')?.toLowerCase().includes('copy')) return 'COPY';
  if (target.getAttribute('role') === 'tab') return 'LAB';
  return '';
}

export function ReticleCursor() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    let mx = -100;
    let my = -100;
    let lx = -100;
    let ly = -100;
    let visible = false;
    let hovering = false;
    let down = false;
    let tagText = '';
    let rafId = 0;

    const setVisibility = (show: boolean) => {
      visible = show;
      if (rootRef.current) {
        rootRef.current.style.opacity = show ? '1' : '0';
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        lx = mx;
        ly = my;
      }

      const el = e.target instanceof Element ? e.target : null;
      const inNativeOverlay = !!el?.closest('dialog[open], input, textarea, [contenteditable="true"]');
      if (inNativeOverlay) {
        setVisibility(false);
        return;
      }

      const interactive = el?.closest('a, button, [role="tab"], [role="button"], [data-cursor]') ?? null;
      hovering = !!interactive;
      tagText = interactive ? getCursorTag(interactive) : '';
      setVisibility(true);
    };

    const onPointerDown = () => {
      down = true;
    };
    const onPointerUp = () => {
      down = false;
    };
    const onPointerLeave = () => {
      setVisibility(false);
      hovering = false;
    };

    const tick = () => {
      lx += (mx - lx) * 0.22;
      ly += (my - ly) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (boxRef.current) {
        const size = hovering ? 38 : 24;
        const scale = down ? 0.82 : 1;
        boxRef.current.style.width = `${size}px`;
        boxRef.current.style.height = `${size}px`;
        boxRef.current.style.marginLeft = `${-size / 2}px`;
        boxRef.current.style.marginTop = `${-size / 2}px`;
        boxRef.current.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0) scale(${scale})`;
        boxRef.current.classList.toggle('is-hover', hovering);
      }
      if (tagRef.current) {
        if (tagRef.current.textContent !== tagText) {
          tagRef.current.textContent = tagText;
        }
        tagRef.current.style.opacity = hovering && tagText ? '1' : '0';
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      html.classList.remove('has-custom-cursor');
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-150"
    >
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -mt-[3px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-[var(--accent)] will-change-transform"
      />
      <div
        ref={boxRef}
        className="reticle-box fixed top-0 left-0 will-change-transform"
        style={{ width: 24, height: 24, marginLeft: -12, marginTop: -12 }}
      >
        <span className="reticle-corner reticle-tl" />
        <span className="reticle-corner reticle-tr" />
        <span className="reticle-corner reticle-bl" />
        <span className="reticle-corner reticle-br" />
        <span
          ref={tagRef}
          className="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-[2px] bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-black opacity-0 transition-opacity duration-150"
        />
      </div>
    </div>
  );
}
