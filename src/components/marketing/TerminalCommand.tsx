"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export default function TerminalCommand() {
  const [copied, setCopied] = useState(false);
  const command = "npx -y prompt-lab-mcp";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center my-10 w-full px-4">
      {/* Outer wrapper with padding and border */}
      <div className="p-[2px] rounded-xl bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] shadow-2xl w-full max-w-2xl md:max-w-3xl">
        <div className="bg-[#1e1e1e] rounded-xl border border-[#333333] w-full overflow-hidden flex flex-col font-mono shadow-inner">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#252526] border-b border-[#333333]">
            <div className="flex items-center gap-3 text-[#cccccc] font-medium text-base">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-transparent border border-[#007acc] text-[#007acc] font-bold text-xs leading-none">
                {">_"}
              </div>
              Terminal
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center p-2 rounded-md border border-[#444444] hover:bg-[#333333] transition-colors text-[#cccccc]"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 bg-[#000000] text-left text-base md:text-lg leading-relaxed overflow-x-auto whitespace-nowrap">
            <span className="text-[#666666] mr-3">-</span>
            <span className="text-[#c586c0]">npx</span>
            <span className="text-white ml-2">-y prompt-lab-mcp</span>
            <span className="inline-block w-2.5 h-5 ml-1.5 bg-[#c586c0] animate-pulse align-middle"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
