'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const performances = [
  {
    id: 1,
    title: 'Întâmpinare',
    subtitle: 'Tradițional',
    image: '/images/intampinare/2.jpg',
    description: 'O poveste de bun-venit prin mișcare și grație',
  },
  {
    id: 2,
    title: 'Flashmob',
    subtitle: 'Stradal',
    image: '/images/flashmob/IMG_6022.JPG',
    description: 'Energia orașului captată în dans spontan',
  },
  {
    id: 3,
    title: 'Oh!',
    subtitle: 'Contemporan',
    image: '/images/oh/IMG_2131.JPG',
    description: 'Emoție pură exprimată prin corp',
  },
  {
    id: 4,
    title: 'Legat',
    subtitle: 'Formație',
    image: '/images/legat/IMG_6610.jpg',
    description: 'Conexiunea dintre dansatori, vizibilă pe scenă',
  },
  {
    id: 5,
    title: 'WOB',
    subtitle: 'Modern',
    image: '/images/wob/IMG_6537.JPG',
    description: 'Wild On Beat — ritm, energie, libertate',
  },
  {
    id: 6,
    title: 'Colac',
    subtitle: 'Cerc',
    image: '/images/colac/IMG_6015.JPG',
    description: 'Unitate și armonie în formă circulară',
  },
];

function PerformanceCard({ perf, index }: { perf: typeof performances[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
      className="group relative overflow-hidden cursor-pointer bg-[#0e0e0e]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={perf.image}
          alt={perf.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Persistent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hover overlay with description */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 text-center">
          <p className="text-white/80 text-sm leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {perf.description}
          </p>
        </div>

        {/* Always visible bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#c9a227] text-xs tracking-[0.3em] uppercase mb-1 transition-transform duration-300 group-hover:-translate-y-1">
            {perf.subtitle}
          </p>
          <h3
            className="text-white transition-transform duration-300 group-hover:-translate-y-1"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: 300 }}
          >
            {perf.title}
          </h3>
        </div>

        {/* Gold corner accent */}
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#c9a227]/0 group-hover:border-[#c9a227]/80 transition-all duration-500" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#c9a227]/0 group-hover:border-[#c9a227]/80 transition-all duration-500" />
      </div>
    </motion.div>
  );
}

export default function Performances() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="performances" className="bg-[#060606] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={ref} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[#c9a227] text-xs tracking-[0.4em] uppercase mb-3"
            >
              Repertoriu
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
            >
              Spectacolele{' '}
              <span className="italic text-[#c9a227]">noastre</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 text-sm max-w-xs md:text-right"
          >
            Fiecare coregrafie este o lume aparte — o invitație la emoție și frumusețe
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {performances.map((perf, i) => (
            <PerformanceCard key={perf.id} perf={perf} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
