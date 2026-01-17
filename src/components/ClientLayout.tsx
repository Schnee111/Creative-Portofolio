'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Scene from './Scene'
import SmoothScroll from './SmoothScroll'
import Loader from './Loader'
import CustomCursor from './CustomCursor'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [showScrollbar, setShowScrollbar] = useState(true)
  
  // Only show Scene and Loader on homepage
  const isHomepage = pathname === '/'

  const handleLoaderFinished = () => {
    window.dispatchEvent(new Event('start-site-intro'))
  }

  useEffect(() => {
    const setVh = () => {
      // Menghitung 1% dari window.innerHeight
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Hide scrollbar during page transition to dashboard
  useEffect(() => {
    if (pathname === '/dashboard') {
      // Hide scrollbar immediately on dashboard navigation
      setShowScrollbar(false)
      
      // Show scrollbar after booting animation (approx 2 seconds)
      const timer = setTimeout(() => {
        setShowScrollbar(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      // Show immediately on other pages
      setShowScrollbar(true)
    }
  }, [pathname])

  // Custom scroll indicator (Lusion style)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    const indicator = scrollIndicatorRef.current
    const thumb = thumbRef.current

    if (!indicator || !thumb) return

    const updateScrollIndicator = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      // Calculate thumb height and position
      const scrollPercentage = scrollTop / (documentHeight - windowHeight)
      const indicatorHeight = indicator.clientHeight
      const thumbHeight = Math.max((windowHeight / documentHeight) * indicatorHeight, 40)
      const thumbPosition = scrollPercentage * (indicatorHeight - thumbHeight)

      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translateY(${thumbPosition}px)`

      // Show indicator
      indicator.classList.add('visible')

      // Hide after 0.2 second
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        indicator.classList.remove('visible')
      }, 200)
    }

    window.addEventListener('scroll', updateScrollIndicator, { passive: true })
    window.addEventListener('resize', updateScrollIndicator, { passive: true })
    
    // Initial calculation
    setTimeout(updateScrollIndicator, 100)

    return () => {
      window.removeEventListener('scroll', updateScrollIndicator)
      window.removeEventListener('resize', updateScrollIndicator)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <>
      {/* Only render Loader on homepage */}
      {isHomepage && <Loader onFinished={handleLoaderFinished} />}
      
      {/* Only render 3D Scene on homepage */}
      {isHomepage && (
        <div className="fixed inset-0 z-0">
          <Scene />
        </div>
      )}

      <main className="relative z-10 bg-transparent">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </main>

      {/* Custom Scroll Indicator - Hide during dashboard booting */}
      <div 
        ref={scrollIndicatorRef} 
        className="scroll-indicator"
        style={{ display: showScrollbar ? 'block' : 'none' }}
      >
        <div ref={thumbRef} className="scroll-indicator-thumb" />
      </div>
    </>
  )
}