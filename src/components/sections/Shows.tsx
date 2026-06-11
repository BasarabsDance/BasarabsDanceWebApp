'use client';
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTransparentImage } from '@/lib/useTransparentImage';

interface Show {
  id: string;
  anchor: string;
  title: string;
  category: string;
  video: string;
  accentColor: string;
  ornament: string;
}

const SHOWS: Show[] = [
  {
    id: 'one-heart',
    anchor: 'show-one-heart',
    title: 'One Heart',
    category: 'Contemporary',
    video: '/videos/One%20Heart.MOV',
    accentColor: '#c9a227',
    ornament: '/logo/Detalii basarabs6.png',
  },
  {
    id: 'welcome-on-board',
    anchor: 'show-welcome-on-board',
    title: 'Welcome on Board',
    category: 'Modern',
    video: '/videos/Welcome%20on%20Board.MOV',
    accentColor: '#1b7fa0',
    ornament: '/logo/Detalii basarabs5.png',
  },
  {
    id: 'afro-roots',
    anchor: 'show-afro-roots',
    title: 'Afro Roots',
    category: 'Afro Fusion',
    video: '/videos/Afro%20Roots.mov',
    accentColor: '#c06080',
    ornament: '/logo/Detalii basarabs2.png',
  },
  {
    id: 'derniere-dance',
    anchor: 'show-derniere-dance',
    title: 'Dernière Dance',
    category: 'French Cabaret',
    video: '/videos/Show%20Francez.mov',
    accentColor: '#d42b3a',
    ornament: '/logo/Detalii basarabs7.png',
  },
];

/* ── one horizontal panel ────────────────────────────────────── */
function ShowPanel({ show, index, playing }: { show: Show; index: number; playing: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ornamentUrl = useTransparentImage(show.ornament);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  return (
    <article
      id={show.anchor}
      className="relative flex h-screen w-[88vw] md:w-[74vw] flex-shrink-0 items-center justify-center gap-10 md:gap-16 px-[4vw]"
    >
      {/* Text block */}
      <div className="relative z-10 max-w-xs">
        {/* Giant outlined number */}
        <span
          aria-hidden
          className="font-nav block leading-none select-none"
          style={{
            fontSize: 'clamp(5rem, 11vw, 11rem)',
            color: 'transparent',
            WebkitTextStroke: `1px ${show.accentColor}77`,
          }}
        >
          0{index + 1}
        </span>

        <p
          className="font-nav text-[0.62rem] tracking-[0.42em] uppercase mt-4 mb-3"
          style={{ color: show.accentColor }}
        >
          {show.category}
        </p>

        <h3
          className="font-display font-light text-white leading-[1.02]"
          style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}
        >
          {show.title}
        </h3>

        <div className="mt-5 h-px w-16" style={{ backgroundColor: `${show.accentColor}66` }} />
      </div>

      {/* Portrait video card */}
      <div className="group relative h-[62vh] md:h-[70vh] aspect-[3/4] flex-shrink-0 overflow-hidden bg-brand-surface">
        <video
          ref={videoRef}
          src={show.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `linear-gradient(to top, #060606cc 0%, transparent 45%), linear-gradient(120deg, ${show.accentColor}14, transparent 50%)`,
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2" style={{ borderColor: `${show.accentColor}aa` }} />
        <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2" style={{ borderColor: `${show.accentColor}aa` }} />

        {/* Slowly turning ornament badge */}
        {ornamentUrl && (
          <motion.img
            src={ornamentUrl}
            alt=""
            className="absolute bottom-5 right-5 w-16 h-16 object-contain opacity-60 pointer-events-none select-none"
            style={{ filter: `drop-shadow(0 0 14px ${show.accentColor}66)` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </article>
  );
}

/* ── mobile / reduced-motion fallback card ───────────────────── */
function MobileShowCard({ show, index }: { show: Show; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.55 });
  const appeared = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  return (
    <motion.article
      ref={ref}
      id={show.anchor}
      initial={{ opacity: 0, y: 32 }}
      animate={appeared ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-brand-surface"
    >
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <video
          ref={videoRef}
          src={show.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pt-12 pb-5">
          <p className="font-nav text-[0.58rem] tracking-[0.38em] uppercase mb-1" style={{ color: show.accentColor }}>
            {show.category}
          </p>
          <h3 className="font-display text-xl font-light text-white/90 leading-tight">{show.title}</h3>
        </div>
        <span
          aria-hidden
          className="font-nav absolute top-3 right-4 text-3xl leading-none select-none"
          style={{ color: 'transparent', WebkitTextStroke: `1px ${show.accentColor}88` }}
        >
          0{index + 1}
        </span>
      </div>
    </motion.article>
  );
}

/* ── section ─────────────────────────────────────────────────── */
export default function Shows() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const reducedMotion = useReducedMotion();
  const bgOrnamentUrl = useTransparentImage('/logo/Detalii basarabs4.png');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* horizontal distance the track must travel = track width − viewport */
  useEffect(() => {
    if (!isDesktop) return;
    const measure = () => {
      if (trackRef.current) {
        setShift(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isDesktop]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);
  /* background ornament drifts the opposite way for depth */
  const bgX = useTransform(scrollYProgress, [0, 1], ['-6vw', '26vw']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveIdx(Math.min(SHOWS.length - 1, Math.max(0, Math.floor(v * SHOWS.length))));
  });

  const pinned = isDesktop && !reducedMotion;

  if (!pinned) {
    return (
      <section id="shows" ref={sectionRef} className="relative bg-brand-bg py-28 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-nav text-crimson text-xs tracking-[0.4em] uppercase mb-3">Repertoire</p>
          <h2
            className="font-display text-white leading-tight mb-12"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
          >
            Our <span className="italic text-gold">Shows</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOWS.map((show, i) => (
              <MobileShowCard key={show.id} show={show} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    /* NOTE: no overflow-hidden on this section — it would break the sticky stage */
    <section id="shows" ref={sectionRef} className="relative bg-brand-bg" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Drifting background ornament */}
        {bgOrnamentUrl && (
          <motion.img
            src={bgOrnamentUrl}
            alt=""
            style={{ x: bgX }}
            className="absolute top-1/2 left-1/3 w-[34vw] -translate-y-1/2 opacity-[0.05] pointer-events-none select-none"
          />
        )}

        {/* Pinned header */}
        <div className="absolute top-20 left-6 md:left-16 z-20 pointer-events-none">
          <p className="font-nav text-crimson text-xs tracking-[0.4em] uppercase mb-2">Repertoire</p>
          <h2
            className="font-display text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', fontWeight: 300 }}
          >
            Our <span className="italic text-gold">Shows</span>
          </h2>
        </div>

        {/* Horizontal track */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex h-full items-stretch pl-[8vw] pr-[10vw]"
        >
          {SHOWS.map((show, i) => (
            <ShowPanel key={show.id} show={show} index={i} playing={activeIdx === i} />
          ))}
        </motion.div>

        {/* Stitched progress indicator */}
        <div className="absolute bottom-8 inset-x-0 z-20 flex items-center justify-center">
          {SHOWS.map((show, i) => (
            <div key={show.id} className="flex items-center">
              <span
                className="block h-2 w-2 rotate-45 transition-all duration-300"
                style={{
                  backgroundColor: activeIdx === i ? show.accentColor : 'rgba(255,255,255,0.18)',
                  transform: `rotate(45deg) scale(${activeIdx === i ? 1.35 : 1})`,
                  boxShadow: activeIdx === i ? `0 0 10px ${show.accentColor}99` : 'none',
                }}
              />
              {i < SHOWS.length - 1 && (
                <span className="mx-2 block h-px w-10 border-t border-dashed border-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
