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
      
      // SNAPPING SETUP
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: [0, 0.40, 0.60],
          duration: { min: 0.4, max: 0.8 },
          ease: "power2.out"
        }
      });

      // 1. SCROLL: HERO (0% - 20%)
      // Animasi Teks (Movement + Opacity)
      gsap.fromTo([".hero-char", ".hero-sub"], 
        { y: 0, opacity: 1, rotateX: 0 },
        {
          y: -60,
          opacity: 0,
          rotateX: 90,
          stagger: 0.03,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "20% top",
            scrub: 1,
            immediateRender: false,
          }
        }
      );

      // Animasi Background Glow (Hanya Opacity agar halus)
      gsap.to(".hero-glow", {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: 1,
        }
      });

      // 2. SCROLL: ABOUT (20% - 45%)
      const tlAbout = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top", 
          end: "45% top",
          scrub: 1,
        }
      });

      tlAbout
        .to("#shadow-about", { opacity: 1, duration: 0.2 }) 
        .fromTo(aboutRef.current, 
          { filter: "blur(20px)", opacity: 0, y: 50 },
          { filter: "blur(0px)", opacity: 1, y: 0, duration: 0.7 },
          "<"
        )
        .to({}, { duration: 0.3 })
        .to(aboutRef.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 0.7 })
        .to("#shadow-about", { opacity: 0, duration: 0.2 }, "<");

      // 3. SCROLL: EXPERTISE (40% - 60%)
      const tlExp = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "40% top", 
          end: "60% top",
          scrub: 1,
        }
      });

      tlExp
        .to("#shadow-exp", { opacity: 1, duration: 0.2 })
        .fromTo([".exp-title", ".exp-card"], 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.7 },
          "<"
        )
        .to({}, { duration: 0.2 })
        .to([".exp-title", ".exp-card"], { opacity: 0, x: -50, stagger: 0.04, duration: 0.7 })
        .to("#shadow-exp", { opacity: 0, duration: 0.2 }, "<");

      // 4. FINAL INDICATOR
      gsap.fromTo(indicatorRef.current, 
        { opacity: 0, y: 20 }, 
        {
          opacity: 0.5,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "65% top",
            end: "100% top",
            scrub: 1,
          }
        }
      );

    }, containerRef)

    const startIntro = () => {
      gsap.set(".hero-char", { y: "110%" });
      gsap.to(".hero-char", { 
        y: 0, 
        stagger: 0.015, 
        duration: 0.8, 
        ease: "expo.out", 
        onComplete: () => { ScrollTrigger.refresh(); } 
      });
      gsap.fromTo(".hero-sub", 
        { opacity: 0, y: 10 }, 
        { opacity: 0.6, y: 0, duration: 0.6, delay: 0.4 }
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
      <span key={i} className="hero-char inline-block px-[0.02em]">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} style={{ height: '550vh' }} className="relative bg-transparent font-sans selection:bg-blue-500/30">
      
      {/* SECTION 1: HERO */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] pointer-events-none text-center px-4">

        <div className="hero-glow absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.7)_0%,_transparent_75%)]" />
        
        <div className="relative z-10">
          <h1 className="text-[8vw] md:text-[6vw] font-display text-white leading-[0.8] uppercase tracking-[-0.06em]">
            <div className="overflow-hidden py-2 px-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
              {splitText("Muhammad")}
            </div>
            <div className="overflow-hidden text-blue-500 italic py-2 px-4 drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)]">
              {splitText("Daffa")}
            </div>
            <div className="overflow-hidden py-2 px-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
              {splitText("Maarif")}
            </div>
          </h1>
          
          <div className="hero-sub mt-8 flex items-center justify-center gap-6 opacity-0">
            <div className="h-[1px] w-12 bg-blue-500/50" />
            <p className="font-mono text-[10px] md:text-xs tracking-[0.6em] text-blue-400 uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              Creative Developer
            </p>
            <div className="h-[1px] w-12 bg-blue-500/50" />
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT */}
      <div className="fixed inset-0 flex items-end justify-start p-10 md:p-24 z-[90] pointer-events-none">
        <div id="shadow-about" className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-0 pointer-events-none" />
        <div ref={aboutRef} className="max-w-2xl opacity-0 relative z-10">
          <span className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-6 opacity-60">// Mission_Statement</span>
          <h2 className="text-white text-2xl md:text-4xl font-normal leading-[1.1] tracking-tight drop-shadow-2xl">
            Bridging complex <br/>
            <span className="text-blue-500 font-black italic font-display lowercase text-3xl md:text-5xl drop-shadow-lg tracking-tighter">logic</span> <br/>
            with seamless <span className="text-blue-500 font-black italic font-display lowercase text-3xl md:text-5xl drop-shadow-lg tracking-tighter">visuals</span> <br/>
            to create digital experiences.
          </h2>
        </div>
      </div>

      {/* SECTION 3: EXPERTISE */}
      <div className="fixed inset-0 flex flex-col items-end justify-center px-10 md:px-32 z-[90] pointer-events-none text-right">
        <div id="shadow-exp" className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/60 to-transparent opacity-0 pointer-events-none" />
        <div className="space-y-2 md:space-y-4 relative z-10">
          <span className="exp-title text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-10 opacity-0">// Core_Skills</span>
          {["Immersive UI", "Fullstack Developer", "Artificial Intelligence", "Distributed Systems", "Data Science"].map((skill, idx) => (
            <div key={idx} className="exp-card opacity-0">
              <h3 className="text-white text-2xl md:text-4xl font-display font-black uppercase tracking-tighter hover:text-blue-500 transition-colors duration-300 drop-shadow-2xl">{skill}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: FINAL INDICATOR */}
      <div ref={indicatorRef} className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[100] opacity-0 pointer-events-none">
        <span className="text-white font-mono text-[9px] uppercase tracking-[0.8em]">Scroll to Explore more</span>
        <div className="w-[1px] h-16 bg-gradient-to-t from-blue-600 to-transparent" />
      </div>

    </div>

  )
}