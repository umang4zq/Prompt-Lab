"use client";

import React, { useEffect, useState } from "react";

const htmlContent = `<!doctype html>
<html lang="en" class="anim">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#161616">
  <title>Orbit — Secure system</title>
  <style>
    @font-face {
      font-family: 'Orbit Sans';
      src: local('Arial');
      font-display: block;
    }
    @font-face {
      font-family: 'Orbit Display';
      src: local('Times New Roman');
      font-display: block;
    }
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: #161616;
      font-family: "Orbit Sans", Arial, Helvetica, sans-serif;
      color: #fff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    :root {
      --ink: #ffffff;
      --surface: #161616;
      --orb-reveal: cubic-bezier(.16, 1, .3, 1);
      --orb-soft: cubic-bezier(.25, .8, .28, 1);
    }
    
    main.viewport {
      position: fixed;
      inset: 0;
      background: #161616;
    }
    section.stage {
      position: absolute;
      inset: 0;
      contain: strict;
      isolation: isolate;
    }
    
    .brand-mark {
      position: absolute;
      top: 2.141745dvh;
      left: 3.854167vw;
      width: clamp(34px, min(3.4375vw, 5.2dvh), 66px);
      z-index: 4;
    }
    
    .primary-nav {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 4;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .primary-nav li {
      position: absolute;
      top: 3.426791dvh;
      color: #fff;
      font-size: clamp(13px, min(1.302083vw, 2.05dvh), 25px);
      pointer-events: auto;
    }
    .primary-nav li:nth-child(1) { left: 10.104167vw; transform: scaleX(1.165); }
    .primary-nav li:nth-child(2) { left: 17.526042vw; transform: scaleX(1.052); }
    .primary-nav li:nth-child(3) { left: 27.578125vw; transform: scaleX(1.126); }
    .primary-nav li:nth-child(4) { left: 36.171875vw; transform: scaleX(1.168); }
    .primary-nav a { color: inherit; text-decoration: none; }
    
    .secure-pill {
      position: absolute;
      top: 2.336449dvh;
      right: 7.5vw;
      height: clamp(34px, 4.439252dvh, 57px);
      border-radius: 999px;
      background: #fff;
      color: #161616;
      letter-spacing: 0.026923em;
      display: flex;
      align-items: center;
      padding: 0 1.5em;
      font-size: clamp(13px, min(1.302083vw, 2.05dvh), 25px);
      z-index: 4;
      white-space: nowrap;
    }
    
    .orbit-word {
      position: absolute;
      top: 11.565421dvh;
      left: 4.348958vw;
      font-family: "Orbit Display", "Times New Roman", Times, serif;
      font-size: min(27.8125vw, 55dvh);
      letter-spacing: 0.033708em;
      margin: 0;
      z-index: 1;
      font-weight: 400;
      white-space: nowrap;
    }
    .orbit-word__mask {
      display: block;
      overflow: hidden;
      padding-top: 0.2em;
      margin-top: -0.2em;
    }
    .orbit-word__inner {
      display: block;
    }
    .orbit-word__white {
      color: #fff;
    }
    .orbit-word__o {
      display: inline-block;
      transform: scaleX(1.0866);
      margin-right: 0.042135em;
    }
    .orbit-word__pink {
      background: linear-gradient(180deg, #ffc5dc 0%, #fd86db 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .flower {
      position: absolute;
      top: 14.749065dvh;
      left: 49.121328vw;
      height: 106.109034dvh;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 2;
    }
    .flower__sizer {
      height: 100%;
      width: auto;
      visibility: hidden;
    }
    .flower__layer {
      position: absolute;
      inset: 0;
    }
    .flower__layer img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .flower__layer--top {
      mask-image: linear-gradient(#0000, #0000);
      -webkit-mask-image: linear-gradient(#0000, #0000);
    }
    
    .support-copy {
      position: absolute;
      bottom: 4.361371dvh;
      color: #f7f7f7;
      font-size: clamp(14px, min(1.40625vw, 2.102804dvh), 27px);
      z-index: 3;
      white-space: pre-wrap;
    }
    .support-copy--left {
      left: 3.177083vw;
      transform: scaleX(1.073);
    }
    .support-copy--right {
      left: 78.28125vw;
      transform: scaleX(1.058);
    }
    .support-copy__inner {
      display: block;
    }
    
    html.anim .orbit-word__inner {
      transform: translateY(118%);
      animation: orb-word 1150ms var(--orb-reveal) 300ms forwards;
    }
    html.anim .flower {
      opacity: 0;
      transform: translateX(-50%) translateY(3.4dvh);
      animation: orb-subject 1150ms var(--orb-reveal) 660ms forwards;
    }
    html.anim .brand-mark, html.anim .secure-pill {
      opacity: 0;
      transform: translateY(1dvh);
      animation: orb-quiet 620ms var(--orb-soft) forwards;
    }
    html.anim .brand-mark { animation-delay: 100ms; }
    html.anim .secure-pill { animation-delay: 340ms; }
    
    html.anim .primary-nav li {
      opacity: 0;
      animation: orb-dim 550ms var(--orb-soft) forwards;
    }
    html.anim .primary-nav li:nth-child(1) { animation-delay: 180ms; }
    html.anim .primary-nav li:nth-child(2) { animation-delay: 225ms; }
    html.anim .primary-nav li:nth-child(3) { animation-delay: 270ms; }
    html.anim .primary-nav li:nth-child(4) { animation-delay: 315ms; }
    
    html.anim .support-copy__inner {
      opacity: 0;
      transform: translateY(2dvh);
      animation: orb-corner 720ms var(--orb-soft) 980ms forwards;
    }
    
    @keyframes orb-word { to { transform: translateY(0); } }
    @keyframes orb-subject { to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    @keyframes orb-quiet { to { opacity: 1; transform: translateY(0); } }
    @keyframes orb-dim { to { opacity: 1; } }
    @keyframes orb-corner { to { opacity: 1; transform: translateY(0); } }
    
    @media (prefers-reduced-motion) {
      html.anim * { animation: none !important; transform: none !important; opacity: 1 !important; }
      html.anim main.viewport { animation: orb-dim 280ms linear forwards; opacity: 0; }
    }
    
    @media (max-width: 900px), (max-aspect-ratio: 4/5) {
      .primary-nav, .secure-pill { display: none; }
      .burger-btn { display: block; }
    }
    @media (min-width: 901px) and (min-aspect-ratio: 4/5) {
      .burger-btn { display: none; }
    }
    
    @media (max-aspect-ratio: 4/5) {
      .flower { height: min(55dvh, 110vw); }
      .orbit-word { font-size: min(27.5vw, 18dvh); }
    }
    
    @media (max-width: 1200px), (orientation: portrait) {
      .orbit-word { left: 0; width: 100%; text-align: center; }
    }
    
    .burger-btn {
      position: absolute;
      top: 2.336449dvh;
      right: 5vw;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fff;
      z-index: 12;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main class="viewport">
    <section class="stage">
      <svg class="brand-mark" viewBox="0 0 66 62" stroke="#fff" stroke-width="5" stroke-linecap="square" fill="none">
        <path d="M33,1 L33,61 M3,31 L63,31 M11.8,9.8 L54.2,52.2 M54.2,9.8 L11.8,52.2" />
      </svg>
      
      <ul class="primary-nav">
        <li><a href="#home">Home</a></li>
        <li><a href="#resources">Resources</a></li>
        <li><a href="#benefits">Benefits</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      
      <div class="secure-pill">Secure system</div>
      <button class="burger-btn" aria-label="Menu" style="display:none;"></button>
      
      <h1 class="orbit-word" id="orbit-title" aria-label="Orbit">
        <span class="orbit-word__mask">
          <span class="orbit-word__inner">
            <span class="orbit-word__white"><span class="orbit-word__o">O</span>R</span><span class="orbit-word__pink">BIT</span>
          </span>
        </span>
      </h1>
      
      <div class="flower">
        <img class="flower__sizer" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85" alt="" aria-hidden="true">
        <div class="flower__layer flower__layer--bg">
          <img id="front-lily" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85" alt="Pixel-art pink and violet lily">
        </div>
        <div class="flower__layer flower__layer--top" aria-hidden="true">
          <img id="reveal-lily" src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85" alt="">
        </div>
      </div>
      
      <div class="support-copy support-copy--left">
        <span class="support-copy__inner">Every workflow,<br>intelligently connected.</span>
      </div>
      <div class="support-copy support-copy--right">
        <span class="support-copy__inner">Less manual work.<br>More meaningful output.</span>
      </div>
    </section>
  </main>
  
  <script>
    setTimeout(() => {
      document.documentElement.classList.remove('anim');
    }, 6000);

    const stage = document.querySelector('.stage');
    const flower = document.querySelector('.flower');
    const frontLayer = document.querySelector('.flower__layer--bg');
    const topLayer = document.querySelector('.flower__layer--top');
    
    const canvasFront = document.createElement('canvas');
    const canvasTop = document.createElement('canvas');
    const ctxFront = canvasFront.getContext('2d');
    const ctxTop = canvasTop.getContext('2d');
    
    let hovering = false;
    let headRadius = 0;
    const trail = [];
    let lastSample = {x: -999, y: -999};
    let time = 0;
    
    function syncSize() {
      const rect = flower.getBoundingClientRect();
      if(rect.width > 0 && rect.height > 0) {
        canvasFront.width = rect.width;
        canvasFront.height = rect.height;
        canvasTop.width = rect.width;
        canvasTop.height = rect.height;
      }
    }
    window.addEventListener('resize', syncSize);
    
    let mx = -999, my = -999;
    
    stage.addEventListener('mouseenter', () => { hovering = true; });
    stage.addEventListener('mouseleave', () => { hovering = false; });
    stage.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      hovering = true;
    });
    
    function drawMorphBlob(ctx, cx, cy, r, t, seed) {
      if (r < 2) return;
      ctx.beginPath();
      const pts = [];
      for(let i=0; i<24; i++) {
        const angle = (i/24) * Math.PI * 2;
        const n1 = Math.sin(angle*3 + t*1.4 + seed) * 0.45;
        const n2 = Math.sin(angle*5 - t*0.9 + seed*2.3) * 0.3;
        const n3 = Math.cos(angle*2 + t*1.8 + seed*0.7) * 0.25;
        const noise = (n1+n2+n3) * 44 * (r/140);
        const radius = Math.max(0, r + noise);
        pts.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius
        });
      }
      
      ctx.moveTo((pts[0].x + pts[23].x)/2, (pts[0].y + pts[23].y)/2);
      for(let i=0; i<24; i++) {
        const next = pts[(i+1)%24];
        const midX = (pts[i].x + next.x)/2;
        const midY = (pts[i].y + next.y)/2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      ctx.fill();
    }
    
    function tick() {
      requestAnimationFrame(tick);
      
      const rect = flower.getBoundingClientRect();
      if(rect.width === 0) return;
      if(canvasFront.width !== rect.width) syncSize();
      
      const targetR = hovering ? 140 : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04);
      
      if(hovering && headRadius > 5) {
        const dist = Math.hypot(mx - lastSample.x, my - lastSample.y);
        if(dist > 8) {
          const localX = mx - rect.left;
          const localY = my - rect.top;
          trail.push({x: localX, y: localY, r: headRadius, alpha: 1, seed: Math.random()*100});
          if(trail.length > 60) trail.shift();
          lastSample = {x: mx, y: my};
        }
      }
      
      ctxFront.fillStyle = 'white';
      ctxFront.fillRect(0, 0, canvasFront.width, canvasFront.height);
      ctxTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
      
      ctxFront.globalCompositeOperation = 'destination-out';
      ctxTop.globalCompositeOperation = 'source-over';
      ctxTop.fillStyle = 'white';
      
      time += 0.016;
      
      for(let i = trail.length-1; i >= 0; i--) {
        const p = trail[i];
        p.alpha *= 0.92;
        p.r *= 0.995;
        if(p.alpha < 0.01) {
          trail.splice(i, 1);
          continue;
        }
        
        ctxFront.globalAlpha = p.alpha;
        ctxTop.globalAlpha = p.alpha;
        
        drawMorphBlob(ctxFront, p.x, p.y, p.r, time, p.seed);
        drawMorphBlob(ctxTop, p.x, p.y, p.r, time, p.seed);
      }
      
      ctxFront.globalAlpha = 1;
      ctxTop.globalAlpha = 1;
      ctxFront.globalCompositeOperation = 'source-over';
      
      const frontData = canvasFront.toDataURL();
      const topData = canvasTop.toDataURL();
      
      frontLayer.style.maskImage = \`url(\${frontData})\`;
      frontLayer.style.webkitMaskImage = \`url(\${frontData})\`;
      frontLayer.style.maskSize = '100% 100%';
      frontLayer.style.webkitMaskSize = '100% 100%';
      
      topLayer.style.maskImage = \`url(\${topData})\`;
      topLayer.style.webkitMaskImage = \`url(\${topData})\`;
      topLayer.style.maskSize = '100% 100%';
      topLayer.style.webkitMaskSize = '100% 100%';
    }
    
    requestAnimationFrame(tick);
  </script>
</body>
</html>`;

export default function OrbitSecureSystem({ isPreview = false }: { isPreview?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return <div className="w-full h-[100vh] bg-[#161616]" />;

  return (
    <div className={`w-full h-[100vh] min-h-[600px] bg-[#161616] ${isPreview ? 'pointer-events-none' : ''}`}>
      <iframe
        srcDoc={htmlContent}
        title="Orbit Secure System"
        className="w-full h-full border-none outline-none"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
