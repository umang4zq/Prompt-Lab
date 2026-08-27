"use client";

import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { getPublicCompositions } from "../../lib/supabase/queries/build";
import CopyButton from "../../components/gallery/CopyButton";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen dark:bg-black bg-gray-50 dark:text-white text-gray-900 flex flex-col items-center p-6 relative overflow-y-auto transition-colors duration-200">
      <Toaster theme="dark" position="bottom-right" />
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#22D3B8]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl pt-24 pb-12 animate-blur-fade-up">
        <div className="text-center mb-16">
          <div className="w-16 h-16 dark:bg-white/5 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border dark:border-white/10 border-black/10">
            <LayoutGrid size={32} className="text-[#22D3B8]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white text-gray-900">Community Gallery</h1>
          <p className="dark:text-gray-400 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover incredible prompt compositions built by our users.
          </p>
          <div className="mt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 dark:bg-white/10 bg-black/10 dark:hover:bg-white/20 hover:bg-black/20 dark:text-white text-gray-900 px-6 py-3 rounded-full font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Return Home
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-2 border-[#22D3B8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {compositions.map((comp) => (
              <div key={comp.id} className="dark:bg-white/5 bg-white p-6 rounded-2xl border dark:border-white/10 border-gray-200 dark:hover:border-white/20 hover:border-gray-300 shadow-sm transition-all flex flex-col cursor-pointer" onClick={() => setSelectedPrompt(comp)}>
                <h3 className="font-semibold dark:text-white text-gray-900 mb-2 text-lg truncate">{comp.title}</h3>
                <p className="text-xs text-gray-500 mb-4 font-mono">{new Date(comp.created_at).toLocaleDateString()}</p>
                <div className="flex-1 dark:bg-black/40 bg-gray-100 rounded-xl p-4 overflow-hidden relative">
                  <p className="text-sm dark:text-gray-400 text-gray-700 font-mono line-clamp-6 leading-relaxed">
                    {comp.edited_prompt || comp.generated_prompt}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-12 dark:bg-gradient-to-t dark:from-black/90 dark:to-transparent bg-gradient-to-t from-gray-100/90 to-transparent pointer-events-none" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link href={`/build?fork=${comp.id}`} className="text-sm font-medium text-[#22D3B8] hover:underline" onClick={e => e.stopPropagation()}>
                    Fork Prompt &rarr;
                  </Link>
                  <div onClick={e => e.stopPropagation()}>
                    <CopyButton text={comp.edited_prompt || comp.generated_prompt || ""} />
                  </div>
                </div>
              </div>
            ))}

            {compositions.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">
                No public compositions yet. Be the first to publish one!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Read-Only Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPrompt(null)}>
          <div 
            className="dark:bg-[#0a0a0a] bg-white border dark:border-white/10 border-gray-200 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b dark:border-white/10 border-gray-200">
              <div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">{selectedPrompt.title}</h2>
                <p className="text-sm text-gray-500 font-mono mt-1">{new Date(selectedPrompt.created_at).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 dark:bg-black/50 bg-gray-50">
              <pre className="text-sm dark:text-gray-300 text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedPrompt.edited_prompt || selectedPrompt.generated_prompt}
              </pre>
            </div>
            <div className="flex items-center justify-between p-6 border-t dark:border-white/10 border-gray-200 dark:bg-[#0a0a0a] bg-white">
              <Link href={`/build?fork=${selectedPrompt.id}`} className="text-sm font-medium text-[#22D3B8] hover:underline flex items-center gap-2">
                Fork this Prompt &rarr;
              </Link>
              <CopyButton text={selectedPrompt.edited_prompt || selectedPrompt.generated_prompt || ""} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
