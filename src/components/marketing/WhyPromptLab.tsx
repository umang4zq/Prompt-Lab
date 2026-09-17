'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const GROUPS = [
  {
    key: 'framework',
    label: 'Framework',
    lead: 'Build with',
    options: [
      { id: 'next', name: 'Next.js 14', dot: '#e5e7eb' },
      { id: 'react', name: 'React', dot: '#61dafb' },
      { id: 'flutter', name: 'Flutter', dot: '#54c5f8' },
    ],
  },
  {
    key: 'styling',
    label: 'Styling',
    lead: 'Style with',
    options: [
      { id: 'tailwind', name: 'Tailwind CSS', dot: '#38bdf8' },
      { id: 'shadcn', name: 'shadcn/ui', dot: '#e5e7eb' },
      { id: 'css', name: 'Plain CSS modules', dot: '#a78bfa' },
    ],
  },
  {
    key: 'data',
    label: 'Data',
    lead: 'Store data in',
    options: [
      { id: 'supabase', name: 'Supabase', dot: '#3ecf8e' },
      { id: 'postgres', name: 'Postgres', dot: '#7aa6d6' },
      { id: 'firebase', name: 'Firebase', dot: '#f0b429' },
    ],
  },
  {
    key: 'rules',
    label: 'House rules',
    lead: 'Always',
    options: [
      { id: 'ts', name: 'use TypeScript in strict mode', dot: '#3178c6' },
      { id: 'router', name: 'use the App Router', dot: '#e5e7eb' },
      { id: 'terse', name: 'answer with code, no essay', dot: '#f0b429' },
    ],
  },
];

const DEFAULT_SELECTED = ['next', 'tailwind', 'supabase', 'ts'];
const CLOSING_LINE = 'Assume all of this for the rest of the chat.';

export default function WhyPromptLab() {
  const [selected, setSelected] = useState(DEFAULT_SELECTED);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const toggle = (id) => {
    setCopied(false);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const lines = useMemo(() => {
    const out = [];
    for (const group of GROUPS) {
      const picked = group.options
        .filter((o) => selected.includes(o.id))
        .map((o) => o.name);
      if (!picked.length) continue;
      const joined =
        picked.length > 1
          ? `${picked.slice(0, -1).join(', ')} and ${picked[picked.length - 1]}`
          : picked[0];
      out.push(`${group.lead} ${joined}.`);
    }
    if (out.length) out.push(CLOSING_LINE);
    return out;
  }, [selected]);

  const wordCount = useMemo(
    () => lines.join(' ').split(/\s+/).filter(Boolean).length,
    [lines]
  );

  const copy = async () => {
    if (!lines.length) return;
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative z-10 py-24 px-6 border-t border-white/[0.08] bg-black/20 backdrop-blur-3xl text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header — left aligned, no centred stack */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-5">
            Set your stack once.
            <br />
            Paste it into any AI.
          </h2>
          <p className="text-[17px] text-white/55 font-light leading-relaxed">
            Every new chat starts with you retyping the same setup — framework,
            styling, database, the rules you always forget to mention.
            Prompt-Lab turns that into one block you keep. Pick what you build
            with below and watch the prompt write itself.
          </p>
        </motion.div>

        {/* The composer */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.1] bg-black/30 backdrop-blur-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            {/* Left: pick */}
            <div className="p-7 lg:p-9 md:border-r border-white/[0.08]">
              <div className="flex flex-col gap-7">
                {GROUPS.map((group) => (
                  <div key={group.key}>
                    <div className="text-[13px] text-white/40 mb-3">
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const on = selected.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggle(opt.id)}
                            aria-pressed={on}
                            className={[
                              'group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]',
                              'border transition-colors duration-200',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                              on
                                ? 'bg-white/[0.12] border-white/25 text-white'
                                : 'bg-transparent border-white/[0.12] text-white/45 hover:text-white/80 hover:border-white/25',
                            ].join(' ')}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full transition-opacity duration-200"
                              style={{
                                backgroundColor: opt.dot,
                                opacity: on ? 1 : 0.3,
                              }}
                            />
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: result */}
            <div className="flex flex-col bg-black/40">
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08]">
                <span className="text-[13px] text-white/40">
                  Your prompt{lines.length ? ` · ${wordCount} words` : ''}
                </span>
                <button
                  type="button"
                  onClick={copy}
                  disabled={!lines.length}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {copied ? (
                    <>
                      <Check size={14} strokeWidth={2} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} strokeWidth={1.75} /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 p-6 font-mono text-[13px] leading-[1.9] min-h-[260px]">
                {lines.length ? (
                  lines.map((line, i) => (
                    <p
                      key={line}
                      className={
                        i === lines.length - 1
                          ? 'text-white/35 mt-3'
                          : 'text-white/85'
                      }
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-white/35 font-sans">
                    Nothing picked yet. Choose a framework on the left and your
                    prompt starts here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who it helps — hairline row, not cards */}
        <div className="mt-14 grid md:grid-cols-3 border-t border-white/[0.08]">
          {[
            {
              head: 'Stop re-explaining yourself',
              body: 'One paste at the top of a chat and the model stops guessing which version of the framework you are on.',
            },
            {
              head: 'Keep a preset per project',
              body: 'A client site, a side project and a work repo each get their own stack. Switch between them in a click.',
            },
            {
              head: 'Share it with your team',
              body: 'Send the same stack to everyone so the AI hands back code that matches the codebase you already have.',
            },
          ].map((item, i) => (
            <div
              key={item.head}
              className={[
                'py-7 md:px-7 border-white/[0.08]',
                i === 0 ? 'md:pl-0' : 'border-t md:border-t-0 md:border-l',
              ].join(' ')}
            >
              <h3 className="text-[15px] font-medium mb-2">{item.head}</h3>
              <p className="text-[14px] text-white/50 font-light leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}