'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  // State baru untuk mendeteksi apakah perangkat adalah Desktop
  const [isDesktop, setIsDesktop] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

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
      setCursorPos({ x: e.clientX, y: e.clientY })
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

  if (!isDesktop) return null

  return (
    <>
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-blue-500 rounded-full z-[999] pointer-events-none mix-blend-difference"
        style={{ transform: `translate(${cursorPos.x - 3}px, ${cursorPos.y - 3}px)` }}
      />

      <motion.div
        className="fixed w-6 h-6 border border-blue-500 rounded-full z-[998] pointer-events-none mix-blend-difference"
        style={{
          left: cursorPos.x - 12,
          top: cursorPos.y - 12
        }}
        animate={{
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0)",
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}