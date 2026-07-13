"use client";

import React from "react";

export default function Placeholder({ _isPreview = false }: { _isPreview?: boolean }) {
  return (
    <div className="w-full h-full min-h-screen bg-[#060606] flex items-center justify-center text-white font-sans overflow-hidden">
      <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Coming Soon</h2>
        <p className="text-gray-400 max-w-md">This template is currently under development and will be available in the next release.</p>
      </div>
    </div>
  );
}
