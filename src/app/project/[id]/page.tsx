'use client'

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { projects } from '@/config/projects'
import ProjectMedia from '@/components/dashboard/project/ProjectMedia'
import ProjectBridge from '@/components/dashboard/project/ProjectBridge'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'

export default function ProjectDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [displayId, setDisplayId] = useState(id as string)
  const [isScrollLocked, setIsScrollLocked] = useState(true)

  const mainRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const isNavigating = useRef(false)

  const currentProject = useMemo(() => projects.find(p => p.id === id), [id])
  const nextProject = useMemo(() => {
    if (!currentProject) return null
    const idx = projects.findIndex(p => p.id === id)
    return projects[(idx + 1) % projects.length]
  }, [id, currentProject])

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

  // Use custom horizontal scroll hook
  const { scrollContainerRef, pullProgress } = useHorizontalScroll({
    mounted,
    nextProject,
    isScrollLocked,
    onNextProject: handleNextProject
  })

  useEffect(() => {
    setMounted(true)
    setDisplayId(id as string)

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0
    }
    isNavigating.current = false
  }, [id])

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
            <ProjectBridge nextProject={nextProject} pullProgress={pullProgress} />

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