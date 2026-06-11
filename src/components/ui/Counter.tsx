'use client';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Count-up number that animates once when scrolled into view. */
export function Counter({ target, suffix = '', duration = 1.6, className, style }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reducedMotion = useReducedMotion();
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      value.set(target);
      return;
    }
    const controls = animate(value, target, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reducedMotion, target, duration, value]);

  return (
    <span ref={ref} className={className} style={style}>
      <motion.span className="tabular-nums">{rounded}</motion.span>
      {suffix}
    </span>
  );
}
