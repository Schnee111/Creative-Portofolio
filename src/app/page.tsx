'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const expertiseRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 1. SCROLL ANIMATION: HERO (TIDAK DIUBAH SAMA SEKALI)
      gsap.fromTo([".hero-char", ".hero-sub"], 
        { y: 0, opacity: 1, rotateX: 0 },
        {
          y: -60,
          opacity: 0,
          rotateX: 90,
          stagger: 0.05,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "25% top",
            scrub: 1,
            immediateRender: false,
          }
        }
      );

      // 2. SCROLL: ABOUT (Menggunakan Timeline agar Sinkron & Anti-Glitch)
      const tlAbout = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top", // Mulai setelah Hero bersih
          end: "50% top",   // Total durasi Bab 2
          scrub: 1,
        }
      });

      tlAbout
        // Fase MUNCUL
        .fromTo(aboutRef.current, 
          { filter: "blur(20px)", opacity: 0, y: 50 },
          { filter: "blur(0px)", opacity: 1, y: 0, duration: 1 }
        )
        // Fase DIAM (Stay)
        .to({}, { duration: 0.5 }) 
        // Fase KELUAR (Naik ke atas dan pudar)
        .to(aboutRef.current, {
          opacity: 0,
          y: -50, // Diubah menjadi -50 agar ada pergerakan 'Out' yang jelas
          filter: "blur(10px)",
          duration: 1
        });

      // 3. SCROLL: EXPERTISE (Menggunakan Timeline agar Sinkron)
      const tlExp = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "45% top", // Mulai setelah About bersih
          end: "70% top",   // LOCK: 90% sudah bersih total
          scrub: 1,
        }
      });

      tlExp
        // Fase MUNCUL
        .fromTo([".exp-title", ".exp-card"], 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 1 }
        )
        // Fase DIAM
        .to({}, { duration: 0.3 })
        // Fase KELUAR
        .to([".exp-title", ".exp-card"], {
          opacity: 0,
          x: -50,
          stagger: 0.05,
          duration: 1
        });

    }, containerRef)

    const startIntro = () => {
      gsap.set(".hero-char", { y: "110%" });
      gsap.to(".hero-char", {
        y: 0,
        stagger: 0.02,
        duration: 1.2,
        ease: "expo.out",
        onComplete: () => { ScrollTrigger.refresh(); }
      });
      gsap.fromTo(".hero-sub", 
        { opacity: 0, y: 10 },
        { opacity: 0.6, y: 0, duration: 1, delay: 0.8 }
      );
    }

    window.addEventListener('start-site-intro', startIntro)
    return () => {
      ctx.revert()
      window.removeEventListener('start-site-intro', startIntro)
    }
  }, [])

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="hero-char inline-block will-change-transform px-[0.02em]">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} style={{ height: '550vh' }} className="relative bg-transparent">
      {/* Konten Hero, About, dan Expertise tetap sama */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none">
        <div className="text-center px-4">
          <h1 className="text-[8vw] md:text-[6vw] font-black text-white leading-[0.8] uppercase tracking-tighter">
            <div className="overflow-hidden py-1 px-4">{splitText("Muhammad")}</div>
            <div className="overflow-hidden text-blue-500 italic font-serif lowercase h-[1.1em] py-1 px-4">
               {splitText("Daffa")}
            </div>
            <div className="overflow-hidden py-1 px-4">{splitText("Maarif")}</div>
          </h1>
          <p className="hero-sub mt-4 font-mono text-[10px] tracking-[0.6em] text-blue-400 uppercase opacity-0">
            Creative Developer
          </p>
        </div>
      </div>

      <div className="fixed inset-0 flex items-end justify-start p-10 md:p-24 z-[90] pointer-events-none">
        {/* Gradien halus di pojok kiri bawah */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.7)_0%,_transparent_50%)] opacity-0 group-active:opacity-100 transition-opacity" />
        
        <div ref={aboutRef} className="max-w-xl opacity-0 relative z-10">
          <span className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase block mb-6 opacity-60">// Mission</span>
          <h2 className="text-white text-2xl md:text-4xl font-light leading-[1.1] tracking-tight">
            Bringing code to life <br/>
            through <br/>
            <span className="text-blue-500 font-bold italic font-serif lowercase text-3xl md:text-5xl">visual storytelling</span> <br/>
            and immersive design.
          </h2>
        </div>
      </div>

      <div className="fixed inset-0 flex flex-col items-end justify-center px-10 md:px-32 z-[90] pointer-events-none text-right">
        {/* Gradien halus di sisi kanan tengah */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(0,0,0,0.6)_0%,_transparent_60%)] opacity-0 group-active:opacity-100 transition-opacity" />

        <div className="space-y-2 md:space-y-4 relative z-10">
          <span className="exp-title text-blue-500 font-mono text-xs tracking-[0.4em] uppercase block mb-10 opacity-0">// Core Skills</span>
          {["Immersive UI", "Fullstack Developer", "Artificial Intelligence", "Distributed Systems", "Data Science"].map((skill, idx) => (
            <div key={idx} className="exp-card opacity-0">
              <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter hover:text-blue-500 transition-colors duration-300">
                {skill}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[100] opacity-30">
        <div className="w-[1px] h-20 bg-gradient-to-b from-blue-600 to-transparent" />
        <span className="text-white font-mono text-[9px] uppercase tracking-[1em] rotate-180 [writing-mode:vertical-lr]">
          Scroll to Enter
        </span>
      </div>
    </div>
  )
}