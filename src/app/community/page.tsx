import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl pt-24 pb-12 animate-blur-fade-up">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <Users size={32} className="text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Community</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of builders creating the future of AI prompt engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-[#5865F2]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#5865F2] font-bold text-xl">#</span>
            </div>
            <h3 className="font-semibold text-white mb-2 text-lg">Discord</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Chat live with the community, get help, and share your pipelines.</p>
            <button className="text-sm font-medium bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2.5 rounded-full transition-colors w-full">Join Server</button>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <h3 className="font-semibold text-white mb-2 text-lg">X / Twitter</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Follow us for platform updates, tips, and community highlights.</p>
            <button className="text-sm font-medium bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full transition-colors w-full">Follow @PromptLab</button>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">{`<>`}</span>
            </div>
            <h3 className="font-semibold text-white mb-2 text-lg">GitHub</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Contribute to our open source projects and track development.</p>
            <button className="text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full transition-colors w-full">View Repo</button>
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
