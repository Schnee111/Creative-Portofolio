'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { VideoSection as VideoSectionType } from '@/config/projects'

interface VideoSectionProps {
    section: VideoSectionType
    index: number
}

export default function VideoSection({ section, index }: VideoSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const isInView = useInView(sectionRef, { once: false, margin: "0px -10% 0px -10%" })

    // Autoplay when in viewport, pause when out
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (isInView) {
            video.play().catch(() => {
                // Autoplay blocked by browser, silently ignore
            })
        } else {
            video.pause()
        }
    }, [isInView])

    return (
        <motion.div
            ref={sectionRef}
            className="w-[90vw] md:w-[50vw] h-[60vh] md:h-[70vh] flex-shrink-0 relative overflow-hidden rounded-[2rem] bg-[#0a0a0a]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <video
                ref={videoRef}
                src={section.src}
                poster={section.poster}
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />
        </motion.div>
    )
}
