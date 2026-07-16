"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Failed to copy"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Copied to clipboard!");
      } catch (_error) {
        toast.error("Failed to copy");
      } finally {
        textArea.remove();
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white text-sm font-medium"
      title="Copy Prompt"
    >
      <Copy size={14} />
      Copy
    </button>
  );
}
