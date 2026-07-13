"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFeaturedCompositions } from "../../lib/supabase/queries/hero";
import Link from "next/link";

export default function FeaturedCarousel() {
  const [compositions, setCompositions] = useState<{id: string, title: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getFeaturedCompositions().then(data => {
      if (mounted && data) {
        setCompositions(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (compositions.length < 2) return null;

  const currentFeatured = compositions[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % compositions.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? compositions.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col items-start md:items-end gap-3 w-full max-w-xs md:max-w-none">
      <Link 
        href={`/gallery/${currentFeatured.id}`}
        className="liquid-glass text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors animate-blur-fade-up opacity-0 text-center line-clamp-1"
        style={{ animationDelay: "750ms" }}
      >
        Featured: <span className="text-gray-300">{currentFeatured.title}</span>
      </Link>
      <div className="flex items-center gap-3">
        <button 
          onClick={handlePrev}
          className="flex items-center justify-center rounded-full liquid-glass px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-white/5 transition-colors animate-blur-fade-up opacity-0"
          style={{ animationDelay: "800ms" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={handleNext}
          className="flex items-center justify-center rounded-full liquid-glass px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-white/5 transition-colors animate-blur-fade-up opacity-0"
          style={{ animationDelay: "900ms" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
