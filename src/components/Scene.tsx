'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
// import { r3f } from '@/helpers/global'; // Opsional, untuk sharing state nanti

export default function Scene() {
  return (
    <Canvas
      // Settingan kamera default
      camera={{ position: [0, 0, 5], fov: 45 }}
      // Mengizinkan pointer events tembus ke HTML di bawahnya jika tidak kena objek 3D
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      {/* Contoh Objek Sederhana: Kubus Berputar */}
      <mesh rotation={[0.5, 0.5, 0]} scale={1.5}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>

      <Preload all />
    </Canvas>
  );
}