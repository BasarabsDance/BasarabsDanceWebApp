'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FloatingLogo } from '@/components/ui/FloatingLogo';

const stats = [
  { value: '10+', label: 'Years of Dance', color: 'text-gold' },
  { value: '50+', label: 'Performances', color: 'text-crimson' },
  { value: '4', label: 'Unique Shows', color: 'text-teal-brand' },
  { value: '∞', label: 'Passion', color: 'text-rose-brand' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative bg-brand-bg py-32 px-6 overflow-hidden">
      {/* 3D Flying logo elements */}
      <FloatingLogo
        src="/logo/Detalii basarabs4.png"
        size={120}
        position="bottom-10 right-10"
        delay={0.2}
        opacity={0.18}
        from="right"
        floatRange={12}
      />
      <FloatingLogo
        src="/logo/Detalii basarabs2.png"
        size={100}
        position="top-16 left-8"
        delay={0.5}
        opacity={0.14}
        from="left"
        floatRange={9}
      />

      {/* Vertical accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-40 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text column */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-gold text-xs tracking-[0.4em] uppercase mb-4"
          >
            About us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-white mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
          >
            Art in{' '}
            <span className="italic text-gold">motion</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-white/50 leading-relaxed mb-5"
          >
            Basarab's Dance is a dance company founded on the passion to transform
            every movement into a story. We blend classical technique with contemporary
            elements to create performances that captivate and inspire.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-white/35 leading-relaxed mb-8"
          >
            From energetic flash mobs to lyrical choreographies, each show reflects
            our commitment to artistic excellence and authentic connection with our audience.
          </motion.p>

          <motion.a
            href="#shows"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="inline-flex items-center gap-3 text-crimson text-sm tracking-widest uppercase hover:gap-5 transition-all duration-300 group"
          >
            Explore our shows
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </motion.a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 * i + 0.1 }}
              className="border border-white/[0.07] p-7 group hover:border-white/20 hover:bg-white/[0.02] transition-all duration-500"
            >
              <div className={`font-display mb-2 leading-none ${s.color}`} style={{ fontSize: '3rem', fontWeight: 300 }}>
                {s.value}
              </div>
              <div className="text-white/35 text-xs tracking-widest uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
