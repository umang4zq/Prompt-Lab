import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { getPublicCompositions } from "../../lib/supabase/queries/build";

export const revalidate = 0; // Disable static rendering since it fetches DB

export default async function GalleryPage() {
  const compositions = await getPublicCompositions();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 relative overflow-y-auto">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#22D3B8]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl pt-24 pb-12 animate-blur-fade-up">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <LayoutGrid size={32} className="text-[#22D3B8]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Community Gallery</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover incredible prompt compositions built by our users.
          </p>
          <div className="mt-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Return Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {compositions.map((comp: { id: string; title: string; created_at: string; edited_prompt?: string; generated_prompt?: string; }) => (
            <div key={comp.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col">
              <h3 className="font-semibold text-white mb-2 text-lg truncate">{comp.title}</h3>
              <p className="text-xs text-gray-500 mb-4 font-mono">{new Date(comp.created_at).toLocaleDateString()}</p>
              <div className="flex-1 bg-black/40 rounded-xl p-4 overflow-hidden relative">
                <p className="text-sm text-gray-400 font-mono line-clamp-6 leading-relaxed">
                  {comp.edited_prompt || comp.generated_prompt}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link href={`/build?fork=${comp.id}`} className="text-sm font-medium text-[#22D3B8] hover:underline">
                  Fork Prompt &rarr;
                </Link>
              </div>
            </div>
          ))}

          {compositions.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No public compositions yet. Be the first to publish one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
