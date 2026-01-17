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
    color: 'from-blue-600/40'
  },
  {
    id: '02',
    title: 'System Arch',
    subtitle: 'WEB & CHAIN',
    skills: ['Next.js 15', 'Blockchain', 'Supabase'],
    desc: 'Building robust architectures for modern web and decentralized export supply chains.',
    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200',
    color: 'from-indigo-600/40'
  },
  {
    id: '03',
    title: 'Data Logic',
    subtitle: 'ANALYTICS',
    skills: ['Big Data', 'Statistics', 'Orange Mining'],
    desc: 'Extracting meaningful insights from complex datasets to drive data-driven decision making.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
    color: 'from-cyan-600/40'
  },
  {
    id: '04',
    title: 'Human Side',
    subtitle: 'PERSONAL',
    skills: ['Piano', 'Manhwa Reader', 'E-Business'],
    desc: 'Exploring creative depths through music, storytelling, and digital business strategies.',
    img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200',
    color: 'from-slate-600/40'
  }
]

export default function ExpertiseColumns() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="h-full w-full flex overflow-hidden bg-black">
      {expertiseData.map((item, i) => (
        <motion.div
          key={item.id}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            // Pembagian lebar yang lebih ekstrem untuk sensasi premium
            width: hoveredIndex === i ? '60%' : hoveredIndex === null ? '25%' : '13.33%'
          }}
          transition={{ 
            duration: 0.7, 
            ease: [0.22, 1, 0.36, 1] // Easing Expo yang sangat smooth
          }}
          className="relative h-full border-r border-white/5 flex flex-col group cursor-pointer overflow-hidden bg-[#050505]"
        >
          {/* 1. BACKGROUND IMAGE DENGAN REVEAL PARALLAX */}
          <motion.div 
            className="absolute inset-0 z-0 overflow-hidden"
            animate={{ opacity: hoveredIndex === i ? 0.5 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src={item.img} 
              alt={item.title}
              animate={{ 
                scale: hoveredIndex === i ? 1 : 1.1,
                filter: hoveredIndex === i ? 'grayscale(0%)' : 'grayscale(100%)'
              }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover"
            />
            {/* Gradient Mask agar teks tetap terbaca */}
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-black/60 to-black`} />
          </motion.div>

          {/* 2. VERTICAL LABEL (State: Collapsed) */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <motion.div
              animate={{ opacity: hoveredIndex === i ? 0 : 1, y: hoveredIndex === i ? -20 : 0 }}
              className="flex flex-col items-center"
            >
              <span className="text-blue-500 font-mono text-[10px] mb-6 tracking-tighter">{item.id}</span>
              <h3 className="[writing-mode:vertical-lr] text-white/20 uppercase font-black tracking-[0.4em] text-xl">
                {item.title}
              </h3>
            </motion.div>
          </div>

          {/* 3. EXPANDED CONTENT WRAPPER (Kunci Smoothness) */}
          <div className="mt-auto h-full w-full flex flex-col justify-end p-8 md:p-16 relative z-30">
            {/* Inner Wrapper dengan lebar tetap agar teks tidak melompat (reflow) */}
            <motion.div 
              className="w-[50vw] flex flex-col items-start"
              animate={{ 
                opacity: hoveredIndex === i ? 1 : 0,
                x: hoveredIndex === i ? 0 : 40,
                filter: hoveredIndex === i ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ duration: 0.6, delay: hoveredIndex === i ? 0.2 : 0 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-blue-500" />
                <p className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase font-bold">{item.subtitle}</p>
              </div>

              <h4 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase italic leading-[0.8] tracking-tighter">
                {item.title.split(' ')[0]}<br/>
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
                  {item.title.split(' ')[1]}
                </span>
              </h4>

              <p className="text-white/60 text-lg md:text-xl max-w-md mb-12 leading-tight font-light italic">
                {item.desc}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {item.skills.map(skill => (
                  <span key={skill} className="text-[10px] border border-white/10 px-5 py-2 rounded-full text-white/40 uppercase tracking-widest bg-white/5 backdrop-blur-md">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 4. BACKGROUND ID DECORATION */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-black text-[30vw] pointer-events-none select-none italic">
            {item.id}
          </div>
        </motion.div>
      ))}
    </div>
  )
}