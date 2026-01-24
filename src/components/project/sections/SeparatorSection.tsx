'use client'

import { motion } from 'framer-motion'
import { SeparatorSection as SeparatorSectionType } from '@/config/projects'

interface SeparatorSectionProps {
    section: SeparatorSectionType
}

export default function SeparatorSection({ section }: SeparatorSectionProps) {
    return (
        <div className="w-[10vw] h-auto flex flex-col justify-center items-center flex-shrink-0 relative">
            {/* Subtle Vertical Line */}
            <div className="w-[1px] h-20 md:h-32 bg-white/10" />

            {/* Optional Label */}
            {section.label && (
                <div className="vertical-text py-8 text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                    {section.label}
                </div>
            )}

            {/* Subtle Vertical Line */}
            <div className="w-[1px] h-20 md:h-32 bg-white/10" />

            {/* Vertical text helper */}
            <style jsx>{`
                .vertical-text {
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    )
}
