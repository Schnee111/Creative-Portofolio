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
        <>
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
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 ${mobileMenuOpen ? 'hidden' : ''}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 bg-blue-500 ${mobileMenuOpen ? 'bg-red-500' : ''}`}></span>
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
                            className="md:hidden flex flex-col gap-1.5 p-2 z-[60] relative justify-center items-center"
                        >
                            <motion.span
                                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 7 : 0 }}
                                className={`w-5 h-[1px] block transition-colors duration-300 ${mobileMenuOpen ? 'bg-red-500' : 'bg-white'}`}
                            />
                            <motion.span
                                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                                className="w-5 h-[1px] bg-white block"
                            />
                            <motion.span
                                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -7 : 0 }}
                                className={`w-5 h-[1px] block transition-colors duration-300 ${mobileMenuOpen ? 'bg-red-500' : 'bg-white'}`}
                            />
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* D. MOBILE FULL SCREEN OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center md:hidden"
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 fui-grid opacity-30 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

                        {/* Content Container */}
                        <div className="relative z-10 w-full max-w-md px-8 flex flex-col gap-8">

                            {/* Menu Header */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-center mb-4"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">System Navigation</span>
                                </div>
                            </motion.div>

                            {/* Menu Items */}
                            <div className="flex flex-col gap-4">
                                {['Work', 'Expertise', 'Contact'].map((item, i) => (
                                    <motion.button
                                        key={item}
                                        initial={{ x: -30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        onClick={() => handleScrollTo(item.toLowerCase())}
                                        className="group relative flex items-center justify-between p-4 border border-white/5 hover:border-blue-500/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-mono text-white/20 group-hover:text-blue-500 transition-colors">
                                                0{i + 1}
                                            </span>
                                            <span className="text-xl uppercase tracking-[0.2em] font-light text-white group-hover:text-blue-200 transition-colors">
                                                {item}
                                            </span>
                                        </div>
                                        <span className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-blue-500">
                                            →
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4"
                            >
                                <Link href="/" className="w-full">
                                    <button className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl group transition-all duration-300 flex items-center justify-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-red-500/50 group-hover:bg-red-500 rounded-full transition-colors" />
                                        <span className="text-xs font-mono uppercase tracking-widest text-red-400 group-hover:text-red-300">
                                            Abort / Exit System
                                        </span>
                                    </button>
                                </Link>

                                <div className="flex justify-between items-center text-[10px] text-white/20 font-mono uppercase tracking-wider">
                                    <span>DAFFA.OS v5.0.2</span>
                                    <span>SECURE CONN</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}