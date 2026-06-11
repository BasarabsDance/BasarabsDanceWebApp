'use client';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTransparentImage } from '@/lib/useTransparentImage';

/*
 * FolkThread — the site's signature "embroidery thread".
 * A dashed gold path that sews itself through the page as you scroll,
 * weaving between sections and activating a folk-ornament checkpoint
 * when it reaches each one.
 *
 * Rendered as an absolute overlay inside a position:relative wrapper
 * that contains the About → Footer sections (see src/app/page.tsx).
 */

interface CheckpointConfig {
  /** DOM id of the section this checkpoint belongs to */
  sectionId: string;
  src: string;
  accent: string;
  /** horizontal position, % of wrapper width */
  xPct: number;
  /** vertical anchor as a fraction of the section's height */
  anchorFrac: number;
  size: number;
}

const CHECKPOINTS: CheckpointConfig[] = [
  { sectionId: 'about', src: '/logo/Detalii basarabs2.png', accent: '#c9a227', xPct: 10, anchorFrac: 0.45, size: 84 },
  { sectionId: 'shows', src: '/logo/Detalii basarabs6.png', accent: '#d42b3a', xPct: 7, anchorFrac: 0.1, size: 92 },
  { sectionId: 'gallery', src: '/logo/Detalii basarabs5.png', accent: '#1b7fa0', xPct: 90, anchorFrac: 0.05, size: 88 },
  { sectionId: 'contact', src: '/logo/Detalii basarabs7.png', accent: '#c06080', xPct: 50, anchorFrac: 0.22, size: 76 },
];

/** extra waypoints between checkpoints so the thread weaves across the page */
const MID_X_PCT = [86, 45, 12];

interface Waypoint {
  x: number;
  y: number;
}

interface CheckpointGeo extends CheckpointConfig {
  x: number;
  y: number;
  threshold: number;
}

interface Geometry {
  d: string;
  width: number;
  height: number;
  checkpoints: CheckpointGeo[];
}

/** smooth vertical S-curve through the waypoints */
function buildPath(points: Waypoint[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const dy = (p1.y - p0.y) * 0.45;
    d += ` C ${p0.x.toFixed(1)} ${(p0.y + dy).toFixed(1)}, ${p1.x.toFixed(1)} ${(p1.y - dy).toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

/** scroll-progress at which the (mostly descending) path reaches a given y */
function thresholdForY(path: SVGPathElement, y: number): number {
  const total = path.getTotalLength();
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return Math.min(1, lo / total);
}

/* ── ornament checkpoint ─────────────────────────────────────── */
function Checkpoint({ cp, progress }: { cp: CheckpointGeo; progress: MotionValue<number> }) {
  const url = useTransparentImage(cp.src);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  useMotionValueEvent(progress, 'change', (v) => {
    if (v >= cp.threshold) setActive(true);
    else if (v < cp.threshold - 0.05) setActive(false);
  });

  const isOn = active || !!reducedMotion;
  if (!url) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: cp.x, top: cp.y, width: cp.size, height: cp.size }}
    >
      {/* pulse ring on activation */}
      <motion.span
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: cp.accent }}
        animate={isOn && !reducedMotion ? { scale: [0.55, 1.7], opacity: [0.7, 0] } : { opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
      <motion.img
        src={url}
        alt=""
        className="h-full w-full object-contain select-none"
        style={{
          filter: isOn
            ? `drop-shadow(0 0 16px ${cp.accent}aa) drop-shadow(0 0 42px ${cp.accent}44)`
            : 'none',
        }}
        animate={
          isOn
            ? { scale: 1, opacity: 0.95, rotate: 0 }
            : { scale: 0.45, opacity: 0.16, rotate: -25 }
        }
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      />
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
export function FolkThread() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  /* progress of the wrapper through the viewport drives the stitch */
  const { scrollYProgress } = useScroll({
    target: overlayRef,
    offset: ['start 0.8', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });

  /* needle tip follows the path */
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const tipOpacity = useMotionValue(0);

  useMotionValueEvent(smooth, 'change', (v) => {
    const path = measureRef.current;
    if (!path) return;
    const p = path.getPointAtLength(v * path.getTotalLength());
    tipX.set(p.x);
    tipY.set(p.y);
    tipOpacity.set(v > 0.005 && v < 0.995 ? 1 : 0);
  });

  /* measure sections + build the weaving path */
  useEffect(() => {
    const overlay = overlayRef.current;
    const wrapper = overlay?.parentElement;
    if (!overlay || !wrapper) return;

    const compute = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      if (!width || !height) return;
      const isMobile = window.innerWidth < 768;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;

      const cps: Array<Omit<CheckpointGeo, 'threshold'>> = [];
      for (const cp of CHECKPOINTS) {
        const el = document.getElementById(cp.sectionId);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY - wrapperTop;
        cps.push({
          ...cp,
          x: ((isMobile ? 12 : cp.xPct) / 100) * width,
          y: sectionTop + el.offsetHeight * cp.anchorFrac,
          size: isMobile ? cp.size * 0.6 : cp.size,
        });
      }
      if (cps.length === 0) return;

      /* waypoints: entry point → checkpoints with weaving midpoints → bottom tail */
      const points: Waypoint[] = [{ x: width * 0.5, y: 0 }];
      cps.forEach((cp, i) => {
        points.push({ x: cp.x, y: cp.y });
        if (i < cps.length - 1) {
          const midX = isMobile ? 18 : MID_X_PCT[i] ?? 50;
          points.push({ x: (midX / 100) * width, y: (cp.y + cps[i + 1].y) / 2 });
        }
      });
      points.push({ x: width * 0.5, y: height - 24 });

      const d = buildPath(points);

      /* thresholds need the real path geometry */
      const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tmp.setAttribute('d', d);
      const checkpoints: CheckpointGeo[] = cps.map((cp) => ({
        ...cp,
        threshold: thresholdForY(tmp, cp.y),
      }));

      setGeometry({ d, width, height, checkpoints });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  if (!geometry) {
    /* still render the scroll target so useScroll has a stable ref */
    return <div ref={overlayRef} className="absolute inset-0 pointer-events-none" aria-hidden />;
  }

  const { d, width, height, checkpoints } = geometry;

  return (
    <div ref={overlayRef} className="absolute inset-0 z-30 pointer-events-none" aria-hidden>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="folk-thread-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="45%" stopColor="#e8c16e" />
            <stop offset="75%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#d42b3a" />
          </linearGradient>
          {/* the mask draws on with scroll, revealing the dashed stitch below */}
          <mask id="folk-thread-mask">
            <motion.path
              d={d}
              fill="none"
              stroke="#fff"
              strokeWidth={14}
              strokeLinecap="round"
              style={reducedMotion ? undefined : { pathLength: smooth }}
              pathLength={reducedMotion ? undefined : 1}
            />
          </mask>
        </defs>

        {/* faint guide of the full route */}
        <path d={d} fill="none" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={1} strokeDasharray="2 9" />

        {/* the stitched thread */}
        <g mask={reducedMotion ? undefined : 'url(#folk-thread-mask)'} style={{ filter: 'drop-shadow(0 0 6px rgba(201,162,39,0.55))' }}>
          <path
            d={d}
            fill="none"
            stroke="url(#folk-thread-gradient)"
            strokeOpacity={0.65}
            strokeWidth={1.6}
            strokeDasharray="9 7"
          />
        </g>

        {/* hidden measuring path for tip + thresholds */}
        <path ref={measureRef} d={d} fill="none" stroke="none" />
      </svg>

      {/* needle tip — a small gold diamond travelling with the thread */}
      {!reducedMotion && (
        <motion.span
          className="absolute top-0 left-0 block"
          style={{ x: tipX, y: tipY, opacity: tipOpacity }}
        >
          <span
            className="block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold"
            style={{ boxShadow: '0 0 12px rgba(201,162,39,0.9), 0 0 30px rgba(201,162,39,0.45)' }}
          />
        </motion.span>
      )}

      {/* ornament checkpoints */}
      {checkpoints.map((cp) => (
        <Checkpoint key={cp.sectionId} cp={cp} progress={smooth} />
      ))}
    </div>
  );
}
