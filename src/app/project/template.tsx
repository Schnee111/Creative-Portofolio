// src/app/project/template.tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ProjectTemplate({ children }: { children: React.ReactNode }) {
  const wipeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset posisi tirai ke tengah (menutup layar) setiap kali rute berubah
    gsap.set(wipeRef.current, { x: "0%" })

    // Animasi tirai membuka ke arah kanan
    gsap.to(wipeRef.current, {
      x: "100%",
      duration: 1,
      ease: "expo.inOut",
      delay: 0.2, // Memberi waktu browser untuk load asset
      onComplete: () => {
        // Kembalikan ke kiri agar siap untuk transisi berikutnya
        gsap.set(wipeRef.current, { x: "-100%" })
      }
    })
  }, []) // Template akan memicu ini pada setiap navigasi rute

  return (
    <div className="relative min-h-screen w-full">
      {/* Tirai Transisi dengan Ref agar lebih akurat */}
      <div 
        ref={wipeRef}
        className="global-wipe fixed inset-0 bg-blue-600 z-[500] pointer-events-none" 
        style={{ transform: 'translateX(-100%)' }} // Initial hide
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}