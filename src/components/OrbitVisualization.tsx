"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

const chipData = [
  // Orbit 1: Language (353px)
  { label: "React", orbitIndex: 0, angle: 90, glow: "#6C5CE7", delay: 0.6 },
  { label: "Vue", orbitIndex: 0, angle: 210, glow: "#6C5CE7", delay: 0.9 },
  { label: "Flutter", orbitIndex: 0, angle: 330, glow: "#6C5CE7", delay: 1.2 },
  
  // Orbit 2: Backend (501px)
  { label: "Node.js", orbitIndex: 1, angle: 60, glow: "#22D3B8", delay: 0.7 },
  { label: "FastAPI", orbitIndex: 1, angle: 180, glow: "#22D3B8", delay: 1.0 },
  { label: "Django", orbitIndex: 1, angle: 300, glow: "#22D3B8", delay: 1.3 },
  
  // Orbit 3: Database (649px)
  { label: "Supabase", orbitIndex: 2, angle: 130, glow: "#F5A623", delay: 0.8 },
  { label: "MongoDB", orbitIndex: 2, angle: 250, glow: "#F5A623", delay: 1.1 },
  { label: "PostgreSQL", orbitIndex: 2, angle: 10, glow: "#F5A623", delay: 1.5 },
  
  // Orbit 4: Animation Lib (797px)
  { label: "Framer Motion", orbitIndex: 3, angle: 30, glow: "#EC4899", delay: 1.4 },
  { label: "GSAP", orbitIndex: 3, angle: 150, glow: "#EC4899", delay: 1.7 },
  { label: "Lottie", orbitIndex: 3, angle: 270, glow: "#EC4899", delay: 2.3 },
];

const orbits = [
  { size: 353, animation: "animate-spin-slow" },
  { size: 501, animation: "animate-spin-slow-reverse" },
  { size: 649, animation: "animate-slower-reverse" }, // Wait, tailwind config has spin-slower and spin-slower-reverse
  { size: 797, animation: "animate-slower" },
];

export default function OrbitVisualization() {
  const count = useCountUp(8249, 2000, 1200);

  return (
    <div className="relative w-[300px] h-[300px] md:w-[720px] md:h-[720px] mx-auto scale-40 md:scale-50 lg:scale-70 xl:scale-85 2xl:scale-100 flex items-center justify-center animate-scale-in opacity-0">
      
      {/* Orbits */}
      <div className="absolute inset-0 flex items-center justify-center">
        {orbits.map((orbit, i) => {
          // Let's use custom inline styles for animations if needed or tailwind classes
          // Orbit 1: left (reverse?) 30s
          // Orbit 2: right (normal) 40s
          // Orbit 3: right (normal) 50s
          // Orbit 4: left (reverse) 60s
          // Wait, the prompt says "spins left", "spins right". Left = counter-clockwise (reverse), Right = clockwise (normal).
          // Let's use a simpler mapping.
          const isReverse = i === 0 || i === 3;
          const duration = i === 0 ? "30s" : i === 1 ? "40s" : i === 2 ? "50s" : "60s";
          
          return (
            <div 
              key={i} 
              className={`orbit-ring`}
              style={{
                width: orbit.size,
                height: orbit.size,
                animation: `spin${isReverse ? '-reverse' : ''} ${duration} linear infinite`
              }}
            >
              {chipData.filter(chip => chip.orbitIndex === i).map((chip, j) => {
                // Calculate position on the ring
                // Angle in degrees -> radians
                const angleRad = (chip.angle - 90) * (Math.PI / 180);
                const radius = orbit.size / 2;
                const x = radius * Math.cos(angleRad);
                const y = radius * Math.sin(angleRad);

                return (
                  <motion.div
                    key={j}
                    initial={{ scale: 0.3, rotate: -180, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: chip.delay, duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                  >
                    {/* The counter-rotation to keep the chip upright */}
                    <div 
                      className="chip-counter-rotate flex items-center justify-center bg-[#14102b] text-text-light px-3 py-[12px] rounded-full border border-gray-700/50 whitespace-nowrap text-sm font-medium"
                      style={{
                        animation: `spin${!isReverse ? '-reverse' : ''} ${duration} linear infinite`,
                        boxShadow: `0 0 20px ${chip.glow}`
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: chip.glow, boxShadow: `0 0 8px ${chip.glow}` }}
                      />
                      {chip.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-[#0a0714] w-[180px] h-[180px] rounded-full border border-primary/20 shadow-[0_0_40px_rgba(108,92,231,0.2)] z-10">
        <span className="text-[64px] font-medium text-text-light leading-none mb-2">
          {count.toLocaleString()}
        </span>
        <span className="text-[16px] font-semibold text-text-muted">
          Prompts Built
        </span>
      </div>

    </div>
  );
}
