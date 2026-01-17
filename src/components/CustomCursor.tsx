// src/components/CustomCursor.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  
  // Menggunakan spring untuk pergerakan kursor yang "kenyal" (smooth)
  const cursorX = useSpring(0, { stiffness: 800, damping: 35 })
  const cursorY = useSpring(0, { stiffness: 800, damping: 35 })

  useEffect(() => {
    const selector = 'a, button, input, textarea, select, [role="button"], .cursor-pointer, [onclick]'
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      
      // Check apakah elemen di bawah cursor adalah interaktif
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
      const isInteractive = elementUnderCursor?.closest(selector)
      
      setIsHovered(!!isInteractive)
    }

    const handleHoverStart = () => setIsHovered(true)
    const handleHoverEnd = () => setIsHovered(false)

    window.addEventListener('mousemove', moveCursor)

    // Fungsi untuk attach listener ke elemen
    const attachListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart)
        el.addEventListener('mouseleave', handleHoverEnd)
      })
    }

    // Deteksi elemen interaktif secara dinamis (lebih lengkap)
    const interactiveElements = document.querySelectorAll(selector)
    attachListeners(interactiveElements)

    // MutationObserver untuk mendeteksi elemen baru yang ditambahkan ke DOM
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(selector)
      attachListeners(newElements)
    })

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [])

  return (
    <>
      {/* Dot Tengah (Fixed) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-blue-500 rounded-full z-[999] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      
      {/* Ring Luar (Smooth) */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border border-blue-500 rounded-full z-[998] pointer-events-none mix-blend-difference"
        style={{ 
          x: cursorX, 
          y: cursorY, 
          translateX: '-50%', 
          translateY: '-50%' 
        }}

        animate={{
          backgroundColor: isHovered ? "rgba(59, 130, 246, 0.5)" : "rgba(0, 0, 0, 0)",
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}