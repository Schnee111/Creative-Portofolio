'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { projects } from '@/config/projects'

const transition = { 
  duration: 1.2, 
  ease: [0.22, 1, 0.36, 1] 
} as const;

// Komponen Media dengan Observer yang presisi
const ProjectMedia = ({ src, alt, type, rootRef }: { src: string; alt: string; type: string; rootRef: any }) => {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isInView = useInView(containerRef, { 
    root: rootRef, 
    once: true, 
    margin: "0px 100px 0px 100px" 
  });

  return (
    <motion.div 
      ref={containerRef}
      className={`relative overflow-hidden flex-shrink-0 mx-8 transition-all duration-[1.5s]
        ${type === 'full' ? 'h-[80vh] w-[75vw]' : type === 'tall' ? 'h-[75vh] w-[35vw] rounded-2xl' : 'h-[55vh] w-[30vw] rounded-xl shadow-xl'}
        bg-neutral-900
      `}
      style={{
        clipPath: isInView ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
        opacity: isInView ? 1 : 0,
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[1.5s] ${loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`} 
      />
      <div className="absolute bottom-4 left-4 font-mono text-[7px] text-white/20 uppercase tracking-[0.3em]">
        NODE_ASSET // {alt}
      </div>
    </motion.div>
  );
};

export default function ProjectDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [switchProgress, setSwitchProgress] = useState(0)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const bufferRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  const currentProject = useMemo(() => projects.find(p => p.id === id), [id])
  const nextProject = useMemo(() => {
    if (!currentProject) return null
    const idx = projects.findIndex(p => p.id === id)
    return projects[(idx + 1) % projects.length]
  }, [id, currentProject])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !currentProject) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const maxScroll = el.scrollWidth - el.clientWidth
      
      if (currentScrollRef.current >= maxScroll - 5 && e.deltaY > 0) {
        bufferRef.current += e.deltaY
        setSwitchProgress(Math.min(100, (bufferRef.current / 800) * 100))
        if (bufferRef.current > 800) {
          gsap.to(".global-wipe", { x: "0%", duration: 0.8, ease: "expo.inOut", onComplete: () => router.push(`/project/${nextProject?.id}`) })
        }
      } else {
        bufferRef.current = Math.max(0, bufferRef.current - 50)
        setSwitchProgress((bufferRef.current / 800) * 100)
        targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current + e.deltaY * 2.2, maxScroll))
      }
    }

    const smoothLoop = () => {
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08
      el.scrollLeft = currentScrollRef.current
      const progress = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100
      const progressBar = document.getElementById('scroll-progress')
      if (progressBar) progressBar.style.width = `${progress}%`
      animationFrameRef.current = requestAnimationFrame(smoothLoop)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    animationFrameRef.current = requestAnimationFrame(smoothLoop)
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [id, currentProject, nextProject, router])

  if (!currentProject) return null

  return (
    <main className="fixed inset-0 h-screen w-screen bg-[#050505] overflow-hidden overscroll-none font-sans selection:bg-blue-500/30">
      <div className="global-wipe fixed inset-0 bg-blue-600 z-[500] translate-x-[-100%] pointer-events-none" />

      {/* Navigasi Minimalis */}
      <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-center z-[350] pointer-events-none font-mono">
        <div className="flex flex-col gap-1">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-500 text-[9px] tracking-[0.4em] uppercase font-bold">
            Project_Node // {currentProject.id}
          </motion.span>
          <div className="h-[1px] w-8 bg-blue-500/30" />
        </div>
        <Link href="/dashboard" className="pointer-events-auto text-white/30 hover:text-white text-[9px] tracking-widest uppercase border border-white/5 px-6 py-2 rounded-full backdrop-blur-md bg-white/[0.02] transition-all">
          [ back_to_archives ]
        </Link>
      </nav>

      <div ref={scrollContainerRef} className="h-full w-full overflow-x-auto flex hide-scrollbar touch-pan-x overscroll-none">
        <div className="flex h-full min-w-max items-center">
          
          {/* 1. HERO SECTION (Font Scaled Down) */}
          <section className="w-screen h-full flex flex-col justify-center p-10 md:p-24 flex-shrink-0 relative border-r border-white/5">
            <div className="absolute inset-0 opacity-10 bg-black">
              <img src={currentProject.mainImage} alt="" className="w-full h-full object-cover blur" />
            </div>
            <div className="relative z-10">
              <div className="overflow-hidden mb-6">
                <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ ...transition, delay: 0.5 }} className="text-blue-500 font-mono text-[10px] tracking-[0.6em] block uppercase font-bold">
                  {currentProject.subtitle}
                </motion.span>
              </div>
              <motion.h1 
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={transition}
                className="text-6xl md:text-[7vw] font-display font-black uppercase italic leading-[0.85] text-white tracking-tighter mb-10"
              >
                {currentProject.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.6 }} className="text-base md:text-lg text-white max-w-lg leading-relaxed font-light italic lowercase">
                {currentProject.desc}
              </motion.p>
            </div>
          </section>

          {/* 2. ANALYSIS SECTION (Refined Sizes to prevent cut-off) */}
          {currentProject.sections.map((section, idx) => (
            <section key={idx} className="w-[40vw] h-full flex items-center p-10 md:p-16 border-r border-white/5 flex-shrink-0 bg-white/[0.01]">
              <div className="space-y-10 w-full max-h-[85vh] flex flex-col justify-center">
                <div className="w-full aspect-[16/10] overflow-hidden rounded-lg border border-white/5 shadow-2xl">
                   <ProjectMedia src={currentProject.gallery[idx]?.url || currentProject.mainImage} alt="Analysis" type="card" rootRef={scrollContainerRef} />
                </div>
                <div className="space-y-4 px-2">
                  <span className="text-blue-500 font-mono text-[9px] uppercase tracking-[0.4em] font-bold opacity-70">
                    // 0{idx + 1}_{section.title}
                  </span>
                  <h3 className="text-xl md:text-2xl text-white/80 font-light leading-snug tracking-tight">
                    {section.content}
                  </h3>
                </div>
              </div>
            </section>
          ))}

          {/* 3. GALLERY SECTION */}
          <section className="min-w-max h-full flex items-center px-0 flex-shrink-0 border-r border-white/5">
            {currentProject.gallery.map((img, i) => (
              <ProjectMedia key={i} src={img.url} alt={`gallery-${i}`} type={img.type} rootRef={scrollContainerRef} />
            ))}
          </section>

          {/* 4. BRIDGE SECTION (Small Right Section with Image) */}
          {nextProject && (
            <section className="w-[45vw] h-full flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-[#0a0a0a] group border-l border-white/5">
              {/* Background Image restricted to this section */}
              <div className="absolute inset-0 z-0 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000">
                <img src={nextProject.mainImage} alt="next" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black" />
              </div>

              <div className="relative z-10 text-center px-12">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ root: scrollContainerRef }}>
                  <p className="text-blue-500 font-mono text-[9px] uppercase tracking-[0.8em] mb-12 italic font-black">Next_Archive</p>
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic text-white/20 group-hover:text-white transition-all duration-700 leading-none tracking-tighter mb-14">
                    {nextProject.title}
                  </h2>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden">
                      <motion.div style={{ width: `${switchProgress}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/20">
                      {switchProgress > 30 ? "RELEASING..." : "PULL_TO_SYNC"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* UI Elements */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-[350] pointer-events-none">
        <div id="scroll-progress" className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
      </div>

      {/* Subtle CRT Mask */}
      <div className="fixed inset-0 pointer-events-none z-[400] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,2px_100%]" />
    </main>
  )
}