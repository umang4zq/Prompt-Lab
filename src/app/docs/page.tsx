import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C5CE7]/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl pt-24 pb-12 animate-blur-fade-up">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <BookOpen size={32} className="text-[#6C5CE7]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Documentation</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to build, compose, and deploy AI pipelines with Prompt-Lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Learn how to use the visual builder to compose your first complex prompt pipeline, select models, and publish to the gallery.</p>
            <div className="text-[#6C5CE7] text-sm font-medium hover:underline cursor-pointer">Read Guide &rarr;</div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-3">Prompt Patterns</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Discover advanced composition patterns, chain-of-thought structuring, and few-shot examples for robust outputs.</p>
            <div className="text-[#6C5CE7] text-sm font-medium hover:underline cursor-pointer">Explore Patterns &rarr;</div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-3">API Reference</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Integrate Prompt-Lab directly into your application backend using our REST API to fetch published prompts dynamically.</p>
            <div className="text-[#6C5CE7] text-sm font-medium hover:underline cursor-pointer">View API &rarr;</div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-3">Best Practices</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Tips, tricks, and formatting standards for getting the most reliable and highest quality outputs from LLMs.</p>
            <div className="text-[#6C5CE7] text-sm font-medium hover:underline cursor-pointer">Read Best Practices &rarr;</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
