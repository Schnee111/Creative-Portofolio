import { useEffect, useRef, useState } from 'react'
import { Project } from '@/config/projects'

interface UseHorizontalScrollProps {
    mounted: boolean
    nextProject: Project | null
    isScrollLocked: boolean
    onNextProject: () => void
}

export function useHorizontalScroll({
    mounted,
    nextProject,
    isScrollLocked,
    onNextProject
}: UseHorizontalScrollProps) {
    const [pullProgress, setPullProgress] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const targetScrollRef = useRef(0)
    const currentScrollRef = useRef(0)
    const bufferRef = useRef(0)
    const animationFrameRef = useRef<number | null>(null)

    useEffect(() => {
        if (!mounted) return

        const onWheel = (e: WheelEvent) => {
            if (isScrollLocked) {
                e.preventDefault()
                return
            }

            if (window.innerWidth < 768) return;

            const el = scrollContainerRef.current
            if (!el) return

            const maxScroll = el.scrollWidth - el.clientWidth
            if (maxScroll <= 0) return

            // === LOGIC PULL (Tarik) ===
            const isAtEnd = currentScrollRef.current >= maxScroll - 10;
            const isPullingNext = e.deltaY > 0;

            if (isAtEnd && isPullingNext) {
                e.preventDefault();
                // Berikan resistance (tahanan) agar tarikan terasa berat
                bufferRef.current += e.deltaY * 0.5;
                const progress = Math.min(100, (bufferRef.current / 600) * 100);
                setPullProgress(progress);

                if (bufferRef.current > 600) {
                    onNextProject();
                }
            } else {
                // Reset buffer jika berbalik
                if (bufferRef.current > 0) {
                    bufferRef.current = Math.max(0, bufferRef.current - 20);
                    setPullProgress((bufferRef.current / 600) * 100);
                }

                // === PHYSICS ENGINE (Lusion Feel) ===
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault()

                    // 1. CLAMPING: Batasi kecepatan maksimal scroll per frame
                    let delta = e.deltaY;
                    if (Math.abs(delta) > 100) {
                        delta = Math.sign(delta) * 100;
                    }

                    // 2. MULTIPLIER: Seberapa jauh target bergerak per scroll
                    targetScrollRef.current += delta * 1.5

                    // Clamp target agar tidak keluar batas
                    targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, maxScroll))
                }
            }
        }

        const smoothLoop = () => {
            if (scrollContainerRef.current && window.innerWidth >= 768) {
                if (!isScrollLocked) {
                    // === 3. LERP FACTOR (Kunci Kehalusan) ===
                    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.06
                }

                scrollContainerRef.current.scrollLeft = currentScrollRef.current

                const max = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
                const progress = max > 0 ? (currentScrollRef.current / max) * 100 : 0
                const progressBar = document.getElementById('scroll-progress')
                if (progressBar) progressBar.style.width = `${progress}%`
            }
            animationFrameRef.current = requestAnimationFrame(smoothLoop)
        }

        window.addEventListener('wheel', onWheel, { passive: false })
        animationFrameRef.current = requestAnimationFrame(smoothLoop)

        return () => {
            window.removeEventListener('wheel', onWheel)
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        }
    }, [mounted, nextProject, isScrollLocked, onNextProject])

    return {
        scrollContainerRef,
        pullProgress,
        setPullProgress,
        targetScrollRef,
        currentScrollRef,
        bufferRef
    }
}
