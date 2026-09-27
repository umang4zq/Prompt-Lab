"use client";

import React, { useState, useEffect, useRef } from "react";
import { BloubBot } from "./BloubBot";
import { StateId } from "@/lib/bot/states";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";

const SKILLS_DATA = [
  {
    id: "ui-ux-pro-max",
    targetIndex: 0,
    keywords: ["ui", "ux", "design system", "layout", "color", "palette", "tailwind", "flutter"],
    shape: "squircle",
    color: "rose",
    message: "I recommend the 'UI/UX Pro Max' skill for advanced design system generation and pixel-perfect layouts!"
  },
  {
    id: "apple-design",
    targetIndex: 2,
    keywords: ["apple", "motion", "animation", "fluid", "spring", "gesture", "swipe", "design"],
    shape: "galet",
    color: "gris",
    message: "You should check out the 'Apple Design Skill' to add fluid motion and spring physics to your interface."
  },
  {
    id: "awesome-design-md",
    targetIndex: 4,
    keywords: ["blueprint", "figma", "markdown", "theme", "library", "libraries"],
    shape: "capsule",
    color: "ambre",
    message: "The 'Awesome-Design-MD' skill is perfect for that! It feeds your AI real design blueprints via markdown."
  },
  {
    id: "superpowers",
    targetIndex: 6,
    keywords: ["superpowers", "tools", "apps", "magic", "toolbelt", "tasks"],
    shape: "triangle",
    color: "turquoise",
    message: "To do that, grab the 'Superpowers' skill! It gives your AI a magic toolbelt for complex tasks."
  },
  {
    id: "readme-template",
    targetIndex: 8,
    keywords: ["readme", "template", "context", "architecture", "database"],
    shape: "hexagone",
    color: "bleu",
    message: "I suggest the 'Ultimate AI README Template' to give your AI perfect context about your codebase."
  },
  {
    id: "context7",
    targetIndex: 10,
    keywords: ["context7", "mcp", "documentation", "hallucinate", "upstash", "version"],
    shape: "cercle",
    color: "orange",
    message: "Check out the 'Context7 MCP' server by Upstash to inject live, verified documentation into your AI!"
  },
  {
    id: "antigravity-vault",
    targetIndex: 12,
    keywords: ["vault", "antigravity", "300", "skills", "collection", "architect"],
    shape: "losange",
    color: "jaune",
    message: "The Antigravity Vault has over 300+ skills across dev, infra, and security domains!"
  }
];

export function BotAssistant() {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [botState, setBotState] = useState<StateId>("idle");
  const [botShape, setBotShape] = useState("cercle");
  const [botColor, setBotColor] = useState("bleu");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      setIsOpen(true);
      setMessage("Hello! I am your AI assistant. How can I help you with your skills today?");
      setBotState("swirl");
      setTimeout(() => setBotState("idle"), 1300); // back to idle after swirl
    }, 1000);
  }, []);

  const triggerSearch = (query: string) => {
    const userText = query.toLowerCase();
    setInputValue("");
    setIsOpen(true);

    let foundSkill = null;
    for (const skill of SKILLS_DATA) {
      if (skill.keywords.some(kw => userText.includes(kw))) {
        foundSkill = skill;
        break;
      }
    }

    if (foundSkill) {
      // Trigger specific action as requested: rotate the floating cards instead of the bot
      window.dispatchEvent(new CustomEvent('trigger-sphere-rotation', { detail: { action: 'start' } }));
      setBotState("thinking");
      setBotShape(foundSkill.shape);
      setBotColor(foundSkill.color);
      setMessage(`Searching for that... Rotating the cards to scan the landing page...`);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-sphere-rotation', { detail: { action: 'stop', targetIndex: foundSkill.targetIndex } }));
        setBotState("alert");
        setMessage(`Found it! ${foundSkill.message}`);
        setTimeout(() => setBotState("idle"), 2000);
      }, 3400); // Wait for the sphere to spin
    } else {
      setBotState("thinking");
      setBotShape("cercle");
      setBotColor("bleu");
      setMessage("Thinking about the best skill for that...");
      
      setTimeout(() => {
        setBotState("notify");
        setBotShape("triangle");
        setBotColor("rouge");
        setMessage("I couldn't find a matching skill! Try using one of the quick suggestions below.");
        setTimeout(() => {
          setBotState("idle");
          setBotShape("cercle");
          setBotColor("bleu");
        }, 3000);
      }, 2600);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    triggerSearch(inputValue);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-2xl shadow-2xl p-4 w-[280px] pointer-events-auto border border-black/10 dark:border-white/10"
          >
            <div className="text-sm mb-3 font-medium">
              {message}
            </div>
            <form onSubmit={handleSend} className="relative flex items-center mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-2 text-sm outline-none border border-transparent focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 text-blue-500 hover:text-blue-600 p-1"
                disabled={!inputValue.trim()}
              >
                <Send size={16} />
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <button onClick={() => triggerSearch("ui")} className="text-[11px] font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full transition-colors border border-blue-200 dark:border-blue-800/30">
                UI Design
              </button>
              <button onClick={() => triggerSearch("apple")} className="text-[11px] font-medium bg-gray-50 hover:bg-gray-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/80 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full transition-colors border border-gray-200 dark:border-neutral-800">
                Apple Motion
              </button>
              <button onClick={() => triggerSearch("readme")} className="text-[11px] font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full transition-colors border border-blue-200 dark:border-blue-800/30">
                Readme
              </button>
              <button onClick={() => triggerSearch("superpowers")} className="text-[11px] font-medium bg-gray-50 hover:bg-gray-100 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/80 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full transition-colors border border-gray-200 dark:border-neutral-800">
                Tools
              </button>
              <button onClick={() => triggerSearch("vault")} className="text-[11px] font-medium bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 px-2.5 py-1 rounded-full transition-colors border border-yellow-200 dark:border-yellow-800/30">
                Vault
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        className="cursor-pointer pointer-events-auto group relative transition-transform hover:scale-105"
        onClick={() => {
          if (isOpen) {
            // Reset everything when closing the chat
            setBotState("idle");
            setBotShape("cercle");
            setBotColor("bleu");
            setMessage("");
            window.dispatchEvent(new CustomEvent('trigger-sphere-rotation', { detail: { action: 'reset' } }));
          }
          setIsOpen(!isOpen);
        }}
      >
        <BloubBot 
          size={120} 
          state={botState} 
          shape={botShape}
          color={botColor}
          follow={true} // follows the mouse cursor
          playing={false}
          paper="transparent"
        />
      </div>
    </div>
  );
}
