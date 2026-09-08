"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Terminal, X, ChevronLeft, ChevronRight } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-[20px] saturate-150 transition-colors" 
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

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-[600px] aspect-[3/4] max-h-[90vh] flex flex-col rounded-sm shadow-2xl overflow-y-auto hidden-scrollbar"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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

const Slide3 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      APPLE-LEVEL UI &<br />
      FLUID MOTION:<br />
      <span style={{ color: accentColor }}>APPLE DESIGN SKILL</span>
    </h1>
    
    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop making your web apps feel stiff and robotic. This skill translates Apple's legendary design principles—fluid physical motion, spring physics, drag and swipe interactions, and gorgeous translucent depth—directly into your frontend projects so your interfaces actually feel alive.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Embeds Apple's approach to interface design, fluid motion, and spatial consistency into your AI coding agent.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Masters interruptible transitions, momentum scrolling, and spring curves instead of weak default CSS easings.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Handles subtle details like translucent materials, proper typography tracking, and reduced-motion preferences effortlessly.
        </div>
      </div>
    </div>
  </SlideContainer>
);

const Slide4 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE AND<br />
      <span style={{ color: accentColor }}>INSTALL THIS SKILL</span>
    </h1>

    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate Apple's design philosophy into your workflow to instantly elevate your frontend projects without guessing animation curves or spacing.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Install as an Antigravity Skill:</strong> Simply grab the apple-design SKILL.md file from the repository and drop it into your Antigravity skills directory to level up your local AI setup.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Guide Your AI Agent:</strong> Use it when building gesture-driven UI, swipe-to-dismiss sheets, or custom component animations so your AI writes code that actually feels natural and smooth.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Share with Friends:</strong> Show this repository to Jenil and your college peers to instantly upgrade your team's frontend game and make your web projects look like they were built by a top-tier design engineer.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60">
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
  </SlideContainer>
);

const Slide5 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      THE ULTIMATE AI<br />
      DESIGN BLUEPRINT:<br />
      <span style={{ color: accentColor }}>AWESOME-DESIGN-MD</span>
    </h1>
    
    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Stop manually translating design files. Awesome-design-md is a curated collection of DESIGN.md files extracted from top-tier websites like Vercel, Stripe, and Apple. You simply drop a markdown file into your project, and your AI agent instantly knows exactly how the UI should look and feel.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Replaces Figma exports and complex JSON schemas with a simple, plain-text markdown format that AI coding tools natively understand.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Captures real design depth, including visual themes, typography rules, color palettes, and responsive behaviors.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Features 55 different design systems from major tech platforms, developer tools, and consumer apps.
        </div>
      </div>
    </div>
  </SlideContainer>
);

const Slide6 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Integrate these design blueprints directly into your workspace so your background coding assistants can generate consistent, pixel-accurate interfaces automatically.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Install as an Antigravities Skill:</strong> Simply download a DESIGN.md file from the repository and drop it straight into your project's root folder or Antigravity directory.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Power Your Agents:</strong> Point your background AI tools or agents at this markdown file so they understand the exact visual rules before generating frontend React or Flutter components.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Standardize with Friends:</strong> Share this repo with Jenil and your IT classmates so you can all build high-quality UI without needing a professional design background.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60">
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
  </SlideContainer>
);

const Slide7 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      UPGRADE YOUR AI:<br />
      <span style={{ color: accentColor }}>SUPERPOWERS</span>
    </h1>
    
    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      This repository is like a magic toolbelt for your AI. Instead of just writing code, your background helpers get real "superpowers" to do bigger tasks. It connects your setup to new apps and extra features so you do not have to build everything from scratch.
    </p>

    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Gives your background AI new tools to do much more than just type text.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Very simple to add to your current computer setup.
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          Saves you hours of boring work by doing the heavy lifting for you.
        </div>
      </div>
    </div>
  </SlideContainer>
);

const Slide8 = ({ bgColor, accentColor }: { bgColor: string, accentColor: string }) => (
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
      className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-4 break-words"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      HOW TO USE<br />
      <span style={{ color: accentColor }}>THIS REPO</span>
    </h1>

    <p className="text-sm md:text-base mb-6 font-medium leading-relaxed">
      Add these tools to your workspace so your coding helpers become much stronger and faster.
    </p>
    
    <div className="flex flex-col gap-3 w-full mt-auto">
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Install as an Antigravities Skill:</strong> Download the files from the link and drop them into your Antigravity skills folder to turn on the new superpowers.
        </div>
      </div>
      
      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Power Your Agents:</strong> Let your background helpers use these new tools so they can finish big tasks without you holding their hand.
        </div>
      </div>

      <div className="flex items-start gap-4 border-b border-black/10 pb-3">
        <ArrowRight style={{ color: accentColor }} className="mt-0.5 shrink-0" size={16} />
        <div className="border-l border-black/20 pl-4 text-xs md:text-sm font-medium">
          <strong>Share with Friends:</strong> Send this link to Jenil and your college friends so they can make their own coding setups super powerful too.
        </div>
      </div>
    </div>
    
    <div className="mt-auto pt-6 font-mono text-[10px] md:text-xs tracking-tight text-black/60">
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
  </SlideContainer>
);

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

  return (
    <div className="min-h-screen bg-neutral-900 p-8 flex flex-col items-center gap-16 py-24">
      
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">AI Skills Showcase</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg mb-8">
          Explore powerful AI skills and prompt structures designed to supercharge your workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-[1600px] mx-auto px-4">
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
  );
}
