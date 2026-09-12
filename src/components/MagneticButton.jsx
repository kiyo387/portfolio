import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ 
  children, 
  className = '', 
  distance = 0.35, 
  springConfig = { damping: 15, stiffness: 150, mass: 0.1 },
  disabled = false,
  ...props 
}) {
  const ref = useRef(null);
  const [canAnimate, setCanAnimate] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // Disable on touch screens or if reduced motion is requested
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReduced) {
      setCanAnimate(false);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!canAnimate || disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((clientX - centerX) * distance);
    y.set((clientY - centerY) * distance);
  };

  const handleMouseLeave = () => {
    if (!canAnimate || disabled) return;
    x.set(0);
    y.set(0);
  };

  if (!canAnimate || disabled) {
    return (
      <div className={`inline-block ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
