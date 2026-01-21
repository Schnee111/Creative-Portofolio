'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NavbarProps {
    booting: boolean
    onScrollTo: (id: string) => void
}

export default function Navbar({ booting, onScrollTo }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleScrollTo = (id: string) => {
        setMobileMenuOpen(false)
        onScrollTo(id)
    }

    return (
        <div className="fixed top-6 left-0 w-full z-50 px-4 md:px-0 flex justify-center">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: booting ? 1 : 0.5, duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50"
            >
                {/* A. LEFT: IDENTITY */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-white font-bold">
                            DAFFA.OS
                        </span>
                    </div>
                    <span className="hidden md:block text-[10px] text-white/20 font-mono">|</span>
                    <span className="hidden md:block text-[10px] text-white/40 font-mono tracking-widest">v5.0.2</span>
                </div>

                {/* B. CENTER: DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8">
                    {['Work', 'Expertise', 'Contact'].map((item) => (
                        <button
                            key={item}
                            onClick={() => handleScrollTo(item.toLowerCase())}
                            className="relative group px-2 py-1"
                        >
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                                {item}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300 ease-out" />
                        </button>
                    ))}
                </div>

                {/* C. RIGHT: ACTIONS & MOBILE TOGGLE */}
                <div className="flex items-center gap-4">

                    {/* EXIT BUTTON (Ke Homepage) */}
                    <Link href="/">
                        <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 rounded-full transition-all duration-300 group">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-red-500 transition-colors" />
                            <span className="text-[9px] font-mono uppercase tracking-widest text-white/60 group-hover:text-red-400">
                                Exit System
                            </span>
                        </button>
                    </Link>

                    {/* MOBILE MENU TOGGLE */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                    >
                        <motion.span
                            animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 5 : 0 }}
                            className="w-5 h-[1px] bg-white block"
                        />
                        <motion.span
                            animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                            className="w-5 h-[1px] bg-white block"
                        />
                        <motion.span
                            animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -5 : 0 }}
                            className="w-5 h-[1px] bg-white block"
                        />
                    </button>
                </div>
            </motion.nav>

            {/* D. MOBILE MENU DROPDOWN */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-4 right-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl md:hidden"
                    >
                        {['Work', 'Expertise', 'Contact'].map((item, i) => (
                            <button
                                key={item}
                                onClick={() => handleScrollTo(item.toLowerCase())}
                                className="text-left py-3 border-b border-white/5 last:border-0"
                            >
                                <span className="text-xs font-mono text-blue-500 mr-4">0{i + 1}</span>
                                <span className="text-sm uppercase tracking-widest text-white">{item}</span>
                            </button>
                        ))}

                        {/* Mobile Exit Button */}
                        <Link href="/" className="mt-4">
                            <button className="w-full py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">
                                Shutdown / Exit
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
