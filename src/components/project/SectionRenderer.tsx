'use client'

import { Project, ProjectSection } from '@/config/projects'
import IntroSection from '@/components/project/sections/IntroSection'
import ImageSection from '@/components/project/sections/ImageSection'
import TextSection from '@/components/project/sections/TextSection'
import VideoSection from '@/components/project/sections/VideoSection'
import SeparatorSection from '@/components/project/sections/SeparatorSection'
import ProjectBridge from '@/components/project/sections/ProjectBridge'

interface SectionRendererProps {
    section: ProjectSection
    project: Project
    index: number
    nextProject?: Project | null
    pullProgress?: number
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

export default function SectionRenderer({
    section,
    project,
    index,
    nextProject,
    pullProgress,
    scrollContainerRef
}: SectionRendererProps) {
    switch (section.type) {
        case 'intro':
            return <IntroSection project={project} scrollContainerRef={scrollContainerRef} />

        case 'image-full':
        case 'image-wide':
        case 'image-tall':
            return <ImageSection section={section} index={index} />

        case 'text':
        case 'text-quote':
            return <TextSection section={section} index={index} />

        case 'video':
            return <VideoSection section={section} index={index} />

        case 'separator':
            return <SeparatorSection section={section} />

        case 'bridge':
            return <ProjectBridge nextProject={nextProject || null} pullProgress={pullProgress || 0} />

        default:
            return null
    }
}
