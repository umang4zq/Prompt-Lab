"use client";

const logos = [
  { name: "Next.js", color: "white" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Tailwind CSS", color: "#38B2AC" },
  { name: "Framer Motion", color: "#EC4899" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "NVIDIA NIM", color: "#76B900" },
];

export default function LogoTicker() {
  // Repeat 4 times for seamless loop
  const tickerItems = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-10 relative opacity-0 animate-[fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.6s_forwards]"
         style={{
           maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
           WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
         }}>
      <div className="flex gap-[64px] w-max animate-ticker">
        {tickerItems.map((logo, i) => (
          <div 
            key={i}
            className="flex items-center justify-center w-[137px] h-[40px] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <span 
              className="text-xl font-bold tracking-tight whitespace-nowrap"
              style={{ color: logo.color }}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
