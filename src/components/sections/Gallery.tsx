'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ZoomParallax } from '@/components/ui/zoom-parallax';

const images = [
  { src: '/images/intampinare/2.jpg', alt: 'Întâmpinare' },
  { src: '/images/flashmob/IMG_6022.JPG', alt: 'Flashmob' },
  { src: '/images/oh/IMG_2131.JPG', alt: 'Oh!' },
  { src: '/images/legat/IMG_6610.jpg', alt: 'Legat' },
  { src: '/images/oh/IMG_6024.JPG', alt: 'Oh! – scenă' },
  { src: '/images/wob/IMG_6537.JPG', alt: 'WOB' },
  { src: '/images/wob/IMG_6541.JPG', alt: 'WOB – formație' },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    /* NOTE: no overflow-hidden here — it breaks position:sticky inside ZoomParallax */
    <section id="gallery" className="relative bg-brand-bg">
      <div ref={ref} className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-nav text-teal-brand text-xs tracking-[0.4em] uppercase mb-3"
        >
          Gallery
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-white leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}
        >
          Unforgettable{' '}
          <span className="italic text-gold">moments</span>
        </motion.h2>
      </div>

      <ZoomParallax images={images} />
    </section>
  );
}
