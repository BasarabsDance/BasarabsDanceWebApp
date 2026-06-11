'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SHOWS_DROPDOWN = [
  { label: 'One Heart', href: '#show-one-heart' },
  { label: 'Welcome on Board', href: '#show-welcome-on-board' },
  { label: 'Afro Roots', href: '#show-afro-roots' },
  { label: 'Derniere Dance', href: '#show-derniere-dance' },
];

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Shows', href: '#shows', dropdown: SHOWS_DROPDOWN },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showsOpen, setShowsOpen] = useState(false);
  const [mobileShowsOpen, setMobileShowsOpen] = useState(false);
  const [active, setActive] = useState('#hero');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll-spy: highlight the section currently in the middle of the viewport */
  useEffect(() => {
    const ids = ['hero', 'about', 'shows', 'gallery', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const linkClass = (href: string, extra?: string) =>
    cn(
      'font-nav text-[0.82rem] tracking-[0.18em] uppercase transition-colors duration-300',
      active === href ? 'text-gold' : 'text-white/70 hover:text-gold',
      extra,
    );

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled ? 'bg-black/88 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20' : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo — cropped to the logo-mark area of logo.png */}
        <a href="#hero" className="flex-shrink-0 group">
          <div
            className="relative overflow-hidden transition-opacity duration-300 group-hover:opacity-80"
            style={{ width: 100, height: 60 }}
          >
            <Image
              src="/logo.png"
              alt="Basarab's Dance"
              width={100}
              height={217}
              className="absolute top-0 left-0"
              style={{ top: -72 }}
              priority
            />
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.dropdown ? (
              <div key={link.href} ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowsOpen((v) => !v)}
                  onMouseEnter={() => setShowsOpen(true)}
                  className={cn(
                    'relative flex items-center gap-1.5 cursor-pointer group/link',
                    linkClass(link.href),
                    showsOpen && 'text-gold',
                  )}
                >
                  {link.label}
                  <ChevronIcon className={cn('w-3 h-3 transition-transform duration-300', showsOpen ? 'rotate-180' : '')} />
                  <span
                    className={cn(
                      'absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-300',
                      active === link.href || showsOpen ? 'w-full' : 'w-0 group-hover/link:w-full',
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showsOpen && (
                    <motion.div
                      onMouseLeave={() => setShowsOpen(false)}
                      initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      style={{ transformOrigin: 'top center' }}
                      className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-60 bg-brand-surface/96 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      {/* Caret */}
                      <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-brand-surface border-t border-l border-white/10 rotate-45" />

                      {link.dropdown.map((item, i) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowsOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-5 py-3.5 group/item transition-all duration-200 hover:bg-white/5',
                            i < link.dropdown!.length - 1 ? 'border-b border-white/[0.06]' : '',
                          )}
                        >
                          <span className="w-1.5 h-1.5 rotate-45 bg-gold/0 group-hover/item:bg-gold scale-0 group-hover/item:scale-100 transition-all duration-300 flex-shrink-0" />
                          <span className="font-nav text-[0.85rem] tracking-[0.1em] text-white/60 group-hover/item:text-white transition-colors duration-200">
                            {item.label}
                          </span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={cn('relative group/link', linkClass(link.href))}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-300',
                    active === link.href ? 'w-full' : 'w-0 group-hover/link:w-full',
                  )}
                />
              </a>
            ),
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/75 hover:text-white ml-auto"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-[5px]">
            <span className={cn('h-px w-full bg-current transition-all duration-300 origin-center', mobileOpen ? 'rotate-45 translate-y-[9px]' : '')} />
            <span className={cn('h-px w-full bg-current transition-all duration-300', mobileOpen ? 'opacity-0 scale-x-0' : '')} />
            <span className={cn('h-px w-full bg-current transition-all duration-300 origin-center', mobileOpen ? '-rotate-45 -translate-y-[5px]' : '')} />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md border-b border-white/5"
          >
            <div className="px-6 py-5 space-y-0">
              {NAV_LINKS.map((link, i) =>
                link.dropdown ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileShowsOpen((v) => !v)}
                      className={cn(
                        'w-full flex items-center justify-between py-3.5 border-b border-white/5',
                        linkClass(link.href),
                      )}
                    >
                      {link.label}
                      <ChevronIcon className={cn('w-3 h-3 transition-transform duration-300', mobileShowsOpen ? 'rotate-180' : '')} />
                    </button>
                    <AnimatePresence>
                      {mobileShowsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-5 border-l-2 border-gold/30 ml-1 my-1"
                        >
                          {link.dropdown.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={() => { setMobileOpen(false); setMobileShowsOpen(false); }}
                              className="flex items-center gap-2.5 py-2.5 font-nav text-[0.85rem] tracking-[0.1em] text-white/50 hover:text-gold transition-colors"
                            >
                              <span className="w-1 h-1 rotate-45 bg-gold/40 flex-shrink-0" />
                              {item.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className={cn('block py-3.5 border-b border-white/5', linkClass(link.href))}
                  >
                    {link.label}
                  </motion.a>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
