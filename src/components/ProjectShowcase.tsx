'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/config/projects'

export default function ProjectShowcase() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  
  const requestRef = useRef<number | null>(null)

  // --- MOUSE TRACKING (Untuk Gambar Background) ---
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    requestRef.current = requestAnimationFrame(() => {
      setCursorPos({ x, y })
    })
  }

  const activeProject = projects.find(p => p.id === hoveredId)

  return (
    <div 
      className="relative bg-[#050505] w-full" 
      onMouseMove={handleMouseMove}
    >
      
      {/* ========================================================= */}
      {/* 1. LAYER GAMBAR (BACKGROUND FIXED)                       */}
      {/* ========================================================= */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 hidden md:block overflow-hidden">
        <AnimatePresence mode="wait">
          {hoveredId && activeProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ 
                opacity: 0.4, // Opacity rendah agar tidak mengganggu teks
                scale: 1,
                filter: "blur(0px)",
                x: cursorPos.x - 300, // Center image (600px / 2)
                y: cursorPos.y - 200, // Center image (400px / 2)
                rotate: (cursorPos.x - window.innerWidth / 2) * 0.005
              }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
              className="absolute w-[600px] h-[400px] rounded-[1rem] overflow-hidden bg-white/5"
            >
              <Image 
                src={activeProject.mainImage} 
                alt="Preview"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" /> {/* Overlay gelapkan dikit */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================= */}
      {/* 2. LAYER LIST TEXT (FOREGROUND)                          */}
      {/* ========================================================= */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center py-32">
        
        <div className="container mx-auto px-6 md:px-12 mb-12">
           <span className="text-blue-500 font-mono text-[9px] tracking-[0.6em] uppercase font-bold opacity-60 pl-4">
             // Selected_Works
           </span>
        </div>

        <div className="flex flex-col border-t border-white/5">
          {projects.map((project, index) => {
            const isHovered = hoveredId === project.id;

            return (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="group block relative border-b border-white/5 transition-colors duration-500"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="container mx-auto px-6 md:px-12 py-10 flex items-center justify-between">
                  
                  {/* KIRI: PROJECT TITLE */}
                  <motion.div 
                    className="flex items-center gap-6"
                    initial={false}
                    animate={{ x: isHovered ? 40 : 0 }} // Geser ke kanan saat hover
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {/* ID kecil (Hanya muncul saat hover) */}
                    <motion.span 
                      className="font-mono text-xs text-blue-500"
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                    >
                      0{index + 1}
                    </motion.span>

                    {/* JUDUL UTAMA */}
                    <h2 
                      className={`text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none transition-all duration-300 ${
                        isHovered ? 'text-blue-500 opacity-100' : 'text-white opacity-20'
                      }`}
                    >
                      {project.title}
                    </h2>
                  </motion.div>

                  {/* KANAN: SUBTITLE / INFO (Muncul saat Hover) */}
                  <div className="hidden md:block overflow-hidden">
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-8"
                        >
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white">
                              {project.tech.split(',')[0]} {/* Tech Stack */}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                              {project.subtitle || "Interaction"}
                            </span>
                          </div>
                          
                          {/* Arrow Icon */}
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                             </svg>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  )
}