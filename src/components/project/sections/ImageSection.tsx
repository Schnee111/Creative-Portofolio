'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ImageSection as ImageSectionType } from '@/config/projects'
import Image from 'next/image'

interface ImageSectionProps {
    section: ImageSectionType
    index: number
}

export default function ImageSection({ section, index }: ImageSectionProps) {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: false, margin: "0px 0% 0px 0%" })

    const getSizeClasses = () => {
        switch (section.type) {
            case 'image-full':
                // Truly full height - covers entire viewport
                return 'w-[85vw] md:w-[60vw] h-screen rounded-[2rem]'
            case 'image-wide':
                // Normal size - landscape orientation
                return 'w-[85vw] md:w-[60vw] h-[60vh] md:h-[65vh] rounded-[2rem]'
            case 'image-tall':
                // Normal size - portrait orientation
                return 'w-[85vw] md:w-[25vw] h-[60vh] md:h-[85vh] rounded-[2rem]'
            default:
                return 'w-[85vw] md:w-[60vw] h-[60vh] md:h-[65vh] rounded-[2rem]'
        }
    }

    return (
        <motion.div
            ref={containerRef}
            className={`relative flex-shrink-0 group ${getSizeClasses()} overflow-hidden bg-[#0a0a0a] z-10 ${section.type === 'image-wide' ? 'md:ml-[5vw]' : ''}`}
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Image - Scales DOWN (opposite of container) */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.3 }}
                animate={isInView ? { scale: 1 } : { scale: 1.5 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <Image
                    src={section.src}
                    alt={section.alt || `Project image ${index}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority={section.id === 'hero' || index <= 1}
                    loading={section.id === 'hero' || index <= 2 ? 'eager' : 'lazy'}
                    unoptimized={false}
                />
            </motion.div>

            {/* Figure Label */}
            <div className="absolute top-6 left-6 z-10">
                <motion.span
                    initial={{ y: -20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[9px] font-mono text-white/50 tracking-widest uppercase bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5"
                >
                    Fig. {String(index).padStart(2, '0')}
                </motion.span>
            </div>
        </motion.div>
    )
}
