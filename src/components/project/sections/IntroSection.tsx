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
                            Client
                        </span>
                        <span className="text-[11px] text-white uppercase tracking-wider">
                            Confidential
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
            </motion.div>
        </section>
    )
}
