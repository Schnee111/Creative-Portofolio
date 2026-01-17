'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ProjectShowcase from '@/components/ProjectShowcase'
import ExpertiseColumns from '@/components/ExpertiseColumns'

export default function DashboardPage() {
  const router = useRouter()
  
  // --- STATE ---
  const [mounted, setMounted] = useState(false)
  const [booting, setBooting] = useState(true)
  const [logs, setLogs] = useState<string[]>([])
  const [systemTime, setSystemTime] = useState('')
  const [navbarVisible, setNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  // --- AUDIO REFS ---
  const bootSound = useRef<HTMLAudioElement | null>(null)
  const typeSound = useRef<HTMLAudioElement | null>(null)

  const sections = [
    { id: 'projects', label: 'Projects' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'contact', label: 'Contact' }
  ]

  // 1. Logika Booting & SSR Hydration
  useEffect(() => {
    setMounted(true)
    
    // Inisialisasi Audio (Pastikan file ada di /public/sounds/)
    bootSound.current = new Audio('/sounds/startup.mp3')
    typeSound.current = new Audio('/sounds/type_blip.mp3')
    if (typeSound.current) typeSound.current.volume = 0.2

    // Cek Referrer: Hanya booting jika datang dari "/"
    // document.referrer memberikan URL halaman sebelumnya
    const referrer = document.referrer
    const isFromHome = referrer.endsWith('/') || referrer === '' 

    if (!isFromHome) {
      setBooting(false)
      return
    }

    // Play Startup Sound
    if (bootSound.current) {
      bootSound.current.play().catch(() => console.log("Audio play blocked by browser. Interaction required."))
    }

    const bootLogs = [
      "INITIALIZING DAFFA.OS KERNEL v5.0.2...",
      "MOUNTING REPOSITORIES FROM CLOUD_DATABASE...",
      "LOADING NEURAL_NET_MODULES... DONE",
      "ESTABLISHING SECURE CONNECTION TO PORTFOLIO_NODE...",
      "DECRYPTING ARCHIVE_DATA...",
      "STARTING GRAPHICAL_INTERFACE..."
    ]

    let currentLog = 0
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]])
        
        // Play Typing Sound per Log
        if (typeSound.current) {
          typeSound.current.currentTime = 0
          typeSound.current.play().catch(() => {})
        }
        
        currentLog++
      } else {
        clearInterval(interval)
        setTimeout(() => setBooting(false), 800)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Menangani Scroll Lock & Posisi Scroll setelah Booting
  useEffect(() => {
    if (booting && mounted) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      if (mounted) window.scrollTo(0, 0)
    }
  }, [booting, mounted]);

  // 2. Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Navbar Auto-hide
  useEffect(() => {
    if (booting) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavbarVisible(false)
      } else {
        setNavbarVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [booting])

  // 4. Smooth Scroll to Section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // SSR Safe check: Jangan render UI sebelum mounted untuk menghindari mismatch
  if (!mounted) return <div className="min-h-screen bg-black" />

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono overflow-x-hidden selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {booting ? (
          /* FASE 1: BOOTING SEQUENCE */
          <motion.div 
            key="boot"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-start justify-center p-10 md:p-24"
          >
            <div className="max-w-2xl">
              {logs.map((log, i) => (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={i} 
                  className="text-blue-500 text-xs md:text-sm mb-2"
                >
                  <span className="text-white/30 mr-4">[{i+1}]</span> {log}
                </motion.p>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-blue-500 mt-4" 
              />
            </div>
          </motion.div>
        ) : (
          /* FASE 2: DASHBOARD */
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* NAVBAR */}
            <motion.nav 
              initial={{ y: -100 }}
              animate={{ y: navbarVisible ? 0 : -100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-[#050505]/80 border-b border-white/5"
            >
              <div className="max-w-[2000px] mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
                <motion.div 
                  className="flex items-center gap-8"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <h1 
                      onClick={() => router.push('/')}
                      className="text-xl md:text-2xl font-black italic tracking-tighter text-white hover:text-blue-500 transition-colors cursor-pointer"
                    >
                      DAFFA.OS
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[8px] text-white/40 uppercase tracking-widest">System_Active</p>
                    </div>
                  </div>
                </motion.div>

                <div className="hidden md:flex items-center gap-8">
                  <motion.button
                    onClick={() => router.push('/')}
                    className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-blue-500 transition-colors relative group"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="relative z-10">← Home</span>
                    <motion.div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
                  </motion.button>
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-blue-500 transition-colors relative group"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative z-10">{section.label}</span>
                      <motion.div 
                        className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="hidden lg:flex flex-col items-end text-[8px] text-white/30 uppercase tracking-wider">
                  <p>TIME: {systemTime}</p>
                  <p className="text-green-500">STATUS: ONLINE</p>
                </div>

                <motion.button 
                  className="md:hidden text-white/60 hover:text-white transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
            </motion.nav>

            {/* CONTENT SECTIONS */}
            <div id="projects">
              <ProjectShowcase />
            </div>

            <div id="expertise" className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="h-screen w-full"
              >
                <ExpertiseColumns />
              </motion.div>
            </div>

            <section id="contact" className="min-h-screen w-full flex flex-col items-center justify-center p-10 md:p-24 relative">
               <div className="absolute inset-0 opacity-10">
                 <div className="fui-grid w-full h-full" />
               </div>

               <motion.h2 
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 0.02, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="absolute text-[18vw] font-black uppercase text-white select-none pointer-events-none italic"
               >
                 Connect
               </motion.h2>
               
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative z-10 text-center max-w-4xl"
               >
                  <span className="text-blue-500 text-[10px] tracking-[0.5em] uppercase mb-12 block opacity-60">
                    // Signal_End
                  </span>
                  
                  <motion.h3
                    className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter italic mb-8 text-white/90"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    Let's Build Something
                  </motion.h3>

                  <motion.a 
                    href="mailto:daffa@example.com" 
                    className="inline-block text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter italic hover:text-blue-500 transition-colors duration-500 group relative"
                    whileHover={{ y: -5 }}
                  >
                    <span className="relative z-10">Get_In_Touch</span>
                    <motion.div 
                      className="absolute -bottom-2 left-0 w-0 h-1 bg-blue-500 group-hover:w-full transition-all duration-700"
                    />
                  </motion.a>
                  
                  <motion.div className="mt-16 md:mt-24 flex flex-wrap gap-6 md:gap-12 justify-center text-[10px] uppercase tracking-[0.4em]">
                    {[
                      { label: 'GitHub', href: 'https://github.com' },
                      { label: 'LinkedIn', href: 'https://linkedin.com' },
                      { label: 'Twitter', href: 'https://twitter.com' },
                      { label: 'Instagram', href: 'https://instagram.com' }
                    ].map((link) => (
                      <motion.a 
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/20 hover:text-blue-500 transition-colors relative group"
                        whileHover={{ y: -2 }}
                      >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
                      </motion.a>
                    ))}
                  </motion.div>
               </motion.div>

               <motion.footer 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 0.1 }}
                 viewport={{ once: true }}
                 className="absolute bottom-10 text-[8px] text-white uppercase tracking-[0.5em] text-center"
               >
                 <p>© 2026 Muhammad Daffa Maarif</p>
                 <p className="mt-1">System v5.0.2 • Powered by Next.js</p>
               </motion.footer>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}