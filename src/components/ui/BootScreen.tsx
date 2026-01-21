'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface BootScreenProps {
    booting: boolean
    percent: number
    headerLeft?: string
    headerRight?: string
    footerLeft?: string
    footerStatus?: string
}

export default function BootScreen({
    booting,
    percent,
    headerLeft = "System_Check_Init",
    headerRight = "Secure_Env_v5.2",
    footerLeft = "Loading Assets...",
    footerStatus = percent < 100 ? "Processing" : "Ready"
}: BootScreenProps) {
    return (
        <AnimatePresence mode="wait">
            {booting && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col justify-between p-8 md:p-12 font-mono text-white"
                    onViewportLeave={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                >
                    {/* Top Corners */}
                    <div className="flex justify-between items-start opacity-30 text-[10px] tracking-widest uppercase">
                        <span>{headerLeft}</span>
                        <span>{headerRight}</span>
                    </div>

                    {/* Center: Massive Counter */}
                    <div className="flex flex-col items-center justify-center relative">
                        <motion.h1
                            className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter tabular-nums"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {percent}%
                        </motion.h1>

                        {/* Loading Bar Tipis */}
                        <div className="w-64 h-[1px] bg-white/10 mt-8 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>

                    {/* Bottom Corners */}
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                            <span>{footerLeft}</span>
                            <span className="text-blue-500">{footerStatus}</span>
                        </div>

                        <div className="hidden md:block text-[10px] text-white/20">
                            ID: 882-991-X
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
