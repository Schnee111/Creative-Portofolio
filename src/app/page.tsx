'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const expertiseRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 1. SCROLL: HERO (Tetap 0% - 20%)
      gsap.fromTo([".hero-char", ".hero-sub"], 
        { y: 0, opacity: 1, rotateX: 0 },
        {
          y: -60,
          opacity: 0,
          rotateX: 90,
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "20% top",
            scrub: 1,
            immediateRender: false,
          }
        }
      );

      // 2. SCROLL: ABOUT (20% - 50%)
      const tlAbout = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top", 
          end: "45% top",
          scrub: 1,
        }
      });

      tlAbout
        .to("#shadow-about", { opacity: 1, duration: 0.3 }) 
        .fromTo(aboutRef.current, 
          { filter: "blur(20px)", opacity: 0, y: 50 },
          { filter: "blur(0px)", opacity: 1, y: 0, duration: 1 }, 
          "<"
        )
        .to({}, { duration: 0.5 }) 
        .to(aboutRef.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 1 })
        .to("#shadow-about", { opacity: 0, duration: 0.3 }, "<");

      // 3. SCROLL: EXPERTISE (45% - 70%)
      const tlExp = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "40% top", 
          end: "60% top",
          scrub: 1,
        }
      });

      tlExp
        .to("#shadow-exp", { opacity: 1, duration: 0.3 })
        .fromTo([".exp-title", ".exp-card"], 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 1 },
          "<"
        )
        .to({}, { duration: 0.3 })
        .to([".exp-title", ".exp-card"], { opacity: 0, x: -50, stagger: 0.05, duration: 1 })
        .to("#shadow-exp", { opacity: 0, duration: 0.3 }, "<");

      // 4. FINAL INDICATOR (90% - 100%)
      gsap.fromTo(indicatorRef.current, 
        { opacity: 0, y: 20 }, 
        {
          opacity: 0.5,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "60% top",
            end: "100% top",
            scrub: 1,
          }
        }
      );

    }, containerRef)

    const startIntro = () => {
      gsap.set(".hero-char", { y: "110%" });
      gsap.to(".hero-char", { y: 0, stagger: 0.02, duration: 1.2, ease: "expo.out", onComplete: () => { ScrollTrigger.refresh(); } });
      gsap.fromTo(".hero-sub", { opacity: 0, y: 10 }, { opacity: 0.6, y: 0, duration: 1, delay: 0.8 });
    }

    window.addEventListener('start-site-intro', startIntro)
    return () => {
      ctx.revert()
      window.removeEventListener('start-site-intro', startIntro)
    }
  }, [])

  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="hero-char inline-block px-[0.02em]">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} style={{ height: '550vh' }} className="relative bg-transparent">
      
      {/* SECTION 1: HERO - DENGAN SHADOW/GLOW YANG DIKEMBALIKAN */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none text-center px-4">
        {/* Glow pusat yang sempat hilang */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0%,_transparent_65%)]" />
        
        <div className="relative z-10">
            <h1 className="text-[8vw] md:text-[6vw] font-black text-white leading-[0.8] uppercase tracking-[-0.05em]">
            <div className="overflow-hidden py-2 px-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{splitText("Muhammad")}</div>
            <div className="overflow-hidden text-blue-500 italic font-serif lowercase h-[1.1em] py-2 px-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">{splitText("Daffa")}</div>
            <div className="overflow-hidden py-2 px-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{splitText("Maarif")}</div>
            </h1>
            <div className="hero-sub mt-8 flex items-center justify-center gap-6 opacity-0">
            <div className="h-[1px] w-12 bg-blue-500/50" />
            <p className="font-mono text-[10px] md:text-xs tracking-[0.8em] text-blue-400 uppercase">Creative Developer</p>
            <div className="h-[1px] w-12 bg-blue-500/50" />
            </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT */}
      <div className="fixed inset-0 flex items-end justify-start p-10 md:p-24 z-[90] pointer-events-none">
        <div id="shadow-about" className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-0 pointer-events-none" />
        <div ref={aboutRef} className="max-w-xl opacity-0 relative z-10">
          <span className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase block mb-6 opacity-60">// Mission</span>
          <h2 className="text-white text-2xl md:text-4xl font-light leading-[1.1] tracking-tight drop-shadow-2xl">
            Bringing code to life <br/>
            through <br/>
            <span className="text-blue-500 font-bold italic font-serif lowercase text-3xl md:text-5xl drop-shadow-lg">visual storytelling</span> <br/>
            and immersive design.
          </h2>
        </div>
      </div>

      {/* SECTION 3: EXPERTISE */}
      <div className="fixed inset-0 flex flex-col items-end justify-center px-10 md:px-32 z-[90] pointer-events-none text-right">
        <div id="shadow-exp" className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/60 to-transparent opacity-0 pointer-events-none" />
        <div className="space-y-2 md:space-y-4 relative z-10">
          <span className="exp-title text-blue-500 font-mono text-xs tracking-[0.4em] uppercase block mb-10 opacity-0">// Core Skills</span>
          {["Immersive UI", "Fullstack Developer", "Artificial Intelligence", "Distributed Systems", "Data Science"].map((skill, idx) => (
            <div key={idx} className="exp-card opacity-0">
              <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter hover:text-blue-500 transition-colors duration-300 drop-shadow-2xl">{skill}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: FINAL INDICATOR */}
      <div ref={indicatorRef} className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[100] opacity-0 pointer-events-none">
        <span className="text-white font-mono text-[9px] uppercase tracking-[1em]">Scroll to Explore more</span>
        <div className="w-[1px] h-16 bg-gradient-to-t from-blue-600 to-transparent" />
      </div>

    </div>
  )
}