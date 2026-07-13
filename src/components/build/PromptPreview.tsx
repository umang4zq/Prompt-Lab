"use client";

import { useState } from "react";
import { BUILD_CONTENT } from "../../lib/constants/buildContent";
import { Copy, Save, Send } from "lucide-react";
import { toast } from "sonner";

interface PromptPreviewProps {
  title: string;
  onTitleChange: (title: string) => void;
  generatedPrompt: string;
  editedPrompt: string | null;
  onEditedPromptChange: (val: string) => void;
  onReset: () => void;
  onSave: (isPublic: boolean) => Promise<void>;
  hasSelections: boolean;
}

export default function PromptPreview({
  title,
  onTitleChange,
  generatedPrompt,
  editedPrompt,
  onEditedPromptChange,
  onReset,
  onSave,
  hasSelections
}: PromptPreviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const displayPrompt = editedPrompt !== null ? editedPrompt : generatedPrompt;
  const isEdited = editedPrompt !== null && editedPrompt !== generatedPrompt;

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(displayPrompt)
        .then(() => toast.success("Copied to clipboard"))
        .catch(() => toast.error("Failed to copy"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = displayPrompt;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Copied to clipboard");
      } catch (_error) {
        toast.error("Failed to copy");
      } finally {
        textArea.remove();
      }
    }
  };

  const handleSave = async (isPublic: boolean) => {
    setIsSaving(true);
    try {
      await onSave(isPublic);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] lg:h-[calc(100vh-120px)] dark:bg-gray-900/50 bg-gray-100/50 border dark:border-white/10 border-black/10 rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-white/10 border-black/10 dark:bg-gray-900/80 bg-gray-200/80">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium dark:text-white text-black">{BUILD_CONTENT.previewTitle}</h2>
          <span className="text-xs text-gray-500 font-mono">
            {displayPrompt.length} chars
          </span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 dark:hover:bg-white/10 hover:bg-black/10 rounded-md transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          title={BUILD_CONTENT.copyButton}
        >
          <Copy size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative p-4 dark:bg-black/40 bg-white/40">
        <label htmlFor="promptArea" className="sr-only">Prompt Preview</label>
        <textarea
          id="promptArea"
          value={displayPrompt}
          onChange={(e) => onEditedPromptChange(e.target.value)}
          className="w-full h-full bg-transparent resize-none outline-none dark:text-gray-300 text-gray-700 font-mono text-sm leading-relaxed"
          style={{ fontFeatureSettings: '"tnum"' }}
        />
        {isEdited && (
          <button 
            onClick={onReset}
            className="absolute bottom-4 right-4 text-xs dark:bg-gray-800 bg-gray-200 dark:hover:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-colors border dark:border-gray-700 border-gray-300"
          >
            {BUILD_CONTENT.resetButton}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t dark:border-white/10 border-black/10 dark:bg-gray-900/80 bg-gray-200/80 flex flex-col gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={BUILD_CONTENT.titlePlaceholder}
          className="w-full bg-transparent border-none outline-none dark:text-white text-black font-medium text-sm placeholder-gray-500 px-1"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={!hasSelections || isSaving}
            className="flex-1 flex items-center justify-center gap-2 liquid-glass dark:text-white text-black text-sm font-medium py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={!hasSelections ? BUILD_CONTENT.tooltipDisabled : ""}
          >
            <Save size={16} />
            {BUILD_CONTENT.saveDraftBtn}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={!hasSelections || isSaving}
            className="flex-1 flex items-center justify-center gap-2 liquid-glass dark:text-white text-black text-sm font-medium py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:hover:bg-white/5 hover:bg-black/5"
            title={!hasSelections ? BUILD_CONTENT.tooltipDisabled : ""}
          >
            <Send size={16} />
            {BUILD_CONTENT.publishBtn}
          </button>
        </div>
      </div>

    </div>
  );
}
