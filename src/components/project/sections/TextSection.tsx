'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TextSection as TextSectionType } from '@/config/projects'

interface TextSectionProps {
    section: TextSectionType
    index: number
}

export default function TextSection({ section, index }: TextSectionProps) {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: false, margin: "0px -10% 0px -10%" })

    if (section.type === 'text-quote') {
        return (
            <motion.div
                ref={sectionRef}
                className="w-[85vw] md:w-[35vw] flex-shrink-0 px-4 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <blockquote className="text-center">
                    <p className="text-2xl md:text-4xl text-white/80 font-light italic leading-relaxed">
                        {section.content}
                    </p>
                </blockquote>
            </motion.div>
        )
    }

    return (
        <motion.div
            ref={sectionRef}
            className="w-[85vw] md:w-[25vw] flex-shrink-0 px-6 md:px-4 flex items-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="text-left w-full max-w-[85vw] md:max-w-none mx-auto md:mx-0">
                {section.title && (
                    <span className="text-blue-500 font-mono text-[10px] mb-4 block tracking-widest">
                        {String(index).padStart(2, '0')} // {section.title}
                    </span>
                )}
                <p className="text-white/60 text-base md:text-lg font-light leading-relaxed">
                    {section.content}
                </p>
            </div>
        </motion.div>
    )
}
