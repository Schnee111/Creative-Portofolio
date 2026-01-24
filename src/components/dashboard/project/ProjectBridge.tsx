'use client'

import { Project } from '@/config/projects'

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
    if (!nextProject) return null

    return (
        <section
            className="w-screen md:w-[20vw] h-[20vh] md:h-screen flex-shrink-0 relative overflow-hidden group bg-black"
        >
            {/* Image BG (Redup) */}
            <div className="absolute inset-0 opacity-20 blur-[3px] transition-all duration-1000">
                <img src={getMainImage(nextProject)} className="w-full h-full object-cover" alt="" />
            </div>

            {/* Content Center */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
                <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase mb-6">
                    {pullProgress > 20 ? "Keep Pulling" : "Next Project"}
                </span>

                <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-8"
                    style={{ transform: `scale(${1 + pullProgress * 0.0005})` }}
                >
                    {nextProject.title}
                </h2>

                {/* Minimal Progress Line */}
                <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-75 ease-linear"
                        style={{ width: `${pullProgress}%` }}
                    />
                </div>

                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-4">
                    Scroll to Sync
                </span>
            </div>
        </section>
    )
}
