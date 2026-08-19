"use client";

import { useState } from "react";
import { ChevronDown, Copy, X } from "lucide-react";
import Navbar from "@/components/hero/Navbar"; // Assume we can use the existing Navbar
import PrmptArchive from "@/components/templates/PrmptArchive";
import Marketeam from "@/components/templates/Marketeam";
import ViktorStudio from "@/components/templates/ViktorStudio";
import OrbitSecureSystem from "@/components/templates/OrbitSecureSystem";
import Placeholder from "@/components/templates/Placeholder";
import CopyButton from "@/components/CopyButton";
import Vantage from "@/components/templates/Vantage";
import SecurityLayer from "@/components/templates/SecurityLayer";
import SPD from "@/components/templates/SPD";
import JWTBankCarousel from "@/components/templates/JWTBankCarousel";
import promptsExtra from "@/data/prompts-extra.json";
import { 
  promptOrbitSecureSystem,
  promptPrmptArchive,
  promptMarketeam,
  promptViktorStudio,
  promptApogee
} from "@/data/prompts";
import Apogee from "@/components/templates/Apogee";

const TEMPLATES = [
  {
    id: "prmpt-archive",
    title: "Prmpt Archive",
    category: "Scroll Landing",
    Component: PrmptArchive,
    prompt: promptPrmptArchive,
  },
  {
    id: "marketeam",
    title: "Marketeam",
    category: "Landing Page",
    Component: Marketeam,
    prompt: promptMarketeam,
  },
  {
    id: "viktor-studio",
    title: "Viktor Studio",
    category: "Portfolio Hero",
    Component: ViktorStudio,
    prompt: promptViktorStudio,
  },
  {
    id: "orbit-secure-system",
    title: "Orbit Secure System",
    category: "Secure System",
    Component: OrbitSecureSystem,
    prompt: promptOrbitSecureSystem,
  },
  {
    id: "placeholder",
    title: "Upcoming Template",
    category: "TBD",
    Component: Placeholder,
  },
  {
    id: "apogee",
    title: "Apogee",
    category: "Hero Section",
    Component: Apogee,
    prompt: promptApogee,
  },
  {
    id: "vantage",
    title: "Vantage",
    category: "Landing Page",
    Component: Vantage,
    prompt: promptsExtra.vantage,
  },
  {
    id: "security-layer",
    title: "Security Layer",
    category: "Cybersecurity",
    Component: SecurityLayer,
    prompt: promptsExtra.securityLayer,
  },
  {
    id: "spd",
    title: "S.P.D",
    category: "Hero Section",
    Component: SPD,
    prompt: promptsExtra.spd,
  },
  {
    id: "jwt-bank-carousel",
    title: "JWT Bank Carousel",
    category: "3D Carousel",
    Component: JWTBankCarousel,
    prompt: promptsExtra.jwtBankCarousel,
  },
];

export default function TemplatesGallery() {
  const [openTemplateId, setOpenTemplateId] = useState<string | null>(null);

  const openTemplate = TEMPLATES.find((t) => t.id === openTemplateId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pb-24 pt-4">
        {/* Top Toolbar */}
        <div className="flex justify-between items-center px-[28px] py-[20px] max-w-[1920px] mx-auto">
          <div>
            {/* Pricing removed */}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#d4d4d4] rounded-full px-[14px] py-[8px] text-[13px] hover:bg-[#212121] transition-colors">
              Type <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#d4d4d4] rounded-full px-[14px] py-[8px] text-[13px] hover:bg-[#212121] transition-colors">
              Mixed <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="px-[28px] max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[18px]">
            {TEMPLATES.map((tpl) => (
              <div key={tpl.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => setOpenTemplateId(tpl.id)}>
                {/* Card Container */}
                <div 
                  className="bg-[#141414] border border-[#232323] rounded-[16px] overflow-hidden transition-all duration-300 group-hover:border-[#3a3a3a] group-hover:-translate-y-[2px] relative aspect-[16/10.2]"
                  style={{ containerType: 'inline-size' }}
                >
                  
                  {/* Badge */}
                  {tpl.prompt && <CopyButton textToCopy={tpl.prompt} />}

                  {/* Thumbnail render */}
                  <div className="absolute inset-0 pointer-events-none select-none origin-top-left" aria-hidden="true" style={{ width: '100vw', height: '100vh', transform: 'scale(calc(100cqw / 100vw))' }}>
                    <tpl.Component isPreview={true} />
                  </div>
                </div>

                {/* Meta Row */}
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[15px] font-semibold text-[#f5f5f5]">{tpl.title}</h3>
                  <span className="text-[13px] text-[#8a8a8a]">{tpl.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Fullscreen Overlay */}
      {openTemplate && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto overflow-x-hidden">
          <button 
            onClick={() => setOpenTemplateId(null)}
            className="fixed top-6 right-6 z-[200] flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full px-4 py-2 text-sm hover:bg-black/80 transition-colors"
          >
            <X size={16} /> Close
          </button>
          
          <div className="w-full min-h-screen relative">
             <openTemplate.Component isPreview={false} />
          </div>
        </div>
      )}
    </div>
  );
}
