"use client";

import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import SwipeToBuild from "../../components/hero/SwipeToBuild";
import WhyPromptLab from "../../components/marketing/WhyPromptLab";
import { useTheme } from "../../lib/theme/ThemeContext";

export default function CinematicHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Build", href: "/build" },
    { name: "Templates", href: "/templates" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <div className={`relative w-full font-sans ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <main className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
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
        
        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
          {/* Logo */}
          <div 
            className="text-2xl font-bold tracking-wider h-8 md:h-10 flex items-center animate-blur-fade-up opacity-0"
            style={{ animationDelay: "0ms" }}
          >
            PROMPT-LAB
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors animate-blur-fade-up opacity-0 ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                style={{ animationDelay: `${100 + (i * 50)}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">

            <button 
              onClick={toggleTheme}
              className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full liquid-glass animate-blur-fade-up opacity-0 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              style={{ animationDelay: "380ms" }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>


            
            {/* Hamburger */}
            <button 
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full liquid-glass animate-blur-fade-up opacity-0 relative transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              style={{ animationDelay: "350ms" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={18} className={`absolute transition-all duration-500 ease-out ${mobileMenuOpen ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
              <X size={18} className={`absolute transition-all duration-500 ease-out ${!mobileMenuOpen ? "-rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div 
          className={`absolute top-[72px] left-0 w-full z-40 backdrop-blur-lg border-t border-b shadow-2xl transition-all duration-500 ease-out flex flex-col ${mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"} ${isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'}`}
        >
          <div className="flex flex-col p-4">
            {navLinks.map((link, i) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`py-3 px-3 text-sm font-medium rounded-lg transition-all duration-500 ${mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"} ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'}`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            <div className={`sm:hidden flex items-center justify-between mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>

              <button 
                onClick={toggleTheme}
                className={`flex items-center justify-center w-10 h-10 rounded-full liquid-glass transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>


            </div>
          </div>
        </div>

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
              className={`text-base sm:text-lg md:text-xl max-w-2xl mb-8 md:mb-12 animate-blur-fade-up opacity-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
