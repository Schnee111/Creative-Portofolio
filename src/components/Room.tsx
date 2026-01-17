'use client'

import * as THREE from 'three'
import React, { JSX, useState, useEffect } from 'react'
import { useGLTF, Html } from '@react-three/drei' 

export function ModelRoom(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/computer-room.glb') as unknown as any
  
  // === ⚡ OPTIMASI MATERIAL (BARU) ===
  useEffect(() => {
    // Loop semua material yang ada di dalam model
    Object.values(materials).forEach((material: any) => {
      // Pastikan material valid
      if (material) {
        // 1. Matikan Double Sided (Paksa render sisi depan saja)
        // Ini mengaktifkan "Backface Culling" -> GPU hemat kerja 50%
        material.side = THREE.FrontSide 

        // 2. Matikan Transparent jika tidak perlu (Opsional, sangat bagus untuk performa)
        // Jika material Anda solid (Meja, Dinding, Speaker), matikan transparansi
        // material.transparent = false 
        // material.alphaTest = 0.5 

        // Update material agar perubahan diterapkan
        material.needsUpdate = true
      }
    })
  }, [materials])
  // ===================================

  // Logic untuk Jam Digital
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
        <mesh geometry={nodes.Object_9.geometry} material={materials.Emission_Blue} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.Foam_Acoustic} />
        <mesh geometry={nodes.Object_11.geometry} material={materials.Foam_Acoustic} />

        {/* === MONITOR SCREEN (Object_13) === */}
        <mesh geometry={nodes.Object_13.geometry} material={materials.Monitor_Single} />

        {/* === LAYAR KIRI (VERTIKAL) === */}
        <mesh geometry={nodes.Object_12.geometry} material={materials.Trim_Sheet_Wall}>
          <Html
            transform
            wrapperClass="htmlScreen"
            distanceFactor={1.5}
            position={[-1.002, -0.1, 0.11]}
            rotation={[Math.PI / 2, 12.2 * (Math.PI / 180), 0]}
            scale={0.14}
          >
            <div className="monitor-screen fui-grid w-[450px] h-[750px] bg-[#050505]/95 p-6 font-mono shadow-[inset_0_0_60px_rgba(0,0,0,1)] text-[10px]">
              <div className="flex flex-col h-full relative z-20 overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-blue-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h3 className="text-white font-bold tracking-[0.2em]">SCHNEE_NUCLEUS_V5</h3>
                  </div>
                  <div className="bg-blue-500/10 px-2 py-0.5 rounded text-blue-400 text-[8px] border border-blue-500/30">
                    Uptime: 284:12:09
                  </div>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3 mb-6 border border-white/5">
                  <div className="flex justify-between text-[8px] text-white/30 mb-2 uppercase tracking-widest">
                    <span>Live Process Log</span>
                    <span>Buffer: 100%</span>
                  </div>
                  <div className="space-y-1.5 opacity-80 h-24 overflow-hidden">
                    <p className="text-blue-400">05:44:01 {">"} Initializing_Neural_Link...</p>
                    <p className="text-green-400">05:44:02 {">"} Auth_Token_Verified [OK]</p>
                    <p className="text-white/60">05:44:03 {">"} Establishing_Handshake_Jakarta_ID</p>
                    <p className="text-yellow-400 animate-pulse">05:44:04 {">"} SYNCING_REMOTE_ASSETS...</p>
                    <p className="text-white/20">05:44:05 {">"} Garbage_Collection_Running</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                    <p className="text-blue-500 mb-2 font-bold">CPU_INTENSITY</p>
                    <div className="flex items-end gap-1 h-10">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="w-full bg-blue-500/40" style={{ height: `${Math.random() * 100}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-500/5 p-3 border border-purple-500/10 rounded-xl">
                    <p className="text-purple-500 mb-2 font-bold">GPU_RENDER</p>
                    <div className="space-y-1.5">
                      {[75, 42, 90].map((val, i) => (
                        <div key={i} className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500/50" style={{ width: `${val}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_120px] gap-4 mb-6">
                  <div className="relative h-32 border border-white/10 rounded-2xl bg-white/[0.02] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 fui-grid opacity-20" />
                    <div className="w-20 h-20 border border-blue-500/20 rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 border-t-2 border-blue-400/60 rounded-full animate-spin [animation-duration:2s]" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-ping" />
                    </div>
                    <div className="absolute top-2 left-2 text-[6px] text-white/40">LOC_SCAN: ACTIVE</div>
                  </div>
                  <div className="flex flex-col justify-between py-1 text-[8px] text-white/40 font-bold border-l border-white/10 pl-4">
                    <div>
                      <p className="text-blue-500/60 mb-1">LATITUDE</p>
                      <p className="text-white">-6.2088° S</p>
                    </div>
                    <div>
                      <p className="text-blue-500/60 mb-1">LONGITUDE</p>
                      <p className="text-white">106.8456° E</p>
                    </div>
                    <div>
                      <p className="text-blue-500/60 mb-1">ALTITUDE</p>
                      <p className="text-white">12.4M</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2 mb-6 opacity-60">
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] mb-2">Active_Project_Nodes</p>
                  {["Deploying_ThreeJS_Engine", "Optimizing_GSAP_Timeline", "Configuring_Environment", "Finalizing_Asset_Loader"].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-1">
                      <div className="w-1.5 h-1.5 border border-blue-500/50 rounded-sm flex items-center justify-center">
                        {i < 2 && <div className="w-full h-full bg-blue-500/80" />}
                      </div>
                      <span className="text-[9px] truncate">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-white/10 pt-4 bg-gradient-to-t from-blue-500/5 to-transparent">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">NODE_04</span>
                        <span className="text-white/20">|</span>
                        <span className="text-white/40 tracking-tighter tracking-widest">TLS_1.3_ENCRYPTED</span>
                      </div>
                      <p className="text-[7px] text-white/10">AUTHENTICATED_SESSION_DAFFA_MAARIF_2026</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-blue-500/50 block mb-1 font-bold">JAKARTA_TIME</span>
                      <span className="text-white font-black text-2xl tabular-nums tracking-wider leading-none">
                        {timeString}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Html>
        </mesh>

        {/* === LAYAR UTAMA (HORIZONTAL) === */}
        <mesh geometry={nodes.Object_13.geometry} material={materials.Monitor_Single}>
          <Html
            transform
            wrapperClass="htmlScreen"
            distanceFactor={1.5}
            position={[-0.458, -0.08, 0.12]} 
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.14} 
          >
            <div className="monitor-screen fui-grid w-[1055px] h-[455px] bg-[#030303] flex flex-col overflow-hidden">
              
              <div className="w-full h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[10px] text-white/40 font-mono tracking-[0.4em] uppercase">
                  Daffa_Workspace_v1.0.4
                </div>
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="flex-1 p-10 flex gap-10 relative">
                <div className="absolute inset-0 fui-grid opacity-20 pointer-events-none" />

                <div className="flex-1 flex flex-col justify-center relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md">
                      <span className="text-blue-500 font-mono text-xs font-bold tracking-widest animate-pulse">LIVE_ENV</span>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
                  </div>
                  
                  <h1 className="text-white font-display font-black text-[90px] leading-none tracking-tighter italic mb-2">
                    katsukare<span className="text-blue-500">.</span>OS
                  </h1>
                  <p className="text-white/40 font-mono text-sm tracking-[0.8em] uppercase pl-2">
                    Daffa's Personal Workspace
                  </p>
                </div>

                <div className="w-[300px] flex flex-col justify-center gap-4 relative z-10">
                  
                  <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 -blur-md">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Active Project</span>
                      <span className="text-blue-500 font-bold text-xs">84%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                      <div className="w-[84%] h-full bg-gradient-to-r from-blue-600 to-blue-400" />
                    </div>
                    <p className="text-white/60 text-[9px] font-mono italic">Syncing Room_Assets...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <p className="text-[8px] text-white/30 uppercase mb-2">Core Temp</p>
                      <div className="text-xl text-white font-bold">42<span className="text-blue-500">°C</span></div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                      <p className="text-[8px] text-white/30 uppercase mb-2">Memory</p>
                      <div className="text-xl text-white font-bold">24<span className="text-blue-500">GB</span></div>
                    </div>
                  </div>

                  <div className="h-20 flex items-center justify-around gap-1 px-2">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-blue-500/20 rounded-full"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          animation: `pulse 2s infinite ${i * 0.1}s` 
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            </div>
          </Html>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/models/computer-room.glb')