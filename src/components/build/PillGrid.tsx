"use client";

import type { Category, Pill, Selections } from "../../lib/prompt/generate";
import PillChip from "./PillChip";
import { BUILD_CONTENT } from "../../lib/constants/buildContent";

interface PillGridProps {
  categories: Category[];
  pills: Pill[];
  selections: Selections;
  onToggle: (categoryId: string, pillId: string, selectionType: 'single' | 'multi') => void;
  customExtras: string;
  onCustomExtrasChange: (val: string) => void;
}

export default function PillGrid({
  categories,
  pills,
  selections,
  onToggle,
  customExtras,
  onCustomExtrasChange
}: PillGridProps) {
  return (
    <div className="flex flex-col gap-10 overflow-y-auto pb-32">
      {categories.map((category) => {
        const categoryPills = pills.filter(p => p.category_id === category.id);
        if (categoryPills.length === 0) return null;

        return (
          <section key={category.id} id={category.slug} className="scroll-mt-24">
            <h3 className="text-lg font-medium dark:text-white text-black mb-4 flex items-baseline gap-2">
              {category.name}
              {category.selection_type === 'single' && (
                <span className="text-xs text-gray-500 font-normal">(pick one)</span>
              )}
            </h3>
            <div className={`flex flex-wrap gap-2 ${category.slug === 'templates' ? 'gap-4 w-full' : ''}`}>
              {categoryPills.map((pill) => {
                const isSelected = (selections[category.slug] || []).includes(pill.id);
                if (category.slug === 'templates') {
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => onToggle(category.slug, pill.id, category.selection_type)}
                      className={`text-left flex flex-col p-5 rounded-2xl w-full xl:w-[calc(50%-0.5rem)] transition-all duration-300 border ${
                        isSelected 
                          ? 'dark:bg-[#22D3B8]/10 bg-[#22D3B8]/20 border-[#22D3B8] shadow-[0_0_20px_rgba(34,211,184,0.15)]' 
                          : 'dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10 dark:hover:bg-white/10 hover:bg-black/10 dark:hover:border-white/20 hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <h4 className="font-semibold dark:text-white text-black text-base truncate">{pill.label}</h4>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#22D3B8] shadow-[0_0_8px_#22D3B8] flex-shrink-0" />}
                      </div>
                      <p className="text-xs dark:text-gray-400 text-gray-600 line-clamp-4 leading-relaxed font-mono">
                        {pill.prompt_snippet}
                      </p>
                    </button>
                  );
                }

                return (
                  <PillChip
                    key={pill.id}
                    pill={pill}
                    selected={isSelected}
                    onClick={() => onToggle(category.slug, pill.id, category.selection_type)}
                  />
                );
              })}
            </div>
            
            {category.slug === 'extras' && (
              <div className="mt-4">
                <label htmlFor="customExtras" className="sr-only">
                  {BUILD_CONTENT.customExtrasLabel}
                </label>
                <textarea
                  id="customExtras"
                  value={customExtras}
                  onChange={(e) => onCustomExtrasChange(e.target.value)}
                  placeholder={BUILD_CONTENT.customExtrasPlaceholder}
                  className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl p-3 text-sm dark:text-white text-black placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-colors resize-none h-24"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
