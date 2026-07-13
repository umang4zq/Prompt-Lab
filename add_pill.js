global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const promptSnippet = `# Design Specifications & Reusable Components

This file contains reusable code snippets and design patterns used across the DocIntel application.

## 1. Liquid Glass CSS Effect

The \`liquid-glass\` class creates a beautiful floating glass pill effect with a dynamic gradient border that adapts to both light and dark themes. We use this on the \`ThemeToggle\` and the \`Navbar\`.

Add this to your CSS (e.g. \`index.css\`):

\`\`\`css
/* Dark mode liquid-glass (default) */
.liquid-glass {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

/* Light mode liquid-glass */
[data-theme="light"] .liquid-glass {
  background: rgba(0,0,0,0.03);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

/* Shared ::before for gradient border */
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

[data-theme="light"] .liquid-glass::before {
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.45) 0%,
    rgba(0,0,0,0.15) 20%,
    rgba(0,0,0,0) 40%,
    rgba(0,0,0,0) 60%,
    rgba(0,0,0,0.15) 80%,
    rgba(0,0,0,0.45) 100%
  );
}
\`\`\`

---

## 2. Reusable MacBook Screen (Dashboard Mockup)

This is the code for the MacBook Screen wrapper seen on the landing page (with the \`docintel.ai\` domain, window controls, and scalable design). 

I have modified it slightly here to accept \`children\`. This allows you to pass in *any* content to be rendered inside the screen!

\`\`\`tsx
import { useEffect, useRef, useState, ReactNode } from 'react';
import { PanelLeft, ChevronLeft, ChevronRight, Monitor, RotateCw, Share, Plus, Copy } from 'lucide-react';

export default function ReusableMacBookScreen({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const containerWidth = entry.contentRect.width;
        // Fixed design width of 896px
        const newScale = Math.min(containerWidth / 896, 1);
        setScale(newScale);
        
        if (innerRef.current) {
          setHeight(innerRef.current.offsetHeight * newScale);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0"
      style={{ height: height > 0 ? height : 'auto' }}
    >
      <div 
        ref={innerRef}
        className="origin-top-left absolute top-0 left-0 w-[896px]"
        style={{ transform: \`scale(\${scale})\` }}
      >
        <div className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left flex flex-col h-[560px]">
          {/* Title bar */}
          <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-2">
                <PanelLeft className="w-3.5 h-3.5 text-white/40" />
                <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
                <ChevronRight className="w-3.5 h-3.5 text-white/25" />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 min-w-[240px] justify-center">
              <Monitor className="w-3 h-3" />
              <span>docintel.ai</span>
            </div>

            <div className="flex items-center gap-3">
              <RotateCw className="w-3.5 h-3.5 text-white/40" />
              <Share className="w-3.5 h-3.5 text-white/40" />
              <Plus className="w-3.5 h-3.5 text-white/40" />
              <Copy className="w-3.5 h-3.5 text-white/40" />
            </div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="flex flex-1 overflow-hidden relative bg-[#1a1a1c]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
\`\`\`

### Example Usage:
\`\`\`tsx
import ReusableMacBookScreen from './ReusableMacBookScreen';

export default function MyComponent() {
  return (
    <ReusableMacBookScreen>
       <div className="p-8 text-white">
          <h1>Hello World!</h1>
          <p>I am inside the MacBook Screen!</p>
       </div>
    </ReusableMacBookScreen>
  );
}
\`\`\`
`;

async function addPill() {
  const { data: cats } = await supabase.from('categories').select('*').eq('name', 'Extras');
  if (!cats || cats.length === 0) {
    console.log("No Extras category found!");
    return;
  }
  
  const catId = cats[0].id;
  
  const { data: pills } = await supabase.from('pills').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const maxOrder = pills && pills.length > 0 ? pills[0].sort_order : 0;
  
  const res = await supabase.from('pills').insert({
    category_id: catId,
    label: 'Liquid Glass & MacBook',
    prompt_snippet: promptSnippet,
    icon: 'sparkles',
    color: '#00f2fe',
    is_active: true,
    sort_order: maxOrder + 1
  });
  
  if (res.error) {
    console.error(res.error);
  } else {
    console.log("Success!");
  }
}

addPill();
