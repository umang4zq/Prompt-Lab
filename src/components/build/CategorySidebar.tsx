"use client";

import type { Category, Selections } from "../../lib/prompt/generate";
import { Code, Database, Layout, Sparkles, Box } from "lucide-react";
import { BUILD_CONTENT } from "../../lib/constants/buildContent";

interface CategorySidebarProps {
  categories: Category[];
  selections: Selections;
  activeCategorySlug: string;
}

export default function CategorySidebar({ categories, selections, activeCategorySlug }: CategorySidebarProps) {
  const IconComponent = ({ iconName, size = 16 }: { iconName: string, size?: number }) => {
    switch(iconName) {
      case "code": return <Code size={size} />;
      case "database": return <Database size={size} />;
      case "layout": return <Layout size={size} />;
      case "sparkles": return <Sparkles size={size} />;
      default: return <Box size={size} />;
    }
  };

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
      <div className="hidden lg:block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
        {BUILD_CONTENT.sidebarTitle}
      </div>
      {categories.map((category) => {
        const selectedCount = (selections[category.slug] || []).length;
        const isActive = activeCategorySlug === category.slug;
        
        return (
          <button
            key={category.id}
            onClick={() => scrollToCategory(category.slug)}
            className={`
              flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap lg:whitespace-normal
              ${isActive ? 'dark:bg-white/10 bg-black/10 dark:text-white text-black' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5 hover:bg-black/5'}
            `}
            style={{
              borderLeft: isActive ? '3px solid #22D3B8' : '3px solid transparent'
            }}
          >
            <div className="flex items-center gap-2">
              <IconComponent iconName={category.icon} />
              {category.name}
            </div>
            {selectedCount > 0 && (
              <span className="bg-brand-teal/20 text-brand-teal text-[10px] px-1.5 py-0.5 rounded-md">
                {selectedCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
