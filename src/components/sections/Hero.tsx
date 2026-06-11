'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTransparentImage } from '@/lib/useTransparentImage';

/* lazy, client-only — never blocks first paint */
const DanceParticles = dynamic(() => import('@/components/three/DanceParticles'), { ssr: false });

/* ── events ──────────────────────────────────────────────────── */
const EVENTS = [
  {
    title: 'Paris',
    sub: 'Event · 2025',
    video: '/top-events/event1.mp4',
    logoSrc: '/logo/Detalii basarabs6.png',
    accent: '#d42b3a',
  },
  {
    title: 'Madisson Park',
    sub: 'Event · 2026',
    video: '/top-events/event2.mov',
    logoSrc: '/logo/Detalii basarabs4.png',
    accent: '#c9a227',
  },
  {
    title: 'Balti',
    sub: 'Event · 2026',
    video: '/top-events/event3.mov',
    logoSrc: '/logo/Detalii basarabs2.png',
    accent: '#c06080',
  },
];

const AUTO_MS = 20000;

/* ── FlyingLogo — arcs across the screen on event change ─────── */
interface FlyingLogoProps {
  src: string;
  trigger: number; // increment to re-fire
  fromSide: 'left' | 'right';
  accent: string;
  /** smaller echo ornament on the opposite diagonal */
  secondary?: boolean;
}

function FlyingLogo({ src, trigger, fromSide, accent, secondary = false }: FlyingLogoProps) {
  const url = useTransparentImage(src);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setKey((k) => k + 1);
  }, [trigger]);

  if (!url || trigger === 0) return null;

  const startX = fromSide === 'left' ? '-30vw' : '130vw';
  const endX = fromSide === 'left' ? '130vw' : '-30vw';
  const midX = '50vw';
  const yArc = secondary ? ['0%', '12vh', '-9vh'] : ['0%', '-12vh', '10vh'];
  const peakOpacity = secondary ? 0.5 : 0.9;
  const baseDelay = secondary ? 0.2 : 0;
  /* [extra delay, opacity factor] — ghost copies form a comet trail */
  const copies: Array<[number, number]> = secondary ? [[0, 1]] : [[0, 1], [0.12, 0.4], [0.24, 0.18]];

  return (
    <>
      {copies.map(([extraDelay, opacityFactor], i) => (
        <motion.div
          key={`${key}-${i}`}
          className="absolute pointer-events-none select-none z-30"
          style={{
            top: secondary ? '58%' : '42%',
            left: 0,
            width: secondary ? 'clamp(90px, 10vw, 150px)' : 'clamp(160px, 22vw, 300px)',
            aspectRatio: '1 / 1',
            transformPerspective: 900,
          }}
          initial={{ x: startX, y: 0, rotateY: fromSide === 'left' ? -80 : 80, rotateZ: fromSide === 'left' ? -25 : 25, scale: 0.3, opacity: 0 }}
          animate={{
            x: [startX, midX, endX],
            y: yArc,
            rotateY: [fromSide === 'left' ? -80 : 80, 0, fromSide === 'left' ? 80 : -80],
            rotateZ: [fromSide === 'left' ? -25 : 25, 0, fromSide === 'left' ? 20 : -20],
            rotateX: [-30, 15, -10],
            scale: [0.3, secondary ? 1 : 1.5, 0.4],
            opacity: [0, peakOpacity * opacityFactor, 0],
          }}
          transition={{ duration: 1.8, delay: baseDelay + extraDelay, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter: i === 0
                ? `drop-shadow(0 0 34px ${accent}aa) drop-shadow(0 0 90px ${accent}44) drop-shadow(0 12px 32px rgba(0,0,0,0.7))`
                : `drop-shadow(0 0 22px ${accent}66)`,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

/* ── Diamond ornament ────────────────────────────────────────── */
function Diamond({ size = 5, color = '#c9a227' }: { size?: number; color?: string }) {
  return (
    <span
      className="inline-block rotate-45 flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

/* ── Progress bar for auto-advance ──────────────────────────── */
function ProgressBar({ duration, active, accent }: { duration: number; active: boolean; accent: string }) {
  return (
    <div className="h-px w-full bg-white/10 relative overflow-hidden">
      {active && (
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ backgroundColor: accent }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
}

/* ── main component ──────────────────────────────────────────── */
export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [fromSide, setFromSide] = useState<'left' | 'right'>('right');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ornament particles only on desktop and without reduced-motion */
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const update = () => setShowParticles(desktop.matches && motionOk.matches);
    update();
    desktop.addEventListener('change', update);
    motionOk.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      motionOk.removeEventListener('change', update);
    };
  }, []);

  const goTo = useCallback((next: number, side: 'left' | 'right') => {
    if (next === idx) return;
    // fade to dark
    setOverlayOpacity(1);
    setTimeout(() => {
      setIdx(next);
      setVideoKey((k) => k + 1);
      setFromSide(side);
      setFlyTrigger((t) => t + 1);
      // fade back
      setTimeout(() => setOverlayOpacity(0), 120);
    }, 320);
  }, [idx]);

  /* auto-advance */
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const next = (idx + 1) % EVENTS.length;
      goTo(next, 'right');
    }, AUTO_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [idx, goTo]);

  const ev = EVENTS[idx];

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-brand-bg flex flex-col"
    >
      {/* ── Video background ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video
            key={videoKey}
            src={ev.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </div>

      {/* Fade-to-black overlay for transitions */}
      <div
        className="absolute inset-0 z-10 bg-[#060606] pointer-events-none transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Permanent vignette layers */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060606] via-[#060606]/40 to-[#060606]/50 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,transparent_30%,#060606_100%)] pointer-events-none" />

      {/* Drifting ornament particles (Three.js) */}
      {showParticles && (
        <div className="absolute inset-0 z-[15] pointer-events-none opacity-50">
          <DanceParticles />
        </div>
      )}

      {/* ── Flying logos on transition ────────────────────────── */}
      <FlyingLogo
        src={ev.logoSrc}
        trigger={flyTrigger}
        fromSide={fromSide}
        accent={ev.accent}
      />
      <FlyingLogo
        src={EVENTS[(idx + 1) % EVENTS.length].logoSrc}
        trigger={flyTrigger}
        fromSide={fromSide === 'left' ? 'right' : 'left'}
        accent={ev.accent}
        secondary
      />

      {/* ── Editorial content ─────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-end pb-40 px-6 md:px-16 max-w-5xl mx-auto w-full">

        {/* Season tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <Diamond size={4} color="#c9a22788" />
          <span className="font-nav text-white/35 text-[0.58rem] tracking-[0.5em] uppercase">
            Basarab&apos;s Dance — Season 2025
          </span>
          <Diamond size={4} color="#c9a22788" />
        </motion.div>

        {/* Event sub-label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-nav text-white/30 text-[0.62rem] tracking-[0.45em] uppercase mb-4"
          >
            {ev.sub}
          </motion.p>
        </AnimatePresence>

        {/* Main event title */}
        <div className="overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${idx}`}
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-105%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-light text-white leading-[0.9]"
              style={{ fontSize: 'clamp(3.2rem, 10vw, 8rem)', letterSpacing: '-0.02em' }}
            >
              {ev.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Thin rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left h-px w-24 mb-8"
          style={{ backgroundColor: ev.accent + '66' }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="flex items-center gap-6"
        >
          <a href="#shows" className="group relative inline-flex items-center overflow-hidden">
            <span
              className="absolute inset-0 transition-all duration-500 group-hover:scale-x-[1.04] group-hover:scale-y-[1.12]"
              style={{ backgroundColor: ev.accent }}
            />
            <span className="relative font-nav px-8 py-3.5 text-black text-[0.62rem] tracking-[0.35em] uppercase font-semibold">
              Our Shows
            </span>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 font-nav text-white/35 text-[0.62rem] tracking-[0.35em] uppercase hover:text-white/70 transition-colors duration-400"
          >
            Discover
            <svg className="w-3.5 h-3.5 transition-transform duration-400 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ── Event navigation tabs ─────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent pointer-events-none" />

        <div className="relative grid grid-cols-3">
          {EVENTS.map((e, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                onClick={() => goTo(i, i > idx ? 'right' : 'left')}
                className="group flex flex-col justify-end pt-5 pb-6 px-5 md:px-8 text-left relative overflow-hidden transition-colors duration-300"
                style={{ borderTop: `1px solid ${active ? e.accent + '55' : 'rgba(255,255,255,0.07)'}` }}
              >
                <ProgressBar duration={AUTO_MS} active={active} accent={e.accent} />

                <p
                  className="mt-3 font-display font-light leading-tight transition-opacity duration-300"
                  style={{
                    fontSize: 'clamp(0.95rem, 2.2vw, 1.35rem)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {e.title}
                </p>

                <p
                  className="mt-1 font-nav text-[0.55rem] tracking-[0.4em] uppercase transition-opacity duration-300"
                  style={{ color: active ? e.accent : 'rgba(255,255,255,0.18)' }}
                >
                  {e.sub.split('·')[0].trim()}
                </p>

                {/* Active indicator dot */}
                {active && (
                  <motion.span
                    layoutId="tab-dot"
                    className="absolute right-5 top-5 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: e.accent }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-px h-14 relative overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }}
          />
          <div className="absolute inset-0 bg-white/5" />
        </div>
        <span
          className="font-nav text-[0.48rem] tracking-[0.5em] uppercase"
          style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.2)' }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
