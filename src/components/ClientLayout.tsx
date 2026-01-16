'use client'

import Scene from './Scene'
import SmoothScroll from './SmoothScroll'
import Loader from './Loader'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const handleLoaderFinished = () => {
    window.dispatchEvent(new Event('start-site-intro'))
  }

  return (
    <>
      <Loader onFinished={handleLoaderFinished} />
      
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      <main className="relative z-10 bg-transparent">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </main>
    </>
  )
}