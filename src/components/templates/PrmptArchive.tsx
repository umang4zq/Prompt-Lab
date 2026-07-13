"use client";

import React, { useEffect, useRef, useState } from "react";
import { Inter_Tight } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const interTight = Inter_Tight({
  weight: "500",
  subsets: ["latin"],
});

const GALLERY_IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85",
];

export default function PrmptArchive({ isPreview = false }: { isPreview?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftVidRef = useRef<HTMLVideoElement>(null);
  const rightVidRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const activeSideRef = useRef<"left" | "right">("right");
  const panelRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);
  const outroFooterRef = useRef<HTMLDivElement>(null);
  const outroInfoRef = useRef<HTMLDivElement>(null);
  const outroBuyRef = useRef<HTMLDivElement>(null);
  const circleSymbolRef = useRef<HTMLSpanElement>(null);

  const [videosLoaded, setVideosLoaded] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const reducedMotion = useReducedMotion();

  // Load GSAP
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // Determine touch device and load videos
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) setVideosLoaded(true);
    };

    if (leftVidRef.current) leftVidRef.current.oncanplay = checkLoaded;
    if (rightVidRef.current) rightVidRef.current.oncanplay = checkLoaded;
    
    // Fallback if they are already ready
    if (leftVidRef.current?.readyState && leftVidRef.current.readyState >= 3) checkLoaded();
    if (rightVidRef.current?.readyState && rightVidRef.current.readyState >= 3) checkLoaded();
  }, []);

  // Cursor logic & Video Interaction
  useEffect(() => {
    if (isTouch || !containerRef.current) return;

    let symbolLastChanged = performance.now();
    const symbols = ['8', '$', '^^', '%', '/'];

    const handleMouseMove = (e: MouseEvent) => {
      // Cursor follow
      if (cursorRef.current && !isPreview) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }

      // Video scrub logic
      const width = containerRef.current!.clientWidth;
      const deadZone = Math.max(30, width * 0.05);
      const centerX = width / 2;
      const x = e.clientX;
      
      const leftV = leftVidRef.current;
      const rightV = rightVidRef.current;
      if (!leftV || !rightV) return;

      if (x >= centerX - deadZone && x <= centerX + deadZone) {
        // Dead zone
        if (!leftV.seeking) leftV.currentTime = 0;
        if (!rightV.seeking) rightV.currentTime = 0;
      } else if (x < centerX - deadZone) {
        // Left side -> scrub RIGHT video
        if (activeSideRef.current !== "right") {
          activeSideRef.current = "right";
          leftV.style.display = "none";
          rightV.style.display = "block";
        }
        const range = centerX - deadZone;
        const progress = Math.max(0, Math.min(1, x / range));
        const targetTime = (1 - progress) * (rightV.duration || 0); // distance from edge
        if (!rightV.seeking && !isNaN(targetTime)) rightV.currentTime = targetTime;
      } else {
        // Right side -> scrub LEFT video
        if (activeSideRef.current !== "left") {
          activeSideRef.current = "left";
          rightV.style.display = "none";
          leftV.style.display = "block";
        }
        const range = width - (centerX + deadZone);
        const progress = Math.max(0, Math.min(1, (x - (centerX + deadZone)) / range));
        const targetTime = progress * (leftV.duration || 0);
        if (!leftV.seeking && !isNaN(targetTime)) leftV.currentTime = targetTime;
      }
    };

    const scrollHandler = () => {
      const now = performance.now();
      if (now - symbolLastChanged > 80 && circleSymbolRef.current) {
        circleSymbolRef.current.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        symbolLastChanged = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [isTouch, isPreview]);

  // Touch video logic
  useEffect(() => {
    if (!isTouch || reducedMotion) return;
    const playNext = (current: "left" | "right") => {
      if (current === "left") {
        if (leftVidRef.current) leftVidRef.current.style.display = "none";
        if (rightVidRef.current) {
          rightVidRef.current.style.display = "block";
          rightVidRef.current.play().catch(()=>{});
        }
      } else {
        if (rightVidRef.current) rightVidRef.current.style.display = "none";
        if (leftVidRef.current) {
          leftVidRef.current.style.display = "block";
          leftVidRef.current.play().catch(()=>{});
        }
      }
    };

    const handleLeftEnded = () => playNext("left");
    const handleRightEnded = () => playNext("right");

    const leftVid = leftVidRef.current;
    const rightVid = rightVidRef.current;

    leftVid?.addEventListener("ended", handleLeftEnded);
    rightVid?.addEventListener("ended", handleRightEnded);

    if (videosLoaded && leftVidRef.current) {
      leftVidRef.current.style.display = "block";
      if (rightVidRef.current) rightVidRef.current.style.display = "none";
      leftVidRef.current.play().catch(()=>{});
    }

    return () => {
      leftVid?.removeEventListener("ended", handleLeftEnded);
      rightVid?.removeEventListener("ended", handleRightEnded);
    };
  }, [isTouch, videosLoaded, reducedMotion]);

  // Build Grid Layout
  const buildLayout = (count: number, cols: number) => {
    // Actual algorithm as per specs
    const layout = [];
    for (let r = 0; r < count; r++) {
      const a = (r * 2 + (r % 2)) % cols;
      const rowArr = new Array(cols).fill(-1);
      if (r < count) rowArr[a] = r;
      if (r % 3 === 0 && r + 1 < count) {
        let b = (a + 2) % cols;
        if (b === a) b = (a + 1) % cols;
        rowArr[b] = ++r;
      }
      layout.push(rowArr);
    }
    return layout;
  };
  
  const cols = typeof window !== 'undefined' ? (window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4) : 4;
  const layout = buildLayout(GALLERY_IMAGES.length, cols);

  // GSAP animations for Phase 1 & 2 & Outro
  useEffect(() => {
    if (isPreview) return; // Disable scroll interactions if in preview
    
    // Set scroll spacer height
    const vh = window.innerHeight;
    const wrapScrollHeight = galleryRef.current?.scrollHeight || 3000;
    const maxScroll = wrapScrollHeight - vh;
    if (scrollSpacerRef.current) {
      scrollSpacerRef.current.style.height = `${vh + maxScroll + 2 * vh}px`;
    }

    const cards = gsap.utils.toArray('.bp-card') as HTMLElement[];
    
    const ctx = gsap.context(() => {
      // Phase 1: Panel slides up
      ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: "top top",
        end: `+=${vh}`,
        scrub: true,
        animation: gsap.fromTo(panelRef.current, { y: vh }, { y: 0, ease: "none" }),
      });

      // Phase 2: Panel pinned, inner scrolls up
      ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: `top+=${vh} top`,
        end: `+=${maxScroll}`,
        scrub: true,
        animation: gsap.fromTo(galleryRef.current, { y: 0 }, { y: -maxScroll, ease: "none" }),
      });

      // Phase 3: Outro
      ScrollTrigger.create({
        trigger: scrollSpacerRef.current,
        start: `top+=${vh + maxScroll} top`,
        end: `+=${vh}`,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (outroOverlayRef.current) outroOverlayRef.current.style.opacity = p.toString();
          if (outroBuyRef.current) outroBuyRef.current.style.transform = `scale(${p})`;
          if (outroFooterRef.current) outroFooterRef.current.style.opacity = p.toString();
          
          if (outroInfoRef.current) {
            const outroOffset = window.innerWidth >= 1024 ? 166 : 132;
            outroInfoRef.current.style.transform = `translateY(-${p * outroOffset}px)`;
          }
        }
      });
      
      // Card RAF
      const raf = () => {
        if (!reducedMotion) {
          cards.forEach((card) => {
             const rect = card.getBoundingClientRect();
             const top = rect.top;
             const bottom = rect.bottom;
             
             let scale = 0;
             if (top < vh && bottom > 0) {
               const enter = Math.min(1, (vh - top) / (vh * 0.6));
               const exit = Math.min(1, bottom / (vh * 0.4));
               scale = Math.min(enter, exit);
             }
             card.style.transform = `scale(${scale})`;
          });
        }
      };
      
      gsap.ticker.add(raf);
      
      return () => {
        gsap.ticker.remove(raf);
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, [isPreview, reducedMotion]);


  // Helper classes for sizing based on container when in preview, but viewport when fullscreen

  return (
    <div className={`relative bg-white select-none overflow-hidden ${interTight.className}`} ref={containerRef}>
      <div id="scroll-spacer" ref={scrollSpacerRef} className={`${isPreview ? 'h-full overflow-hidden' : ''} bg-white relative w-full`}>
        
        {/* 1A. Custom Cursor */}
        {!isTouch && (
          <div
            ref={cursorRef}
            className="fixed pointer-events-none z-50 mix-blend-exclusion -translate-x-1/2 -translate-y-1/2 hidden lg:block"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22.75" stroke="white" strokeWidth="2.5" />
              <path d="M24 16 L32 24 L24 32 L16 24 Z" fill="white" />
            </svg>
          </div>
        )}

        {/* 1B. Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          className="fixed pointer-events-none z-20 mix-blend-exclusion top-[16px] left-[16px] sm:w-[124px] md:w-[266px] lg:w-[355px] lg:top-[32px] lg:left-[32px] w-[124px]"
        >
          <svg viewBox="0 0 355 110" fill="none">
            <path d="M10 90 L10 20 L50 20 Q70 20 70 40 Q70 60 50 60 L30 60 L30 90 Z" fill="white"/>
            <path d="M90 90 L90 20 L120 20 C140 20 140 40 120 40 L105 40 L120 90 Z" fill="white"/>
            <path d="M160 90 L160 20 L200 20 L200 90 Z M175 35 L185 35 L185 75 L175 75 Z" fill="white"/>
            <path d="M220 90 L220 20 L260 20 Q280 20 280 40 Q280 60 260 60 L240 60 L240 90 Z" fill="white"/>
            <path d="M290 20 L350 20 L350 40 L330 40 L330 90 L310 90 L310 40 L290 40 Z" fill="white"/>
          </svg>
        </motion.div>

        {/* 1C. Caption */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="fixed pointer-events-none z-20 mix-blend-exclusion text-[12px] leading-[1.4] tracking-[-0.04em] text-white lg:left-[32px] lg:top-[244px] lg:w-[692px] left-[16px] top-[118px] md:top-[180px] md:w-[calc(50vw-48px)] w-[calc(100vw-32px)]"
        >
          When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active.
        </motion.div>

        {/* 1D. Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="fixed z-20 pointer-events-none mix-blend-exclusion flex justify-between items-center h-[30px] lg:top-[32px] lg:right-[32px] lg:w-[330px] top-[16px] right-[16px] w-auto"
        >
          <span className="hidden lg:block text-[15px] uppercase text-white font-medium">ABOUT</span>
          <div className="flex gap-[20px] lg:gap-[50px] items-center">
            <svg viewBox="0 0 40 40" className="w-[24px] h-[24px] lg:w-[30px] lg:h-[30px] stroke-white stroke-[2.5px] fill-none">
              <path d="M0 14H40 M0 26H40" />
            </svg>
            <span className="text-[13px] lg:text-[15px] text-white font-medium">[ CART ]</span>
          </div>
        </motion.div>

        {/* 1E. Product Info */}
        <motion.div
          id="outro-info"
          ref={outroInfoRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="fixed pointer-events-none z-20 mix-blend-exclusion flex flex-col items-center lg:right-[32px] lg:bottom-[80px] lg:w-[330px] lg:left-auto lg:top-auto left-0 right-0 bottom-[48px]"
        >
          <div className="flex flex-col items-start w-[252px] lg:w-full mb-[12px] lg:mb-[32px]">
            <div className="relative w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] mb-2 flex items-center justify-center">
              <svg className="absolute inset-0" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18.75" stroke="white" strokeWidth={isTouch ? 2 : 2.5} fill="none" />
              </svg>
              <span id="circle-symbol" ref={circleSymbolRef} className="text-white text-[10px] lg:text-[15px] tracking-[-0.04em] uppercase font-medium">8</span>
            </div>
            <div className="text-[20px] lg:text-[30px] leading-none text-center tracking-[-0.04em] uppercase text-white">
              ARCHIVE COLLECTION<br/>&quot;PROMPT&quot;
            </div>
          </div>
          <div className="text-[60px] lg:text-[80px] leading-none text-center tracking-[-0.04em] text-white">
            $97,33
          </div>
        </motion.div>

        {/* 1F. View Button */}
        <div
          id="outro-buy"
          ref={outroBuyRef}
          className="fixed pointer-events-none z-20 mix-blend-exclusion flex items-center justify-center bg-white rounded-full lg:right-[32px] lg:bottom-[32px] lg:w-[330px] lg:h-[174px] left-[16px] right-[16px] bottom-[60px] h-[100px] origin-bottom-right scale-0"
        >
          <span className="text-[72px] lg:text-[110px] tracking-[-0.04em] text-white mix-blend-exclusion">view</span>
        </div>

        {/* 1G. Video Container */}
        <div id="main-canvas" className={`pointer-events-none fixed lg:inset-0 lg:w-full lg:h-full z-0 left-0 top-[220px] w-[100vw] h-[calc(100vh-220px)] overflow-hidden transition-opacity duration-300 ${videosLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={leftVidRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4"
            className="absolute inset-0 w-full h-full object-cover hidden"
            muted playsInline preload="auto" loop={!isTouch}
          />
          <video
            ref={rightVidRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4"
            className="absolute inset-0 w-full h-full object-cover block"
            muted playsInline preload="auto" loop={!isTouch}
          />
        </div>

        {/* 1I. White Overlay */}
        <div id="outro-overlay" ref={outroOverlayRef} className="fixed inset-0 pointer-events-none z-[12] bg-white opacity-0" />

        {/* 1J. Footer */}
        <div id="outro-footer" ref={outroFooterRef} className="fixed pointer-events-none mix-blend-exclusion opacity-0 left-[16px] lg:bottom-[32px] bottom-[24px] flex lg:gap-[80px] justify-between lg:justify-start w-[calc(100vw-32px)] lg:w-auto">
          <span className="text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white font-medium">PRMPT (R) 2026</span>
          <span className="text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white font-medium">PRIVACY POLICY</span>
        </div>

        {/* SECTION 2: Black Panel */}
        <div className={`fixed inset-0 bg-black z-10 ${isPreview ? 'relative' : ''} translate-y-[100vh]`} ref={panelRef}>
          <div className="w-full pt-[min(400px,40vh)] relative" ref={galleryRef}>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4`}>
              {layout.map((row, rIdx) => (
                 <React.Fragment key={rIdx}>
                   {row.map((itemIdx, cIdx) => {
                      if (itemIdx === -1) {
                         return <div key={`empty-${rIdx}-${cIdx}`} className="aspect-[2/3] invisible" />;
                      }
                      const isLeftHalf = cIdx < cols / 2;
                      return (
                        <div 
                          key={itemIdx} 
                          className={`bp-card aspect-[2/3] w-full relative scale-0 ${isLeftHalf ? 'origin-bottom-right' : 'origin-bottom-left'} will-change-transform ${reducedMotion ? '!transform-none' : ''}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={GALLERY_IMAGES[itemIdx]} 
                            alt={`Gallery ${itemIdx}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )
                   })}
                 </React.Fragment>
              ))}
            </div>
            {/* Pad bottom for scroll */}
            <div className="h-[100vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}
