"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Toaster, toast } from "sonner";
import { Code2 } from "lucide-react";

import Navbar from "../../components/hero/Navbar";
import CategorySidebar from "../../components/build/CategorySidebar";
import PillGrid from "../../components/build/PillGrid";
import PromptPreview from "../../components/build/PromptPreview";

import { getCategories, getPills, saveComposition, getCompositionById } from "../../lib/supabase/queries/build";
import { generatePrompt, type Category, type Pill, type Selections } from "../../lib/prompt/generate";
import { BUILD_CONTENT } from "../../lib/constants/buildContent";
import { supabase } from "../../lib/supabase/client";

function BuildPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forkId = searchParams?.get("fork");

  const { data: categories = [], isLoading: catsLoading } = useSWR<Category[]>('categories', getCategories, { revalidateOnFocus: false, dedupingInterval: 60000 });
  const { data: pills = [], isLoading: pillsLoading } = useSWR<Pill[]>('pills', getPills, { revalidateOnFocus: false, dedupingInterval: 60000 });

  const [selections, setSelections] = useState<Selections>({});
  const [customExtras, setCustomExtras] = useState("");
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [forkOf, setForkOf] = useState<string | null>(null);
  
  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{ categorySlug: string; pillId: string; selectionType: 'single' | 'multi' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from sessionStorage if available
    const saved = sessionStorage.getItem('prompt-builder-state');
    if (saved && !forkId) {
      try {
        const state = JSON.parse(saved);
        setSelections(state.selections || {});
        setCustomExtras(state.customExtras || "");
        setEditedPrompt(state.editedPrompt || null);
        setTitle(state.title || "");
      } catch {}
    }
  }, [forkId]);

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('prompt-builder-state', JSON.stringify({
        selections, customExtras, editedPrompt, title
      }));
    }
  }, [selections, customExtras, editedPrompt, title, mounted]);

  useEffect(() => {
    if (forkId) {
      getCompositionById(forkId).then(data => {
        if (data) {
          setSelections(data.selections || {});
          setTitle(`${data.title} (fork)`);
          setForkOf(forkId);
        }
      }).catch(() => {
        toast.error("Failed to load forked prompt");
      });
    }
  }, [forkId]);

  // Set first category as active initially
  useEffect(() => {
    if (categories.length > 0 && !activeCategorySlug) {
      setActiveCategorySlug(categories[0].slug);
    }
  }, [categories, activeCategorySlug]);

  const generatedPrompt = useMemo(() => {
    return generatePrompt(selections, categories, pills, customExtras);
  }, [selections, categories, pills, customExtras]);

  const applyToggle = (categorySlug: string, pillId: string, selectionType: 'single' | 'multi') => {
    setSelections(prev => {
      const current = prev[categorySlug] || [];
      const isSelected = current.includes(pillId);
      let next = [...current];

      if (selectionType === 'single') {
        next = isSelected ? [] : [pillId];
      } else {
        if (isSelected) next = next.filter(id => id !== pillId);
        else next.push(pillId);
      }

      return { ...prev, [categorySlug]: next };
    });
  };

  const handleToggle = useCallback((categorySlug: string, pillId: string, selectionType: 'single' | 'multi') => {
    if (editedPrompt !== null && editedPrompt !== generatedPrompt) {
      setPendingSelection({ categorySlug, pillId, selectionType });
      setShowOverrideWarning(true);
    } else {
      applyToggle(categorySlug, pillId, selectionType);
    }
  }, [editedPrompt, generatedPrompt]);

  const handleOverrideDecision = (update: boolean) => {
    if (update) {
      setEditedPrompt(null);
      if (pendingSelection) {
        applyToggle(pendingSelection.categorySlug, pendingSelection.pillId, pendingSelection.selectionType);
      }
    }
    setShowOverrideWarning(false);
    setPendingSelection(null);
  };

  const handleSave = async (isPublic: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Authenticating demo user...");
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'demo@prompt-lab.com',
        password: 'password123'
      });
      
      if (authError) {
        toast.error("Failed to authenticate.");
        return;
      }
    }

    const { error } = await saveComposition({
      title,
      selections,
      generatedPrompt,
      editedPrompt,
      isPublic,
      forkOf
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isPublic ? BUILD_CONTENT.toastPublished : BUILD_CONTENT.toastSaved);
      if (isPublic) router.push('/gallery');
      sessionStorage.removeItem('prompt-builder-state');
    }
  };

  const hasSelections = Object.values(selections).some(arr => arr.length > 0);

  if (catsLoading || pillsLoading) {
    return (
      <div className="h-screen w-full dark:bg-black bg-white dark:text-white text-black flex flex-col pt-20 px-12">
        <div className="animate-pulse flex gap-8 h-full">
          <div className="w-48 dark:bg-white/5 bg-black/5 rounded-xl h-96"></div>
          <div className="flex-1 dark:bg-white/5 bg-black/5 rounded-xl h-full"></div>
          <div className="w-[420px] dark:bg-white/5 bg-black/5 rounded-xl h-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto lg:overflow-hidden dark:bg-black bg-white dark:text-white text-black flex flex-col">
      <Toaster theme="dark" position="bottom-right" />
      <Navbar />
      
      <main className="flex-1 overflow-visible lg:overflow-hidden flex flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-12 pb-6 max-w-[1920px] mx-auto w-full">
        
        {/* Mobile Header / Overrides */}
        {showOverrideWarning && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 dark:bg-brand-teal/20 bg-brand-teal/10 border border-brand-teal dark:text-white text-black px-4 py-3 rounded-xl flex items-center gap-4 shadow-2xl backdrop-blur-md animate-blur-fade-up">
            <span className="text-sm">{BUILD_CONTENT.promptOverrideWarning}</span>
            <div className="flex gap-2">
              <button onClick={() => handleOverrideDecision(true)} className="text-xs bg-brand-teal px-3 py-1.5 rounded-md font-medium dark:text-white text-white hover:bg-brand-teal/80">
                {BUILD_CONTENT.promptOverrideUpdate}
              </button>
              <button onClick={() => handleOverrideDecision(false)} className="text-xs dark:bg-white/10 bg-black/10 px-3 py-1.5 rounded-md font-medium dark:hover:bg-white/20 hover:bg-black/20">
                {BUILD_CONTENT.promptOverrideKeep}
              </button>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside className="w-full lg:w-[200px] flex-shrink-0 lg:h-full lg:overflow-y-auto animate-blur-fade-up opacity-0" style={{ animationDelay: "150ms" }}>
          <CategorySidebar 
            categories={categories} 
            selections={selections}
            activeCategorySlug={activeCategorySlug}
          />
        </aside>

        {/* Pill Grid */}
        <div className="flex-1 lg:h-full lg:overflow-hidden animate-blur-fade-up opacity-0" style={{ animationDelay: "200ms" }}>
          <PillGrid 
            categories={categories}
            pills={pills}
            selections={selections}
            onToggle={handleToggle}
            customExtras={customExtras}
            onCustomExtrasChange={setCustomExtras}
          />
        </div>

        {/* Live Preview (Desktop is right column, Mobile is floating button + sheet) */}
        <div className={`
          fixed lg:static inset-0 z-40 lg:z-auto dark:bg-black/90 bg-white/90 lg:bg-transparent lg:dark:bg-transparent backdrop-blur-xl lg:backdrop-blur-none transition-transform duration-300
          ${previewOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          flex flex-col lg:w-[420px] flex-shrink-0 lg:h-full pt-20 lg:pt-0 px-4 lg:px-0
        `}>
          <div className="flex-1 animate-blur-fade-up opacity-0" style={{ animationDelay: "250ms" }}>
            <PromptPreview 
              title={title}
              onTitleChange={setTitle}
              generatedPrompt={generatedPrompt}
              editedPrompt={editedPrompt}
              onEditedPromptChange={setEditedPrompt}
              onReset={() => setEditedPrompt(null)}
              onSave={handleSave}
              hasSelections={hasSelections}
            />
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setPreviewOpen(false)}
            className="lg:hidden mt-4 dark:bg-white/10 bg-black/10 py-3 rounded-xl text-sm font-medium dark:hover:bg-white/20 hover:bg-black/20"
          >
            Close Preview
          </button>
        </div>

        {/* Mobile Floating Action Button */}
        <button 
          onClick={() => setPreviewOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-brand-teal text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,184,0.4)] animate-blur-fade-up"
        >
          <Code2 size={24} />
        </button>

      </main>
    </div>
  );
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full dark:bg-black bg-white dark:text-white text-black flex items-center justify-center">Loading...</div>}>
      <BuildPageContent />
    </Suspense>
  );
}
