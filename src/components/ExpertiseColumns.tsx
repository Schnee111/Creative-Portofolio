'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { expertiseData } from '@/config/expertise'

export default function ExpertiseColumns() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile: tap to toggle, Desktop: hover
  const handleInteraction = (index: number) => {
    if (isMobile) {
      setHoveredIndex(hoveredIndex === index ? null : index)
    } else {
      setHoveredIndex(index)
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:h-screen w-full bg-black border-y border-white/5">
      {expertiseData.map((item, i) => (
        <motion.div
          key={item.id}
          onClick={() => handleInteraction(i)}
          onMouseEnter={() => !isMobile && setHoveredIndex(i)}
          onMouseLeave={() => !isMobile && setHoveredIndex(null)}
          animate={{
            // Mobile: height animation, Desktop: width animation
            height: isMobile ? (hoveredIndex === i ? '60vh' : '80px') : 'auto',
            width: !isMobile ? (hoveredIndex === i ? '55%' : hoveredIndex === null ? '25%' : '15%') : '100%'
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="relative w-full md:w-auto md:h-full min-h-[80px] md:min-h-0 border-b md:border-b-0 md:border-r border-white/5 flex flex-col group cursor-pointer overflow-hidden bg-[#050505]"
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            animate={{ opacity: hoveredIndex === i ? 0.6 : 0.1 }}
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
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black`} />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-transparent to-transparent opacity-50`} />
          </motion.div>

          {/* Vertical Label (Collapsed State) */}
          <div className="absolute top-6 md:top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <motion.div
              animate={{
                opacity: hoveredIndex === i ? 0 : 1,
                y: hoveredIndex === i ? -20 : 0
              }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-col items-center gap-4 md:gap-8"
            >
              <span className="text-blue-500 font-mono text-[9px] tracking-widest">0{i + 1}</span>
              <h3 className="md:[writing-mode:vertical-lr] text-white/30 uppercase font-black tracking-[0.3em] text-xs md:text-sm lg:text-base">
                {item.subtitle}
              </h3>
            </motion.div>
          </div>

          {/* Expanded Content */}
          <div className="mt-auto h-full w-full flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16 relative z-30">
            <motion.div
              className="w-full md:w-[40vw] md:min-w-[300px] flex flex-col items-start"
              animate={{
                opacity: hoveredIndex === i ? 1 : 0,
                x: hoveredIndex === i ? 0 : 20,
                filter: hoveredIndex === i ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ duration: 0.5, delay: hoveredIndex === i ? 0.1 : 0 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-3 md:mb-4">
                <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] uppercase">
                  {item.subtitle}
                </span>
                <div className="h-[1px] w-8 bg-blue-500/50" />
              </div>

              {/* Title */}
              <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 uppercase tracking-tighter leading-[0.9]">
                {item.title}
              </h4>

              {/* Description */}
              <p className="text-white/50 text-xs sm:text-sm md:text-base max-w-md mb-6 md:mb-8 leading-relaxed font-light border-l border-white/10 pl-4">
                {item.desc}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <span key={skill} className="text-[10px] sm:text-xs border border-white/10 px-3 py-1.5 rounded text-white/60 uppercase tracking-wider bg-white/[0.03]">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Decorative ID */}
          <div className="absolute top-4 md:top-8 right-4 md:right-8 text-white/[0.03] font-black text-6xl md:text-8xl pointer-events-none select-none">
            {item.id}
          </div>

        </motion.div>
      ))}
    </div>
  )
}
