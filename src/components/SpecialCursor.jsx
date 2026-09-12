import React, { useEffect, useRef, useState } from 'react';

export default function SpecialCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Disable on touch screens / coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let speed = 0;
    let angle = 0;
    let targetHoverScale = 1;
    let currentHoverScale = 1;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check interactive target
      const target = e.target;
      const isInteractive = !!target.closest('a, button, input, textarea, [role="button"], .cursor-pointer, [data-cursor]');
      setIsHovered(isInteractive);
      targetHoverScale = isInteractive ? 1.75 : 1;
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let currentStretch = 0;

    // Synchronized RAF render loop with velocity deadband (zero angular jitter)
    const render = () => {
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      const dist = Math.hypot(dx, dy);

      // Subpixel settling when mouse is stationary to stop any micro-vibration
      if (dist < 0.08) {
        pos.x = mouse.x;
        pos.y = mouse.y;
        speed = 0;
      } else {
        pos.x += dx * 0.22;
        pos.y += dy * 0.22;
        speed = dist;
      }

      // Smooth hover scale interpolation
      currentHoverScale += (targetHoverScale - currentHoverScale) * 0.18;

      // Velocity deadband: Below 2.5px/frame, stay a pure circle with 0 stretch.
      // This mathematically eliminates angular spinning jitter when moving slowly!
      let targetStretch = 0;
      if (speed >= 2.5) {
        targetStretch = Math.min((speed - 2.5) * 0.016, 0.42);

        // Smooth shortest-path angular lerp
        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        angle += diff * 0.22;
      }

      currentStretch += (targetStretch - currentStretch) * 0.2;
      if (currentStretch < 0.002) currentStretch = 0;

      const clickScale = isClicked ? 0.82 : 1;
      const scaleX = (1 + currentStretch) * currentHoverScale * clickScale;
      const scaleY = (1 / (1 + currentStretch * 0.7)) * currentHoverScale * clickScale;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;
      }

      // Synchronize center pinpoint on the same RAF tick
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isClicked]);

  if (isTouchDevice) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ mixBlendMode: 'difference' }}
    >
      {/* 1. Fluid Liquid Jelly Reticle (Stretches with velocity & inverts colors) */}
      <div
        ref={cursorRef}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        className={`w-9 h-9 rounded-full bg-white transition-shadow duration-200 ${
          isHovered ? 'shadow-[0_0_20px_rgba(255,255,255,0.8)]' : ''
        }`}
      />

      {/* 2. Precision Center Pinpoint (Inverted Zero-Lag Point) */}
      <div
        ref={dotRef}
        style={{
          opacity: isVisible && !isHovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
        className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"
      />
    </div>
  );
}
