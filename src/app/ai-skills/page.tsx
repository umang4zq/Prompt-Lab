"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Terminal, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SlideProps {
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  children: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
}

// Fully responsive SlideContainer. Expands to fill its parent.
function SlideContainer({
  bgColor = "#F4F1EA",
  textColor = "#111111",
  accentColor = "#2563EB",
  borderColor = "rgba(17, 17, 17, 0.2)",
  children,
  headerLeft,
  headerRight,
  footerLeft,
  footerRight,
}: SlideProps) {
  return (
    <div
      className="relative w-full h-full font-sans flex flex-col shadow-2xl overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center text-xs tracking-widest uppercase font-semibold mb-4 z-10 p-6 md:p-8 pb-0">
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>

      {/* Main Content Area with Borders */}
      <div
        className="flex-grow flex flex-col relative border-l border-t ml-6 md:ml-8"
        style={{ borderColor }}
      >
        <div className="pt-6 pl-6 pr-6 pb-6 flex flex-col flex-grow">
          {children}
        </div>
      </div>

      {/* Footer Area with Borders */}
      <div
        className="flex justify-between items-center text-xs font-semibold tracking-wider p-6 md:p-8 pt-4 border-t border-l uppercase mt-auto ml-6 md:ml-8"
        style={{ borderColor }}
      >
        <div className="flex items-center gap-2">{footerLeft}</div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}

// Wrapper that forces a 600x800 render of the slide and scales it down to 300x400
function ThumbnailWrapper({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <div 
      className="w-[300px] h-[400px] relative overflow-hidden cursor-pointer group hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl mx-auto rounded-sm"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-[600px] h-[800px] origin-top-left scale-50 pointer-events-none">
        {children}
      </div>
      {/* Overlay for hover effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
    </div>
  );
}

// Modal to display the full-size slide with navigation
function SlideModal({ 
  isOpen, 
  onClose, 
  children,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  children: React.ReactNode,
  onNext: () => void,
  onPrev: () => void,
  hasPrev: boolean,
  hasNext: boolean
}) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasNext, hasPrev, onNext, onPrev, onClose]);

  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md transition-opacity" 
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full"
      >
        <X size={32} />
      </button>

      {/* Navigation Arrows */}
      {hasPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 transition-colors p-4 hidden sm:block"
        >
          <ChevronLeft size={48} />
        </button>
      )}
      
      {hasNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-50 transition-colors p-4 hidden sm:block"
        >
          <ChevronRight size={48} />
        </button>
      )}

      <div 
        className="relative w-full max-w-[600px] aspect-[3/4] max-h-[90vh] flex flex-col rounded-sm shadow-2xl overflow-y-auto hidden-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        
        {/* Mobile Navigation (shows below content on small screens) */}
        <div className="sm:hidden flex justify-between items-center bg-black p-4 sticky bottom-0 z-50">
          <button 
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className={`text-white p-2 ${!hasPrev && 'opacity-30 pointer-events-none'}`}
          >
            <ChevronLeft size={32} />
          </button>
          <span className="text-white/50 text-xs font-mono">SWIPE OR CLICK</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className={`text-white p-2 ${!hasNext && 'opacity-30 pointer-events-none'}`}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Slide Content Components ---

const Slide1 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / UI/UX PRO MAX"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-POWERED <span style={{ color: accentColor }}>→</span> DESIGN SYSTEM
      </span>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      THE ULTIMATE AI<br />
      DESIGN ASSISTANT:<br />
      <span style={{ color: accentColor }}>UI/UX PRO MAX</span>
    </h1>
    
    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop guessing your layouts and hex codes. The <strong>ui-ux-pro-max-skill</strong> is an AI-powered reasoning engine that instantly generates complete, professional design systems for any project. Just provide your requirements, and it analyzes your product to output perfectly tailored UI patterns, typography pairings, and color palettes ready for production.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Intelligent Design System Generator backed by 192 industry-specific reasoning rules.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Explores 79 searchable UI styles to match your exact aesthetic, whether you need a soft minimalist look or a dark cyber-noir layout.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Provides native architectural support for 22 tech stacks, including React, Flutter, and Tailwind.
        </div>
      </div>
    </div>
  </SlideContainer>
);

const Slide2 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE / THIS REPO"
    footerLeft={
      <Link 
        href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/NEXTLEVELBUILDER
      </Link>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate this design intelligence directly into your existing architecture to automate layout generation and maintain strict frontend standards across your applications.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Feed the skill's design JSON into your LLM pipelines (like Gemini or Claude) so your background AI agents can generate pixel-perfect React or Flutter components.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Run the built-in pre-delivery checklist to automatically enforce strict UX guidelines and accessibility rules across your frontend workflow.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Share the repository with Jenil and your other CS/IT friends to help them standardize their application architectures and easily avoid common design anti-patterns.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60">
      repository URL:
      <br />
      <a 
        href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill"
        target="_blank"
        className="hover:underline font-bold text-black break-all"
      >
        https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
      </a>
    </div>
  </SlideContainer>
);

export default function AiSkillsPage() {
  const [accentColor, setAccentColor] = useState("#2F50FD");
  const [bgColor, setBgColor] = useState("#F7F5EC");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  const slides = [
    <Slide1 key="1" bgColor={bgColor} accentColor={accentColor} />,
    <Slide2 key="2" bgColor={bgColor} accentColor={accentColor} />
  ];

  return (
    <div className="min-h-screen bg-neutral-900 p-8 flex flex-col items-center gap-16 py-24">
      
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">AI Skills Showcase</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-8">
          Explore powerful AI skills and prompt structures designed to supercharge your workflow.
        </p>
        
        <div className="flex justify-center gap-6 bg-white/5 p-4 rounded-full border border-white/10 w-fit mx-auto">
          <label className="flex items-center gap-2 text-white text-sm font-medium">
            Accent:
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-transparent w-6 h-6 cursor-pointer" />
          </label>
          <label className="flex items-center gap-2 text-white text-sm font-medium border-l border-white/20 pl-6">
            Background:
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-transparent w-6 h-6 cursor-pointer" />
          </label>
        </div>
      </div>

      <div className="flex justify-center w-full max-w-[1600px] mx-auto px-4">
        <ThumbnailWrapper onClick={() => setActiveSlideIndex(0)}>
          {slides[0]}
        </ThumbnailWrapper>
      </div>

      <SlideModal 
        isOpen={activeSlideIndex !== null} 
        onClose={() => setActiveSlideIndex(null)}
        onNext={() => activeSlideIndex !== null && setActiveSlideIndex((activeSlideIndex + 1) % slides.length)}
        onPrev={() => activeSlideIndex !== null && setActiveSlideIndex((activeSlideIndex - 1 + slides.length) % slides.length)}
        hasPrev={activeSlideIndex !== null && activeSlideIndex > 0}
        hasNext={activeSlideIndex !== null && activeSlideIndex < slides.length - 1}
      >
        {activeSlideIndex !== null && slides[activeSlideIndex]}
      </SlideModal>
    </div>
  );
}
