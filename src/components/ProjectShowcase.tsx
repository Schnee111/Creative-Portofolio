'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/config/projects'

export default function ProjectShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Konfigurasi Tween yang sangat cepat dan sinkron
  const techTween = {
    type: "tween",
    duration: 0.25, // Dipercepat dari 0.35s
    ease: [0.23, 1, 0.32, 1] 
  } as const

  return (
    <div className="relative bg-[#050505] selection:bg-blue-500/30">
      <section className="min-h-screen flex flex-col justify-center p-8 md:p-24 pt-20 pb-48 md:pt-32 md:pb-64">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 0.4, x: 0 }}
          viewport={{ once: true }}
          className="text-blue-500 font-mono text-[10px] tracking-[0.6em] mb-16 uppercase font-bold italic"
        >
          // Featured_Archives
        </motion.span>

        <div className="space-y-12 md:space-y-16">
          {projects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex items-center"
            >
              <Link 
                href={`/project/${project.id}`} 
                className="group cursor-pointer block relative z-10"
              >
                <motion.h2 
                  animate={{ 
                    x: hoveredId === project.id ? 20 : 0,
                    color: hoveredId === project.id ? '#3b82f6' : 'rgba(255,255,255,0.05)' 
                  }}
                  transition={techTween}
                  className="text-4xl md:text-[6vw] font-display font-black uppercase tracking-tighter italic leading-[0.85] md:text-white/5"
                >
                  {project.title.split(' ')[0]} <br />
                  
                  <span 
                    className="transition-all duration-0"
                    style={{ 
                      WebkitTextStroke: hoveredId === project.id ? '0px transparent' : '1px rgba(255,255,255,0.1)',
                      color: hoveredId === project.id ? 'inherit' : 'transparent'
                    }}
                  >
                    {project.title.split(' ').slice(1).join(' ')}
                  </span>
                </motion.h2>

                {/* ID Proyek */}
                <div className={`absolute -top-4 -left-6 md:-left-12 transition-all duration-300 font-mono text-blue-500 text-sm md:text-lg font-black italic pointer-events-none ${hoveredId === project.id ? 'opacity-40 translate-x-2' : 'opacity-0'}`}>
                  {project.id}
                </div>
              </Link>

              {/* Indikator Samping */}
              <AnimatePresence>
                {hoveredId === project.id && (
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={techTween}
                    className="ml-10 md:ml-20 hidden md:flex items-center gap-6 pointer-events-none whitespace-nowrap"
                  >
                    <div className="h-[1px] w-16 bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    <div className="flex flex-col">
                      <span className="text-blue-500 font-mono text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 mb-1">Node_Connected</span>
                      <span className="text-blue-500 font-mono text-[12px] font-bold tracking-widest uppercase">
                        {project.subtitle}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}