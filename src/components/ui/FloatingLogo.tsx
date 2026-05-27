'use client';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ── canvas-based white-background removal ─────────────── */
function useTransparentImage(src: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 228 && d[i + 1] > 228 && d[i + 2] > 228) d[i + 3] = 0;
      }
      ctx.putImageData(id, 0, 0);
      setUrl(c.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);
  return url;
}

/* ── props ──────────────────────────────────────────────── */
interface FloatingLogoProps {
  src: string;
  size?: number;
  /** Tailwind absolute-positioning classes, e.g. "top-8 right-12" */
  position?: string;
  delay?: number;
  opacity?: number;
  /** Direction the element flies in from */
  from?: 'left' | 'right' | 'top' | 'bottom';
  /** px amplitude for the continuous float loop */
  floatRange?: number;
}

/* ── component ──────────────────────────────────────────── */
export function FloatingLogo({
  src,
  size = 90,
  position = 'top-8 right-8',
  delay = 0,
  opacity = 0.2,
  from = 'right',
  floatRange = 10,
}: FloatingLogoProps) {
  const url = useTransparentImage(src);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();
  const hasRun = useRef(false);

  const fromX = from === 'left' ? -280 : from === 'right' ? 280 : 0;
  const fromY = from === 'top' ? -200 : from === 'bottom' ? 200 : 0;
  const rotYStart = from === 'left' ? 70 : from === 'right' ? -70 : 30;

  useEffect(() => {
    if (!inView || !url || hasRun.current) return;
    hasRun.current = true;

    controls
      .start({
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 6,
        rotateZ: 0,
        scale: 1,
        opacity,
        transition: { duration: 1.35, delay, ease: [0.16, 1, 0.3, 1] },
      })
      .then(() => {
        controls.start({
          y: [-floatRange / 2, floatRange / 2, -floatRange / 2],
          rotateY: [6, -6, 6],
          rotateZ: [-3, 3, -3],
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        });
      });
  }, [inView, url, controls, delay, opacity, floatRange]);

  return (
    <motion.div
      ref={ref}
      className={`absolute pointer-events-none select-none ${position}`}
      style={{ width: size, height: size, transformPerspective: 700 }}
      initial={{
        x: fromX,
        y: fromY,
        rotateX: -50,
        rotateY: rotYStart,
        rotateZ: from === 'left' ? -22 : 22,
        scale: 0.25,
        opacity: 0,
      }}
      animate={controls}
    >
      {url && (
        <img
          src={url}
          alt=""
          className="w-full h-full object-contain"
          style={{
            filter:
              'drop-shadow(0 8px 24px rgba(0,0,0,0.7)) drop-shadow(0 0 14px rgba(201,162,39,0.12))',
          }}
        />
      )}
    </motion.div>
  );
}
