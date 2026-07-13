/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Inter, Urbanist } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["500", "600", "700"] });

// CSS for the rotating border
const borderCss = `
  @property --border-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
  }
  .btn-border-wrap {
    position: relative;
    border-radius: 50px;
    z-index: 1;
    overflow: visible;
  }
  .btn-border-wrap::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: inherit;
    padding: 3px;
    background: conic-gradient(from var(--border-angle), #A068FF, #070319, #A068FF, #070319, #A068FF);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
    animation: borderRotate 3s linear infinite;
  }
  @keyframes borderRotate {
    to { --border-angle: 1turn; }
  }
  .join-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #A068FF;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: -1;
  }
  .join-btn:hover::after {
    transform: translateX(0);
  }
  .start-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #A068FF;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: -1;
  }
  .start-btn:hover::after {
    transform: translateX(0);
  }
  .nav-link {
    position: relative;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: currentColor;
    transform-origin: bottom left;
    transition: transform 0.3s ease-out;
  }
  .nav-link:hover::after {
    transform: scaleX(1);
  }
  .avatar-anim {
    animation: avatarFlyIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes avatarFlyIn {
    0% { transform: translate(-50%, -50%) rotate(var(--rot)) translate(var(--rad)) rotate(calc(-1 * var(--rot))) scale(0.3) rotate(-180deg); filter: blur(10px); opacity: 0; }
    100% { transform: translate(-50%, -50%) rotate(var(--rot)) translate(var(--rad)) rotate(calc(-1 * var(--rot))) scale(1) rotate(0deg); filter: blur(0px); opacity: 1; }
  }
  .logo-ticker {
    display: flex;
    gap: 64px;
    animation: scrollLogos 20s linear infinite;
  }
  @keyframes scrollLogos {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 32px)); }
  }
`;

function useCountUp(end: number, delayMs: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let frame: number;
    let started = false;

    const animate = (time: number) => {
      if (!started) {
        if (time < startTime + delayMs) {
          frame = requestAnimationFrame(animate);
          return;
        }
        started = true;
        startTime = time;
      }

      const progress = Math.min(1, (time - startTime) / 2000); // 2s duration
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame((time) => {
      startTime = time;
      frame = requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(frame);
  }, [end, delayMs]);

  return count;
}

export default function Marketeam({ _isPreview = false }: { _isPreview?: boolean }) {
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const fullText = "Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!";
  const count = useCountUp(20, 1200);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let currentIndex = 0;
    
    // reset state when remounting (e.g. going from preview to full)
    setTypedText("");
    setIsTypingDone(false);

    const typeChar = () => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        timeout = setTimeout(typeChar, 35);
      } else {
        setIsTypingDone(true);
      }
    };

    timeout = setTimeout(typeChar, 400);

    return () => clearTimeout(timeout);
  }, []);

  const getColoredText = () => {
    if (typedText.length <= 67) {
      return <span className="text-[#000000]">{typedText}</span>;
    }
    return (
      <>
        <span className="text-[#000000]">{fullText.slice(0, 67)}</span>
        <span className="text-[#ffffff]">{typedText.slice(67)}</span>
      </>
    );
  };

  const logos = [
    "https://polo-pecan-73837341.figma.site/_assets/v11/1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/3eac03c183db2ae080d910159211c14843398b61.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/17705a4c0023a0e5a99154dfb10582adbbf4260b.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/0e5f442b09dc5c248e3e60d40a65505fb1887228.svg",
    "https://polo-pecan-73837341.figma.site/_assets/v11/63f99030ceb459e3c9ab9e429cfa2353491d3816.svg",
  ];

  const avatars = [
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/aa51718fb3af3637e6d666b6543fc27a175fada6.png", orbit: 1, rot: 270, rad: 176.5, size: 58, br: "20px", delay: 0.6, glow: "#A068FF" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png", orbit: 2, rot: 60, rad: 250.5, size: 58, br: "50%", delay: 0.9, glow: "#FFD166" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/dc01064c7093dcc32674876ee3cf5e41c4a485c6.png", orbit: 2, rot: 180, rad: 250.5, size: 78, br: "50%", delay: 1.1, glow: "#FF6B6B" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/d5470a58b02388336141575048720f19a50de832.png", orbit: 2, rot: 300, rad: 250.5, size: 58, br: "20px", delay: 1.3, glow: "#4D96FF" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png", orbit: 3, rot: 130, rad: 324.5, size: 88, br: "50%", delay: 1.5, glow: "#FF6B6B" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/c76d8a0b99676de31c014344bfaf75bad090758d.png", orbit: 4, rot: 30, rad: 398.5, size: 58, br: "50%", delay: 1.7, glow: "#A068FF" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png", orbit: 4, rot: 95, rad: 398.5, size: 88, br: "24px", delay: 1.9, glow: "#FF9F43" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/9ae171d8895199349755c43fbff00e122221a027.png", orbit: 4, rot: 220, rad: 398.5, size: 88, br: "24px", delay: 2.1, glow: "#FF6B6B" },
    { url: "https://polo-pecan-73837341.figma.site/_assets/v11/926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png", orbit: 4, rot: 320, rad: 398.5, size: 58, br: "50%", delay: 2.3, glow: "#A068FF" },
  ];

  return (
    <div className={`relative min-h-screen bg-[#0a0a0a] overflow-hidden ${inter.className}`}>
      <style dangerouslySetInnerHTML={{ __html: borderCss }} />
      
      {/* Background */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_111401_56af5012-2263-45d3-849a-8688084d7c2a.png&w=1280&q=85')" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-[1920px] mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center py-[24px] px-[64px] animate-[fadeDown_0.8s_cubic-bezier(0.22,1,0.36,1)]">
          <div className="flex items-center gap-[64px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://polo-pecan-73837341.figma.site/_assets/v11/17ae538989a509947a8de3892c644664895e69b1.png" alt="Marketeam Logo" className="h-[32px] w-auto" />
            <nav className="hidden lg:flex gap-[32px]">
              {["Your Team", "Solutions", "Blog", "Pricing"].map(item => (
                <a key={item} href="#" className="nav-link text-[#000000] text-[15px] font-normal cursor-pointer">
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-[24px]">
            <a href="#" className="nav-link text-[#ffffff] text-[15px] font-medium hidden sm:block">Log In</a>
            <div className="btn-border-wrap">
              <button className="join-btn relative overflow-hidden bg-[#000000] text-white text-[15px] font-medium py-[12px] px-[26px] rounded-[50px] transition-colors cursor-pointer">
                <span className="relative z-10">Join Now</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-[24px] sm:px-[64px] pb-[60px] lg:pb-0">
          
          {/* Hero Left */}
          <div className="flex-[0_1_600px] pt-[40px] animate-[fadeUp_1s_cubic-bezier(0.22,1,0.36,1)]">
            <h1 className={`${urbanist.className} text-[36px] sm:text-[48px] lg:text-[64px] font-semibold leading-[1.1] lg:leading-[64px] tracking-[-1.5px] min-h-[200px]`}>
              {getColoredText()}
              <span className="text-[#A068FF] animate-pulse">|</span>
            </h1>

            <div className={`mt-[40px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isTypingDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="btn-border-wrap inline-block">
                <button className="start-btn relative overflow-hidden bg-[#060218] text-white text-[16px] font-medium py-[14px] px-[28px] rounded-[50px] flex items-center gap-2 cursor-pointer">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Project 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div className={`absolute ml-[290px] mt-[10px] sm:mt-[40px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center gap-2 ${isTypingDone ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} style={{ transitionDelay: '400ms' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A068FF">
                <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.5z" />
              </svg>
              <div className="bg-[#A068FF] text-white text-[16px] font-medium py-[8px] px-[16px] rounded-[20px]">
                David
              </div>
            </div>
          </div>

          {/* Hero Right - Circles */}
          <div className="mt-12 lg:mt-0 relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[720px] lg:h-[720px] flex items-center justify-center animate-[scaleIn_1.2s_cubic-bezier(0.22,1,0.36,1)_0.3s_both] scale-[0.4] sm:scale-[0.6] lg:scale-100 xl:scale-85">
            {[353, 501, 649, 797].map((size, i) => (
              <div 
                key={i}
                className="absolute rounded-full border border-transparent"
                style={{ 
                  width: size, 
                  height: size, 
                  background: 'linear-gradient(#070319, #070319) padding-box, linear-gradient(180deg, rgba(217, 161, 255, 0) 0%, rgba(217, 161, 255, 1) 43%, rgba(217, 161, 255, 0) 100%) border-box',
                  animation: `spin ${30 + i * 10}s linear infinite ${i % 2 === 0 ? 'reverse' : 'normal'}`,
                }}
              />
            ))}

            <div className="absolute z-10 flex flex-col items-center justify-center">
              <span className={`${urbanist.className} text-[64px] font-medium text-white leading-none`}>{count}k+</span>
              <span className={`${urbanist.className} text-[16px] font-semibold text-white`}>Specialists</span>
            </div>

            {avatars.map((av, i) => (
              <div 
                key={i}
                className="absolute left-1/2 top-1/2 opacity-0 avatar-anim"
                style={{
                  '--rot': `${av.rot}deg`,
                  '--rad': `${av.rad}px`,
                  animationDelay: `${av.delay}s`,
                } as React.CSSProperties}
              >
                <div style={{ animation: `spin ${30 + (av.orbit - 1) * 10}s linear infinite ${av.orbit % 2 !== 0 ? 'normal' : 'reverse'}` }}>
                   <div style={{ animation: `spin ${30 + (av.orbit - 1) * 10}s linear infinite ${(av.orbit % 2 !== 0) ? 'reverse' : 'normal'}` }}>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={av.url} 
                        alt="Avatar" 
                        style={{ 
                          width: av.size, 
                          height: av.size, 
                          borderRadius: av.br,
                          boxShadow: `0 0 15px ${av.glow}`,
                          objectFit: 'cover'
                        }}
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>

        </main>

        {/* Ticker */}
        <div className="relative w-full overflow-hidden pb-[24px] lg:pb-[40px] animate-[fadeUp_1s_cubic-bezier(0.22,1,0.36,1)_0.6s_both]" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
          <div className="logo-ticker w-max">
             {[...logos, ...logos, ...logos, ...logos].map((src, i) => (
               // eslint-disable-next-line @next/next/no-img-element
               <img key={i} src={src} alt="Partner Logo" className="w-[137px] h-[40px] object-contain opacity-50" />
             ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
