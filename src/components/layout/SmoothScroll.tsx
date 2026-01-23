'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Sinkronisasi ScrollTrigger dengan Lenis
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: isMobile ? 1 : 0.125,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.2,
        infinite: false,
        prevent: (node: any) => node.classList.contains('no-smooth-scroll'),
        overscroll: false,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}