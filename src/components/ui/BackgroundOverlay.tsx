'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'

interface BackgroundOverlayProps {
    type?: 'leaf' | 'tech'
}

export default function BackgroundOverlay({ type }: BackgroundOverlayProps) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth mouse for global parallax
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 })
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 })

    const { scrollYProgress } = useScroll()

    // Leaf transforms
    const leafX = useTransform(smoothX, [-0.5, 0.5], [20, -20])
    const leafYMouse = useTransform(smoothY, [-0.5, 0.5], [20, -20])
    const leafYScroll = useTransform(scrollYProgress, [0, 1], [0, -100])
    const leafY = useTransform([leafYMouse, leafYScroll], ([m, s]) => (m as number) + (s as number))
    const leafRotate = useTransform(scrollYProgress, [0, 1], [0, -10])

    // Tech transforms
    const techX = useTransform(smoothX, [-0.5, 0.5], [-30, 30])
    const techY = useTransform(smoothY, [-0.5, 0.5], [-30, 30])
    const techRotate = useTransform(scrollYProgress, [0, 1], [0, 5])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window
            const x = (e.clientX / innerWidth) - 0.5
            const y = (e.clientY / innerHeight) - 0.5
            mouseX.set(x)
            mouseY.set(y)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    if (!type) return null

    // --- LEAF CONFIGURATION ---
    // A stem with multiple leaflets. Each leaflet sways independently.
    if (type === 'leaf') {
        const leafCount = 12
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-soft-light opacity-30">
                {/* Container for the whole branch - Parallax */}
                <motion.div
                    style={{
                        x: leafX,
                        y: leafY,
                        rotate: leafRotate
                    }}
                    className="absolute -right-20 top-0 h-[120vh] w-[50vw] origin-top-right transform translate-y-[10%]"
                >
                    <svg viewBox="0 0 400 800" className="w-full h-full text-white fill-current drop-shadow-2xl filter blur-[5px]">
                        {/* Main Stem */}
                        <motion.path
                            d="M 380,-50 Q 300,300 100,700"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                        />

                        {/* Leaflets attached to stem */}
                        {Array.from({ length: leafCount }).map((_, i) => {
                            const t = i / leafCount // 0 to 1 along stem
                            // Approximate position along the quadratic bezier M 380,-50 Q 300,300 100,700
                            // Quadratic Bezier: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
                            const p0 = { x: 380, y: -50 }
                            const p1 = { x: 300, y: 300 }
                            const p2 = { x: 100, y: 700 }

                            const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x
                            const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y

                            const side = i % 2 === 0 ? 1 : -1
                            const rotationOffset = 20 * t

                            return (
                                <motion.g
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    {/* The Leaflet Shade */}
                                    <motion.path
                                        d={`M 0,0 C 30,10 50,40 60,100 C 40,80 10,70 0,0`}
                                        // Shape: simple curved leaf
                                        transform={`translate(${x}, ${y}) scale(${0.8 + t * 0.5}) rotate(${(side * 60) + (i * 5)})`}
                                        style={{
                                            originX: 0, // Pivot at stem
                                            originY: 0
                                        }}
                                        animate={{
                                            // Sway animation
                                            rotate: [
                                                (side * 60) + (i * 5) - 5,
                                                (side * 60) + (i * 5) + 5,
                                                (side * 60) + (i * 5) - 5
                                            ]
                                        }}
                                        transition={{
                                            duration: 5 + i, // Varies per leaf
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </motion.g>
                            )
                        })}
                    </svg>
                </motion.div>
            </div>
        )
    }

    // --- TECH CONFIGURATION ---
    // "Cyber-Spine": A complex, segmented bio-digital structure
    // Heavily blurred to act as a subtle, moving shadow background.
    if (type === 'tech') {
        const vertebraeCount = 18
        return (
            <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-100">
                <motion.div
                    style={{
                        x: techX,
                        y: techY,
                        rotate: techRotate
                    }}
                    className="absolute -left-[10vw] -top-[10vh] h-[150vh] w-[80vw] origin-top-left"
                >
                    <svg viewBox="0 0 1000 1200" className="w-full h-full fill-white/10 dark:fill-blue-400/10 filter blur-[5px] opacity-60">
                        {/* 
                            Generative Spine Construction 
                            Creates a chain of swaying geometric segments.
                         */}
                        {Array.from({ length: vertebraeCount }).map((_, i) => {
                            const t = i / vertebraeCount

                            // Spine Curve (Quadratic Bezier path)
                            // Starts top-left, curves down to bottom-center
                            const p0 = { x: 200, y: -50 }
                            const p1 = { x: 600, y: 500 }
                            const p2 = { x: 300, y: 1300 }

                            const x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x
                            const y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y

                            // Size tapers towards the end
                            const size = 180 * (1 - t * 0.5)

                            return (
                                <motion.g
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        // Independent organic sway calculation
                                        x: [0, 30 * Math.sin(i * 0.5), 0],
                                        rotate: [
                                            (i * 10),
                                            (i * 10) + 5 * Math.sin(i * 0.8),
                                            (i * 10)
                                        ]
                                    }}
                                    transition={{
                                        delay: i * 0.05,
                                        duration: 6 + i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Main Vertebra Block */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={size}
                                        height={size * 0.6}
                                        rx={20}
                                        transform={`rotate(${i * 2}, ${x}, ${y})`}
                                    />

                                    {/* Floating Satellite Parts (Adds complexity) */}
                                    {i % 2 === 0 && (
                                        <rect
                                            x={x + size * 0.8}
                                            y={y + size * 0.2}
                                            width={size * 0.3}
                                            height={size * 0.3}
                                            rx={10}
                                        />
                                    )}
                                    {i % 3 === 0 && (
                                        <rect
                                            x={x - size * 0.4}
                                            y={y + size * 0.4}
                                            width={size * 0.2}
                                            height={size * 0.8}
                                            rx={5}
                                        />
                                    )}
                                </motion.g>
                            )
                        })}
                    </svg>
                </motion.div>
            </div>
        )
    }

    return null
}
