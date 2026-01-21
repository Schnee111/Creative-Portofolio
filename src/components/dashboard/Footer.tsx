'use client'

import { motion } from 'framer-motion'
import TimeDisplay from '@/components/ui/TimeDisplay'

interface FooterProps {
    onScrollTo: (id: string) => void
}

export default function Footer({ onScrollTo }: FooterProps) {
    return (
        <footer id="contact" className="relative bg-[#080808] pt-32 pb-8 overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                                Available for new projects
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
                            Have an idea? <br />
                            <span className="text-white/40 italic">Let's build it together.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-end text-right space-y-2">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Local Time (Jakarta)</span>
                        <TimeDisplay />
                    </div>
                </div>

                <div className="mb-32 relative group">
                    <a
                        href="mailto:hello@daffa.dev"
                        className="block text-[11vw] leading-[0.8] font-black tracking-tighter text-white transition-colors duration-500 group-hover:text-blue-600 mix-blend-difference"
                    >
                        hello@daffa.dev
                    </a>
                    <div className="h-[2px] w-0 bg-blue-600 mt-4 transition-all duration-700 group-hover:w-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12 text-[10px] font-mono uppercase tracking-widest text-white/40">
                    <div className="space-y-4">
                        <span className="block text-white">Sitemap</span>
                        <nav className="flex flex-col gap-2">
                            {['Home', 'Work', 'Expertise', 'Contact'].map(item => (
                                <button key={item} onClick={() => onScrollTo(item === 'Home' ? 'top' : item.toLowerCase())} className="text-left hover:text-blue-500 transition-colors cursor-pointer">
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <span className="block text-white">Socials</span>
                        <nav className="flex flex-col gap-2">
                            <a href="#" className="hover:text-blue-500 transition-colors">Instagram</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <span className="block text-white">Version</span>
                        <div className="flex flex-col gap-1">
                            <span>Daffa.OS v5.0.2</span>
                            <span>Last Updated: Jan 2026</span>
                        </div>
                    </div>

                    <div className="space-y-4 text-right md:text-left">
                        <span className="block text-white">Credits</span>
                        <div className="flex flex-col gap-1">
                            <span>Design & Dev by Daffa</span>
                            <span>Built with Next.js 15</span>
                            <span>Three.js / R3F Engine</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-20 w-full overflow-hidden border-t border-white/5 py-4 bg-white/[0.02]">
                <motion.div
                    className="flex whitespace-nowrap gap-12 text-[100px] md:text-[150px] font-black text-white/[0.03] leading-none select-none"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i}>DESIGN • CODE • INTERACTION • MOTION • </span>
                    ))}
                </motion.div>
            </div>

        </footer>
    )
}
