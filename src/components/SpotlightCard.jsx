import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(2, 132, 199, 0.08)', 
  tilt = true,
  maxTilt = 5,
  ...props 
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tiltStyle, setTiltStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [canTilt, setCanTilt] = useState(tilt);

  useEffect(() => {
    if (!tilt) {
      setCanTilt(false);
      return;
    }
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReduced) {
      setCanTilt(false);
    }
  }, [tilt]);

  const handleMouseMove = useCallback((e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });

    if (canTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`
      );
    }
  }, [canTilt, maxTilt]);

  const handleFocus = useCallback(() => setOpacity(1), []);
  const handleBlur = useCallback(() => setOpacity(0), []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
    if (canTilt) {
      setTiltStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    }
  }, [canTilt]);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: canTilt ? tiltStyle : undefined,
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: canTilt ? 'preserve-3d' : undefined,
      }}
      className={`relative rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_20px_45px_-8px_rgba(15,23,42,0.09)] ${className}`}
      {...props}
    >
      {/* Specular Radial Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* Dynamic Specular 3D Reflection Glare */}
      {canTilt && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: opacity * 0.45,
            background: `radial-gradient(circle 380px at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.45), transparent 70%)`,
          }}
        />
      )}

      {/* Hairline Glass Top Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
