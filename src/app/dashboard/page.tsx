  'use client'

  import { useState, useEffect, useRef } from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import { useRouter } from 'next/navigation'
  import ProjectShowcase from '@/components/ProjectShowcase'
  import ExpertiseColumns from '@/components/ExpertiseColumns'

  export default function DashboardPage() {
    const router = useRouter()
    const [booting, setBooting] = useState(true)
    const [logs, setLogs] = useState<string[]>([])
    const [systemTime, setSystemTime] = useState('')
    const [navbarVisible, setNavbarVisible] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const lastScrollY = useRef(0)

    const sections = [
      { id: 'projects', label: 'Projects' },
      { id: 'expertise', label: 'Expertise' },
      { id: 'contact', label: 'Contact' }
    ]

    // 1. Logika Booting
    useEffect(() => {
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
          currentLog++
        } else {
          clearInterval(interval)
          setTimeout(() => setBooting(false), 800)
        }
      }, 250)

      return () => clearInterval(interval)
    }, [])

    useEffect(() => {
      if (!booting) {
        window.scrollTo(0, 0);
        document.documentElement.classList.remove('lenis-stopped');
      }
    }, [booting]);

    // 1.1 Hide scrollbar during booting & menu open
    useEffect(() => {
      const html = document.documentElement;
      const body = document.body;

      if (booting || menuOpen) {
        // Kunci scroll secara total
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        html.classList.add('lenis-stopped'); // Jika pakai smooth scroll Lenis
        
        // Opsional: cegah pergeseran layout saat scrollbar hilang
        body.style.touchAction = 'none'; 
        body.style.overscrollBehavior = 'none';
      } else {
        // Kembalikan scroll
        html.style.overflow = '';
        body.style.overflow = '';
        html.classList.remove('lenis-stopped');
        
        body.style.touchAction = '';
        body.style.overscrollBehavior = '';
      }

      return () => {
        html.style.overflow = '';
        body.style.overflow = '';
        html.classList.remove('lenis-stopped');
      };
    }, [booting, menuOpen]);

    // 2. Real-time Clock
    useEffect(() => {
      const timer = setInterval(() => {
        setSystemTime(new Date().toLocaleTimeString('en-GB', { hour12: false }))
      }, 1000)
      return () => clearInterval(timer)
    }, [])

    // 3. Navbar Auto-hide & Scroll Progress
    useEffect(() => {
      if (booting) return

      const handleScroll = () => {
        const currentScrollY = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        // Auto-hide navbar
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
      setMenuOpen(false);
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    return (
      <main className="min-h-screen bg-[#050505] text-white font-mono overflow-x-hidden selection:bg-blue-500/30">
        <AnimatePresence mode="wait">
          {booting ? (
            /* FASE 1: BOOTING SEQUENCE (Sesuai kode kamu) */
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
            /* FASE 2: DASHBOARD (Lusion Style Interface) */
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {/* NAVBAR: Advanced Header dengan Navigation */}
              <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: navbarVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed top-0 w-full z-[160] transition-colors duration-500 ${
                  menuOpen ? 'bg-[#050505]' : 'backdrop-blur-xl bg-[#050505]/80'
                } border-b border-white/5`}
              >
                <div className="max-w-[2000px] mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
                  {/* Logo & Status */}
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
                    </div>
                  </motion.div>

                  {/* Navigation Menu */}
                  <div className="hidden md:flex items-center gap-8">
                    <motion.button
                      onClick={() => router.push('/')}
                      className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-blue-500 transition-colors relative group"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="relative z-10">← Home</span>
                      <motion.div 
                        className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"
                      />
                    </motion.button>
                    {sections.map((section, idx) => (
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

                  {/* System Info */}
                  <div className="hidden lg:flex flex-col items-end text-[8px] text-white/30 uppercase tracking-wider">
                    <p>TIME: {systemTime}</p>
                    <p className="text-green-500">STATUS: ONLINE</p>
                  </div>

                  {/* Mobile Menu Button */}
                  <motion.button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    // Pastikan z-index di sini (z-[250]) jauh lebih tinggi dari z-index overlay (z-[140])
                    className="md:hidden relative z-[250] w-10 h-10 flex flex-col items-center justify-center gap-2"
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span 
                      className="w-6 h-0.5 bg-white block origin-center" 
                      animate={menuOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="w-6 h-0.5 bg-white block"
                      animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="w-6 h-0.5 bg-white block origin-center"
                      animate={menuOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </motion.nav>

              {/* TAMBAHKAN INI: Mobile Overlay Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onPointerMove={(e) => e.stopPropagation()}
                    className="fixed inset-0 z-[140] bg-[#050505] flex flex-col p-10 justify-center md:hidden h-screen w-screen"
                  >
                    <div className="flex flex-col gap-8">
                      <p className="text-blue-500 text-[10px] tracking-[0.5em] uppercase opacity-50">// Navigation</p>
                      <button onClick={() => { router.push('/'); setMenuOpen(false); }} className="text-4xl font-black italic uppercase text-left text-white/20">Home</button>
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => {
                            scrollToSection(section.id);
                            setMenuOpen(false);
                          }}
                          className="text-5xl font-black italic uppercase text-left hover:text-blue-500 transition-colors"
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION 1: FEATURED WORKS */}
              <div id="projects">
                <ProjectShowcase />
              </div>

              {/* SECTION 2: EXPERTISE */}
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

              {/* SECTION 3: CONTACT */}
              <section 
                id="contact" 
                className="min-h-screen w-full flex flex-col items-center justify-center p-10 md:p-24 relative"
              >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="fui-grid w-full h-full" />
                </div>

                {/* Background Typography */}
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
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="mt-16 md:mt-24 flex flex-wrap gap-6 md:gap-12 justify-center text-[10px] uppercase tracking-[0.4em]"
                    >
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

                    {/* Additional Info */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.4 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className="mt-16 text-white/40 text-sm max-w-2xl mx-auto leading-relaxed"
                    >
                      <p>Available for freelance projects, collaborations, and full-time opportunities.</p>
                      <p className="mt-2">Based in Indonesia • Working Globally</p>
                    </motion.div>
                </motion.div>

                {/* Footer */}
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