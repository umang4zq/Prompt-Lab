"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import SwipeToBuild from "../../components/hero/SwipeToBuild";
import WhyPromptLab from "../../components/marketing/WhyPromptLab";
import Navbar from "../../components/hero/Navbar";
import { useTheme } from "../../lib/theme/ThemeContext";
import SphereGallery from "../../components/hero/SphereGallery";
import { Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10, Slide11, Slide12 } from "../ai-skills/page";

export default function CinematicHero() {
  const { isDarkMode } = useTheme();

  const navLinks = [
    { name: "Build", href: "/build" },
    { name: "Templates", href: "/templates" },
    { name: "Gallery", href: "/gallery" },
  ];

  const galleryItems = [
    <Slide1 key="1" bgColor="#F7F5EC" accentColor="#2F50FD" />,
    <Slide2 key="2" bgColor="#F7F5EC" accentColor="#2F50FD" />,
    <Slide3 key="3" bgColor="#F7F5EC" accentColor="#FF3B30" />,
    <Slide4 key="4" bgColor="#F7F5EC" accentColor="#FF3B30" />,
    <Slide5 key="5" bgColor="#F7F5EC" accentColor="#FF9500" />,
    <Slide6 key="6" bgColor="#F7F5EC" accentColor="#FF9500" />,
    <Slide7 key="7" bgColor="#F7F5EC" accentColor="#34C759" />,
    <Slide8 key="8" bgColor="#F7F5EC" accentColor="#34C759" />,
    <Slide9 key="9" bgColor="#F7F5EC" accentColor="#9C27B0" />,
    <Slide10 key="10" bgColor="#F7F5EC" accentColor="#9C27B0" />,
    <Slide11 key="11" bgColor="#F7F5EC" accentColor="#10B981" />,
    <Slide12 key="12" bgColor="#F7F5EC" accentColor="#10B981" />
  ];

  return (
    <div className="relative w-full font-sans dark:bg-black bg-white dark:text-white text-black">
      <main className="sticky top-0 h-screen w-full overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <SphereGallery items={galleryItems} title="" />
        </div>

      {/* Bottom Blur Overlay */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none backdrop-blur-sm"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col pointer-events-none">
        
        <div className="pointer-events-auto">
          <Navbar />
        </div>

        {/* Hero Content (Center) */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pb-8 md:pb-16 z-10">
          <div className="flex flex-col items-center max-w-4xl mx-auto w-full text-center mt-32">
            
            {/* Title */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.04em] mb-4 md:mb-6 animate-blur-fade-up opacity-0 pointer-events-auto"
              style={{ animationDelay: "400ms" }}
            >
              Design with Intelligence.
            </h1>

            {/* Description */}
            <p 
              className="text-base sm:text-lg md:text-xl max-w-2xl mb-8 md:mb-12 animate-blur-fade-up opacity-0 dark:text-gray-300 text-gray-700 pointer-events-auto"
              style={{ animationDelay: "500ms" }}
            >
              Create, compose, and deploy powerful prompt engineering pipelines with the industry&apos;s most advanced visual builder.
            </p>

            {/* Buttons */}
            <div className="flex justify-center w-full pointer-events-auto">
              <SwipeToBuild />
            </div>

          </div>
        </div>
      </div>
      </main>
      <WhyPromptLab />
    </div>
  );
}
