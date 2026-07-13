"use client";

import type { Pill } from "../../lib/prompt/generate";

// Very basic mapping for demo, usually you'd have an icon component mapping or use a library
import { Box, Code, Database, Layout, Sparkles } from "lucide-react";

interface PillChipProps {
  pill: Pill;
  selected: boolean;
  onClick: () => void;
}

export default function PillChip({ pill, selected, onClick }: PillChipProps) {
  // Simple icon fallback mapper
  const IconComponent = () => {
    switch(pill.icon) {
      case "code": return <Code size={16} />;
      case "database": return <Database size={16} />;
      case "layout": return <Layout size={16} />;
      case "sparkles": return <Sparkles size={16} />;
      default: return <Box size={16} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150
        ${selected ? 'border' : 'liquid-glass border border-transparent'}
        dark:text-white text-black
      `}
      style={{
        backgroundColor: selected ? `${pill.color}26` : undefined, // ~15% opacity (26 in hex is ~15%)
        borderColor: selected ? pill.color : undefined,
        boxShadow: selected ? `0 0 12px ${pill.color}40` : undefined,
      }}
    >
      <IconComponent />
      {pill.label}
    </button>
  );
}
