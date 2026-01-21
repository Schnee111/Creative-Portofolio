'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectShowcase from '@/components/dashboard/ProjectShowcase'
import ExpertiseColumns from '@/components/dashboard/ExpertiseColumns'
import BootScreen from '@/components/ui/BootScreen'
import Navbar from '@/components/dashboard/layout/Navbar'
import DirectoryHeader from '@/components/dashboard/DirectoryHeader'
import Footer from '@/components/dashboard/layout/Footer'

export default function DashboardPage() {
  const [booting, setBooting] = useState(true)
  const [percent, setPercent] = useState(0)

  // Fix scroll position
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  // Booting logic + scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });

    let current = 0;
    const interval = setInterval(() => {
      const jump = Math.floor(Math.random() * 15) + 1;
      current += jump;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);

        setTimeout(() => {
          setBooting(false);
          document.body.style.overflow = '';

          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
        }, 500);
      }
      setPercent(current);
    }, 80);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    }
  }, [])

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/20 overflow-x-hidden">

      {/* Boot Screen */}
      <BootScreen booting={booting} percent={percent} />

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: booting ? 0.6 : 0, ease: "easeOut" }}
      >
        {/* Navbar */}
        <Navbar booting={booting} onScrollTo={handleScrollTo} />

        {/* Directory Header */}
        <DirectoryHeader />

        {/* Projects Showcase */}
        <section id="work" className="py-12 md:py-20">
          <ProjectShowcase />
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-20 md:py-40 border-t border-white/5">
          <div className="container mx-auto px-6 mb-20">
            <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase block">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-4 tracking-tighter">
              TECHNICAL <span className="text-white/20">STACK</span>
            </h2>
          </div>
          <ExpertiseColumns />
        </section>

        {/* Footer */}
        <Footer onScrollTo={handleScrollTo} />

      </motion.div>
    </main>
  )
}
