'use client'

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { projects } from '@/config/projects'

// --- KOMPONEN GAMBAR: LUSION STYLE (Reverse Scale) ---
const ProjectMedia = ({ src, type, index }: { src: string; type: string; index: number }) => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "0px -10% 0px -10%" })

  // Ukuran Variatif (Rounded & Aspect Ratio)
  const sizeClasses = type === 'full' 
    ? 'w-[85vw] md:w-[60vw] h-[60vh] md:h-[80vh] rounded-[2rem]' 
    : type === 'tall' 
      ? 'w-[85vw] md:w-[30vw] h-[60vh] md:h-[70vh] rounded-[2rem]' 
      : 'w-[85vw] md:w-[45vw] h-[40vh] md:h-[50vh] rounded-[1.5rem]';

  return (
    <div ref={containerRef} className={`relative flex-shrink-0 group ${sizeClasses} overflow-hidden bg-[#0a0a0a]`}>
      <motion.div
        className="w-full h-full overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} 
      >
        <motion.img 
          src={src} 
          alt="Project Asset"
          initial={{ scale: 1.3 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
        />
        
        <div className="absolute top-6 left-6 z-10">
           <motion.span 
             initial={{ y: -20, opacity: 0 }}
             animate={isInView ? { y: 0, opacity: 1 } : {}}
             transition={{ delay: 0.5 }}
             className="text-[9px] font-mono text-white/50 tracking-widest uppercase bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5"
           >
             Fig. 0{index}
           </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default function ProjectDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [displayId, setDisplayId] = useState(id as string)
  const [pullProgress, setPullProgress] = useState(0)
  
  const [isScrollLocked, setIsScrollLocked] = useState(true)

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
    targetScrollRef.current = 0
    currentScrollRef.current = 0
    bufferRef.current = 0
    setPullProgress(0)
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
    isNavigating.current = false
  }, [id])

  const handleNextProject = () => {
    if (isNavigating.current || !nextProject) return
    isNavigating.current = true
    setIsScrollLocked(true) 
    setDisplayId(nextProject.id)

    const tl = gsap.timeline({
      onComplete: () => router.push(`/project/${nextProject.id}`)
    })

    tl.set(panelsRef.current, { x: "-100%" })
      .to(panelsRef.current, {
        x: "0%",
        stagger: 0.05,
        duration: 0.8,
        ease: "expo.inOut"
      })
  }

  useEffect(() => {
    if (!mounted) return

    const onWheel = (e: WheelEvent) => {
      if (isScrollLocked) {
        e.preventDefault() 
        return 
      }

      if (window.innerWidth < 768) return; 

      const el = scrollContainerRef.current
      if (!el) return
      
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return 

      // === LOGIC PULL (Tarik) ===
      const isAtEnd = currentScrollRef.current >= maxScroll - 10;
      const isPullingNext = e.deltaY > 0;

      if (isAtEnd && isPullingNext) {
        e.preventDefault();
        // Berikan resistance (tahanan) agar tarikan terasa berat
        bufferRef.current += e.deltaY * 0.5; 
        const progress = Math.min(100, (bufferRef.current / 600) * 100);
        setPullProgress(progress);

        if (bufferRef.current > 600) {
           handleNextProject();
        }
      } else {
        // Reset buffer jika berbalik
        if (bufferRef.current > 0) {
           bufferRef.current = Math.max(0, bufferRef.current - 20); 
           setPullProgress((bufferRef.current / 600) * 100);
        }

        // === PHYSICS ENGINE (Lusion Feel) ===
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault()
          
          // 1. CLAMPING: Batasi kecepatan maksimal scroll per frame
          // Agar tidak "terbang" saat swipe trackpad kencang
          let delta = e.deltaY;
          if (Math.abs(delta) > 100) {
             delta = Math.sign(delta) * 100;
          }

          // 2. MULTIPLIER: Seberapa jauh target bergerak per scroll
          // Angka kecil (1.2 - 1.5) = Terasa berat/mahal
          // Angka besar (2.0+) = Terasa ringan/cepat
          targetScrollRef.current += delta * 1.5 
          
          // Clamp target agar tidak keluar batas
          targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, maxScroll))
        }
      }
    }

    const smoothLoop = () => {
      if (scrollContainerRef.current && window.innerWidth >= 768) {
        if (!isScrollLocked) {
           // === 3. LERP FACTOR (Kunci Kehalusan) ===
           // 0.1  = Standar
           // 0.05 = Cinematic (Lusion) - Sangat halus, berhenti perlahan
           // 0.03 = Sangat berat (Seperti di dalam air)
           currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.06
        } 
        
        // PENTING: Gunakan translate3d daripada scrollLeft untuk performa GPU (Hardware Acceleration)
        // scrollContainerRef.current.scrollLeft = currentScrollRef.current <-- Cara lama (bisa stutter)
        // Cara Baru (GPU Friendly):
        if (panelsRef.current) {
             // Kita manipulasi scroll container via transform, bukan scroll native
             // Tapi karena logic layout kamu pakai native scroll overflow, 
             // kita tetap pakai scrollLeft tapi pastikan content didalamnya ringan.
             // Untuk struktur saat ini, scrollLeft masih oke.
             scrollContainerRef.current.scrollLeft = currentScrollRef.current
        }
        
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
  }, [mounted, nextProject, isScrollLocked]) 

  useLayoutEffect(() => {
    if (!mounted) return
    setIsScrollLocked(true)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsScrollLocked(false)
        }
      })

      tl.to(panelsRef.current, {
        x: "100%",
        stagger: 0.05,
        duration: 1.4,
        ease: "expo.inOut"
      })
      .from(contentRef.current, {
        scale: 0.95,
        filter: "blur(5px)",
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=1.0") 

    }, mainRef)
    return () => ctx.revert()
  }, [mounted])

  if (!currentProject || !mounted) return null

  return (
    <main ref={mainRef} className="fixed inset-0 h-screen w-screen bg-[#050505] overflow-hidden font-sans overscroll-none selection:bg-blue-500/20 selection:text-blue-200">
      
      {/* Tirai Transisi Anti-Glitch (120vh) */}
      <div className="fixed top-1/2 left-0 w-full h-[100vh] -translate-y-1/2 z-[9999] pointer-events-none flex flex-col">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            ref={(el) => { if (el) panelsRef.current[i] = el }} 
            className="flex-1 bg-neutral-950 w-full relative" 
            style={{ transform: 'translateX(0%)', willChange: 'transform' }} 
          >
             {i === 1 && (
               <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                 <span className="text-[12vw] font-black text-white/10 uppercase italic tracking-tighter">{displayId}</span>
               </div>
             )}
          </div>
        ))}
      </div>

      <div ref={contentRef} className="h-full w-full flex flex-col">
        
        <nav className="fixed top-0 w-full px-8 py-8 flex justify-between items-start z-[350] pointer-events-none mix-blend-difference">
          <div className="flex flex-col gap-1">
            <span className="text-white/50 text-[9px] font-mono tracking-widest uppercase">Project</span>
            <h2 className="text-white text-sm font-bold tracking-widest uppercase">{currentProject.title}</h2>
          </div>
          <Link href="/dashboard" className="pointer-events-auto group flex flex-col items-end gap-1">
             <span className="text-[9px] font-mono text-white/50 group-hover:text-white transition-colors tracking-widest uppercase">Back</span>
             <div className="w-6 h-[1px] bg-white/20 group-hover:bg-white transition-colors" />
          </Link>
        </nav>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div 
          ref={scrollContainerRef} 
          className="flex-1 w-full overflow-y-auto md:overflow-y-hidden md:overflow-x-auto flex flex-col md:flex-row hide-scrollbar relative z-10"
        >
          {/* Layout Horizontal */}
          <div className="flex flex-col md:flex-row h-auto md:h-full min-w-max items-center pt-32 md:pt-0 pl-0 md:pl-0 gap-y-32 md:gap-x-[10vw]">
            
            {/* 1. TITLE & INTRO */}
            <section className="w-full md:w-[35vw] flex-shrink-0 px-6 md:px-16 flex flex-col justify-center h-auto md:h-full relative">
               <div className="relative z-10">
                  <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase block mb-8">00 // Overview</span>
                  <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed tracking-wide mb-12">
                    {currentProject.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 opacity-60">
                    <div>
                      <span className="text-[9px] text-white/40 uppercase block mb-2 font-mono tracking-widest">Client</span>
                      <span className="text-[11px] text-white uppercase tracking-wider">Confidential</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 uppercase block mb-2 font-mono tracking-widest">Stack</span>
                      <span className="text-[11px] text-white uppercase tracking-wider">{currentProject.tech}</span>
                    </div>
                  </div>
               </div>
            </section>

            {/* 2. MAIN IMAGE */}
            <ProjectMedia src={currentProject.mainImage} type="full" index={1} />

            {/* 3. TEXT SECTION */}
            {currentProject.sections[0] && (
               <div className="w-[85vw] md:w-[25vw] flex-shrink-0 px-4 flex items-center justify-center">
                 <div className="text-left">
                    <span className="text-blue-500 font-mono text-[9px] mb-4 block tracking-widest">01 // Concept</span>
                    <p className="text-white/60 text-sm font-light leading-7">{currentProject.sections[0].content}</p>
                 </div>
               </div>
            )}

            {/* 4. GALLERY */}
            {currentProject.gallery.map((img, i) => (
               <ProjectMedia 
                  key={i} 
                  src={img.url} 
                  type={i % 2 === 0 ? 'tall' : 'wide'} 
                  index={i + 2} 
               />
            ))}

            {/* 5. BRIDGE (FULL HEIGHT & SEAMLESS) */}
            {nextProject && (
              <section 
                className="w-full md:w-[30vw] h-[60vh] md:h-screen flex-shrink-0 relative overflow-hidden group bg-black border-l border-white/5"
              >
                {/* Image BG (Redup) */}
                <div className="absolute inset-0 opacity-40 transition-all duration-1000">
                   <img src={nextProject.mainImage} className="w-full h-full object-cover" alt="" />
                </div>
                
                {/* Content Center */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase mb-6">
                    {pullProgress > 20 ? "Keep Pulling" : "Next Project"}
                  </span>
                  
                  <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-8"
                      style={{ transform: `scale(${1 + pullProgress * 0.0005})` }} 
                  >
                    {nextProject.title}
                  </h2>

                  {/* Minimal Progress Line */}
                  <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                     <div 
                        className="h-full bg-blue-500 transition-all duration-75 ease-linear" 
                        style={{ width: `${pullProgress}%` }} 
                     />
                  </div>
                  
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-4">
                     Scroll to Sync
                  </span>
                </div>
              </section>
            )}

            {/* NO SPACER AT THE END - Bridge is the end */}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-[350] pointer-events-none hidden md:block">
          <div id="scroll-progress" className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
        </div>

      </div>
    </main>
  )
}