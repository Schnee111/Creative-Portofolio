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
    const visualVelocityRef = useRef(0) // Store decoupled velocity

    const lastWheelTimeRef = useRef(0)

    useEffect(() => {
        if (!mounted) return

        const onWheel = (e: WheelEvent) => {
            lastWheelTimeRef.current = Date.now()
            // Block ALL wheel events on desktop to prevent native scrolling
            if (window.innerWidth >= 768) {
                e.preventDefault()
            }

            if (isScrollLocked) {
                return
            }

            if (window.innerWidth < 768) return;

            const el = scrollContainerRef.current
            if (!el) return

            const maxScroll = el.scrollWidth - el.clientWidth
            if (maxScroll <= 0) return

            // Combine deltaY and deltaX for touchpad support
            // Touchpad horizontal swipe uses deltaX, mouse wheel uses deltaY
            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

            // === LOGIC PULL (Tarik) ===
            const isAtEnd = currentScrollRef.current >= maxScroll - 10;
            const isPullingNext = delta > 0;

            if (isAtEnd && isPullingNext) {
                // Berikan resistance (tahanan) agar tarikan terasa berat
                bufferRef.current += delta * 0.5;
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
                let step = delta * 0.8;
                const maxStep = 150;
                if (Math.abs(step) > maxStep) {
                    step = Math.sign(step) * maxStep;
                }

                targetScrollRef.current += step
                targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, maxScroll))

                // === DECOUPLED VISUAL VELOCITY ===
                const rawSpeed = Math.abs(delta);
                const visualBoost = 1 + (rawSpeed * 0.2);
                visualVelocityRef.current = delta * visualBoost;
            }
        }

        const smoothLoop = () => {
            if (scrollContainerRef.current && window.innerWidth >= 768) {
                // AUTO RESET PULL PROGRESS IF IDLE
                const timeSinceLastWheel = Date.now() - lastWheelTimeRef.current;
                if (timeSinceLastWheel > 150 && bufferRef.current > 0) {
                    // Decay buffer pretty fast if user stops pulling
                    bufferRef.current = Math.max(0, bufferRef.current - 15);
                    setPullProgress((bufferRef.current / 600) * 100);
                }

                if (!isScrollLocked) {
                    const distance = Math.abs(targetScrollRef.current - currentScrollRef.current);
                    const dynamicLerp = Math.min(0.5, 0.05 + (distance / 1000));

                    currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * dynamicLerp

                    const actualDiff = targetScrollRef.current - currentScrollRef.current;

                    visualVelocityRef.current *= 0.5;

                    const effectVelocity = actualDiff

                    scrollContainerRef.current.style.transform = ``

                    const absVel = Math.abs(effectVelocity);
                    const blurX = Math.max(0, Math.min(8, (absVel - 25) * 0.12));
                    const blurY = 0.2;

                    const svgFilter = document.getElementById('motion-blur-x');
                    if (svgFilter) {
                        const feBlur = svgFilter.querySelector('feGaussianBlur');
                        if (feBlur) {
                            feBlur.setAttribute('stdDeviation', `${blurX},${blurY}`);
                        }
                    }

                    scrollContainerRef.current.style.filter = blurX > 0 ? `url(#motion-blur-x)` : ``
                } else {
                    scrollContainerRef.current.style.transform = ``
                    scrollContainerRef.current.style.filter = ``
                    visualVelocityRef.current = 0;
                }

                // Only update scrollLeft if there's meaningful movement (prevents micro-vibration)
                const scrollDiff = Math.abs(scrollContainerRef.current.scrollLeft - currentScrollRef.current);
                if (scrollDiff > 0.5) {
                    scrollContainerRef.current.scrollLeft = currentScrollRef.current
                }

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