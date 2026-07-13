"use client";

import React, { useState, useEffect, useRef } from "react";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"] });

const videos = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4"
];

const css = `
  :root {
    --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes revealUp { 
    from { opacity: 0; transform: translateY(80px) } 
    to { opacity: 1; transform: translateY(0) } 
  }
  @keyframes revealRight { 
    from { opacity: 0; transform: translateX(100px) } 
    to { opacity: 1; transform: translateX(0) } 
  }
  @keyframes dotPulse { 
    0%, 100% { opacity: 1; transform: scale(1) } 
    50% { opacity: 0.45; transform: scale(1.45) } 
  }
  .reveal-up {
    opacity: 0;
  }
  .reveal-right {
    opacity: 0;
  }
  .is-revealed .reveal-up {
    animation: revealUp 0.9s var(--ease-spring) forwards;
  }
  .is-revealed .reveal-right {
    animation: revealRight 0.9s var(--ease-spring) forwards;
  }
  .nav-link-underline {
    position: relative;
    cursor: pointer;
  }
  .nav-link-underline::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: currentColor;
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }
  .nav-link-underline:hover::after {
    transform-origin: bottom left;
    transform: scaleX(1);
  }
  .role-link {
    transition: transform 0.3s ease-out;
  }
  .role-link:hover {
    transform: translateX(4px);
  }
  .cta-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid white;
    cursor: pointer;
  }
  .cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: #F598F2;
    transform: translateY(101%);
    transition: transform 0.4s var(--ease-spring);
    z-index: -1;
  }
  .cta-btn:hover {
    color: black;
    border-color: #F598F2;
  }
  .cta-btn:hover::before {
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal-up, .reveal-right { opacity: 1; animation: none; transform: none; }
    .nav-link-underline::after { display: none; }
    .role-link:hover { transform: none; }
    .cta-btn::before { transition: none; }
  }
`;

export default function ViktorStudio({ isPreview = false }: { isPreview?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [blobUrls, setBlobUrls] = useState<string[]>(videos);

  useEffect(() => {
    // Preload videos as blobs for instant switching (only if not preview to save bandwidth, or just do it)
    if (!isPreview) {
      Promise.all(videos.map(async (url) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          return URL.createObjectURL(blob);
        } catch (_e) {
          return url; // fallback
        }
      })).then(urls => setBlobUrls(urls));
    }

    // Intersection Observer for reveal
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [isPreview]);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/London' }).format(new Date()) + " CUP");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dotColor = activeIndex === 0 ? "#F598F2" : "white";
  const periodColor = activeIndex === 0 ? "#F598F2" : "white";

  return (
    <div className={`relative w-full h-[100vh] min-h-[600px] bg-black text-white overflow-hidden ${figtree.className}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      
      {/* Video Backgrounds */}
      {blobUrls.map((url, i) => (
        <video 
          key={i}
          src={url}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${i === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          muted autoPlay playsInline loop aria-hidden="true"
        />
      ))}
      <div className="absolute inset-0 bg-black/10 z-[1] pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 flex justify-center">
        <div className="w-full max-w-[1340px] py-6 px-[18px] md:py-[30px] lg:py-9 flex justify-between items-start">
          
          {/* Desktop Nav */}
          <div className="hidden min-[810px]:flex gap-4 lg:gap-8">
            {["Works", "Services", "About", "Contact"].map((item, i) => (
              <div key={item} className="flex flex-col nav-link-underline">
                <span className="text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase text-white/70">0{i+1} /</span>
                <span className="text-xs leading-4 tracking-[-0.12px] font-medium uppercase">{item}</span>
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="min-[810px]:hidden">
             <button 
               className="text-xs leading-4 tracking-[-0.12px] font-medium uppercase z-50 relative"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? "CLOSE" : "MENU"}
             </button>
          </div>

          {/* Right Info */}
          <div className="flex flex-col items-end text-xs leading-4 tracking-[-0.12px] font-medium uppercase relative z-50">
            <span>Davies@gmail.com</span>
            <span>{time}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div className="min-[810px]:hidden absolute inset-0 z-40 flex flex-col justify-center items-center bg-black/95 backdrop-blur-md transition-all duration-[420ms] var(--ease-spring)"
           style={{ display: 'grid', gridTemplateRows: isMenuOpen ? '1fr' : '0fr', opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? 'auto' : 'none' }}>
         <div className="overflow-hidden flex flex-col gap-6 text-center">
            {["Works", "Services", "About", "Contact"].map((item, _i) => (
              <div key={item} className="text-[28px] leading-8 tracking-[-0.84px] font-medium uppercase">{item}</div>
            ))}
         </div>
      </div>

      {/* Hero Content */}
      <main 
        ref={sectionRef} 
        className={`relative z-[2] w-full max-w-[1340px] mx-auto h-full flex flex-col justify-end min-[810px]:items-end items-start px-[18px] lg:px-[15px] pt-[140px] min-[810px]:pt-[190px] gap-[72px] min-[810px]:gap-[150px] pb-11 min-[810px]:pb-[52px] lg:pb-[60px] ${revealed || isPreview ? 'is-revealed' : ''}`}
      >
        {/* Section 1: Switcher & Availability */}
        <div className="w-full flex flex-col min-[810px]:flex-row gap-7 min-[810px]:gap-0">
          <div className="flex-[4] flex flex-col gap-2 min-[810px]:gap-1">
            {["WATER WAVE", "GRIDWAVE", "LIGHT TUNNEL"].map((label, i) => (
              <button 
                key={label}
                onClick={() => setActiveIndex(i)}
                className={`role-link text-left text-[10px] md:text-xs tracking-[-0.12px] font-medium uppercase transition-opacity duration-300 ${i === activeIndex ? 'opacity-100' : 'opacity-55 hover:opacity-75'}`}
              >
                0{i+1} / {label}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-3">
             <div className="w-[7px] h-[7px] rounded-full" style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}`, animation: 'dotPulse 1.6s infinite' }} />
             <span className="text-[10px] md:text-xs tracking-[-0.12px] font-medium uppercase">Available for work</span>
          </div>
        </div>

        {/* Section 2: Name & CTA */}
        <div className="w-full flex flex-col min-[810px]:flex-row gap-8 min-[810px]:gap-7 lg:gap-[50px] items-start min-[810px]:items-end">
           <div className="flex-[2] reveal-up">
              <h1 className="font-medium uppercase leading-[96px] min-[810px]:leading-[113.4px] lg:leading-[81%] tracking-[-4.8px] min-[810px]:tracking-[-7.7px] lg:tracking-[-6px] text-[clamp(68px,21vw,80px)] min-[810px]:text-[129.6px] lg:text-[200px] m-0">
                 Viktor<span style={{ color: periodColor, transition: 'color 0.5s ease' }}>.</span>
              </h1>
           </div>
           
           <div className="flex-1 min-[810px]:pl-6 lg:pl-[50px] flex flex-col items-start gap-6 max-w-[420px] min-[810px]:max-w-none">
              <p className="reveal-right text-base leading-6 tracking-[-0.16px] font-medium m-0 text-white/90">
                 I craft bold brands and modern websites with purpose. Focused on pushing boundaries in digital experiences.
              </p>
              <button className="reveal-right cta-btn px-6 py-3 rounded-full text-sm font-medium tracking-[-0.12px] uppercase z-10" style={{ animationDelay: '0.08s' }}>
                <span className="relative z-10 text-[inherit]">start a project</span>
              </button>
           </div>
        </div>
      </main>

    </div>
  );
}
