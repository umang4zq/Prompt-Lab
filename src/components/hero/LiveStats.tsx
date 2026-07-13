"use client";

import { useEffect, useState } from "react";
import { Sparkles, Users, Clock } from "lucide-react";
import { getLiveStats } from "../../lib/supabase/queries/hero";
import { HERO_CONTENT } from "../../lib/constants/heroContent";

export default function LiveStats() {
  const [stats, setStats] = useState(HERO_CONTENT.statsFallback);

  useEffect(() => {
    let mounted = true;
    getLiveStats().then(res => {
      if (mounted) setStats(res);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm animate-blur-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-1.5 font-medium">
        <Sparkles size={16} className="text-brand-teal sm:w-5 sm:h-5" />
        {stats.pills} stack pills
      </div>
      <div className="flex items-center gap-1.5 font-medium">
        <Users size={16} className="text-brand-teal sm:w-5 sm:h-5" />
        {stats.users} builders
      </div>
      <div className="flex items-center gap-1.5 font-medium">
        <Clock size={16} className="text-gray-400 sm:w-5 sm:h-5" />
        {stats.time}
      </div>
    </div>
  );
}
