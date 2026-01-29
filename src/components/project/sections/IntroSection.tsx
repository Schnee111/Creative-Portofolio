'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Project } from '@/config/projects'

interface IntroSectionProps {
    project: Project
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

export default function IntroSection({ project, scrollContainerRef }: IntroSectionProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [hasInitialAnimationDone, setHasInitialAnimationDone] = useState(false)
    const rafRef = useRef<number | null>(null)

    const isTextInView = useInView(textRef, { once: true, margin: "0px 0px -10% 0px" })

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasInitialAnimationDone(true)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const updateParallax = useCallback(() => {
        if (!scrollContainerRef?.current || !sectionRef.current) {
            rafRef.current = requestAnimationFrame(updateParallax)
            return
        }

        const container = scrollContainerRef.current
        const section = sectionRef.current
        const scrollLeft = container.scrollLeft
        const sectionWidth = section.offsetWidth

        const progress = Math.min(1, Math.max(0, scrollLeft / (sectionWidth * 1.5)))
        setScrollProgress(progress)

        rafRef.current = requestAnimationFrame(updateParallax)
    }, [scrollContainerRef])

    useEffect(() => {
        // Only run parallax on desktop
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            rafRef.current = requestAnimationFrame(updateParallax)
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [updateParallax])

    // Calculate parallax values from scroll progress
    const parallaxX = hasInitialAnimationDone ? -scrollProgress * 10 : 0
    const parallaxOpacity = hasInitialAnimationDone ? Math.max(0, 1 - scrollProgress * 1.3) : 1 // Fade to 0
    const parallaxScale = hasInitialAnimationDone ? 1 - scrollProgress * 0.05 : 1 // Scale down to 0.85

    // Staggered Text Variants - FASTER (runs once)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    }

    const words = project.desc.split(" ")

    return (
        <section
            ref={sectionRef}
            style={{
                transform: `translateX(${parallaxX}%) scale(${parallaxScale})`,
                opacity: parallaxOpacity,
                transition: hasInitialAnimationDone ? 'none' : 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: 0, // Lower than image sections
            }}
            className="w-[90vw] md:w-[50vw] flex-shrink-0 px-6 md:px-20 py-12 md:py-16 flex flex-col justify-center h-auto md:h-full relative transform-gpu origin-center will-change-transform md:sticky md:left-0"
        >
            <motion.div
                ref={textRef}
                className="relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isTextInView ? "visible" : "hidden"}
            >
                <motion.span
                    variants={itemVariants}
                    className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase block mb-8"
                >
                    00 // Overview
                </motion.span>

                <div className="mb-12 overflow-hidden">
                    <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed tracking-wide flex flex-wrap gap-x-1.5">
                        {words.map((word, i) => (
                            <motion.span key={i} variants={itemVariants} className="inline-block">
                                {word}
                            </motion.span>
                        ))}
                    </p>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 opacity-60"
                >
                    <div>
                        <span className="text-[9px] text-white/40 uppercase block mb-2 font-mono tracking-widest">
                            Field
                        </span>
                        <span className="text-[11px] text-white uppercase tracking-wider">
                            {project.subtitle}
                        </span>
                    </div>
                    <div>
                        <span className="text-[9px] text-white/40 uppercase block mb-2 font-mono tracking-widest">
                            Stack
                        </span>
                        <span className="text-[11px] text-white uppercase tracking-wider">
                            {project.tech}
                        </span>
                    </div>
                </motion.div>

                {/* Project Links */}
                {(project.github || project.demo) && (
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-3 mt-8"
                    >
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/30 hover:bg-white/10 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="text-[10px] font-medium tracking-wider uppercase text-white/60 group-hover:text-white transition-colors duration-300">View Source</span>
                                <svg className="w-3 h-3 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        )}
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-blue-400/40 hover:bg-blue-500/20 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <svg className="w-4 h-4 text-blue-400/70 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-[10px] font-medium tracking-wider uppercase text-blue-400/80 group-hover:text-blue-300 transition-colors duration-300">Live Demo</span>
                                <svg className="w-3 h-3 text-blue-400/50 group-hover:text-blue-300/80 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </section>
    )
}
