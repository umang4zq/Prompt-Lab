"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import SwipeToBuild from "../../components/hero/SwipeToBuild";
import WhyPromptLab from "../../components/marketing/WhyPromptLab";
import Navbar from "../../components/hero/Navbar";
import { useTheme } from "../../lib/theme/ThemeContext";

export default function CinematicHero() {
  const { isDarkMode } = useTheme();

  const navLinks = [
    { name: "Build", href: "/build" },
    { name: "Templates", href: "/templates" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <div className="relative w-full font-sans dark:bg-black bg-white dark:text-white text-black">
      <main className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_075403_bdde66c3-c5ad-41ac-ba8f-6a0bc4545c3f.mp4"
      />

      {/* Bottom Blur Overlay */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, transparent 45%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 45%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        
        <Navbar />

        {/* Hero Content (Center) */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pb-8 md:pb-16 z-10">
          <div className="flex flex-col items-center max-w-4xl mx-auto w-full text-center mt-32">
            
            {/* Title */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[-0.04em] mb-4 md:mb-6 animate-blur-fade-up opacity-0"
              style={{ animationDelay: "400ms" }}
            >
              Design with Intelligence.
            </h1>

            {/* Description */}
            <p 
              className="text-base sm:text-lg md:text-xl max-w-2xl mb-8 md:mb-12 animate-blur-fade-up opacity-0 dark:text-gray-300 text-gray-700"
              style={{ animationDelay: "500ms" }}
            >
              Create, compose, and deploy powerful prompt engineering pipelines with the industry&apos;s most advanced visual builder.
            </p>

            {/* Buttons */}
            <div className="flex justify-center w-full">
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
