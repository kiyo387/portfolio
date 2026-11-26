import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useTweenedNumber(target: number, durationMs = 180): number {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    if (reducedMotion || durationMs <= 0) {
      currentRef.current = target;
      setValue(target);
      return;
    }

    const from = currentRef.current;
    if (Math.abs(target - from) < 1e-6) {
      currentRef.current = target;
      setValue(target);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (t < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        currentRef.current = target;
        setValue(target);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [target, durationMs, reducedMotion]);

  return reducedMotion ? target : value;
}
