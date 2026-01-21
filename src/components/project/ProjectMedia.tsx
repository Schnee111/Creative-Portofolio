'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ProjectMediaProps {
    src: string
    type: string
    index: number
}

export default function ProjectMedia({ src, type, index }: ProjectMediaProps) {
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
}
