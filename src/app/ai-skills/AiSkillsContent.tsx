"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Terminal, X, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

function CopyRepoButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 px-2 py-1 md:px-3 md:py-1.5 bg-black/5 hover:bg-black/10 text-black rounded-md transition-colors flex items-center gap-2 font-sans font-medium text-[10px] md:text-xs shadow-sm"
      title="Copy Repo URL"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span className="hidden sm:inline">{copied ? "Copied!" : "Copy URL"}</span>
    </button>
  );
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
      className="relative w-full min-h-full shrink-0 font-sans flex flex-col shadow-2xl overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs tracking-widest uppercase font-semibold mb-4 z-10 p-4 sm:p-6 md:p-8 pb-0">
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>

      {/* Main Content Area with Borders */}
      <div
        className="flex-grow flex flex-col relative border-l border-t ml-4 sm:ml-6 md:ml-8"
        style={{ borderColor }}
      >
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          {children}
        </div>
      </div>

      {/* Footer Area with Borders */}
      <div
        className="flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-wider p-4 sm:p-6 md:p-8 pt-4 border-t border-l uppercase mt-auto ml-4 sm:ml-6 md:ml-8"
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
    <motion.div 
      className="w-[300px] h-[400px] relative overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl rounded-sm"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    >
      <div className="absolute top-0 left-0 w-[600px] h-[800px] origin-top-left scale-50 pointer-events-none">
        {children}
      </div>
      {/* Overlay for hover effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
    </motion.div>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-[20px] saturate-150 transition-colors" 
          onClick={onClose}
        >
          {/* Top Bar with X button */}
          <div className="w-full max-w-[600px] flex justify-end mb-4 shrink-0 z-50">
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <X size={28} />
            </button>
          </div>

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

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full flex-grow min-h-0 sm:flex-none sm:h-auto sm:aspect-[3/4] flex flex-col rounded-sm shadow-2xl overflow-y-auto hidden-scrollbar dark:bg-neutral-900 bg-white"
            style={{ maxWidth: '600px', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold && hasNext) {
                onNext();
              } else if (swipe > swipeConfidenceThreshold && hasPrev) {
                onPrev();
              }
            }}
          >
            {children}
          </motion.div>
          
          {/* Mobile Navigation (shows below content on small screens) */}
          <div className="sm:hidden flex justify-between items-center w-full max-w-[600px] mt-4 shrink-0 px-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className={`text-white p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors ${!hasPrev && 'opacity-30 pointer-events-none'}`}
            >
              <ChevronLeft size={28} />
            </button>
            <span className="text-white/70 text-[10px] tracking-widest font-mono uppercase bg-black/40 px-4 py-2 rounded-full">Swipe or Click</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className={`text-white p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors ${!hasNext && 'opacity-30 pointer-events-none'}`}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Slide Content Components ---

export const Slide1 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      THE ULTIMATE AI<br />
      DESIGN ASSISTANT:<br />
      <span style={{ color: accentColor }}>UI/UX PRO MAX</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop guessing your layouts and hex codes. The <strong>ui-ux-pro-max-skill</strong> is an AI-powered reasoning engine that instantly generates complete, professional design systems for any project. Just provide your requirements, and it analyzes your product to output perfectly tailored UI patterns, typography pairings, and color palettes ready for production.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Intelligent Design System Generator backed by 192 industry-specific reasoning rules.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Explores 79 searchable UI styles to match your exact aesthetic, whether you need a soft minimalist look or a dark cyber-noir layout.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Provides native architectural support for 22 tech stacks, including React, Flutter, and Tailwind.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide2 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate this design intelligence directly into your existing architecture to automate layout generation and maintain strict frontend standards across your applications.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Feed the skill's design JSON into your LLM pipelines (like Gemini or Claude) so your background AI agents can generate pixel-perfect React or Flutter components.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Run the built-in pre-delivery checklist to automatically enforce strict UX guidelines and accessibility rules across your frontend workflow.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Share the repository with Jenil and your other CS/IT friends to help them standardize their application architectures and easily avoid common design anti-patterns.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
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
      <CopyRepoButton url="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" />
    </div>
  </SlideContainer>
);

export const Slide3 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / APPLE DESIGN"
    footerLeft={
      <Link 
        href="https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/EMILKOWALSKI
      </Link>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      APPLE-LEVEL UI &<br />
      FLUID MOTION:<br />
      <span style={{ color: accentColor }}>APPLE DESIGN SKILL</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop making your web apps feel stiff and robotic. This skill translates Apple's legendary design principles—fluid physical motion, spring physics, drag and swipe interactions, and gorgeous translucent depth—directly into your frontend projects so your interfaces actually feel alive.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Embeds Apple's approach to interface design, fluid motion, and spatial consistency into your AI coding agent.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Masters interruptible transitions, momentum scrolling, and spring curves instead of weak default CSS easings.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Handles subtle details like translucent materials, proper typography tracking, and reduced-motion preferences effortlessly.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide4 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE / INSTALL"
    footerLeft={
      <Link 
        href="https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/EMILKOWALSKI
      </Link>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE AND<br />
      <span style={{ color: accentColor }}>INSTALL THIS SKILL</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate Apple's design philosophy into your workflow to instantly elevate your frontend projects without guessing animation curves or spacing.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Install as an Antigravity Skill:</strong> Simply grab the apple-design SKILL.md file from the repository and drop it into your Antigravity skills directory to level up your local AI setup.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Guide Your AI Agent:</strong> Use it when building gesture-driven UI, swipe-to-dismiss sheets, or custom component animations so your AI writes code that actually feels natural and smooth.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Share with Friends:</strong> Show this repository to Jenil and your college peers to instantly upgrade your team's frontend game and make your web projects look like they were built by a top-tier design engineer.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        repository URL:
        <br />
        <a 
          href="https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md"
          target="_blank"
          className="hover:underline font-bold text-black break-all"
        >
          https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md
        </a>
      </div>
      <CopyRepoButton url="https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md" />
    </div>
  </SlideContainer>
);

export const Slide5 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / AWESOME-DESIGN-MD"
    footerLeft={
      <Link 
        href="https://github.com/VoltAgent/awesome-design-md"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/VOLTAGENT
      </Link>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      THE ULTIMATE AI<br />
      DESIGN BLUEPRINT:<br />
      <span style={{ color: accentColor }}>AWESOME-DESIGN-MD</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop manually translating design files. Awesome-design-md is a curated collection of DESIGN.md files extracted from top-tier websites like Vercel, Stripe, and Apple. You simply drop a markdown file into your project, and your AI agent instantly knows exactly how the UI should look and feel.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Replaces Figma exports and complex JSON schemas with a simple, plain-text markdown format that AI coding tools natively understand.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Captures real design depth, including visual themes, typography rules, color palettes, and responsive behaviors.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Features 55 different design systems from major tech platforms, developer tools, and consumer apps.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide6 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE THIS REPO"
    footerLeft={
      <Link 
        href="https://github.com/VoltAgent/awesome-design-md"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/VOLTAGENT
      </Link>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate these design blueprints directly into your workspace so your background coding assistants can generate consistent, pixel-accurate interfaces automatically.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Install as an Antigravities Skill:</strong> Simply download a DESIGN.md file from the repository and drop it straight into your project's root folder or Antigravity directory.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Power Your Agents:</strong> Point your background AI tools or agents at this markdown file so they understand the exact visual rules before generating frontend React or Flutter components.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Standardize with Friends:</strong> Share this repo with Jenil and your IT classmates so you can all build high-quality UI without needing a professional design background.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        repository URL:
        <br />
        <a 
          href="https://github.com/VoltAgent/awesome-design-md"
          target="_blank"
          className="hover:underline font-bold text-black break-all"
        >
          https://github.com/VoltAgent/awesome-design-md
        </a>
      </div>
      <CopyRepoButton url="https://github.com/VoltAgent/awesome-design-md" />
    </div>
  </SlideContainer>
);

export const Slide7 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / SUPERPOWERS"
    footerLeft={
      <Link 
        href="https://github.com/obra/superpowers"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/OBRA
      </Link>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      UPGRADE YOUR AI:<br />
      <span style={{ color: accentColor }}>SUPERPOWERS</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      This repository is like a magic toolbelt for your AI. Instead of just writing code, your background helpers get real "superpowers" to do bigger tasks. It connects your setup to new apps and extra features so you do not have to build everything from scratch.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Gives your background AI new tools to do much more than just type text.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Very simple to add to your current computer setup.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          Saves you hours of boring work by doing the heavy lifting for you.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide8 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE THIS REPO"
    footerLeft={
      <Link 
        href="https://github.com/obra/superpowers"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/OBRA
      </Link>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Add these tools to your workspace so your coding helpers become much stronger and faster.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Install as an Antigravities Skill:</strong> Download the files from the link and drop them into your Antigravity skills folder to turn on the new superpowers.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Power Your Agents:</strong> Let your background helpers use these new tools so they can finish big tasks without you holding their hand.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Share with Friends:</strong> Send this link to Jenil and your college friends so they can make their own coding setups super powerful too.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        repository URL:
        <br />
        <a 
          href="https://github.com/obra/superpowers"
          target="_blank"
          className="hover:underline font-bold text-black break-all"
        >
          https://github.com/obra/superpowers
        </a>
      </div>
      <CopyRepoButton url="https://github.com/obra/superpowers" />
    </div>
  </SlideContainer>
);

import Navbar from "../../components/hero/Navbar";

export default function AiSkillsPage() {
  const [accentColor, setAccentColor] = useState("#2F50FD");
  const [bgColor, setBgColor] = useState("#F7F5EC");
  const [activeSlides, setActiveSlides] = useState<React.ReactNode[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  const post1Slides = [
    <Slide1 key="1" bgColor={bgColor} accentColor={accentColor} />,
    <Slide2 key="2" bgColor={bgColor} accentColor={accentColor} />
  ];

  const post2Slides = [
    <Slide3 key="3" bgColor={bgColor} accentColor="#FF3B30" />,
    <Slide4 key="4" bgColor={bgColor} accentColor="#FF3B30" />
  ];

  const post3Slides = [
    <Slide5 key="5" bgColor={bgColor} accentColor="#FF9500" />,
    <Slide6 key="6" bgColor={bgColor} accentColor="#FF9500" />
  ];

  const post4Slides = [
    <Slide7 key="7" bgColor={bgColor} accentColor="#34C759" />,
    <Slide8 key="8" bgColor={bgColor} accentColor="#34C759" />
  ];

  const post5Slides = [
    <Slide9 key="9" bgColor={bgColor} accentColor="#9C27B0" />,
    <Slide10 key="10" bgColor={bgColor} accentColor="#9C27B0" />
  ];

  const post6Slides = [
    <Slide11 key="11" bgColor={bgColor} accentColor="#10B981" />,
    <Slide12 key="12" bgColor={bgColor} accentColor="#10B981" />
  ];

  const post7Slides = [
    <Slide13 key="13" bgColor={bgColor} accentColor="#EAB308" />,
    <Slide14 key="14" bgColor={bgColor} accentColor="#EAB308" />
  ];

  const post8Slides = [
    <Slide15 key="15" bgColor={bgColor} accentColor="#ec4899" />,
    <Slide16 key="16" bgColor={bgColor} accentColor="#ec4899" />
  ];

  const post9Slides = [
    <Slide17 key="17" bgColor={bgColor} accentColor="#06B6D4" />,
    <Slide18 key="18" bgColor={bgColor} accentColor="#06B6D4" />
  ];

  return (
    <div className="min-h-screen dark:bg-neutral-900 bg-gray-50 dark:text-white text-gray-900 flex flex-col transition-colors duration-200">
      <Navbar />
      <div className="px-2 py-12 sm:p-8 flex flex-col items-center gap-8 sm:gap-16 sm:py-24">
      
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-6 tracking-tight">AI Skills Showcase</h1>
        <p className="dark:text-neutral-400 text-gray-600 max-w-2xl mx-auto text-lg mb-8">
          Explore powerful AI skills and prompt structures designed to supercharge your workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full max-w-[1600px] mx-auto">
        <ThumbnailWrapper onClick={() => { setActiveSlides(post1Slides); setActiveSlideIndex(0); }}>
          {post1Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post2Slides); setActiveSlideIndex(0); }}>
          {post2Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post3Slides); setActiveSlideIndex(0); }}>
          {post3Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post4Slides); setActiveSlideIndex(0); }}>
          {post4Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post5Slides); setActiveSlideIndex(0); }}>
          {post5Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post6Slides); setActiveSlideIndex(0); }}>
          {post6Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post7Slides); setActiveSlideIndex(0); }}>
          {post7Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post8Slides); setActiveSlideIndex(0); }}>
          {post8Slides[0]}
        </ThumbnailWrapper>

        <ThumbnailWrapper onClick={() => { setActiveSlides(post9Slides); setActiveSlideIndex(0); }}>
          {post9Slides[0]}
        </ThumbnailWrapper>
      </div>

      <SlideModal 
        isOpen={activeSlideIndex !== null} 
        onClose={() => setActiveSlideIndex(null)}
        onNext={() => activeSlideIndex !== null && setActiveSlideIndex((activeSlideIndex + 1) % activeSlides.length)}
        onPrev={() => activeSlideIndex !== null && setActiveSlideIndex((activeSlideIndex - 1 + activeSlides.length) % activeSlides.length)}
        hasPrev={activeSlideIndex !== null && activeSlideIndex > 0}
        hasNext={activeSlideIndex !== null && activeSlideIndex < activeSlides.length - 1}
      >
        {activeSlideIndex !== null && activeSlides[activeSlideIndex]}
      </SlideModal>
      </div>
    </div>
  );
}

export const Slide9 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="PROJECT TEMPLATE / README.MD"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> PROJECT CONTEXT
      </span>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      THE ULTIMATE AI<br />
      <span style={{ color: accentColor }}>README TEMPLATE</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop giving your AI assistants half-baked context. This perfectly structured README template is specifically designed to feed AI IDEs exactly what they need: architecture patterns, tech stack, data structure, and core workflows. Just copy-paste this when your project is complete, and your AI will instantly understand your entire codebase.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>AI Assistant Context Section:</strong> Directly tells the AI what framework, language, and architecture pattern you are using so it stops hallucinating wrong imports.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Visual Database Mapping:</strong> Includes an ASCII folder and database structure so the agent knows exactly where everything is located without having to scan 500 files.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Quick Start & Environments:</strong> Standardizes your setup instructions so humans and autonomous agents can spin up your project instantly.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const rawReadmeTemplate = `# 🚀 [Project Name]

> [Short, catchy description of the project - e.g., AI-powered tax notice management system]

A comprehensive description of what the platform/app/software does, who it's for, and the primary problem it solves. 

---

## 🤖 AI Assistant Context (For AI IDEs)

*If you are an AI assistant analyzing this codebase, here is the essential context you need:*
- **Software Type:** [e.g., Web Application, Mobile App, Desktop Software, API]
- **Primary Framework:** [e.g., Next.js 14, Flutter, React, Express]
- **Language:** [e.g., TypeScript, Dart, Python, Go]
- **Architecture Pattern:** [e.g., App Router, Clean Architecture, MVC]
- **Key Workflows:** 
  - **[Workflow 1]:** [Explain how the core logic works]
  - **[Workflow 2]:** [Explain another core feature]

---

## ✨ Features

### 🎯 Core Feature 1
- Sub-feature or technical detail
- Sub-feature or technical detail

### 🎯 Core Feature 2
- Sub-feature or technical detail
- Sub-feature or technical detail

---

## 🔧 Tech Stack

### Frontend / Client
- **Framework:** [e.g., Next.js, Flutter]
- **Language:** [e.g., TypeScript, Dart]
- **Styling:** [e.g., Tailwind CSS, Material Design]
- **State Management:** [e.g., Zustand, Provider, Redux]

### Backend / Server
- **Database:** [e.g., Supabase PostgreSQL, Firebase Firestore, MongoDB]
- **Auth:** [e.g., Supabase Auth, Firebase Auth, NextAuth]
- **Storage:** [e.g., AWS S3, Firebase Storage]
- **APIs & Integrations:** [e.g., Stripe, Gemini AI, SendGrid]

---

## 🚀 Quick Start

### Prerequisites
- [e.g., Node.js 18+ and npm]
- [e.g., Supabase account / Firebase project]
- [e.g., Specific API Keys]

### 1. Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd <project-folder>

# Install dependencies
npm install  # or flutter pub get, pip install -r requirements.txt, etc.
\`\`\`

### 2. Environment Setup

Copy the example environment file and add your keys:

\`\`\`bash
cp .env.example .env.local
\`\`\`

**Required environment variables:**
- \`API_KEY_1\` - Description
- \`DATABASE_URL\` - Description

### 3. Run Development Server

\`\`\`bash
# Start the local server
npm run dev # or flutter run
\`\`\`

---

## 🗄️ Database Structure / Architecture

*Provide a visual or text representation of how the data is structured to help AIs and developers understand relationships quickly.*

\`\`\`text
users (table/collection)
 ├── id: uuid (PK)
 ├── name: string
 └── posts (subcollection/relation)
      ├── id: uuid
      ├── title: string
      └── content: text
\`\`\`

---

## 📁 Project Structure

\`\`\`text
/root/
├── src/
│   ├── app/                    # Main routing / entry points
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utilities & external client configs
│   └── api/                    # Backend API routes / services
├── database/                   # SQL migrations & schemas / Firebase rules
├── docs/                       # Documentation
└── public/                     # Static assets (images, icons)
\`\`\`

---

## 🤝 Contributing

1. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
2. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
3. Push to the branch (\`git push origin feature/amazing-feature\`)
4. Open a Pull Request

---

## 📄 License

Proprietary - All rights reserved. 
Copyright © [Year] [Your Company/Name].`;

export const Slide10 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="RAW MARKDOWN / COPY & PASTE"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> PROJECT CONTEXT
      </span>
    }
    footerRight="02 / 02"
  >
    <div className="relative flex flex-col flex-grow h-full bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 p-4">
      {/* Inline Copy Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(rawReadmeTemplate);
          alert("README copied to clipboard!");
        }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Terminal size={14} /> COPY README
      </button>

      <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-50">README.md</h3>
      
      <div className="flex-grow overflow-y-auto hidden-scrollbar pr-2 relative">
        <pre className="text-[10px] sm:text-xs font-mono leading-relaxed whitespace-pre-wrap break-words opacity-80" style={{ fontFamily: "monospace" }}>
          {rawReadmeTemplate}
        </pre>
      </div>
    </div>
  </SlideContainer>
);

export const Slide11 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="UPSTASH / CONTEXT7"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> MCP SERVER
      </span>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      NEVER HALLUCINATE<br />
      <span style={{ color: accentColor }}>OUTDATED CODE AGAIN.</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Tired of Cursor or Claude generating code using deprecated Next.js or React APIs? Context7 by Upstash is an MCP server that directly injects verified, version-specific, and real-time live documentation straight into your AI's context.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Live MCP Integration:</strong> Hooks directly into Claude Desktop, Cursor, or Windsurf via the Model Context Protocol.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Version Specific Docs:</strong> Just tell your AI "Use context7 for Next.js 14" and it instantly pulls the exact documentation needed.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>No More Generic Code:</strong> AI models finally have the exact context required to build modern, hyper-specific tools without guessing.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const rawContext7Config = `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}`;

export const Slide12 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE / CONTEXT7 MCP"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> MCP SERVER
      </span>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO INSTALL<br />
      <span style={{ color: accentColor }}>CONTEXT7 MCP</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Simply add this configuration to your MCP settings file (like <code>cline_mcp_settings.json</code> for VSCode or the Cursor MCP menu).
    </p>

    <div className="relative flex flex-col flex-grow h-full bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 p-4">
      {/* Inline Copy Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(rawContext7Config);
          alert("MCP Config copied to clipboard!");
        }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Terminal size={14} /> COPY CONFIG
      </button>

      <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-50">mcp_settings.json</h3>
      
      <div className="flex-grow overflow-y-auto hidden-scrollbar pr-2 relative">
        <pre className="text-[10px] sm:text-xs font-mono leading-relaxed whitespace-pre-wrap break-words opacity-80" style={{ fontFamily: "monospace" }}>
          {rawContext7Config}
        </pre>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        Or use the CLI: <code>npx ctx7 setup</code><br/>
        repository URL: <a href="https://github.com/upstash/context7" target="_blank" className="hover:underline font-bold text-black break-all">https://github.com/upstash/context7</a>
      </div>
      <CopyRepoButton url="https://github.com/upstash/context7" />
    </div>
  </SlideContainer>
);

export const Slide13 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / ANTIGRAVITY VAULT"
    footerLeft={
      <Link 
        href="https://github.com/rmyndharis/antigravity-skills"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/RMYNDHARIS
      </Link>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      300+ SPECIALIZED<br />
      AI AGENT SKILLS:<br />
      <span style={{ color: accentColor }}>THE SKILL VAULT</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      A curated collection of over 300 Agent Skills ported specifically for Google Antigravity. This vault provides your AI with repeatable workflows, domain expertise, and specialized tools across software development, DevOps, security, and cloud architecture.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Domain Expertise:</strong> Access specialized skills for Python, React, Kubernetes, Terraform, and CI/CD automation directly from your agent.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Specialist Personas:</strong> Transform your AI into a Backend Architect, Security Auditor, or Data Engineer instantly.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Multi-Step Workflows:</strong> Give your AI structured pipelines like Full Stack Orchestration or Context-Driven Development.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide14 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO INSTALL THE VAULT"
    footerLeft={
      <Link 
        href="https://github.com/rmyndharis/antigravity-skills"
        target="_blank"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        style={{ color: accentColor }}
      >
        <Terminal size={16} />
        GITHUB.COM/RMYNDHARIS
      </Link>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO INSTALL<br />
      <span style={{ color: accentColor }}>VAULT SKILLS</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Browse the catalog and install skills strategically to keep token usage low and maximize relevance. Antigravity automatically loads metadata from all installed skills.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Install Specific Skills:</strong> Download the desired skill folders into your <code>skills/</code> directory. (e.g. <code>api-design-principles</code>).
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Automatic Triggering:</strong> Once installed, simply ask your agent naturally. E.g., "Help me design a REST API" will automatically activate the relevant skill!
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        Check out the full Catalog on GitHub<br/>
        repository URL: <a href="https://github.com/rmyndharis/antigravity-skills" target="_blank" className="hover:underline font-bold text-black break-all">https://github.com/rmyndharis/antigravity-skills</a>
      </div>
      <CopyRepoButton url="https://github.com/rmyndharis/antigravity-skills" />
    </div>
  </SlideContainer>
);

export const rawPromptLabConfig = `{
  "mcpServers": {
    "prompt-lab": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "your/path/to/Prompt-Lab"
    }
  }
}`;

export const Slide15 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="PROMPT LAB / MCP SERVER"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> MCP SERVER
      </span>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      SUPERCHARGE YOUR AI<br />
      <span style={{ color: accentColor }}>WITH PROMPT LAB MCP.</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Connect your local AI agent directly to the Prompt Lab! The Prompt Lab MCP server provides your AI tools to check available skills and install them with one click.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Skill Checking:</strong> Lets your AI query all available UI/UX, Design, and DevOps skills seamlessly.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>One-click Install:</strong> Agent can instantly install requested skills into your local directory.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide16 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="HOW TO USE / PROMPT LAB MCP"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> MCP SERVER
      </span>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO INSTALL<br />
      <span style={{ color: accentColor }}>PROMPT LAB MCP</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Simply add this configuration to your agent's MCP settings (e.g. <code>cline_mcp_settings.json</code>) to get started!
    </p>

    <div className="relative flex flex-col flex-grow h-full bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 p-4">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(rawPromptLabConfig);
          alert("MCP Config copied to clipboard!");
        }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Terminal size={14} /> COPY CONFIG
      </button>

      <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-50">mcp_settings.json</h3>
      
      <div className="flex-grow overflow-y-auto hidden-scrollbar pr-2 relative">
        <pre className="text-[10px] sm:text-xs font-mono leading-relaxed whitespace-pre-wrap break-words opacity-80" style={{ fontFamily: "monospace" }}>
          {rawPromptLabConfig}
        </pre>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        Local run: <code>npm run mcp</code><br/>
      </div>
    </div>
  </SlideContainer>
);

export const rawLoginRegisterSkill = `---
name: login-register
description: Builds production-ready Login and Register (sign up) screens for Flutter mobile apps and Next.js web apps, covering form validation, loading and error states, Google/OAuth sign-in, terms consent, secure session handling, autofill, accessibility, and dark mode. Use this skill whenever the user mentions login, sign in, sign up, register, registration, auth screens, authentication UI, "login & register", or asks to create, fix, redesign, or review any authentication page or screen, even if they do not say "production ready".
---

# Login & Register

Generate or upgrade Login and Register screens so they are safe to ship. Do not paste a template: read the project first, then apply the rules for its platform.

## Pick the platform

Detect it from the project and do not ask if it is obvious:

- \`pubspec.yaml\` exists → follow the **Flutter** section only.
- \`package.json\` with \`next\` → follow the **Next.js** section only.
- Both exist (monorepo) or neither → ask the user which one to build, in one short question.

## Rules that apply to every platform

1. **Inspect before writing.** Reuse the existing auth/API layer, theme, state management, and routes. Do not add a second auth system or rename things other files depend on.
2. **Validate everywhere.** Every field has validation. Passwords are never trimmed. Confirm-password is validated against the password field. Server-side checks must not depend on the client's checks.
3. **One shared set of building blocks.** Login and Register share header, field, button, and terms components. No copy-pasted widgets.
4. **Friendly, generic errors.** Map errors in one place (no connection, timeout, wrong credentials, already registered, server error, unknown). Never show raw exception text. Login failures must not reveal whether an account exists.
5. **No double submits.** Disable controls while loading, dismiss the keyboard, and reset loading state in \`finally\`.
6. **Consent at registration.** Terms and Privacy are required when an account can be created, not for logging in an existing user (flag it if the original code differs).
7. **No fake data.** Do not write placeholder values to the backend just to satisfy a required field.
8. **Accessible by default.** Labels, error announcements, autofill hints, correct keyboard types, large tap targets, text scaling, light and dark mode through theme tokens.
9. **Safe session handling.** Tokens go in secure storage (mobile) or httpOnly cookies (web). Never log secrets or credentials.
10. **Be honest about the edges.** Do not claim the result is "secure". Finish with a short list of decisions made and things that could not be verified (backend contract, provider settings, rate limits).
11. **Verify.** Run the platform's analyzer or type-check and fix what the change introduced.

## Do not

- Do not add packages without saying which and why.
- Do not put secrets, API keys, or client IDs in screen/page files.
- Do not change routes, class names, or API methods that other files use.

---

## Flutter

### Step 1: Inspect the project before writing anything

1. Read \`pubspec.yaml\`. Note the state management in use (setState / Provider / Riverpod / Bloc / GetX) and follow it. Do not introduce a new one.
2. Find the existing API/auth layer (e.g. \`ApiService\`, \`AuthRepository\`, \`GoogleAuthService\`, \`NotificationService\`). Reuse it. Never invent endpoints.
3. Find the theme (\`ThemeData\`, color constants, \`AppColors\`). Use the theme. Only fall back to the default tokens below if the project has none.
4. Find the app name, logo asset and home route. Use the real app name consistently everywhere (title, terms text, header). Flag any mismatch to the user instead of silently picking one.
5. Check whether the project already has \`login_screen.dart\` / \`register_screen.dart\`. If so, refactor in place and keep the public class names and routes so nothing else breaks.

### Step 2: File structure

Put shared pieces in one place so the two screens never duplicate code:

\`\`\`
features/auth/presentation/
├── login_screen.dart
├── register_screen.dart
├── forgot_password_screen.dart      (only if it already exists)
└── widgets/
    ├── auth_header.dart             logo + title + tagline
    ├── auth_text_field.dart         one text field used by both screens
    ├── auth_primary_button.dart     loading-aware button
    ├── google_sign_in_button.dart
    ├── terms_checkbox.dart          owns and disposes its TapGestureRecognizers
    └── auth_footer_link.dart        "New here? Sign Up" / "Already have an account? Log in"
features/auth/validators.dart        pure functions, easy to unit test
\`\`\`

### Step 3: Production checklist (every item is required)

#### Validation
- Every \`TextFormField\` has a \`validator\`. A \`Form.validate()\` with no validators does nothing.
- Email: trimmed, non-empty, matches a sane regex. Password: required, minimum 8 characters on register (login only checks non-empty so existing users are never blocked).
- Confirm password is validated **inside its own validator** by comparing with the password controller, not with a separate snackbar.
- Use \`autovalidateMode: AutovalidateMode.onUserInteraction\` after the first submit attempt.

#### Credentials
- Trim username/email. **Never trim or alter the password.**
- Never log passwords, tokens, or full responses. No \`print\` of user data. Use \`debugPrint\` only for non-sensitive messages, guarded by \`kDebugMode\`.
- Tokens must be stored with \`flutter_secure_storage\` (or the project's existing secure store). If the existing \`ApiService\` stores tokens in \`SharedPreferences\`, tell the user and offer to migrate. Do not change it silently.

#### Submit behaviour
- Dismiss the keyboard (\`FocusScope.of(context).unfocus()\`) on submit.
- Ignore taps while loading (\`if (_isLoading) return;\`) and disable the button. Disable the Google button too, and vice versa.
- Always check \`if (!mounted) return;\` after every \`await\` before touching \`context\` or \`setState\`.
- Reset loading in \`finally\`.
- Order of checks: form validation first, then consent, then network.

#### Errors
- Convert exceptions into friendly messages in **one** helper (for example \`AuthErrorMapper.message(Object e)\`), handling at least: no connection / \`SocketException\`, timeout, 400/401 (wrong credentials), 409 (already registered), 5xx (server problem), and unknown.
- Never show raw \`e.toString()\` or stack-ish text to the user.
- Never swallow errors with an empty \`catch (_) {}\`. Non-critical steps (like uploading an FCM token) may fail without blocking login, but log them in debug mode.

#### Navigation
- After a successful login or register-and-auto-login, go to Home with \`Navigator.pushAndRemoveUntil(..., (_) => false)\` so Back cannot return to the auth screen. Use the project's router (go_router etc.) equivalent if it has one.
- After register, pick **one** consistent flow and say which: either auto-login straight into the app, or send the user to Login with a success message. Do not log the user in silently and then also ask them to log in again.
- Do not create server records with fake placeholder values (\`'Unknown'\`, \`0\`). Collect the field, make it optional on the backend, or complete it in an onboarding step. Tell the user if the backend currently forces placeholders.
- If registration succeeds but a follow-up step (profile creation) fails, do not hide it. Show a clear message and make the step retryable.

#### Terms and consent
- Consent is required at **register**, and for Google sign-in when it can create a new account. Do not block plain login of an existing user behind a checkbox unless the user's legal requirement says so. If the original code does this, ask or flag it.
- Link text to Terms and Privacy uses \`TapGestureRecognizer\`. **Dispose recognizers** in \`dispose()\` or they leak. This is why \`terms_checkbox.dart\` is its own StatefulWidget.

#### UX and accessibility
- \`textInputAction\`: \`next\` on every field, \`done\`/\`go\` on the last. Call submit from \`onFieldSubmitted\`.
- \`keyboardType: emailAddress\` for email; \`autocorrect: false\` and \`enableSuggestions: false\` for email and password.
- Wrap fields in \`AutofillGroup\` and set \`autofillHints\` (\`AutofillHints.email\`, \`.password\`, \`.newPassword\`, \`.name\`). Call \`TextInput.finishAutofillContext()\` on success.
- Password visibility toggle has a \`tooltip\`/semantic label.
- Footer links use \`InkWell\`/\`TextButton\` (48x48 minimum tap target), not a bare \`GestureDetector\` on text.
- Layout must not overflow on small screens or with the keyboard open: \`SingleChildScrollView\` + \`ConstrainedBox(minHeight)\` inside \`LayoutBuilder\`, and avoid fixed heights.
- Respect text scaling. No hardcoded widths on labels.
- Image assets (Google icon) get an \`errorBuilder\` fallback to a \`Icon\`.
- Remove empty/unused UI (for example bilingual labels with an empty second string).

#### Styling
- Use \`Theme.of(context).colorScheme\` and \`TextTheme\` instead of \`isDark ? X : Y\` ternaries repeated in every widget. Dark mode should come from the theme, not from per-widget checks.
- Define constants once (radius, spacing, field height). Use \`const\` constructors everywhere possible.
- Use \`super.key\` instead of \`Key? key\` + \`super(key: key)\`.

#### Fallback design tokens (only if the project has no theme)
Primary \`#1E2A47\`, dark-mode accent \`Colors.blue.shade300\`, radius 8, field fill \`cardColor\`, button height 56, logo 80px circle, screen padding 24 horizontal / 32 vertical, label 14 bold.

### Step 4: Reference patterns

Validators (pure, testable):

\`\`\`dart
class AuthValidators {
  static final _email = RegExp(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+\$');

  static String? email(String? v) {
    final s = v?.trim() ?? '';
    if (s.isEmpty) return 'Email is required';
    if (!_email.hasMatch(s)) return 'Enter a valid email';
    return null;
  }

  static String? loginPassword(String? v) =>
      (v == null || v.isEmpty) ? 'Password is required' : null;

  static String? newPassword(String? v) {
    if (v == null || v.isEmpty) return 'Password is required';
    if (v.length < 8) return 'Use at least 8 characters';
    return null;
  }

  static String? Function(String?) confirm(TextEditingController other) =>
      (v) => v != other.text ? 'Passwords do not match' : null;

  static String? name(String? v) =>
      (v == null || v.trim().length < 2) ? 'Enter your full name' : null;
}
\`\`\`

Submit skeleton:

\`\`\`dart
Future<void> _submit() async {
  if (_isLoading) return;
  FocusScope.of(context).unfocus();
  if (!_formKey.currentState!.validate()) return;

  setState(() => _isLoading = true);
  try {
    await _auth.login(_email.text.trim(), _password.text); // password untouched
    TextInput.finishAutofillContext();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
      (_) => false,
    );
  } catch (e) {
    if (!mounted) return;
    _showError(AuthErrorMapper.message(e));
  } finally {
    if (mounted) setState(() => _isLoading = false);
  }
}
\`\`\`

### Step 5: Verify before finishing

1. Run \`flutter analyze\`. Fix everything the change introduced.
2. Confirm no unused imports remain and every controller, focus node, and recognizer is disposed.
3. Mentally walk these cases: empty form, invalid email, short password, mismatched passwords, no internet, wrong password, already-registered email, double tap on submit, Google sign-in cancelled by the user, rotate / small screen / keyboard open, dark mode.
4. End your reply with a short list of **decisions you made** and **things you could not verify** (backend contract, token storage, Google backend token exchange), so the user can confirm them.

### Do not

- Do not rename routes, classes, or API methods that other files depend on.
- Do not add packages without saying which and why.
- Do not store secrets, API keys, or client IDs in the screen files.
- Do not claim the screens are "secure". Say what was done and what depends on the backend.

---

## Next.js

### Step 1: Inspect the project before writing anything

1. Read \`package.json\` and \`next.config.*\`. Note the Next version, whether it uses the App Router (\`app/\`) or Pages Router, and the React version.
   - Next 14 / React 18: \`useFormState\` from \`react-dom\`.
   - Next 15 / React 19: \`useActionState\` from \`react\`.
2. Find the existing auth layer and use it: Supabase (\`@supabase/ssr\`), Auth.js/NextAuth, Clerk, or a custom API. Do not add a second auth system. If none exists and the project already uses Supabase, use Supabase Auth.
3. Check Tailwind version. Tailwind v4 is CSS-first (\`@import "tailwindcss"\` + \`@theme\` in the CSS file); do not create a \`tailwind.config.js\` unless the project already has one.
4. Find existing UI primitives (shadcn/ui, custom \`Button\`, \`Input\`). Reuse them. Match the existing design tokens and dark-mode approach.
5. Read the app name, logo, and route conventions. Keep names consistent everywhere.
6. If login/register pages already exist, refactor in place and keep their routes.

### Step 2: File structure

\`\`\`
app/
├── (auth)/
│   ├── layout.tsx                 centered card layout, redirects signed-in users away
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── actions.ts                 "use server": login, register, signInWithGoogle, signOut
├── auth/
│   └── callback/route.ts          OAuth / email-confirmation code exchange
components/auth/
├── auth-card.tsx
├── form-field.tsx                 label + input + error, wired for a11y
├── password-input.tsx             show/hide toggle
├── submit-button.tsx              pending-aware
├── google-button.tsx
└── terms-checkbox.tsx
lib/
├── validators/auth.ts             zod schemas shared by client and server
├── safe-redirect.ts
└── supabase/{client,server,middleware}.ts   (only if using Supabase)
middleware.ts                      session refresh + route protection
\`\`\`

### Step 3: Production checklist (every item is required)

#### Validation
- One zod schema per form in \`lib/validators/auth.ts\`, used for client-side feedback **and** re-validated inside the server action. Never trust the client.
- Email: trim + lowercase. Password: **never trim**. Register: minimum 8 characters, \`confirmPassword\` checked with \`.refine\`. Login: only "not empty", so existing users are never locked out.
- Return field-level errors (\`{ errors: { email: [...] } }\`) plus one form-level error, and render them next to the fields.

#### Security
- Do mutations in Server Actions or Route Handlers, never in client components with secrets.
- On the server, trust \`supabase.auth.getUser()\`, not \`getSession()\`, for authorization decisions.
- Only the public anon key goes in \`NEXT_PUBLIC_*\`. The service-role key must never reach client code or be imported from a client file.
- Auth cookies must come from \`@supabase/ssr\` (httpOnly handling) or the library's default. Do not hand-roll tokens in \`localStorage\`.
- **Open-redirect protection:** any \`?next=\` / \`redirectTo\` value must pass \`safeRedirect()\` (only same-origin paths that start with a single \`/\`). Default to \`/dashboard\` (or the project's home).
- Login errors must be generic ("Invalid email or password") and must not reveal whether an account exists. Do the same on password reset.
- Mention rate limiting / CAPTCHA (e.g. Cloudflare Turnstile, or Supabase's built-in limits) to the user as a decision. Do not silently skip it and do not add a service without saying so.
- Never log passwords, tokens, or whole request bodies.

#### Flow
- \`middleware.ts\` refreshes the session on every request and redirects unauthenticated users away from protected routes. Matcher excludes \`_next/static\`, images, and the favicon.
- Signed-in users who visit \`/login\` or \`/register\` get redirected to home.
- Register: choose one flow and state it. With email confirmation on: show a "check your inbox" state, no auto-login. With confirmation off: sign in and redirect. Handle "email already registered" without leaking details beyond what the provider returns.
- Google/OAuth: \`redirectTo\` points to \`/auth/callback\`, which exchanges the code for a session and then redirects through \`safeRedirect\`. Handle callback errors with a friendly message on \`/login\`.
- Terms and Privacy consent is required at register (and when OAuth can create a new account), not for logging in an existing user. Link to the real pages.
- Do not write fake placeholder data to the database. Collect it, make it optional, or ask for it in onboarding. A profile row can be created by a database trigger instead of client code.

#### UX and accessibility
- Every input has a visible \`<label htmlFor>\`. Do not rely on placeholders as labels.
- Errors use \`aria-invalid\`, \`aria-describedby\`, and a message with \`role="alert"\`. Focus the first invalid field after a failed submit.
- Correct \`autoComplete\`: \`email\`, \`current-password\` (login), \`new-password\` (register, both password fields), \`name\`. Use \`type="email"\` and \`inputMode="email"\`.
- Password toggle is a real \`<button type="button">\` with \`aria-label\` and \`aria-pressed\`.
- Submit button shows a pending state (\`useFormStatus\`) and is disabled while pending, so double submits are impossible. Disable the Google button during any pending action too.
- Works with keyboard only; Enter submits; visible focus rings; touch targets at least 44px.
- Responsive from 320px up; no horizontal scroll; correct in light and dark mode through design tokens, not per-component ternaries.
- Anything using \`useSearchParams\` is wrapped in \`<Suspense>\` so the build does not fail.
- Set page \`metadata\` (title) per page.

### Step 4: Reference patterns

Schemas:

\`\`\`ts
// lib/validators/auth.ts
import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"), // no trim
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email,
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.literal("on", { errorMap: () => ({ message: "You must accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
\`\`\`

Safe redirect:

\`\`\`ts
// lib/safe-redirect.ts
export function safeRedirect(next: string | null | undefined, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\\\")) {
    return fallback;
  }
  return next;
}
\`\`\`

Server action (Supabase):

\`\`\`ts
// app/(auth)/actions.ts
"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/auth";
import { safeRedirect } from "@/lib/safe-redirect";

export type FormState = { errors?: Record<string, string[]>; message?: string };

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient(); // drop \`await\` if your helper is sync
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: "Invalid email or password." }; // generic on purpose

  redirect(safeRedirect(formData.get("next") as string | null));
}
\`\`\`

Form component skeleton (Next 14 shown; on Next 15 use \`useActionState\` from \`react\`):

\`\`\`tsx
"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login, type FormState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Signing in…" : "Log in"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState<FormState, FormData>(login, {});
  return (
    <form action={action} noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      {/* FormField for email (autoComplete="email") and PasswordInput
          (autoComplete="current-password"), each reading state.errors */}
      {state.message && <p role="alert">{state.message}</p>}
      <Submit />
    </form>
  );
}
\`\`\`

### Step 5: Verify before finishing

1. Run \`npx tsc --noEmit\` and the project's lint command. Run \`next build\` when feasible (it catches the \`useSearchParams\` Suspense issue).
2. Walk through: empty form, invalid email, short password, mismatched passwords, wrong password, existing email, double click, JS disabled (server action still validates), \`?next=https://evil.com\` (must fall back), signed-in user opening \`/login\`, OAuth cancelled, mobile width, dark mode, keyboard-only.
3. End your reply with **decisions made** and **unverified items** (Supabase email-confirmation setting, redirect URLs allow-list in the dashboard, RLS policies, rate limits).

### Do not

- Do not move auth logic into client components or expose server-only keys.
- Do not add packages (zod, react-hook-form, Turnstile) without saying which and why. Prefer what the project already has.
- Do not change existing routes, middleware matchers, or database schema without saying so.
- Do not claim the flow is "secure"; state what was done and what depends on provider and database configuration.
`;

export const Slide17 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="AI SKILLS / LOGIN & REGISTER"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-POWERED <span style={{ color: accentColor }}>→</span> PRODUCTION AUTH
      </span>
    }
    footerRight="01 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      PRODUCTION-READY AUTH:<br />
      <span style={{ color: accentColor }}>LOGIN & REGISTER</span>
    </h1>
    
    <p className="text-[13px] sm:text-sm md:text-base mb-6 font-medium leading-relaxed">
      Build and upgrade production-ready Login and Sign-up screens for Flutter mobile apps and Next.js web apps. Covers zero-trust form validation, loading and error states, OAuth sign-in, terms consent, secure session handling, autofill, accessibility, and dark mode tokens.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Auto Platform Detection:</strong> Detects <code>pubspec.yaml</code> for Flutter or <code>package.json</code> for Next.js to apply framework-native architectural rules without guessing.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Zero-Trust & Safe Sessions:</strong> Never trims passwords, guards against open-redirects, stores tokens securely (httpOnly cookies / flutter_secure_storage), and disables double submits.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-[11px] sm:text-xs md:text-sm font-medium">
          <strong>Accessible & Theme-Aware:</strong> Includes <code>AutofillGroup</code> / <code>autoComplete</code>, 44px/48px touch targets, error announcements, keyboard navigation, and theme tokens.
        </div>
      </div>
    </div>
  </SlideContainer>
);

export const Slide18 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
  <SlideContainer
    bgColor={bgColor}
    accentColor={accentColor}
    headerLeft="RAW SKILL / COPY & ACTIVATE"
    footerLeft={
      <span className="flex items-center gap-2">
        AI-OPTIMIZED <span style={{ color: accentColor }}>→</span> MULTI-PLATFORM
      </span>
    }
    footerRight="02 / 02"
  >
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE &<br />
      <span style={{ color: accentColor }}>ACTIVATE THIS SKILL</span>
    </h1>

    <p className="text-[13px] sm:text-sm md:text-base mb-4 font-medium leading-relaxed">
      Save this skill to <code>.agents/skills/login-register/SKILL.md</code>. Your AI agent will automatically activate it whenever you mention login, registration, or auth screens!
    </p>

    <div className="relative flex flex-col flex-grow h-full bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 p-4">
      {/* Inline Copy Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(rawLoginRegisterSkill);
          alert("Login-Register skill copied to clipboard!");
        }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Terminal size={14} /> COPY SKILL
      </button>

      <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-50">SKILL.md</h3>
      
      <div className="flex-grow overflow-y-auto hidden-scrollbar pr-2 relative">
        <pre className="text-[10px] sm:text-xs font-mono leading-relaxed whitespace-pre-wrap break-words opacity-80" style={{ fontFamily: "monospace" }}>
          {rawLoginRegisterSkill}
        </pre>
      </div>
    </div>
    
    <div className="mt-auto pt-4 font-mono text-[10px] md:text-xs tracking-tight text-black/60 flex items-end justify-between gap-4">
      <div>
        File path: <code>.agents/skills/login-register/SKILL.md</code>
      </div>
      <CopyRepoButton url="https://github.com/umang4zq/Prompt-Lab" />
    </div>
  </SlideContainer>
);
