'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const expertiseData = [
  {
    id: '01',
    title: 'Neural Link',
    subtitle: 'AI & VISION',
    skills: ['NLP Transformer', 'YOLOv8', 'Deep Learning'],
    desc: 'Developing intelligent systems specializing in Natural Language Processing and Computer Vision.',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
    color: 'from-blue-600/20' // Warna lebih subtle agar elegan
  },
  {
    id: '02',
    title: 'System Arch',
    subtitle: 'WEB & CHAIN',
    skills: ['Next.js 15', 'Blockchain', 'Supabase'],
    desc: 'Building robust architectures for modern web and decentralized export supply chains.',
    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200',
    color: 'from-indigo-600/20'
  },
  {
    id: '03',
    title: 'Data Logic',
    subtitle: 'ANALYTICS',
    skills: ['Big Data', 'Statistics', 'Orange Mining'],
    desc: 'Extracting meaningful insights from complex datasets to drive data-driven decision making.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
    color: 'from-cyan-600/20'
  },
  {
    id: '04',
    title: 'Human Side',
    subtitle: 'PERSONAL',
    skills: ['Piano', 'Manhwa Reader', 'E-Business'],
    desc: 'Exploring creative depths through music, storytelling, and digital business strategies.',
    img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200',
    color: 'from-slate-600/20'
  }
]

export default function ExpertiseColumns() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    // FIX GAP: Pakai h-screen (tinggi layar penuh) atau min-h-[80vh]
    // w-full agar mengisi lebar container
    <div className="h-screen w-full flex overflow-hidden bg-black border-y border-white/5">
      {expertiseData.map((item, i) => (
        <motion.div
          key={item.id}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            // Logic lebar yang lebih responsif
            width: hoveredIndex === i ? '55%' : hoveredIndex === null ? '25%' : '15%'
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="relative h-full border-r border-white/5 flex flex-col group cursor-pointer overflow-hidden bg-[#050505]"
        >
          {/* 1. BACKGROUND IMAGE (Parallax Zoom) */}
          <motion.div 
            className="absolute inset-0 z-0 overflow-hidden"
            animate={{ opacity: hoveredIndex === i ? 0.6 : 0.1 }} // Sedikit opacity saat idle agar tidak mati total
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src={item.img} 
              alt={item.title}
              animate={{ 
                scale: hoveredIndex === i ? 1 : 1.2,
                filter: hoveredIndex === i ? 'grayscale(0%)' : 'grayscale(100%)'
              }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay yang menyatu dengan hitam */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-transparent to-transparent opacity-50`} />
          </motion.div>

          {/* 2. VERTICAL LABEL (Saat Tertutup) */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <motion.div
              animate={{ 
                opacity: hoveredIndex === i ? 0 : 1, 
                y: hoveredIndex === i ? -20 : 0 
              }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-8"
            >
              <span className="text-blue-500 font-mono text-[9px] tracking-widest">0{i + 1}</span>
              <h3 className="[writing-mode:vertical-lr] text-white/30 uppercase font-black tracking-[0.3em] text-sm md:text-base">
                {item.subtitle}
              </h3>
            </motion.div>
          </div>

          {/* 3. EXPANDED CONTENT (Saat Terbuka) */}
          <div className="mt-auto h-full w-full flex flex-col justify-end p-8 md:p-16 relative z-30">
            {/* Wrapper konten dengan lebar tetap agar teks tidak geser-geser */}
            <motion.div 
              className="w-[40vw] min-w-[300px] flex flex-col items-start"
              animate={{ 
                opacity: hoveredIndex === i ? 1 : 0,
                x: hoveredIndex === i ? 0 : 20,
                filter: hoveredIndex === i ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ duration: 0.5, delay: hoveredIndex === i ? 0.1 : 0 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase">
                  {item.subtitle}
                </span>
                <div className="h-[1px] w-8 bg-blue-500/50" />
              </div>

              {/* Title Besar */}
              <h4 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.9]">
                {item.title}
              </h4>

              {/* Description */}
              <p className="text-white/50 text-sm md:text-base max-w-md mb-8 leading-relaxed font-light border-l border-white/10 pl-4">
                {item.desc}
              </p>
              
              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <span key={skill} className="text-[9px] border border-white/10 px-3 py-1.5 rounded text-white/60 uppercase tracking-wider bg-white/[0.03]">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 4. DECORATIVE ID (Background) */}
          <div className="absolute top-8 right-8 text-white/[0.03] font-black text-8xl pointer-events-none select-none">
            {item.id}
          </div>

        </motion.div>
      ))}
    </div>
  )
}