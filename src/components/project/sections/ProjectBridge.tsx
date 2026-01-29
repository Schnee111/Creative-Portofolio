'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Project } from '@/config/projects'

// Inline SVG icons to avoid external dependency
const ArrowRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
)

interface ProjectBridgeProps {
    nextProject: Project | null
    pullProgress: number
}

const getMainImage = (project: Project): string => {
    const imageSection = project.sections.find(
        s => s.type === 'image-full' || s.type === 'image-wide' || s.type === 'image-tall'
    )
    return imageSection && 'src' in imageSection ? imageSection.src : ''
}

export default function ProjectBridge({ nextProject, pullProgress }: ProjectBridgeProps) {
    const router = useRouter()

    if (!nextProject) return null

    const isAlmostComplete = pullProgress > 85
    const isHalfway = pullProgress > 50

    const handleNextClick = () => {
        router.push(`/project/${nextProject.id}`)
    }

    // Calculate circular progress
    const circumference = 2 * Math.PI * 20 // radius = 20
    const strokeDashoffset = circumference - (pullProgress / 100) * circumference

    return (
        <section
            className="w-screen md:w-[25vw] h-[35vh] md:h-screen flex-shrink-0 relative overflow-hidden bg-black"
        >
            {/* Animated Background Image */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0.5, scale: 1.1 }}
                animate={{
                    scale: 1.1 - (pullProgress * 0.001),
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <img
                    src={getMainImage(nextProject)}
                    className="w-full h-full object-cover blur-[2px]"
                    alt=""
                />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-b from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center">

                {/* Status Label */}
                <motion.span
                    className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                    animate={{
                        color: isAlmostComplete ? '#22c55e' : isHalfway ? '#3b82f6' : '#6b7280'
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {isAlmostComplete ? "Release to Navigate" : isHalfway ? "Keep Pulling →" : "Next Project"}
                </motion.span>

                {/* Project Title */}
                <motion.h2
                    className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-none mb-6"
                    animate={{
                        opacity: 0.6 + pullProgress * 0.004
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {nextProject.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.span
                    className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6"
                    animate={{ opacity: 0.4 + pullProgress * 0.006 }}
                >
                    {nextProject.subtitle}
                </motion.span>

                {/* Circular Progress Indicator - Desktop */}
                <div className="hidden md:block relative w-12 h-12 mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                        {/* Background circle */}
                        <circle
                            cx="22"
                            cy="22"
                            r="20"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="2"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="22"
                            cy="22"
                            r="20"
                            fill="none"
                            stroke={isAlmostComplete ? '#22c55e' : '#3b82f6'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                    </svg>
                    {/* Center icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                            scale: isAlmostComplete ? 1.2 : 1,
                            rotate: pullProgress * 1.8
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <ArrowRight className="w-4 h-4 text-white" />
                    </motion.div>
                </div>

                {/* Desktop hint */}
                <span className="hidden md:block text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    Scroll to Continue
                </span>

                {/* Mobile Next Button */}
                <motion.button
                    onClick={handleNextClick}
                    className="md:hidden flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium text-sm uppercase tracking-wider group"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <span>View Project</span>
                    <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </motion.div>
                </motion.button>

                {/* Tap hint for mobile */}
                <span className="md:hidden text-[9px] font-mono text-white/30 uppercase tracking-widest mt-3">
                    Tap to Navigate
                </span>
            </div>

        </section>
    )
}
