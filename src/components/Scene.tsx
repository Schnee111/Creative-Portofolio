'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { ModelRoom } from './Room'
import { useRef, useLayoutEffect, useEffect } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'
import { useControls, button } from 'leva'

const DEBUG_MODE = false; 

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const START_POS  = { x: 1.757, y: 0.467, z: 3.037 }
const START_LOOK = { x: -0.478, y: 0.122, z: 0.367 }

const END_POS    = { x: -0.09, y: 0.117, z: 0.598 }
const END_LOOK   = { x: -0.362, y: 0.118, z: 0.269 }

function Debugger() {
  const { camera } = useThree()
  const orbitRef = useRef<any>(null)

  useControls({
    'PRINT KOORDINAT': button(() => {
        const p = camera.position
        const t = orbitRef.current.target
        console.log(`
// === SALIN KE DATA KOORDINAT ===
const START_POS  = { x: ${p.x.toFixed(3)}, y: ${p.y.toFixed(3)}, z: ${p.z.toFixed(3)} }
const START_LOOK = { x: ${t.x.toFixed(3)}, y: ${t.y.toFixed(3)}, z: ${t.z.toFixed(3)} }
// ==============================
        `)
        alert('Koordinat dicetak di Console (F12)')
    })
  })

  useEffect(() => {
    camera.position.set(START_POS.x, START_POS.y, START_POS.z)
    if(orbitRef.current) orbitRef.current.target.set(START_LOOK.x, START_LOOK.y, START_LOOK.z)
  }, [camera])

  return <OrbitControls ref={orbitRef} makeDefault />
}

function CameraHandler() {
  const { camera, size } = useThree()
  const router = useRouter()
  const tl = useRef<gsap.core.Timeline | null>(null)
  const isMobile = size.width < 768

  const baseLookAt = useRef(new THREE.Vector3(START_LOOK.x, START_LOOK.y, START_LOOK.z))
  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useLayoutEffect(() => {
    camera.position.set(START_POS.x, START_POS.y, START_POS.z)
    baseLookAt.current.set(START_LOOK.x, START_LOOK.y, START_LOOK.z)

    const finalPos = isMobile ? { ...END_POS, z: END_POS.z + 0.3 } : END_POS

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.0, 
        onLeave: () => { router.push('/dashboard') }
      }
    })

    tl.current
      .to(camera.position, { x: finalPos.x, y: finalPos.y, z: finalPos.z, duration: 1, ease: 'power2.inOut' }, 0)
      .to(baseLookAt.current, { x: END_LOOK.x, y: END_LOOK.y, z: END_LOOK.z, duration: 1, ease: 'power2.inOut' }, 0)

    return () => {
      tl.current?.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [camera, isMobile, router])

  useFrame(() => {
    const progress = tl.current ? tl.current.progress() : 0
    const parallaxStrength = Math.max(0, 1 - (progress * 1.25))

    // Sangat smooth (0.02)
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mouse.current.x, 0.02)
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mouse.current.y, 0.02)

    // Jangkauan Luas (1.5)
    const lookX = baseLookAt.current.x + (smoothMouse.current.x * 1 * parallaxStrength)
    const lookY = baseLookAt.current.y + (smoothMouse.current.y * 0.7 * parallaxStrength)

    camera.lookAt(lookX, lookY, baseLookAt.current.z)
  })

  return null
}

export default function Scene() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#050505]">
        <Canvas
            camera={{ position: [0, 0, 0], fov: 45, near: 0.01 }}
            style={{ pointerEvents: DEBUG_MODE ? 'auto' : 'none' }} 
            shadows // Aktifkan sistem bayangan
            
            // === OPTIMASI CANVAS ===
            dpr={[1, 1.5]} 
            gl={{ 
              antialias: false, 
              powerPreference: "high-performance", 
              stencil: false, 
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping, // Tone mapping filmis
              toneMappingExposure: 0.9 // Sedikit lebih gelap untuk mood
            }}
            // ========================
        >
            {/* 1. ATMOSPHERE: Kabut halus untuk menyatukan ruang & background */}
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 20]} /> 

            {/* 2. LIGHTING SETUP: Cinematic "Teal & Orange" Vibe */}
            
            {/* Ambient Light: Sangat redup, hanya agar hitam tidak mati total */}
            <ambientLight intensity={0.2} color="#1a2035" /> 

            {/* Key Light: Cahaya utama (Hangat/Amber) - Fokus ke meja */}
            <spotLight 
              position={[5, 8, 5]} 
              angle={0.5} 
              penumbra={1} 
              intensity={20} 
              color="#ffaa77" // Warna hangat lampu meja
              castShadow 
              shadow-bias={-0.0001}
            />

            {/* Fill Light: Cahaya pengisi (Dingin/Biru) - Dari sisi berlawanan */}
            <pointLight 
              position={[-5, 5, -5]} 
              intensity={5} 
              color="#4c6ef5" // Biru cyber
            />

            {/* Screen Glow Simulation: Cahaya dari area monitor */}
            <pointLight 
              position={[-0.3, 0.2, 0.4]} 
              distance={3}
              intensity={1.5} 
              color="#00ffff" // Cyan screen glow
            />

            {DEBUG_MODE ? <Debugger /> : <CameraHandler />}

            <group rotation={[0, 40 * (Math.PI / 180), 0]}>
                <ModelRoom />
            </group>

            {/* 3. REFLECTIONS: City preset lebih detail untuk logam/kaca */}
            <Environment preset="city" environmentIntensity={0.5} blur={0.8} />

            {/* 4. GROUND SHADOWS: Bayangan kontak di lantai agar tidak melayang */}
            <ContactShadows 
              position={[0, -0.01, 0]} // Tepat di bawah lantai
              opacity={0.6} 
              scale={10} 
              blur={2.5} 
              far={4} 
            />

            {/* 5. POST PROCESSING: Final Polish */}
            <EffectComposer multisampling={0} enableNormalPass={false}>
              {/* Bloom: Membuat layar monitor & neon berpendar indah */}
              <Bloom 
                luminanceThreshold={1} // Hanya bagian sangat terang yang glowing
                mipmapBlur 
                intensity={1.2} 
                radius={0.5} 
              />
              
              {/* Noise: Memberi tekstur "film grain" agar tidak terlalu plastik */}
              <Noise opacity={0.02} />
              
              {/* Vignette: Fokuskan mata ke tengah layar */}
              <Vignette eskil={false} offset={0.1} darkness={0.9} />
              
              {/* Chromatic Aberration: Efek lensa kamera (sedikit saja di pinggir) */}
              <ChromaticAberration 
                offset={[0.001, 0.001]} // Pergeseran RGB sangat halus
                radialModulation={false}
                modulationOffset={0}
              />
            </EffectComposer>
        </Canvas>
      </div>
      {DEBUG_MODE && <div className="fixed top-0 left-0 bg-red-600 text-white p-2 z-50 font-bold">DEBUG MODE ON</div>}
    </>
  )
}