"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening the template fullscreen
    if (!textToCopy) return;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#141414]/85 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 text-xs text-white font-medium hover:bg-white/10 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
