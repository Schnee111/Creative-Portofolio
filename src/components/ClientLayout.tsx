'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Scene from './Scene'
import SmoothScroll from './SmoothScroll'
import Loader from './Loader'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  
  // Only show Scene and Loader on homepage
  const isHomepage = pathname === '/'

  const handleLoaderFinished = () => {
    window.dispatchEvent(new Event('start-site-intro'))
  }

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

      // Hide after 1 second
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        indicator.classList.remove('visible')
      }, 1000)
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
          {children}
        </SmoothScroll>
      </main>

      {/* Custom Scroll Indicator */}
      <div ref={scrollIndicatorRef} className="scroll-indicator">
        <div ref={thumbRef} className="scroll-indicator-thumb" />
      </div>
    </>
  )
}