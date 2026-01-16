'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
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
        onLeave: () => { router.push('/home') }
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
      <div className="fixed inset-0 z-0">
        <Canvas
            camera={{ position: [0, 0, 0], fov: 45, near: 0.01 }}
            style={{ pointerEvents: DEBUG_MODE ? 'auto' : 'none' }} 
        >
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={1.2} />
            <pointLight position={[-2, 1, 2]} intensity={5} color="#0088ff" />
            <pointLight position={[2, 2, 2]} intensity={5} color="#ff00cc" />
            <directionalLight position={[0, 5, 0]} intensity={2} />

            {DEBUG_MODE ? <Debugger /> : <CameraHandler />}

            <group rotation={[0, 40 * (Math.PI / 180), 0]}>
                <ModelRoom />
            </group>

            <Environment preset="night" blur={0.6} environmentIntensity={1} />
        </Canvas>
      </div>
      {DEBUG_MODE && <div className="fixed top-0 left-0 bg-red-600 text-white p-2 z-50 font-bold">🛠 DEBUG MODE ON</div>}
    </>
  )
}