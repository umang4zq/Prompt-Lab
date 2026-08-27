import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen dark:bg-black bg-gray-50 dark:text-white text-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-200">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl pt-24 pb-12 animate-blur-fade-up">
        <div className="text-center mb-12">
          <div className="w-16 h-16 dark:bg-white/5 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border dark:border-white/10 border-black/10">
            <Users size={32} className="text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight dark:text-white text-gray-900">Community</h1>
          <p className="dark:text-gray-400 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of builders creating the future of AI prompt engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="dark:bg-white/5 bg-white p-6 rounded-2xl border dark:border-white/10 border-gray-200 shadow-sm flex flex-col items-center text-center dark:hover:bg-white/10 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-[#5865F2]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#5865F2] font-bold text-xl">#</span>
            </div>
            <h3 className="font-semibold dark:text-white text-gray-900 mb-2 text-lg">Discord</h3>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-6 flex-1">Chat live with the community, get help, and share your pipelines.</p>
            <button className="text-sm font-medium bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2.5 rounded-full transition-colors w-full">Join Server</button>
          </div>
          
          <div className="dark:bg-white/5 bg-white p-6 rounded-2xl border dark:border-white/10 border-gray-200 shadow-sm flex flex-col items-center text-center dark:hover:bg-white/10 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 dark:bg-white/10 bg-black/10 rounded-full flex items-center justify-center mb-4">
              <span className="dark:text-white text-gray-900 font-bold text-xl">X</span>
            </div>
            <h3 className="font-semibold dark:text-white text-gray-900 mb-2 text-lg">X / Twitter</h3>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-6 flex-1">Follow us for platform updates, tips, and community highlights.</p>
            <button className="text-sm font-medium dark:bg-white bg-black dark:text-black text-white hover:opacity-90 px-6 py-2.5 rounded-full transition-colors w-full">Follow @PromptLab</button>
          </div>

          <div className="dark:bg-white/5 bg-white p-6 rounded-2xl border dark:border-white/10 border-gray-200 shadow-sm flex flex-col items-center text-center dark:hover:bg-white/10 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 dark:bg-gray-800 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="dark:text-white text-gray-900 font-bold text-xl">{`<>`}</span>
            </div>
            <h3 className="font-semibold dark:text-white text-gray-900 mb-2 text-lg">GitHub</h3>
            <p className="text-sm dark:text-gray-400 text-gray-600 mb-6 flex-1">Contribute to our open source projects and track development.</p>
            <button className="text-sm font-medium dark:bg-gray-700 bg-gray-800 hover:bg-gray-600 text-white px-6 py-2.5 rounded-full transition-colors w-full">View Repo</button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 dark:bg-white bg-black dark:text-black text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-colors"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
