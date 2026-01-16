'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/SmoothScroll';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Layer 1: Canvas 3D (Background/Immersive) */}
      <div className="fixed inset-0 z-0 touch-none">
        <Scene />
      </div>

      {/* Layer 2: Konten HTML (Scrollable) */}
      <main className="relative z-10">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </main>
    </>
  );
}