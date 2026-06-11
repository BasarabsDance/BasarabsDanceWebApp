'use client';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useTransparentImage } from '@/lib/useTransparentImage';

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram, hover: '#c06080' },
  { label: 'Facebook', Icon: Facebook, hover: '#1b7fa0' },
  { label: 'YouTube', Icon: Youtube, hover: '#d42b3a' },
];

/* ── email CTA that leans toward the cursor ──────────────────── */
function MagneticCta() {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.18);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="mailto:contact@basarabsdance.ro"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className="inline-block px-10 py-4 border border-gold/45 font-nav text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-colors duration-400"
    >
      contact@basarabsdance.ro
    </motion.a>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const knotUrl = useTransparentImage('/logo/Detalii basarabs7.png');

  return (
    <footer id="contact" className="relative bg-brand-bg border-t border-white/5 overflow-hidden">
      {/* Giant watermark */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display font-light text-white/[0.03] select-none pointer-events-none whitespace-nowrap"
        style={{ fontSize: 'clamp(6rem, 16vw, 16rem)', lineHeight: 1 }}
      >
        BASARAB&apos;S
      </div>

      {/* CTA block */}
      <div ref={ref} className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10">
        <p className="font-nav text-crimson text-xs tracking-[0.4em] uppercase mb-4">Contact</p>
        <h2
          className="font-display text-white mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300 }}
        >
          Let&apos;s dance{' '}
          <span className="italic text-gold">together</span>
        </h2>
        <p className="text-white/35 mb-10 max-w-md mx-auto leading-relaxed">
          Interested in our shows or a collaboration? Write to us and let&apos;s get acquainted.
        </p>

        <MagneticCta />

        {/* Stitched divider with the thread's final knot */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <svg width="100%" height="2" viewBox="0 0 400 2" preserveAspectRatio="none" className="max-w-[180px]">
            <motion.line
              x1="400" y1="1" x2="0" y2="1"
              stroke="#c9a227" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="7 6"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
          {knotUrl ? (
            <motion.img
              src={knotUrl}
              alt=""
              className="w-10 h-10 object-contain select-none"
              style={{ filter: 'drop-shadow(0 0 12px rgba(201,162,39,0.45))' }}
              initial={{ opacity: 0, scale: 0.3, rotate: -120 }}
              animate={inView ? { opacity: 0.9, scale: 1, rotate: 0 } : {}}
              transition={{ type: 'spring', stiffness: 130, damping: 13, delay: 1.1 }}
            />
          ) : (
            <span className="block h-2 w-2 rotate-45 bg-gold/70" />
          )}
          <svg width="100%" height="2" viewBox="0 0 400 2" preserveAspectRatio="none" className="max-w-[180px]">
            <motion.line
              x1="0" y1="1" x2="400" y2="1"
              stroke="#c9a227" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="7 6"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-white/25 text-sm">
            © {new Date().getFullYear()} Basarab&apos;s Dance
          </span>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, Icon, hover }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/35 transition-all duration-300 hover:border-current hover:scale-105"
                onMouseEnter={(e) => (e.currentTarget.style.color = hover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <a
            href="#hero"
            className="inline-flex items-center gap-2 font-nav text-white/25 hover:text-gold text-xs tracking-widest uppercase transition-colors duration-300"
          >
            Back to top
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
