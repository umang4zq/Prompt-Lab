"use client";

import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { getPublicCompositions } from "../../lib/supabase/queries/build";
import CopyButton from "../../components/gallery/CopyButton";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

import Navbar from "../../components/hero/Navbar";

export default function GalleryPage() {
  const [compositions, setCompositions] = useState<{ id: string; title: string; created_at: string; edited_prompt?: string; generated_prompt?: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<{ id: string; title: string; created_at: string; edited_prompt?: string; generated_prompt?: string; } | null>(null);

  useEffect(() => {
    getPublicCompositions().then(data => {
      setCompositions(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen dark:bg-black bg-[#f8f9fa] dark:text-white text-gray-900 flex flex-col relative overflow-y-auto transition-colors duration-300 font-sans selection:bg-black/10 dark:selection:bg-white/20">
      
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] w-[600px] sm:w-[800px] h-[500px] rounded-full bg-black/5 dark:bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] w-[400px] sm:w-[600px] h-[600px] rounded-full bg-black/5 dark:bg-white/5 blur-[120px]" />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>
      
      <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 w-full">
        <Toaster theme="dark" position="bottom-right" />
      
        <div className="w-full max-w-7xl pt-16 sm:pt-24 pb-12 animate-blur-fade-up" style={{ animationDuration: '800ms' }}>
          
          {/* Header Section */}
          <div className="text-center mb-16 sm:mb-24 relative">
            <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl mb-8 transform transition-transform hover:scale-105">
              <LayoutGrid size={32} className="text-black/80 dark:text-white/90" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-[-0.03em] mb-6 dark:text-white text-black drop-shadow-sm">
              Community Gallery
            </h1>
            <p className="text-lg md:text-xl dark:text-gray-400 text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Discover incredible prompt compositions built by our users.
            </p>
            <div className="mt-10">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 dark:bg-white/10 bg-black/5 dark:hover:bg-white/20 hover:bg-black/10 dark:text-white text-black px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md"
              >
                <ArrowLeft size={18} />
                Return Home
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full px-2 sm:px-0">
              {compositions.map((comp, idx) => (
                <div 
                  key={comp.id} 
                  className="group relative bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden animate-blur-fade-up" 
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                  onClick={() => setSelectedPrompt(comp)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 dark:from-white/0 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <h3 className="relative z-10 font-medium dark:text-white text-black mb-2 text-xl truncate tracking-wide">{comp.title}</h3>
                  <p className="relative z-10 text-xs text-black/40 dark:text-white/40 mb-6 font-mono tracking-wider uppercase">{new Date(comp.created_at).toLocaleDateString()}</p>
                  
                  <div className="relative z-10 flex-1 dark:bg-black/40 bg-black/5 rounded-2xl p-5 overflow-hidden border border-black/5 dark:border-white/5 group-hover:border-black/10 dark:group-hover:border-white/10 transition-colors">
                    <p className="text-sm dark:text-gray-300 text-gray-700 font-mono line-clamp-6 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {comp.edited_prompt || comp.generated_prompt}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-16 dark:bg-gradient-to-t dark:from-[#0a0a0a] dark:to-transparent bg-gradient-to-t from-[#f1f2f3] to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="relative z-10 mt-6 flex items-center justify-between">
                    <Link href={`/build?fork=${comp.id}`} className="text-sm font-medium dark:text-white text-black opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      Fork Prompt <span className="text-lg leading-none ml-1">&rarr;</span>
                    </Link>
                    <div onClick={e => e.stopPropagation()} className="dark:bg-white/10 bg-black/5 rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                      <CopyButton text={comp.edited_prompt || comp.generated_prompt || ""} />
                    </div>
                  </div>
                </div>
              ))}

              {compositions.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-black/50 dark:text-white/50 py-24 bg-white/20 dark:bg-white/5 rounded-[3rem] backdrop-blur-md border border-black/5 dark:border-white/5">
                  <LayoutGrid size={48} className="mb-4 opacity-20" />
                  <p className="text-xl font-light">No public compositions yet.</p>
                  <p className="text-sm mt-2 opacity-60">Be the first to publish one!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cinematic Modal */}
        {selectedPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-all duration-300" onClick={() => setSelectedPrompt(null)}>
            <div 
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-blur-fade-up"
              style={{ animationDuration: "400ms" }}
              onClick={e => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-black/5 dark:border-white/5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-medium dark:text-white text-black tracking-tight">{selectedPrompt.title}</h2>
                  <p className="text-sm text-black/40 dark:text-white/40 font-mono mt-2 tracking-wider uppercase">{new Date(selectedPrompt.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedPrompt(null)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 dark:bg-black/30 bg-black/5 custom-scrollbar">
                <pre className="text-sm sm:text-base dark:text-gray-300 text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">
                  {selectedPrompt.edited_prompt || selectedPrompt.generated_prompt}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50">
                <Link href={`/build?fork=${selectedPrompt.id}`} className="w-full sm:w-auto px-8 py-4 rounded-full dark:bg-white bg-black dark:text-black text-white font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg">
                  Fork this Prompt <span className="text-lg leading-none">&rarr;</span>
                </Link>
                <div className="p-3 rounded-full dark:bg-white/10 bg-black/5 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer w-full sm:w-auto flex justify-center">
                   <CopyButton text={selectedPrompt.edited_prompt || selectedPrompt.generated_prompt || ""} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
