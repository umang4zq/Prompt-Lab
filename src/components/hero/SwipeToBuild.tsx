"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function SwipeToBuild() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const THUMB_SIZE = 48; // 3rem
  const TRACK_PADDING = 4;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isUnlocking || isBooting) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isUnlocking || isBooting) return;
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const maxDrag = trackRect.width - THUMB_SIZE - TRACK_PADDING * 2;
    
    // Calculate new position based on pointer relative to the track
    let newX = e.clientX - trackRect.left - THUMB_SIZE / 2;
    newX = Math.max(0, Math.min(newX, maxDrag));
    setDragX(newX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const maxDrag = trackRect.width - THUMB_SIZE - TRACK_PADDING * 2;
    const threshold = maxDrag * 0.8;

    if (dragX >= threshold) {
      // Swipe successful
      setDragX(maxDrag);
      setIsUnlocking(true);
      triggerTransition();
    } else {
      // Snap back
      setDragX(0);
    }
  };

  const triggerTransition = () => {
    if (prefersReducedMotion) {
      router.push('/build');
      return;
    }
    setIsBooting(true);
    setTimeout(() => {
      router.push('/build');
    }, 600); // Wait for transition
  };

  return (
    <>
      <div 
        ref={trackRef}
        className="relative flex items-center h-14 w-64 rounded-full overflow-hidden animate-blur-fade-up opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        style={{ 
          animationDelay: "600ms",
          // Liquid glass track styling
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Track Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className="text-sm font-medium text-white/70 transition-opacity duration-300 ml-8 tracking-wide"
            style={{ opacity: dragX > 20 || isUnlocking ? 0 : 1 }}
          >
            Slide to start
          </span>
        </div>

        {/* Thumb */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style={{ 
            left: TRACK_PADDING,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            // Glass orb styling
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.1) 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.6)"
          }}
        >
          <ArrowRight size={18} className="text-gray-900" style={{ filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.8))" }} />
        </div>
      </div>

      {/* Boot Transition Overlay */}
      {isBooting && (
        <div 
          className="fixed inset-0 z-[100] bg-black pointer-events-none"
          style={{
            animation: "slideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <style>{`
            @keyframes slideLeft {
              0% { transform: translateX(100%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
