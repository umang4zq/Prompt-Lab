"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function WhyPromptLab() {
  const reducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const visualVariants: Variants = {
    hidden: { opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.8, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.34, 1.36, 0.64, 1] }
    }
  };

  return (
    <section className="relative w-full bg-[#0a0a0a] text-white py-24 md:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24 md:mb-32 text-center">
          <h2 className="text-sm font-semibold tracking-widest text-neutral-400 uppercase mb-4">Why Prompt-Lab</h2>
          <p className="text-4xl md:text-6xl font-bold tracking-tight">Stop explaining. Start building.</p>
        </div>

        <div className="space-y-32 md:space-y-48">
          
          {/* Panel 1: The Problem */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
          >
            <div className="flex-1 space-y-6">
              <motion.h3 variants={textVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                The context tax is <span className="text-red-400">too high.</span>
              </motion.h3>
              <motion.p variants={textVariants} className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                AI coding models burn a massive number of tokens when you have to manually explain your tech stack, framework choices, folder structure, and conventions every single time you start a prompt.
              </motion.p>
            </div>
            <div className="flex-1 flex justify-center w-full">
              <motion.div variants={visualVariants} className="relative w-full max-w-sm aspect-video bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-center gap-4 shadow-2xl">
                <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-neutral-800 rounded animate-pulse delay-75"></div>
                <div className="h-4 w-5/6 bg-neutral-800 rounded animate-pulse delay-150"></div>
                <div className="h-4 w-1/2 bg-red-900/30 rounded mt-2"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Panel 2: The Cost */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24"
          >
            <div className="flex-1 space-y-6">
              <motion.h3 variants={textVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                Wasted tokens = <br/><span className="text-orange-400">worse output.</span>
              </motion.h3>
              <motion.p variants={textVariants} className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                Every wasted token eats into your context window. That means less room for actual logic, poorer memory of previous steps, and repeated hallucinations across every new chat session.
              </motion.p>
            </div>
            <div className="flex-1 flex justify-center w-full">
              <motion.div variants={visualVariants} className="flex gap-6 flex-wrap justify-center items-center">
                 <div className="w-28 h-28 rounded-full border-4 border-orange-500/20 flex items-center justify-center bg-orange-500/5 shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)]">
                    <span className="text-orange-400 font-bold text-2xl">-40%</span>
                 </div>
                 <div className="w-24 h-24 rounded-full border-2 border-neutral-800 flex items-center justify-center bg-neutral-900/50">
                    <span className="text-neutral-500 font-medium text-sm text-center leading-tight">Context<br/>Limit</span>
                 </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Panel 3: The Fix */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-12 md:gap-24"
          >
            <div className="flex-1 space-y-6">
              <motion.h3 variants={textVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                Pick visually. <br/><span className="text-green-400">Generate instantly.</span>
              </motion.h3>
              <motion.p variants={textVariants} className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                Instead of typing paragraphs of context, use our pill-based selector. Pick your framework, database, and styling tools in seconds. Prompt-Lab assembles a structured, perfectly optimized prompt for you.
              </motion.p>
            </div>
            <div className="flex-1 flex justify-center w-full">
              <div className="flex flex-wrap gap-4 justify-center max-w-sm">
                <motion.div variants={visualVariants} className="px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium shadow-lg">Next.js</motion.div>
                <motion.div variants={visualVariants} className="px-6 py-3 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-medium shadow-lg">Tailwind CSS</motion.div>
                <motion.div variants={visualVariants} className="px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium shadow-lg">Supabase</motion.div>
                <motion.div variants={visualVariants} className="px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium shadow-lg">Framer Motion</motion.div>
              </div>
            </div>
          </motion.div>

          {/* Panel 4: The Result */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24"
          >
            <div className="flex-1 space-y-6">
              <motion.h3 variants={textVariants} className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                More building. <br/><span className="text-blue-400">Zero repetition.</span>
              </motion.h3>
              <motion.p variants={textVariants} className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                Get cleaner prompts, drastically more consistent AI outputs, and never rewrite the same stack context again. Keep your context window entirely focused on solving the hard problems.
              </motion.p>
            </div>
            <div className="flex-1 flex justify-center w-full">
              <motion.div variants={visualVariants} className="relative w-full max-w-sm bg-[#0d1117] border border-neutral-800 rounded-2xl p-6 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)]">
                <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                  <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                </div>
                <code className="text-sm md:text-base font-mono block leading-relaxed">
                  <span className="text-blue-400">{"// Output"}</span><br/>
                  <span className="text-yellow-300">{"{"}</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;stack&quot;</span>: <span className="text-green-300">&quot;Next.js + Tailwind&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;optimization&quot;</span>: <span className="text-orange-300">&quot;100%&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;ready&quot;</span>: <span className="text-purple-400">true</span><br/>
                  <span className="text-yellow-300">{"}"}</span>
                </code>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
