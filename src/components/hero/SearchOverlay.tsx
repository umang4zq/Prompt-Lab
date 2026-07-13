"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "../../lib/supabase/client";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{id: string, title: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("compositions")
          .select("id, title")
          .eq("is_public", true)
          .ilike("title", `%${query}%`)
          .limit(8);
        
        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="flex items-center px-4 py-3 border-b border-gray-800">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 placeholder-gray-500"
            placeholder="Search public prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              results.map((res) => (
                <Link 
                  key={res.id} 
                  href={`/gallery/${res.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <span className="text-sm font-medium">{res.title}</span>
                  <span className="text-xs text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity">View Prompt &rarr;</span>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No results found for &quot;{query}&quot;</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
