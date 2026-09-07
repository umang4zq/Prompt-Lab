"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

// You can customize the colors here or pass them as props
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
      className="relative w-full max-w-2xl aspect-[3/4] mx-auto p-6 md:p-12 font-sans flex flex-col shadow-2xl"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center text-xs md:text-sm tracking-widest uppercase font-semibold mb-8 z-10">
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>

      {/* Main Content Area with Borders */}
      <div
        className="flex-grow flex flex-col relative border-l border-t"
        style={{ borderColor }}
      >
        <div className="pt-8 pl-6 pr-4 pb-12 flex flex-col flex-grow">
          {children}
        </div>
      </div>

      {/* Footer Area with Borders */}
      <div
        className="flex justify-between items-center text-xs md:text-sm font-semibold tracking-wider pt-6 border-t border-l uppercase"
        style={{ borderColor }}
      >
        <div className="pl-6 flex items-center gap-2">{footerLeft}</div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}

export default function SlidesShowcase() {
  const [accentColor, setAccentColor] = useState("#2F50FD");
  const [bgColor, setBgColor] = useState("#F7F5EC");

  return (
    <div className="min-h-screen bg-neutral-900 p-8 flex flex-col items-center gap-12 py-20">
      <div className="text-white text-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Slide Template Generator</h1>
        <p className="text-neutral-400 mb-6">Customize colors below and use these templates for your content.</p>
        
        <div className="flex justify-center gap-6 mb-8">
          <label className="flex items-center gap-2">
            Accent Color:
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-transparent" />
          </label>
          <label className="flex items-center gap-2">
            Background:
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-transparent" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1600px] mx-auto px-4">
        {/* Slide 1: Title Slide */}
        <SlideContainer
          bgColor={bgColor}
          accentColor={accentColor}
          headerLeft="VIBECODING / 2026"
          footerLeft={
            <>
              FROM BLANK PROJECT <span style={{ color: accentColor }}>→</span> POLISHED UI
            </>
          }
          footerRight="01 / 06"
        >
          <h1 
            className="text-7xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mt-12 mb-8"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            5 PROMPTS<br />
            I USE WHILE<br />
            VIBECODING
          </h1>
          <div className="text-3xl font-mono mt-auto" style={{ color: accentColor }}>
            &gt;_
          </div>
        </SlideContainer>

        {/* Slide 2: Context Slide */}
        <SlideContainer
          bgColor={bgColor}
          accentColor={accentColor}
          headerLeft={
            <>
              01 — <span style={{ color: accentColor }}>BUILD</span>
            </>
          }
          footerLeft={
            <>
              CONTEXT <span style={{ color: accentColor }}>→</span> PLAN <span style={{ color: accentColor }}>→</span> CODE
            </>
          }
          footerRight="02 / 06"
        >
          <h1 
            className="text-6xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-4"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            DON'T JUST SAY<br />BUILD THIS.
          </h1>
          <p className="text-lg md:text-xl mb-8 font-medium">
            Give AI the context before asking it to code.
          </p>

          {/* Code Box */}
          <div 
            className="border rounded-lg p-6 font-mono text-sm leading-relaxed"
            style={{ borderColor: "rgba(17, 17, 17, 0.4)" }}
          >
            <p>You are a senior frontend engineer.</p>
            <br />
            <p>I'm building [PROJECT].</p>
            <p>Goal: [WHAT IT DOES]</p>
            <p>Target users: [AUDIENCE]</p>
            <br />
            <p>Tech stack:</p>
            <p>- [FRAMEWORK]</p>
            <p>- [STYLING]</p>
            <p>- [LIBRARIES]</p>
            <br />
            <p>Core features:</p>
            <p>1. [FEATURE]</p>
            <p>2. [FEATURE]</p>
            <p>3. [FEATURE]</p>
          </div>
        </SlideContainer>

        {/* Slide 3: The Wildcard Slide */}
        <SlideContainer
          bgColor={bgColor}
          accentColor={accentColor}
          headerLeft=",05 — THE WILDCARD"
        >
          <h1 
            className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mt-4 mb-4"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            GPT-OSS <span style={{ color: accentColor }}>120B</span>
          </h1>
          <p className="text-3xl md:text-4xl font-medium tracking-tight mb-8 leading-tight">
            Not your first choice.<br />
            Still useful.
          </p>

          {/* Box */}
          <div 
            className="border rounded-lg p-6 md:p-8 flex flex-col gap-6"
            style={{ borderColor: "rgba(17, 17, 17, 0.2)" }}
          >
            <h3 className="text-2xl font-bold uppercase tracking-tighter" style={{ color: accentColor }}>BEST FOR</h3>
            
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <ArrowRight style={{ color: accentColor }} size={20} />
                <div className="border-l border-black/20 pl-4 text-lg">Trivial tasks</div>
              </div>
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <ArrowRight style={{ color: accentColor }} size={20} />
                <div className="border-l border-black/20 pl-4 text-lg">Filler work</div>
              </div>
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <ArrowRight style={{ color: accentColor }} size={20} />
                <div className="border-l border-black/20 pl-4 text-lg">Preserving premium-model quota</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4">
            <div className="w-1 h-12 shrink-0" style={{ backgroundColor: accentColor }}></div>
            <p className="text-xl font-medium leading-snug">
              Useful when you don't need<br />
              your strongest model.
            </p>
          </div>
        </SlideContainer>
      </div>
    </div>
  );
}
