'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface Show {
  id: string;
  anchor: string;
  title: string;
  category: string;
  video: string;
  accentColor: string;
}

const SHOWS: Show[] = [
  {
    id: 'one-heart',
    anchor: 'show-one-heart',
    title: 'One Heart',
    category: 'Contemporary',
    video: '/videos/One%20Heart.MOV',
    accentColor: '#c9a227',
  },
  {
    id: 'welcome-on-board',
    anchor: 'show-welcome-on-board',
    title: 'Welcome on Board',
    category: 'Modern',
    video: '/videos/Welcome%20on%20Board.MOV',
    accentColor: '#1b7fa0',
  },
  {
    id: 'afro-roots',
    anchor: 'show-afro-roots',
    title: 'Afro Roots',
    category: 'Afro Fusion',
    video: '/videos/Afro%20Roots.mov',
    accentColor: '#c06080',
  },
  {
    id: 'derniere-dance',
    anchor: 'show-derniere-dance',
    title: 'Dernière Dance',
    category: 'French Cabaret',
    video: '/videos/Show%20Francez.mov',
    accentColor: '#d42b3a',
  },
];

function ShowCard({ show, index }: { show: Show; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleEnter = () => videoRef.current?.play();
  const handleLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      ref={ref}
      id={show.anchor}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-brand-surface overflow-hidden cursor-pointer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Colored top border that reveals on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ backgroundColor: show.accentColor }}
      />

      {/* Portrait-friendly container — 3:4 ratio matches phone-shot video */}
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <video
          ref={videoRef}
          src={show.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 group-hover:bg-black/25 transition-all duration-700" />

        {/* Play button — centered */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
          <div
            className="w-14 h-14 rounded-full border flex items-center justify-center backdrop-blur-sm"
            style={{ borderColor: `${show.accentColor}88`, backgroundColor: `${show.accentColor}18` }}
          >
            <svg className="w-5 h-5 ml-1" fill={show.accentColor} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Corner accents */}
        <div
          className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ borderColor: show.accentColor }}
        />
        <div
          className="absolute bottom-20 left-4 w-5 h-5 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ borderColor: show.accentColor }}
        />

        {/* Info overlay — always visible at bottom of video */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pt-12 pb-5">
          <p
            className="text-[0.58rem] tracking-[0.38em] uppercase mb-1"
            style={{ color: show.accentColor }}
          >
            {show.category}
          </p>
          <div className="flex items-end justify-between">
            <h3 className="font-display text-xl font-light text-white/90 group-hover:text-white transition-colors duration-300 leading-tight">
              {show.title}
            </h3>
            <svg
              className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mb-0.5"
              fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Shows() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="shows" className="relative bg-brand-bg py-32 px-6 overflow-hidden">
      {/* Decorative rooster logo detail — top right */}
      <div className="absolute top-12 right-8 w-32 h-32 pointer-events-none select-none opacity-[0.06] mix-blend-screen">
        <Image src="/logo/Detalii basarabs6.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={ref} className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-crimson text-xs tracking-[0.4em] uppercase mb-3"
            >
              Repertoire
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
            >
              Our{' '}
              <span className="italic text-gold">Shows</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-white/35 text-sm max-w-xs md:text-right leading-relaxed"
          >
            Four worlds, one language — the language of movement. Hover to preview.
          </motion.p>
        </div>

        {/* 4-column portrait grid — 2 cols on mobile, 4 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {SHOWS.map((show, i) => (
            <ShowCard key={show.id} show={show} index={i} />
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>
    </section>
  );
}
