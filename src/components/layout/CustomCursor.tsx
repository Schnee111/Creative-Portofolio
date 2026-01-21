'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  // State baru untuk mendeteksi apakah perangkat adalah Desktop
  const [isDesktop, setIsDesktop] = useState(false)
  
  const cursorX = useSpring(0, { stiffness: 800, damping: 35 })
  const cursorY = useSpring(0, { stiffness: 800, damping: 35 })

  useEffect(() => {
    // Fungsi pengecekan: Lebar layar > 768px dan tidak mendukung touch utama
    const checkDevice = () => {
      const isLargeScreen = window.innerWidth > 768
      const hasMouse = window.matchMedia('(pointer: fine)').matches
      setIsDesktop(isLargeScreen && hasMouse)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    if (!isDesktop) return // Jangan pasang event listener jika bukan desktop

    const selector = 'a, button, input, textarea, select, [role="button"], .cursor-pointer, [onclick]'
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
      const isInteractive = elementUnderCursor?.closest(selector)
      setIsHovered(!!isInteractive)
    }

    const handleHoverStart = () => setIsHovered(true)
    const handleHoverEnd = () => setIsHovered(false)

    window.addEventListener('mousemove', moveCursor)

    const attachListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart)
        el.addEventListener('mouseleave', handleHoverEnd)
      })
    }

    const interactiveElements = document.querySelectorAll(selector)
    attachListeners(interactiveElements)

    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(selector)
      attachListeners(newElements)
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [isDesktop]) // Masukkan isDesktop ke dependency agar listener dipasang ulang saat resize

  // JIKA BUKAN DESKTOP, JANGAN RENDERING APAPUN
  if (!isDesktop) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-blue-500 rounded-full z-[999] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border border-blue-500 rounded-full z-[998] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0)",
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}