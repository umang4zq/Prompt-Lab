"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { ArrowRight, ArrowDown, ChevronUp, Info, Menu, X } from "lucide-react";
import Head from "next/head";

const DARK = "#1D3045";
const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4";

// Using next/font is ideal but requirement explicitly says load exactly:
// <link href="https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME" rel="stylesheet">
// We can just embed this in the component for the template.

export default function Vectrus({ isPreview = false }: { isPreview?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getProgress = useCallback(() => {
    if (!containerRef.current) return 0;
    // In preview mode, force progress to a specific frame or scrub via hover?
    // Let's just fix it at a nice frame for preview.
    if (isPreview) return 0.4;
    
    const { top, height } = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = height - windowHeight;
    // top is negative when scrolling down
    const scrolled = -top;
    
    const p = Math.max(0, Math.min(1, scrolled / scrollDistance));
    // Fallback if not scrolling yet
    if (scrollDistance <= 0) return 0;
    return p;
  }, [isPreview]);

  const { videoRef, canvasRef, scrollProgress, canvasLive } = useVideoScrub(VIDEO_URL, getProgress);

  const [menuOpen, setMenuOpen] = useState(false);
  
  // Calculate opacities
  const p = scrollProgress;
  
  let s1Opacity = 1;
  if (p >= 0.20) {
    s1Opacity = Math.max(0, 1 - (p - 0.20) / 0.08);
  }

  let s2Opacity = 0;
  if (p >= 0.32 && p < 0.40) {
    s2Opacity = (p - 0.32) / 0.08;
  } else if (p >= 0.40 && p < 0.55) {
    s2Opacity = 1;
  } else if (p >= 0.55) {
    s2Opacity = Math.max(0, 1 - (p - 0.55) / 0.08);
  }

  let s3Opacity = 0;
  if (p >= 0.67 && p < 0.75) {
    s3Opacity = (p - 0.67) / 0.08;
  } else if (p >= 0.75) {
    s3Opacity = 1;
  }

  const isLight = p > 0.55;
  const navColor = isLight ? "white" : DARK;

  // Stagger components
  const StaggerItem = ({ delayMs, visible, children, className = "" }: any) => {
    return (
      <div 
        className={`transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateY(${visible ? 0 : '24px'})`,
          transitionDelay: `${visible ? delayMs : 0}ms`,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    );
  };

  const NavLink = ({ children, active, delay }: { children: React.ReactNode, active?: boolean, delay: number }) => (
    <div 
      className={`relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70 cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
      style={{
        opacity: isPreview ? 1 : 0,
        transform: `translateY(${isPreview ? 0 : '-12px'})`,
        animation: `navEntrance 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards`
      }}
    >
      {children}
      {active && <div className="absolute -bottom-3 left-0 w-full h-[2px] bg-current" />}
    </div>
  );

  return (
    <div className={`relative ${isPreview ? 'h-full w-full' : 'h-[500vh]'}`} ref={containerRef} style={{ fontFamily: "'Helvetica Neue ME', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME');
        @keyframes navEntrance {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
      
      <div className={`sticky top-0 w-full ${isPreview ? 'h-full' : 'h-screen'} overflow-hidden bg-black`}>
        
        {/* VIDEO & CANVAS BACKGROUND */}
        <video 
          ref={videoRef}
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />
        <canvas 
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        {/* OVERLAY WRAPPER */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* NAVBAR */}
          <nav className="absolute top-0 left-0 w-full z-50 pointer-events-auto px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 flex items-center justify-between transition-colors duration-500" style={{ color: navColor }}>
            
            {/* Desktop Left */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              <NavLink delay={100} active>VECTRUS ENERGY</NavLink>
              <NavLink delay={180}>VECTRUS UPSTREAM</NavLink>
              <NavLink delay={260}>VECTRUS MARKETS</NavLink>
              <NavLink delay={340}>VECTRUS SYSTEMS</NavLink>
              <NavLink delay={420}>VECTRUS+</NavLink>
            </div>

            {/* Mobile Left */}
            <button 
              className="lg:hidden flex flex-col gap-[5px]"
              onClick={() => setMenuOpen(true)}
            >
              <div className="w-[24px] h-[2px] bg-current" />
              <div className="w-[24px] h-[2px] bg-current" />
              <div className="w-[16px] h-[2px] bg-current" />
            </button>

            {/* Right Cluster */}
            <div className="hidden sm:flex items-center gap-6">
              <div 
                className="flex items-center gap-2 cursor-pointer opacity-0 -translate-y-[12px]" 
                style={{ animation: 'navEntrance 0.6s cubic-bezier(0.16,1,0.3,1) 500ms forwards' }}
              >
                <span className="text-xs tracking-[0.2em] uppercase font-medium">NEWS</span>
                <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: navColor }}>
                  <Info size={10} style={{ color: isLight ? DARK : 'white' }} />
                </div>
              </div>
              <div 
                className="text-xs tracking-[0.2em] uppercase font-medium cursor-pointer opacity-0 -translate-y-[12px]"
                style={{ animation: 'navEntrance 0.6s cubic-bezier(0.16,1,0.3,1) 500ms forwards' }}
                onClick={() => setMenuOpen(true)}
              >
                MENU
              </div>
            </div>
          </nav>

          {/* SECTION 1 */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-20 lg:px-32 transition-opacity duration-100 ease-out pointer-events-none" style={{ opacity: s1Opacity }}>
            <div className="max-w-[1000px]">
              <StaggerItem visible={s1Opacity > 0.3} delayMs={0}>
                <h1 className="text-[clamp(2rem,5vw,5rem)] font-light uppercase leading-[1.2]" style={{ color: DARK }}>
                  Advancing resources for a cleaner future
                </h1>
              </StaggerItem>
              <StaggerItem visible={s1Opacity > 0.3} delayMs={150}>
                <p className="mt-6 text-sm tracking-[0.3em] uppercase" style={{ color: `${DARK}90` }}>
                  Sustainable power with purpose
                </p>
              </StaggerItem>
            </div>
            
            <div className="absolute bottom-12 right-6 sm:right-8 md:right-12 pointer-events-auto">
              <StaggerItem visible={s1Opacity > 0.3} delayMs={300}>
                <button className="w-[48px] h-[48px] rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity" style={{ borderColor: `${DARK}80` }}>
                  <ArrowRight size={18} color={DARK} />
                </button>
              </StaggerItem>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-8 transition-opacity duration-100 ease-out pointer-events-none" style={{ opacity: s2Opacity }}>
            <div className="max-w-[900px]">
              <StaggerItem visible={s2Opacity > 0.3} delayMs={0}>
                <h2 className="text-[clamp(1.5rem,4.5vw,4.5rem)] font-extralight tracking-wide leading-[1.3] text-center uppercase" style={{ color: DARK }}>
                  We build lasting partnerships with vision <span style={{ color: `${DARK}CC` }}>and precision</span> <span style={{ color: `${DARK}80` }}>across every frontier</span>
                </h2>
              </StaggerItem>
            </div>

            <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center pointer-events-auto">
              <StaggerItem visible={s2Opacity > 0.3} delayMs={200}>
                <div className="w-[48px] h-[48px] rounded-full border flex items-center justify-center mb-4" style={{ borderColor: `${DARK}66` }}>
                  <ArrowDown size={18} color={DARK} />
                </div>
              </StaggerItem>
              <StaggerItem visible={s2Opacity > 0.3} delayMs={350} className="flex flex-col items-center gap-2 mb-2">
                <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: DARK }} />
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: `${DARK}66` }} />
              </StaggerItem>
              <StaggerItem visible={s2Opacity > 0.3} delayMs={500}>
                <div className="w-[40px] h-[40px] rounded-full border flex items-center justify-center" style={{ borderColor: `${DARK}4D` }}>
                  <ChevronUp size={16} color={`${DARK}CC`} />
                </div>
              </StaggerItem>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="absolute inset-0 flex flex-col justify-center items-end px-6 sm:px-8 md:px-20 lg:px-32 transition-opacity duration-100 ease-out pointer-events-none text-white text-left" style={{ opacity: s3Opacity }}>
            <div className="max-w-2xl w-full">
              <StaggerItem visible={s3Opacity > 0.3} delayMs={0}>
                <p className="text-white/60 text-lg tracking-wide mb-4">Halder | Nordvik</p>
              </StaggerItem>
              <StaggerItem visible={s3Opacity > 0.3} delayMs={150}>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-light leading-[1.2] uppercase tracking-wide mb-8">
                  Fueling ambition,<br />shaping tomorrow.
                </h2>
              </StaggerItem>
              <StaggerItem visible={s3Opacity > 0.3} delayMs={300} className="pointer-events-auto">
                <button className="group flex items-center gap-4">
                  <span className="text-sm tracking-[0.3em] text-white/80 uppercase">Contact Nordvik</span>
                  <div className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight size={16} className="text-gray-800" />
                  </div>
                </button>
              </StaggerItem>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        style={{ 
          backgroundColor: DARK, 
          opacity: menuOpen ? 1 : 0, 
          visibility: menuOpen ? 'visible' : 'hidden' 
        }}
      >
        <div className={`w-full h-full flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${menuOpen ? 'translate-y-0' : '-translate-y-8'}`}>
          <div className="absolute top-8 right-6 sm:top-12 sm:right-8">
            <button 
              onClick={() => setMenuOpen(false)}
              className="w-[40px] h-[40px] rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 gap-2">
            {['VECTRUS ENERGY', 'VECTRUS UPSTREAM', 'VECTRUS MARKETS', 'VECTRUS SYSTEMS', 'VECTRUS+'].map((link, i) => (
              <div 
                key={link}
                className="text-2xl sm:text-3xl font-light tracking-wide uppercase py-3 cursor-pointer transition-all duration-[600ms]"
                style={{
                  color: i === 0 ? 'white' : 'rgba(255,255,255,0.6)',
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 60}ms`
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                onMouseOut={(e) => (e.currentTarget.style.color = i === 0 ? 'white' : 'rgba(255,255,255,0.6)')}
              >
                {link}
              </div>
            ))}
          </div>
          
          <div className="px-8 sm:px-12 pb-10 flex gap-6">
            <span className="text-xs tracking-[0.2em] uppercase text-white/60">NEWS</span>
            <span className="text-xs tracking-[0.2em] uppercase text-white/60">CONTACT</span>
          </div>
        </div>
      </div>
      {menuOpen && (
        <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden; }` }} />
      )}
    </div>
  );
}
