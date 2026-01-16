'use client'

import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProps {
  onFinished?: () => void
}

export default function Loader({ onFinished }: LoaderProps) {
  const { active, progress } = useProgress()
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Memberi sedikit jeda saat 100% agar user bisa melihat bar penuh sebelum menghilang
    if (!active && progress === 100) {
      const timeout = setTimeout(() => {
        setShow(false)
        if (onFinished) onFinished()
      }, 1000) // Jeda 1 detik agar lebih elegan
      return () => clearTimeout(timeout)
    }
  }, [active, progress, onFinished])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505]"
        >
          <div className="relative flex flex-col items-center w-full max-w-[280px] md:max-w-[400px]">
            
            {/* 1. Angka Persentase Besar & Tipis */}
            <div className="overflow-hidden mb-2">
              <motion.span 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                className="text-white font-black text-6xl md:text-8xl tracking-tighter block tabular-nums"
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
            
            {/* 2. Container Progress Bar */}
            <div className="w-full h-[2px] bg-white/10 relative mt-4 overflow-hidden rounded-full">
              {/* Progress Line */}
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* 3. Info Aset & Status */}
            <div className="w-full flex justify-between mt-3 px-1">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-[10px] text-white font-mono uppercase tracking-[0.2em]"
              >
                System Booting
              </motion.span>
              
              <motion.span 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[10px] text-blue-500 font-mono uppercase tracking-[0.2em] font-bold"
              >
                {progress < 100 ? 'Downloading Assets' : 'Ready'}
              </motion.span>
            </div>

          </div>

          {/* Background Ambient Glow (Opsional untuk estetika) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}