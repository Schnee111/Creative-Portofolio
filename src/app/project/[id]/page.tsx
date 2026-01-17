'use client'

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { projects } from '@/config/projects'

const ProjectMedia = ({ src, alt, type, rootRef }: { src: string; alt: string; type: string; rootRef: any }) => {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  // Margin disesuaikan agar trigger lebih cepat di mobile
  const isInView = useInView(containerRef, { root: rootRef, once: true, margin: "0px" });

  return (
    <motion.div 
      ref={containerRef}
      initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
      animate={isInView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } : {}}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden flex-shrink-0 mb-8 md:mb-0 md:mx-12 
        ${type === 'full' ? 'h-[50vh] md:h-[82vh] w-full md:w-[80vw]' : 
          type === 'tall' ? 'h-[70vh] md:h-[78vh] w-full md:w-[38vw] rounded-2xl' : 
          'h-[45vh] md:h-[58vh] w-full md:w-[32vw] rounded-xl shadow-2xl'}
        bg-neutral-900 border border-white/5
      `}
    >
      <img 
        src={src} 
        alt={alt} 
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[2s] ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`} 
      />
    </motion.div>
  );
};

export default function ProjectDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [switchProgress, setSwitchProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [displayId, setDisplayId] = useState(id as string)
  
  const mainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])

  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const bufferRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const isNavigating = useRef(false)

  const currentProject = useMemo(() => projects.find(p => p.id === id), [id])
  const nextProject = useMemo(() => {
    if (!currentProject) return null
    const idx = projects.findIndex(p => p.id === id)
    return projects[(idx + 1) % projects.length]
  }, [id, currentProject])

  useEffect(() => {
    setMounted(true)
    setDisplayId(id as string)
  }, [id])

  useLayoutEffect(() => {
    if (!mounted) return
    isNavigating.current = true
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => { isNavigating.current = false }
      })

      tl.to(panelsRef.current, {
        x: "100%",
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.inOut"
      })
      .from(contentRef.current, {
        scale: 0.96,
        filter: "blur(15px)",
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")
    }, mainRef)

    return () => ctx.revert()
  }, [id, mounted])

  useEffect(() => {
    if (!mounted) return

    const onWheel = (e: WheelEvent) => {
      // NON-AKTIFKAN CUSTOM SCROLL DI MOBILE
      if (window.innerWidth < 768) return;

      if (isNavigating.current) {
        e.preventDefault()
        return
      }

      const el = scrollContainerRef.current
      if (!el) return
      
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return 

      if (currentScrollRef.current >= maxScroll - 10 && e.deltaY > 0) {
        e.preventDefault()
        bufferRef.current += e.deltaY
        const prog = Math.min(100, (bufferRef.current / 700) * 100)
        setSwitchProgress(prog)

        if (bufferRef.current > 700) {
          triggerExitTransition()
        }
      } else {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault()
          bufferRef.current = Math.max(0, bufferRef.current - 40)
          setSwitchProgress((bufferRef.current / 700) * 100)
          targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current + e.deltaY * 2.5, maxScroll))
        }
      }
    }

    const triggerExitTransition = () => {
      if (isNavigating.current) return
      if (nextProject) setDisplayId(nextProject.id)
      isNavigating.current = true

      const tl = gsap.timeline({
        onComplete: () => router.push(`/project/${nextProject?.id}`)
      })

      tl.set(panelsRef.current, { x: "-100%" })
        .to(panelsRef.current, {
          x: "0%",
          stagger: 0.08,
          duration: 0.8,
          ease: "expo.inOut"
        })
        .to(contentRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: "blur(20px)",
          duration: 0.8
        }, "-=0.8")
    }

    const smoothLoop = () => {
      // HANYA JALANKAN SMOOTH SCROLL DI DESKTOP
      if (scrollContainerRef.current && window.innerWidth >= 768) {
        currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08
        scrollContainerRef.current.scrollLeft = currentScrollRef.current
        const max = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
        const progress = max > 0 ? (currentScrollRef.current / max) * 100 : 0
        const progressBar = document.getElementById('scroll-progress')
        if (progressBar) progressBar.style.width = `${progress}%`
      }
      animationFrameRef.current = requestAnimationFrame(smoothLoop)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    animationFrameRef.current = requestAnimationFrame(smoothLoop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [id, nextProject, router, mounted])

  if (!currentProject || !mounted) return null

  return (
    // main: h-screen tetap fixed, tapi child kontainer akan kita atur overflow-nya
    <main ref={mainRef} className="fixed inset-0 h-screen w-screen bg-[#050505] overflow-hidden font-sans">
      
      {/* Tirai Transisi */}
      <div className="fixed inset-0 z-[999] pointer-events-none flex flex-col">
        {[...Array(3)].map((_, i) => (
          <div key={i} ref={(el) => { if (el) panelsRef.current[i] = el }} className="flex-1 bg-blue-600 w-full relative border-b border-white/5" style={{ transform: 'translateX(0%)' }}>
            {i === 1 && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/10 font-black text-[12vw] md:text-[15vw] italic select-none uppercase">{displayId}</span>
               </div>
            )}
          </div>
        ))}
      </div>

      <div ref={contentRef} className="h-full w-full">
        <nav className="fixed top-0 w-full p-6 md:p-12 flex justify-between items-center z-[350] pointer-events-none font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-blue-500 text-[10px] tracking-[0.4em] uppercase font-bold">Node // {currentProject.id}</span>
            <div className="h-[1px] w-12 bg-blue-500/30" />
          </div>
          <Link href="/dashboard" className="pointer-events-auto text-white/30 hover:text-white text-[9px] tracking-widest uppercase border border-white/5 px-6 py-2 rounded-full backdrop-blur-md bg-white/[0.02] transition-all">
            [ EXIT ]
          </Link>
        </nav>

        {/* KONTAINER SCROLL: Mobile (Y-Auto) | Desktop (X-Auto) */}
        <div 
          ref={scrollContainerRef} 
          className="h-full w-full overflow-y-auto md:overflow-y-hidden md:overflow-x-auto flex flex-col md:flex-row hide-scrollbar relative z-10"
        >
          <div className="flex flex-col md:flex-row h-auto md:h-full min-w-full md:min-w-max items-center pr-0">
            
            {/* HERO */}
            <section className="w-full md:w-screen h-screen md:h-full flex flex-col justify-center p-8 md:p-32 flex-shrink-0 relative border-b md:border-b-0 md:border-r border-white/5">
              <div className="absolute inset-0 opacity-20">
                <img src={currentProject.mainImage} className="w-full h-full object-cover opacity-80 blur-[2px]" alt="" />
              </div>
              <div className="relative z-10 max-w-5xl">
                <span className="text-blue-500 font-mono text-[10px] md:text-[11px] tracking-[0.8em] block uppercase mb-6 md:mb-8 font-black">{currentProject.subtitle}</span>
                <h1 className="text-4xl md:text-[8vw] font-display font-black uppercase italic leading-[0.9] md:leading-[0.8] text-white tracking-tighter mb-8 md:mb-12">{currentProject.title}</h1>
                <p className="text-sm md:text-xl text-white/30 max-w-2xl font-light italic lowercase leading-relaxed">{currentProject.desc}</p>
              </div>
            </section>

            {/* SECTIONS */}
            {currentProject.sections.map((section, idx) => (
              <section key={idx} className="w-full md:w-[48vw] h-auto md:h-full flex items-center p-8 md:p-24 border-b md:border-b-0 md:border-r border-white/5 flex-shrink-0 bg-white/[0.01]">
                <div className="space-y-8 md:space-y-12 w-full flex flex-col">
                  <ProjectMedia src={currentProject.gallery[idx]?.url || currentProject.mainImage} alt="Analysis" type="card" rootRef={scrollContainerRef} />
                  <div className="space-y-4 md:space-y-6 px-0 md:px-4">
                    <span className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.5em] font-bold">// 0{idx+1}_{section.title}</span>
                    <h3 className="text-xl md:text-3xl text-white/80 font-light tracking-tight max-w-md">{section.content}</h3>
                  </div>
                </div>
              </section>
            ))}

            {/* GALLERY */}
            <section className="w-full md:min-w-max h-auto md:h-full flex flex-col md:flex-row items-center px-8 md:px-0 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 py-12 md:py-0">
              {currentProject.gallery.map((img, i) => (
                <ProjectMedia key={i} src={img.url} alt={`gallery-${i}`} type={img.type} rootRef={scrollContainerRef} />
              ))}
            </section>

            {/* BRIDGE */}
            {nextProject && (
              <section className="w-full md:w-[40vw] h-[70vh] md:h-full flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-[#0a0a0a] group border-l-0 md:border-l border-white/5">
                <div className="absolute inset-0 z-0 opacity-20 transition-all duration-1000">
                  <img src={nextProject.mainImage} className="w-full h-full object-cover opacity-40 blur-[2px]" alt="" />
                </div>
                <div className="relative z-10 text-center px-8">
                  <p className="text-blue-500 font-mono text-[10px] uppercase tracking-[1em] mb-8 md:mb-12 italic font-black animate-pulse">Next_Archive</p>
                  <h2 className="text-3xl md:text-6xl font-display font-black uppercase italic text-white transition-all duration-700 leading-none tracking-tighter mb-12 md:mb-16">{nextProject.title}</h2>
                  
                  {/* Tombol Khusus Mobile untuk Pindah Project karena Wheel Buffer tidak ada di Mobile */}
                  <div className="md:hidden">
                    <button 
                      onClick={() => {
                        if (isNavigating.current) return;
                        setDisplayId(nextProject.id);
                        isNavigating.current = true;
                        const tl = gsap.timeline({ onComplete: () => router.push(`/project/${nextProject.id}`) });
                        tl.set(panelsRef.current, { x: "-100%" })
                          .to(panelsRef.current, { x: "0%", stagger: 0.08, duration: 0.8, ease: "expo.inOut" });
                      }}
                      className="bg-blue-600 text-white font-mono text-[10px] tracking-widest uppercase px-10 py-4 rounded-full active:scale-95 transition-transform"
                    >
                      [ Synchronize_Next ]
                    </button>
                  </div>

                  <div className="hidden md:flex flex-col items-center gap-6">
                    <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
                      <motion.div style={{ width: `${switchProgress}%` }} className="h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-white/20">{switchProgress > 30 ? "SYNCING..." : "PULL_TO_SYNC"}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-[4px] bg-white/5 z-[350] pointer-events-none hidden md:block">
        <div id="scroll-progress" className="h-full bg-blue-500 shadow-[0_0_30px_#3b82f6]" />
      </div>
    </main>
  )
}