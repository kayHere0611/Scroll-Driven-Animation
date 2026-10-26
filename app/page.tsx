'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [stealthMode, setStealthMode] = useState(false);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. INITIAL LOAD ANIMATION
      const headlineChars = headlineRef.current?.querySelectorAll('.char');
      if (headlineChars) {
        gsap.fromTo(
          headlineChars,
          { opacity: 0, y: 40, rotateX: -60 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power3.out',
          }
        );
      }

      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.5,
          ease: 'back.out(1.4)',
        }
      );

      // 2. SCROLL-DRIVEN ANIMATION TIMELINE
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1500',
          scrub: 1.2,
          pin: true,
          onUpdate: (self) => {
            // Calculate dynamic velocity
            const currentVel = Math.abs(self.getVelocity());
            const targetSpeed = Math.min(
              250,
              Math.round((currentVel / 15) + self.progress * 120)
            );
            setSpeed(targetSpeed);
          },
        },
      });

      // Animate headline floating up & fading
      scrollTl.to(headlineRef.current, { y: -100, opacity: 0.2, duration: 1 }, 0);

      // Animate car from Left with subtle rotation
      scrollTl.to(
        carRef.current,
        {
          x: '60vw',
          rotateZ: 2,
          scale: 1.05,
          duration: 2,
          ease: 'power1.inOut',
        },
        0
      );

      // Animate 3 Metric Cards reveal sequentially
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        scrollTl.to(
          cards[0],
          { borderColor: 'rgba(59, 130, 246, 0.8)', scale: 1.05, duration: 0.5 },
          0.3
        );
        scrollTl.to(
          cards[1],
          { borderColor: 'rgba(59, 130, 246, 0.8)', scale: 1.05, duration: 0.5 },
          0.8
        );
        scrollTl.to(
          cards[2],
          { borderColor: 'rgba(59, 130, 246, 0.8)', scale: 1.05, duration: 0.5 },
          1.3
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden font-sans">
      {/* HERO SCROLL CONTAINER */}
      <section
        ref={containerRef}
        className="relative h-screen w-full flex flex-col justify-between items-center p-6 md:p-12 select-none overflow-hidden"
      >
        {/* Background Grid & Radial Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Top Header Controls */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300" id="navbar">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-3 shadow-2xl shadow-black/80">
            
            {/* Left: Branding & Status Indicator */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 via-slate-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-emerald-400 shadow-md shadow-emerald-950/50">
                    FZ
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-bold tracking-widest text-sm sm:text-base text-slate-100 font-mono">
                    ITZ FIZZ
                    </span>
                    <span className="text-[10px] sm:text-xs text-emerald-400/90 font-mono tracking-wider flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Animation By Kaveri
                    </span>
                </div>
            </div>

            {/* Right: Telemetry Controls & Stealth Toggle */}
            <div className="flex items-center gap-3">
            <button 
                onClick={() => setStealthMode(!stealthMode)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200 text-xs flex items-center gap-2 font-mono shadow-inner group"
            >
                <i className="fa-solid fa-eye-slash text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="tracking-wider text-slate-200">
                {stealthMode ? 'STEALTH MODE' : 'TRACK MODE'}
                </span>
            </button>
            </div>

        </div>
        </header>

        {/* Main Headline */}
        <div className="z-10 text-center my-auto px-4 py-6">
        <h1 ref={headlineRef}  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.25em] sm:tracking-[0.35em] uppercase bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent flex flex-wrap justify-center gap-x-[0.3em] gap-y-2 select-none">
            {'WELCOME ITZ FIZZ'.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} className="inline-flex whitespace-nowrap">
                {word.split('').map((char, charIndex) => (
                <span key={charIndex} className="char inline-block transform-gpu">
                    {char}
                </span>
                ))}
            </span>
            ))}
        </h1>
        <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.3em] text-blue-400 uppercase opacity-90">
            Scroll to accelerate visual experience
        </p>
        </div>

        {/* Animated Car sub-parts (Moves Left to Right) */}
        <div
          ref={carRef}
          className="absolute top-1/2 left-[-15%] -translate-y-1/2 w-[320px] md:w-[500px] lg:w-[620px] z-10 pointer-events-none transition-filter duration-300"
          style={{ filter: stealthMode ? 'brightness(0.5) contrast(1.5)' : 'none' }}
        >
          <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-[0_25px_35px_rgba(59,130,246,0.3)]">
            {/* Car Wheels */}
            <circle cx="220" cy="200" r="45" fill="#0f172a" stroke="#3b82f6" strokeWidth="6" />
            <circle cx="220" cy="200" r="20" fill="#334155" />
            <circle cx="580" cy="200" r="45" fill="#0f172a" stroke="#3b82f6" strokeWidth="6" />
            <circle cx="580" cy="200" r="20" fill="#334155" />

            {/* Aerodynamic Hypercar Body */}
            <path
              d="M 100 200 C 140 160 200 130 300 120 C 420 110 520 130 620 150 C 680 160 740 180 750 200 C 720 205 640 205 580 205 C 520 205 280 205 220 205 Z"
              fill="url(#carGradient)"
            />
            {/* Cockpit / Windshield */}
            <path d="M 320 120 C 370 80 470 80 540 130 Z" fill="#1e293b" opacity="0.85" />
            {/* Headlight Glow */}
            <polygon points="730,185 790,180 790,195 730,190" fill="#60a5fa" opacity="0.9" />

            <defs>
              <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Speed Indicator */}
        <div className="z-10 font-mono text-xs text-slate-400 tracking-widest flex items-center gap-2 mb-4">
          <span>LIVE TELEMETRY:</span>
          <span className="text-blue-400 font-bold text-sm">{speed} MPH</span>
        </div>

        {/* 3 Random Cards */}
        <div
          ref={cardsRef}
          className="z-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md transition-all">
            <h3 className="text-2xl font-black text-white font-mono">1.9s</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
              0-60 MPH Acceleration
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md transition-all">
            <h3 className="text-2xl font-black text-white font-mono">250 MPH</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
              Aerodynamic Top Speed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md transition-all">
            <h3 className="text-2xl font-black text-white font-mono">1200 HP</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
              Dual-Motor Quad Output
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}