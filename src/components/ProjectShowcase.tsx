'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

const projects = [
  {
    id: '01',
    title: 'Road Damage Detection',
    subtitle: 'COMPUTER VISION',
    tech: 'YOLOv8 / ByteTrack',
    desc: 'Sistem monitoring infrastruktur jalan secara real-time dengan akurasi mAP 92%.',
    details: [
      { label: 'Problem', text: 'Latensi tinggi pada inspeksi manual infrastruktur.' },
      { label: 'Approach', text: 'Custom training YOLOv8 pada dataset kerusakan jalan lokal.' },
      { label: 'Stack', text: 'PyTorch, Python, OpenCV.' }
    ]
  },
  {
    id: '02',
    title: 'Coffee Supply Chain',
    subtitle: 'BLOCKCHAIN',
    tech: 'Hyperledger / Next.js',
    desc: 'Transparansi pelacakan ekspor kopi menggunakan smart contracts.',
    details: [
      { label: 'Problem', text: 'Kurangnya kepercayaan data pada rantai pasok ekspor.' },
      { label: 'Approach', text: 'Implementasi Hyperledger Fabric untuk log transaksi yang immutable.' },
      { label: 'Stack', text: 'Golang, Node.js, Docker.' }
    ]
  },
  {
    id: '03',
    title: 'Transformer Chatbot',
    subtitle: 'NLP',
    tech: 'PyTorch / Transformers',
    desc: 'Eksperimen chatbot dengan arsitektur Transformer murni untuk dialog natural.',
    details: [
      { label: 'Problem', text: 'Chatbot berbasis aturan yang terlalu kaku untuk konteks luas.' },
      { label: 'Approach', text: 'Self-attention mechanism untuk menangkap hubungan antar kata.' },
      { label: 'Stack', text: 'NLTK, PyTorch, HuggingFace.' }
    ]
  }
]

export default function ProjectShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const currentProject = projects.find(p => p.id === activeId)

  // 1. FIXED: Smooth Horizontal Scroll dengan proper cleanup
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !activeId) return

    // Reset scroll position untuk project baru
    targetScrollRef.current = 0
    currentScrollRef.current = 0
    el.scrollLeft = 0

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetScrollRef.current += e.deltaY * 2
      targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, el.scrollWidth - el.clientWidth))
    }

    const smoothScroll = () => {
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.07
      el.scrollLeft = currentScrollRef.current
      
      // FIXED: Tetap loop terus menerus selama modal terbuka
      animationFrameRef.current = requestAnimationFrame(smoothScroll)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    animationFrameRef.current = requestAnimationFrame(smoothScroll)

    return () => {
      el.removeEventListener('wheel', onWheel)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeId])

  // 2. FIXED: Lock Body Scroll dengan proper class management
  useEffect(() => {
    if (activeId) {
      document.documentElement.classList.add('lenis-stopped')
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      // Extra protection untuk scrollbar
      document.body.style.paddingRight = '0px'
    } else {
      document.documentElement.classList.remove('lenis-stopped')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.documentElement.classList.remove('lenis-stopped')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [activeId])

  // 3. FIXED: Progress Bar dengan cleanup
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !activeId) return

    const handleScroll = () => {
      const progress = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100
      const progressBar = document.getElementById('scroll-progress')
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`
      }
    }

    // Trigger initial update
    handleScroll()

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [activeId])

  // 4. FIXED: Smooth transition between projects
  const handleProjectChange = (newId: string) => {
    const el = scrollContainerRef.current
    if (el) {
      // Smooth reset to beginning
      gsap.to(el, { 
        scrollLeft: 0, 
        duration: 0.6, 
        ease: 'power2.inOut',
        onComplete: () => {
          setActiveId(newId)
        }
      })
    } else {
      setActiveId(newId)
    }
  }

  return (
    <div className="relative bg-[#050505]">
      {/* 1. LIST VIEW */}
      <section className="min-h-screen flex flex-col justify-center p-10 md:p-24 pt-24 md:pt-32">
        <span className="text-blue-500 font-mono text-[10px] tracking-[0.6em] mb-12 uppercase opacity-40">
          // Featured_Works
        </span>
        <div className="space-y-4 md:space-y-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              onClick={() => setActiveId(project.id)}
              className="group cursor-pointer relative"
              whileHover={{ x: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.h2 
                layoutId={`title-${project.id}`}
                className="text-[9vw] font-black uppercase tracking-tighter italic leading-[0.85] text-white/5 group-hover:text-blue-500 transition-colors duration-500 will-change-transform"
              >
                {project.title}
              </motion.h2>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                <span className="text-blue-500 font-mono text-xs italic tracking-widest">{project.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. DETAIL VIEW (OVERLAY) */}
      <AnimatePresence mode="wait">
        {activeId && currentProject && (
          <motion.div 
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[150] bg-[#050505] overflow-hidden"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Navigasi Overlay */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="fixed top-0 w-full p-10 flex justify-between items-center z-[170] pointer-events-none"
            >
              <span className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase">Node_Data // {currentProject.id}</span>
              <button 
                onClick={() => setActiveId(null)}
                className="pointer-events-auto text-white/40 hover:text-white font-mono text-[10px] tracking-widest uppercase border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl bg-white/5 transition-all hover:border-blue-500/30 hover:bg-white/10"
              >
                [ Close_Archive ]
              </button>
            </motion.div>

            {/* Horizontal Scroll Wrapper */}
            <div 
              ref={scrollContainerRef}
              data-lenis-prevent
              className="h-full overflow-x-auto flex hide-scrollbar touch-pan-x"
              style={{ cursor: 'grab' }}
              onMouseDown={(e) => {
                const el = e.currentTarget
                el.style.cursor = 'grabbing'
                const startX = e.pageX - el.offsetLeft
                const scrollLeft = el.scrollLeft

                const onMouseMove = (e: MouseEvent) => {
                  const x = e.pageX - el.offsetLeft
                  const walk = (x - startX) * 2
                  targetScrollRef.current = scrollLeft - walk
                }

                const onMouseUp = () => {
                  el.style.cursor = 'grab'
                  document.removeEventListener('mousemove', onMouseMove)
                  document.removeEventListener('mouseup', onMouseUp)
                }

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
              }}
            >
              <div className="flex h-full min-w-max">
                
                {/* PART 1: HERO DETAIL */}
                <section className="w-screen h-full flex flex-col justify-center p-10 md:p-24 border-r border-white/5 flex-shrink-0 relative">
                   <motion.span 
                     layoutId={`subtitle-${currentProject.id}`}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="text-blue-500 font-mono text-xs tracking-[0.5em] mb-8 uppercase"
                   >
                     {currentProject.subtitle}
                   </motion.span>
                   <motion.h2 
                     layoutId={`title-${currentProject.id}`}
                     className="text-6xl md:text-[10vw] font-black uppercase italic leading-[0.8] mb-12 text-blue-500"
                   >
                     {currentProject.title}
                   </motion.h2>
                   
                   <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 0.8, y: 0 }}
                     transition={{ delay: 0.4 }}
                     className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl leading-relaxed"
                   >
                     {currentProject.desc}
                   </motion.p>
                   
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                     className="flex gap-16 mt-4"
                   >
                      <div className="space-y-2">
                          <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono">Tech_Core</p>
                          <p className="text-sm font-mono text-white/80">{currentProject.tech}</p>
                      </div>
                      <div className="space-y-2">
                          <p className="text-white/20 text-[10px] uppercase tracking-widest font-mono">Date</p>
                          <p className="text-sm font-mono text-white/80">2025_EXP_ARCH</p>
                      </div>
                   </motion.div>

                   {/* Background Hint */}
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 0.1 }}
                     transition={{ delay: 1, duration: 1 }}
                     className="absolute bottom-10 left-24 font-mono text-[10px] tracking-[1em] uppercase hidden md:flex items-center gap-4"
                   >
                     <span>Scroll_Right_To_Analyze</span>
                     <motion.span
                       animate={{ x: [0, 10, 0] }}
                       transition={{ repeat: Infinity, duration: 1.5 }}
                     >
                       →
                     </motion.span>
                   </motion.div>
                </section>

                {/* PART 2: DEEP DIVE (Content Blocks) */}
                <section className="w-screen h-full flex items-center p-10 md:p-24 bg-white/[0.01] border-r border-white/5 flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-32">
                      {currentProject.details.map((detail, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                            key={idx} 
                            className="max-w-xs group"
                          >
                              <span className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.4em] block mb-8 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                                // {detail.label}
                              </span>
                              <h3 className="text-2xl md:text-3xl font-light leading-relaxed text-white/90 group-hover:text-white transition-colors">
                                {detail.text}
                              </h3>
                          </motion.div>
                      ))}
                  </div>
                </section>

                {/* PART 3: NEXT BRIDGE (Seamless Transition) */}
                <section className="w-screen h-full flex flex-col items-center justify-center p-10 md:p-24 flex-shrink-0 bg-blue-500/[0.03]">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="text-white/20 font-mono text-[10px] uppercase tracking-[1.2em] mb-16 italic"
                  >
                    Next_Archive_Sequence
                  </motion.p>
                  <motion.h2 
                      whileHover={{ scale: 1.05, color: 'rgb(59 130 246)' }}
                      transition={{ duration: 0.3 }}
                      className="text-[8vw] font-black uppercase italic text-white/5 cursor-pointer text-center leading-none tracking-tighter"
                      onClick={() => {
                          const nextIdx = (projects.findIndex(p => p.id === activeId) + 1) % projects.length;
                          handleProjectChange(projects[nextIdx].id);
                      }}
                  >
                    {projects[(projects.findIndex(p => p.id === activeId) + 1) % projects.length].title}
                  </motion.h2>
                </section>

              </div>
            </div>

            {/* PROGRESS INDICATOR (Horizontal Line at Bottom) */}
            <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-[180] pointer-events-none">
              <motion.div 
                id="scroll-progress" 
                initial={{ width: '0%' }}
                className="h-full bg-blue-500 transition-all duration-100 ease-out"
                style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}