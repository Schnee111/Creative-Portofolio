'use client'

import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { projects } from '@/config/projects'
import SectionRenderer from '@/components/project/SectionRenderer'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import BackgroundOverlay from '@/components/ui/BackgroundOverlay'

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
    <main
      ref={mainRef}
      style={{ backgroundColor: currentProject.bgcolor || '#050505', transition: 'background-color 1s ease' }}
      className="no-smooth-scroll relative min-h-screen md:fixed md:inset-0 md:h-screen w-full max-w-[100vw] md:overflow-hidden font-sans overscroll-none selection:bg-blue-500/20 selection:text-blue-200"
    >
      <div className="hidden md:block">
        <BackgroundOverlay type={currentProject.overlay} />
      </div>


      {/* Header - Outside contentRef to avoid transform/filter interference */}
      <nav className="fixed top-0 left-0 w-full px-4 md:px-8 py-6 md:py-8 flex justify-between items-start z-[350] pointer-events-none mix-blend-difference">
        <div className="flex flex-col gap-1">
          <span className="text-white/50 text-[10px] font-mono tracking-widest uppercase">Project</span>
          <h2 className="text-white text-xl font-bold tracking-widest uppercase">{currentProject.title}</h2>
        </div>
        <Link href="/dashboard" className="pointer-events-auto group flex flex-col items-end gap-1">
          <span className="text-[9px] font-mono text-white/50 group-hover:text-white transition-colors tracking-widest uppercase">Back</span>
          <div className="w-6 h-[1px] bg-white/20 group-hover:bg-white transition-colors" />
        </Link>
      </nav>

      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="motion-blur-x" x="-25%" y="-25%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0,0" />
          </filter>
        </defs>
      </svg>

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

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div
          ref={scrollContainerRef}
          className="flex-1 w-full overflow-y-auto overflow-x-hidden md:overflow-x-auto flex flex-col md:flex-row hide-scrollbar relative z-10 md:touch-none"
        >
          {/* Padding top to prevent header overlap on mobile */}
          <div className="flex flex-col md:flex-row h-auto md:h-full w-full md:min-w-max items-center justify-center md:justify-start pt-20 md:pt-0 pl-0 md:pl-0 gap-y-20 md:gap-x-[10vw]">

            {/* Dynamic Sections */}
            {currentProject.sections.map((section, index) => (
              <SectionRenderer
                key={section.id}
                section={section}
                project={currentProject}
                index={index}
                nextProject={nextProject}
                pullProgress={pullProgress}
                scrollContainerRef={scrollContainerRef}
              />
            ))}

          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-[350] pointer-events-none hidden md:block">
          <div id="scroll-progress" className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb]" />
        </div>

      </div>
    </main>
  )
}
