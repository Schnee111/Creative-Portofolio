'use client'

import * as THREE from 'three'
import React, { JSX, useState, useEffect } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import MonitorScreenLeft from '../room/MonitorScreenLeft'
import MonitorScreenMain from '../room/MonitorScreenMain'

export function ModelRoom(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/computer-room.glb') as unknown as any

  // Material optimization
  useEffect(() => {
    Object.values(materials).forEach((material: any) => {
      if (material) {
        // Enable backface culling for 50% GPU savings
        material.side = THREE.FrontSide
        material.needsUpdate = true
      }
    })
  }, [materials])

  // Clock logic for monitor display
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeString = time.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.987}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.Desk_1} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.Posters} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.Keyboard} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.speaker_2} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.BG_Dark} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.Carpet} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.Emission} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.Foam_Acoustic} />

        {/* Main Monitor Screen */}
        <mesh geometry={nodes.Object_13.geometry} material={materials.Monitor_Single} />

        {/* Left Monitor (Vertical) */}
        <mesh geometry={nodes.Object_12.geometry} material={materials.Trim_Sheet_Wall}>
          <Html
            transform
            wrapperClass="htmlScreen"
            distanceFactor={1.5}
            position={[-1.002, -0.1, 0.11]}
            rotation={[Math.PI / 2, 12.2 * (Math.PI / 180), 0]}
            scale={0.14}
          >
            <MonitorScreenLeft timeString={timeString} />
          </Html>

          {/* Main Monitor (Horizontal) */}
          <Html
            transform
            wrapperClass="htmlScreen"
            distanceFactor={1.5}
            position={[-0.458, -0.08, 0.12]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.14}
          >
            <MonitorScreenMain />
          </Html>
        </mesh>

      </group>
    </group>
  )
}

useGLTF.preload('/models/computer-room.glb')