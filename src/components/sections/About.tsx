'use client';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Counter } from '@/components/ui/Counter';
import { useTransparentImage } from '@/lib/useTransparentImage';

const stats = [
  { target: 10, suffix: '+', label: 'Years of Dance', color: 'text-gold', accent: '#c9a227', ornament: '/logo/Detalii basarabs6.png' },
  { target: 50, suffix: '+', label: 'Performances', color: 'text-crimson', accent: '#d42b3a', ornament: '/logo/Detalii basarabs4.png' },
  { target: 4, suffix: '', label: 'Unique Shows', color: 'text-teal-brand', accent: '#1b7fa0', ornament: '/logo/Detalii basarabs5.png' },
  { target: null, suffix: '', label: 'Passion', color: 'text-rose-brand', accent: '#c06080', ornament: '/logo/Detalii basarabs7.png' },
];

/* ── stat card with pointer-tracking 3D tilt ─────────────────── */
function TiltCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof stats)[number];
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const ornamentUrl = useTransparentImage(stat.ornament);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 220, damping: 18 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.12 * index + 0.1 }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      className="group relative border border-white/[0.07] p-7 overflow-hidden transition-colors duration-500 hover:bg-white/[0.02]"
    >
      {/* accent border glow on hover */}
      <div
        className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: `${stat.accent}55`, boxShadow: `inset 0 0 28px ${stat.accent}14` }}
      />

      {/* ornament watermark */}
      {ornamentUrl && (
        <img
          src={ornamentUrl}
          alt=""
          className="absolute -bottom-3 -right-3 w-20 h-20 object-contain opacity-[0.08] group-hover:opacity-[0.18] group-hover:scale-110 transition-all duration-500 pointer-events-none select-none"
        />
      )}

      <div className={`font-display mb-2 leading-none ${stat.color}`} style={{ fontSize: '3rem', fontWeight: 300 }}>
        {stat.target === null ? (
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.6 }}
          >
            ∞
          </motion.span>
        ) : (
          <Counter target={stat.target} suffix={stat.suffix} />
        )}
      </div>
      <div className="font-nav text-white/35 text-xs tracking-widest uppercase">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative bg-brand-bg py-32 px-6">
      {/* Vertical accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-40 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text column */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-nav text-gold text-xs tracking-[0.4em] uppercase mb-4"
          >
            About us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-white mb-4 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
          >
            Art in{' '}
            <span className="italic text-gold">motion</span>
          </motion.h2>

          {/* Stitched divider — echo of the page thread */}
          <svg width="120" height="10" viewBox="0 0 120 10" fill="none" className="mb-6 overflow-visible">
            <motion.line
              x1="0" y1="5" x2="104" y2="5"
              stroke="#c9a227" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="6 5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            />
            <motion.rect
              x="110" y="1.5" width="7" height="7" fill="#c9a227"
              transform="rotate(45 113.5 5)"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.8, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.5 }}
            />
          </svg>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-white/50 leading-relaxed mb-5"
          >
            Basarab&apos;s Dance is a dance company founded on the passion to transform
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
            className="inline-flex items-center gap-3 font-nav text-crimson text-sm tracking-widest uppercase hover:gap-5 transition-all duration-300 group"
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
            <TiltCard key={s.label} stat={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
