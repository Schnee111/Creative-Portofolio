'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Project } from '@/config/projects'

interface IntroSectionProps {
    project: Project
}

export default function IntroSection({ project }: IntroSectionProps) {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: false, margin: "0px -10% 0px -10%" })

    return (
        <motion.section
            ref={sectionRef}
            className="w-[90vw] md:w-[50vw] flex-shrink-0 px-6 md:px-20 py-12 md:py-16 flex flex-col justify-center h-auto md:h-full relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="relative z-10">
                <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase block mb-8">
                    00 // Overview
                </span>
                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed tracking-wide mb-12">
                    {project.desc}
                </p>

                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 opacity-60">
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
                </div>
            </div>
        </motion.section>
    )
}
