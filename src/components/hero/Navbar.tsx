/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { User, Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { HERO_CONTENT } from "../../lib/constants/heroContent";
import { supabase } from "../../lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useTheme } from "../../lib/theme/ThemeContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (session) {
      setUserDropdownOpen(!userDropdownOpen);
    } else {
      await supabase.auth.signInWithPassword({
        email: 'demo@prompt-lab.com',
        password: 'password123'
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserDropdownOpen(false);
  };

  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
        {/* Left: Logo */}
        <div 
          className="text-2xl font-bold tracking-wider h-8 md:h-10 flex items-center animate-blur-fade-up opacity-0"
          style={{ animationDelay: "0ms" }}
        >
          {HERO_CONTENT.logo}
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {HERO_CONTENT.navLinks.map((link, i) => (
            <Link 
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors animate-blur-fade-up opacity-0 dark:hover:text-gray-300 hover:text-gray-600 text-black dark:text-white"
              style={{ animationDelay: `${100 + (i * 50)}ms` }}
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3">


          {/* User Profile Button */}
          <div className="relative animate-blur-fade-up opacity-0 hidden sm:block" style={{ animationDelay: "350ms" }}>
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full liquid-glass transition-colors dark:hover:bg-white/5 hover:bg-black/5 dark:text-white text-black"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={handleAuthClick}
              className="flex items-center justify-center w-10 h-10 rounded-full liquid-glass overflow-hidden transition-colors dark:hover:bg-white/5 hover:bg-black/5 dark:text-white text-black"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </button>
            
            {/* User Dropdown */}
            {userDropdownOpen && session && (
              <div className="absolute right-0 mt-2 w-48 border rounded-xl shadow-xl py-2 overflow-hidden z-50 dark:bg-gray-900 dark:border-gray-800 bg-white border-gray-200">
                <Link href="/my-compositions" className="block px-4 py-2 text-sm transition-colors dark:hover:bg-gray-800 dark:text-white hover:bg-gray-100 text-black">
                  My Compositions
                </Link>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 transition-colors flex items-center gap-2 dark:hover:bg-gray-800 hover:bg-gray-100">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu (below lg) */}
          <button 
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full liquid-glass animate-blur-fade-up opacity-0 relative transition-colors dark:hover:bg-white/5 hover:bg-black/5 dark:text-white text-black"
            style={{ animationDelay: "300ms" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={18} className={`absolute transition-all duration-500 ease-out ${mobileMenuOpen ? "rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
            <X size={18} className={`absolute transition-all duration-500 ease-out ${!mobileMenuOpen ? "-rotate-180 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu (z-index 40) */}
      <div 
        className="absolute top-[72px] left-0 w-full z-40 backdrop-blur-lg border-t border-b shadow-2xl transition-all duration-500 ease-out flex flex-col pointer-events-none dark:bg-gray-900/95 dark:border-gray-800 bg-white/95 border-gray-200"
        aria-hidden={!mobileMenuOpen}
        style={{
          transform: mobileMenuOpen ? "translateY(0)" : "translateY(-1rem)",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          visibility: mobileMenuOpen ? "visible" : "hidden"
        }}
      >
        <div className="flex flex-col p-4">
          {HERO_CONTENT.navLinks.map((link, i) => (
            <Link 
              key={link}
              href={`/${link.toLowerCase()}`}
              className="py-3 px-3 text-sm font-medium rounded-lg transition-all duration-500 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 dark:text-white text-black"
              style={{
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-1rem)",
                opacity: mobileMenuOpen ? 1 : 0,
                transitionDelay: `${i * 50}ms`
              }}
            >
              {link}
            </Link>
          ))}
          
          <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-800 border-gray-200">

            <div className="flex gap-2">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full liquid-glass transition-colors dark:hover:bg-white/5 hover:bg-black/5 dark:text-white text-black"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={handleAuthClick} className="flex items-center justify-center w-10 h-10 rounded-full liquid-glass overflow-hidden transition-colors dark:hover:bg-white/5 hover:bg-black/5 dark:text-white text-black">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
