'use client';
import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Shows from '@/components/sections/Shows';
import Gallery from '@/components/sections/Gallery';
import Footer from '@/components/sections/Footer';

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#060606] overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Shows />
      <Gallery />
      <Footer />
    </main>
  );
}
