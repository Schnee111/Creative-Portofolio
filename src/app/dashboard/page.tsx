'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectShowcase from '@/components/ProjectShowcase'
import ExpertiseColumns from '@/components/ExpertiseColumns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// --- KOMPONEN JAM ---
const TimeDisplay = () => {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'Asia/Jakarta' 
      });
      setTime(timeString);
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-xl text-white font-light tabular-nums">{time || "00:00:00"} WIB</span>
}

export default function DashboardPage() {
  // 1. STATE DEFAULT TRUE: Selalu booting saat mount
  const [booting, setBooting] = useState(true)
  const [percent, setPercent] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 2. FIX SCROLL POSISI (The "Nuclear" Solution)
  useLayoutEffect(() => {
    // Matikan restorasi otomatis browser agar tidak lompat ke bawah
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Paksa ke atas SECARA INSTANT sebelum frame berikutnya dirender
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTop = 0; // Untuk Safari
    document.documentElement.scrollTop = 0; // Untuk Chrome/FF
  }, []);

  // 3. LOGIC BOOTING + SCROLL LOCK
  useEffect(() => {
    // KUNCI SCROLL: Cegah user atau browser scroll ke bawah selama booting
    document.body.style.overflow = 'hidden';
    
    // Pastikan posisi tetap di atas selama booting
    window.scrollTo({ top: 0, behavior: 'instant' });

    let current = 0;
    const interval = setInterval(() => {
      const jump = Math.floor(Math.random() * 15) + 1; 
      current += jump;

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        
        // Delay sedikit sebelum membuka tirai
        setTimeout(() => {
          setBooting(false);
          
          // BUKA KUNCI SCROLL
          document.body.style.overflow = '';
          
          // PAKSA RESET LAGI setelah konten muncul
          // Ini mengatasi masalah "layout shift" yang bikin scroll loncat
          requestAnimationFrame(() => {
             window.scrollTo({ top: 0, behavior: 'instant' });
          });
          
        }, 500); 
      }
      setPercent(current);
    }, 80); 

    return () => {
      clearInterval(interval);
      // Safety: Pastikan scroll unlocked jika component unmount
      document.body.style.overflow = '';
    }
  }, [])

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
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
      
      {/* === 1. PREMIUM BOOT SCREEN === */}
      <AnimatePresence mode="wait">
        {booting && (
          <motion.div 
            className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col justify-between p-8 md:p-12 font-mono text-white"
            // Penting: Saat exit, paksa scroll ke atas lagi
            onViewportLeave={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }} 
          >
            {/* Top Corners */}
            <div className="flex justify-between items-start opacity-30 text-[10px] tracking-widest uppercase">
              <span>System_Check_Init</span>
              <span>Secure_Env_v5.2</span>
            </div>

            {/* Center: Massive Counter */}
            <div className="flex flex-col items-center justify-center relative">
               <motion.h1 
                 className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter tabular-nums"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
               >
                 {percent}%
               </motion.h1>
               
               {/* Loading Bar Tipis */}
               <div className="w-64 h-[1px] bg-white/10 mt-8 relative overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 h-full bg-blue-500"
                   initial={{ width: 0 }}
                   animate={{ width: `${percent}%` }}
                 />
               </div>
            </div>

            {/* Bottom Corners */}
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                <span>Loading Assets...</span>
                <span className="text-blue-500">{percent < 100 ? "Processing" : "Ready"}</span>
              </div>
              
              <div className="hidden md:block text-[10px] text-white/20">
                ID: 882-991-X
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DASHBOARD CONTENT === */}
      {/* Kita hilangkan initial y:50 agar tidak ada pergeseran layout yang membingungkan browser saat scroll reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: booting ? 0.6 : 0, ease: "easeOut" }}
      >
        {/* 2. NAVBAR (Sticky but Minimal) */}
        <div className="fixed top-6 left-0 w-full z-50 px-4 md:px-0 flex justify-center">
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: booting ? 1 : 0.5, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50"
          >
            {/* A. LEFT: IDENTITY */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-white font-bold">
                  DAFFA.OS
                </span>
              </div>
              <span className="hidden md:block text-[10px] text-white/20 font-mono">|</span>
              <span className="hidden md:block text-[10px] text-white/40 font-mono tracking-widest">v5.0.2</span>
            </div>

            {/* B. CENTER: DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8">
              {['Work', 'Expertise', 'Contact'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => handleScrollTo(item.toLowerCase())}
                  className="relative group px-2 py-1"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                    {item}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300 ease-out" />
                </button>
              ))}
            </div>

            {/* C. RIGHT: ACTIONS & MOBILE TOGGLE */}
            <div className="flex items-center gap-4">
              
              {/* EXIT BUTTON (Ke Homepage) */}
              <Link href="/">
                <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-red-500 transition-colors" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/60 group-hover:text-red-400">
                    Exit System
                  </span>
                </button>
              </Link>

              {/* MOBILE MENU TOGGLE */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2"
              >
                <motion.span 
                  animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 5 : 0 }} 
                  className="w-5 h-[1px] bg-white block" 
                />
                <motion.span 
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }} 
                  className="w-5 h-[1px] bg-white block" 
                />
                <motion.span 
                  animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -5 : 0 }} 
                  className="w-5 h-[1px] bg-white block" 
                />
              </button>
            </div>
          </motion.nav>

          {/* D. MOBILE MENU DROPDOWN */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-20 left-4 right-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl md:hidden"
              >
                {['Work', 'Expertise', 'Contact'].map((item, i) => (
                  <button 
                    key={item}
                    onClick={() => handleScrollTo(item.toLowerCase())}
                    className="text-left py-3 border-b border-white/5 last:border-0"
                  >
                    <span className="text-xs font-mono text-blue-500 mr-4">0{i+1}</span>
                    <span className="text-sm uppercase tracking-widest text-white">{item}</span>
                  </button>
                ))}
                
                {/* Mobile Exit Button */}
                <Link href="/" className="mt-4">
                  <button className="w-full py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">
                    Shutdown / Exit
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. DIRECTORY HEADER (Pengganti Hero Section) */}
        <header className="container mx-auto px-6 md:px-12 pt-64 pb-32 border-b border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
              <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] mb-4 block">
                MAIN_DIRECTORY
              </span>
              <h1 className="text-6xl md:text-[8vw] font-black leading-[0.8] tracking-tighter text-white opacity-90">
                SELECTED<br />
                <span className="text-white/20 italic">ARCHIVES</span>
              </h1>
            </div>
            
            <div className="max-w-sm text-right md:text-left mb-2">
              <p className="text-white/40 text-xs md:text-sm leading-relaxed font-light">
                A collection of digital experiments, commercial projects, 
                and interactive experiences. Scroll to explore the node.
              </p>
            </div>
          </div>
        </header>

        {/* 4. PROJECTS SHOWCASE */}
        <section id="work" className="py-20">
          <ProjectShowcase />
        </section>

        {/* 5. EXPERTISE SECTION */}
        <section id="expertise" className="py-40 border-t border-white/5">
          <div className="container mx-auto px-6 mb-20">
             <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase block">
                Capabilities
             </span>
             <h2 className="text-4xl md:text-6xl font-bold mt-4 tracking-tighter">
               TECHNICAL <span className="text-white/20">STACK</span>
             </h2>
          </div>
          <ExpertiseColumns />
        </section>

        {/* 6. FOOTER (THE GRAND FINALE) */}
        <footer id="contact" className="relative bg-[#080808] pt-32 pb-8 overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            
            <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                    Available for new projects
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                  Have an idea? <br />
                  <span className="text-white/40 italic">Let's build it together.</span>
                </h2>
              </div>

              <div className="flex flex-col items-end text-right space-y-2">
                 <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Local Time (Jakarta)</span>
                 <TimeDisplay />
              </div>
            </div>

            <div className="mb-32 relative group">
              <a 
                href="mailto:hello@daffa.dev" 
                className="block text-[11vw] leading-[0.8] font-black tracking-tighter text-white transition-colors duration-500 group-hover:text-blue-600 mix-blend-difference"
              >
                hello@daffa.dev
              </a>
              <div className="h-[2px] w-0 bg-blue-600 mt-4 transition-all duration-700 group-hover:w-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12 text-[10px] font-mono uppercase tracking-widest text-white/40">
              <div className="space-y-4">
                <span className="block text-white">Sitemap</span>
                <nav className="flex flex-col gap-2">
                  {['Home', 'Work', 'Expertise', 'Contact'].map(item => (
                    <button key={item} onClick={() => handleScrollTo(item === 'Home' ? 'top' : item.toLowerCase())} className="text-left hover:text-blue-500 transition-colors cursor-pointer">
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-4">
                <span className="block text-white">Socials</span>
                <nav className="flex flex-col gap-2">
                  <a href="#" className="hover:text-blue-500 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                </nav>
              </div>

              <div className="space-y-4">
                <span className="block text-white">Version</span>
                <div className="flex flex-col gap-1">
                  <span>Daffa.OS v5.0.2</span>
                  <span>Last Updated: Jan 2026</span>
                </div>
              </div>

              <div className="space-y-4 text-right md:text-left">
                <span className="block text-white">Credits</span>
                <div className="flex flex-col gap-1">
                  <span>Design & Dev by Daffa</span>
                  <span>Built with Next.js 15</span>
                  <span>Three.js / R3F Engine</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-20 w-full overflow-hidden border-t border-white/5 py-4 bg-white/[0.02]">
            <motion.div 
              className="flex whitespace-nowrap gap-12 text-[100px] md:text-[150px] font-black text-white/[0.03] leading-none select-none"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...Array(4)].map((_, i) => (
                <span key={i}>DESIGN • CODE • INTERACTION • MOTION • </span>
              ))}
            </motion.div>
          </div>

        </footer>

      </motion.div>
    </main>
  )
}