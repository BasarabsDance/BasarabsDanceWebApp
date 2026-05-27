'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-brand-bg border-t border-white/5 overflow-hidden">
      {/* Decorative pinwheel — bottom left */}
      <div className="absolute bottom-0 left-8 w-36 h-36 pointer-events-none select-none opacity-[0.07] mix-blend-screen">
        <Image src="/logo/Detalii basarabs5.png" alt="" fill className="object-contain" />
      </div>
      {/* Decorative flower — bottom right */}
      <div className="absolute bottom-0 right-8 w-36 h-44 pointer-events-none select-none opacity-[0.06] mix-blend-screen">
        <Image src="/logo/Detalii basarabs7.png" alt="" fill className="object-contain" />
      </div>

      {/* CTA block */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10">
        <p className="text-crimson text-xs tracking-[0.4em] uppercase mb-4">Contact</p>
        <h2
          className="font-display text-white mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300 }}
        >
          Let's dance{' '}
          <span className="italic text-gold">together</span>
        </h2>
        <p className="text-white/35 mb-10 max-w-md mx-auto leading-relaxed">
          Interested in our shows or a collaboration? Write to us and let's get acquainted.
        </p>

        <a
          href="mailto:contact@basarabsdance.ro"
          className="inline-block px-10 py-4 border border-gold/45 text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-black transition-all duration-400"
        >
          contact@basarabsdance.ro
        </a>

        {/* Decorative divider */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-white/25 text-sm">
            © {new Date().getFullYear()} Basarab's Dance
          </span>
          <div className="flex items-center gap-6">
            {[
              { label: 'Instagram', color: 'hover:text-rose-brand' },
              { label: 'Facebook', color: 'hover:text-teal-brand' },
              { label: 'YouTube', color: 'hover:text-crimson' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                className={`text-white/25 ${s.color} text-xs tracking-widest uppercase transition-colors duration-300`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
