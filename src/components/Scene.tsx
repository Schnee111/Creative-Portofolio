'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Center } from '@react-three/drei'
import { ModelComputer } from './ModelComputer'

export default function Scene() {
  return (
    <Canvas
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      eventSource={document.body}
      shadows
      // Kita set posisi kamera sedikit lebih jauh untuk memastikan objek terlihat
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      {/* 1. Tambahkan warna background sementara untuk debugging */}
      {/* Jika layar jadi abu-abu gelap, berarti Canvas JALAN tapi modelnya yang hilang. */}
      {/* Jika layar tetap putih bersih, berarti Canvas yang CRASH/Tertidih HTML lain. */}
      <color attach="background" args={['#1a1a1a']} />

      {/* 2. Pencahayaan Manual (Tanpa Stage) */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={2} castShadow />

      {/* 3. Center: Memaksa model berada tepat di tengah (0,0,0) */}
      <Center>
        <ModelComputer />
      </Center>

      <Environment preset="city" />

      <OrbitControls 
        makeDefault 
        enableZoom={true} // Aktifkan zoom sementara untuk cari modelnya
      />
    </Canvas>
  )
}