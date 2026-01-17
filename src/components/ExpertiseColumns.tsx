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
    color: 'bg-blue-600'
  },
  {
    id: '02',
    title: 'System Arch',
    subtitle: 'WEB & CHAIN',
    skills: ['Next.js 15', 'Blockchain', 'Supabase'],
    desc: 'Building robust, scalable architectures for modern web and decentralized export supply chains.',
    color: 'bg-indigo-600'
  },
  {
    id: '03',
    title: 'Data Logic',
    subtitle: 'ANALYTICS',
    skills: ['Big Data Challenge', 'Statistics', 'Orange Mining'],
    desc: 'Extracting meaningful insights from complex datasets to drive data-driven decision making.',
    color: 'bg-cyan-600'
  },
  {
    id: '04',
    title: 'Human Side',
    subtitle: 'PERSONAL',
    skills: ['Piano', 'Manhwa Reader', 'E-Business'],
    desc: 'Exploring creative depths through music and storytelling in manhwa like "Pick Me Up".',
    color: 'bg-slate-600'
  }
]

export default function ExpertiseColumns() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="h-full w-full flex overflow-hidden border-y border-white/5">
      {expertiseData.map((item, i) => (
        <motion.div
          key={item.id}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            width: hoveredIndex === i ? '45%' : hoveredIndex === null ? '25%' : '18.33%'
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full border-r border-white/10 flex flex-col group cursor-pointer overflow-hidden"
        >
          {/* Background Highlight */}
          <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />

          {/* Vertical Title (Collapsed) */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
             <span className="text-blue-500 font-mono text-[10px] mb-4 group-hover:opacity-0 transition-opacity">{item.id}</span>
             <h3 className="[writing-mode:vertical-lr] text-white/20 group-hover:opacity-0 uppercase font-black tracking-[0.2em] text-xl transition-all duration-300">
               {item.title}
             </h3>
          </div>

          {/* Expanded Content */}
          <div className="mt-auto p-12 relative z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-10 group-hover:translate-y-0">
             <p className="text-blue-500 font-mono text-[10px] mb-2 tracking-[0.3em] uppercase">{item.subtitle}</p>
             <h4 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic leading-none">{item.title}</h4>
             <p className="text-white/40 text-sm max-w-xs mb-8 leading-relaxed">
               {item.desc}
             </p>
             
             <div className="flex flex-wrap gap-2">
               {item.skills.map(skill => (
                 <span key={skill} className="text-[8px] border border-white/10 px-3 py-1 rounded-full text-white/40 uppercase tracking-widest">
                   {skill}
                 </span>
               ))}
             </div>
          </div>

          {/* Large Background ID */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/5 font-black text-9xl pointer-events-none group-hover:text-blue-500/10 transition-colors">
            {item.id}
          </div>
        </motion.div>
      ))}
    </div>
  )
}