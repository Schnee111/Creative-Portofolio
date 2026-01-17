// src/app/project/template.tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function ProjectTemplate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Animasi tirai membuka saat halaman selesai dimuat
    gsap.to(".global-wipe", {
      x: "100%",
      duration: 0.8,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(".global-wipe", { x: "-100%" })
      }
    })
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Tirai Transisi Global */}
      <div className="global-wipe fixed inset-0 bg-blue-600 z-[500] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  )
}