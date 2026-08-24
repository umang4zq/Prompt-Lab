import React, { useState, useEffect } from 'react';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Security built into every system layer</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;480&family=Space+Grotesk:wght@400;480;700&display=swap');

  :root {
    --s: min(100vw / 1505, 100vh / 700);
    --red: #c81b1c;
    --ink: #fff;
    --sub: #e6e6e6;
    --lab: #949494;
    --bx: 60; 
    --by: 36; 
    --bs: 44;
    --h1y: -12.5;
    --suby: 167.5;
    --numy: 19;
    --laby: 74;
  }

  @media (max-width:1023px) and (max-aspect-ratio:1/1) {
    :root {
      --s: clamp(0.82px, min(100vw / 900, 100vh / 1200), 1.25px);
      --bx: 56; 
      --by: 33; 
      --bs: 40;
      --h1y: -10.25; 
      --suby: 137.4; 
      --numy: 15.6; 
      --laby: 60.7;
    }
  }

  @media (max-width:599px) {
    :root {
      --s: min(100vw / 430, 100vh / 620, 1.02px);
      --bx: 26; 
      --by: 21; 
      --bs: 34;
      --h1y: -7.1; 
      --suby: 108; 
      --numy: 13; 
      --laby: 50;
    }
  }

  html, body { 
    height: 100%; 
    background: #000; 
    overflow: hidden; 
    margin: 0; 
    padding: 0; 
  }
  
  body { 
    -webkit-font-smoothing: antialiased; 
    text-rendering: geometricPrecision; 
    font-family: 'Space Grotesk', sans-serif;
  }

  .screen { 
    position: fixed; 
    inset: 0; 
    overflow: hidden; 
    background: #000; 
  }

  .bg, .bg2 { 
    position: absolute; 
    inset: 0; 
    overflow: hidden; 
    pointer-events: none; 
  }

  .bg { 
    filter: url(#grade); 
  }

  .bg video, .bg2 video {
    position: absolute; 
    inset: 0; 
    width: 100%; 
    height: 100%;
    object-fit: cover; 
    object-position: center top; 
    display: block;
  }

  .bg2 {
    filter: url(#grade2);
    mix-blend-mode: plus-lighter;
    opacity: .35;
    -webkit-mask-image: linear-gradient(180deg, transparent 21.5%, #000 100%);
    mask-image: linear-gradient(180deg, transparent 21.5%, #000 100%);
  }

  @media (max-width:1023px) {
    .bg2 { display: none; }
    .bg video { 
      object-position: right top; 
      transform: scale(1.18); 
      transform-origin: right top; 
    }
    .bg {
      -webkit-mask-image: linear-gradient(180deg, #000 0 40%, transparent 64%);
      mask-image: linear-gradient(180deg, #000 0 40%, transparent 64%);
    }
  }

  @media (max-width:599px) {
    .bg video, .bg2 video { object-position: 78% top; }
    .bg2 { 
      display: block; 
      -webkit-mask-image: linear-gradient(180deg, transparent 10%, #000 60%);
      mask-image: linear-gradient(180deg, transparent 10%, #000 60%);
    }
  }

  .svgdefs { position: absolute; width: 0; height: 0; overflow: hidden; }

  /* Frame and Elements */
  .frame {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  header {
    position: relative;
    width: 100%;
    height: calc(100 * var(--s));
  }

  .logo {
    position: absolute;
    left: calc(60 * var(--s));
    top: calc(35 * var(--s));
    width: calc(45 * var(--s));
    height: calc(45 * var(--s));
  }

  .logo svg {
    width: 100%;
    height: 100%;
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: butt;
  }

  nav {
    position: absolute;
    left: calc(482 * var(--s));
    top: calc(32 * var(--s));
    height: calc(58 * var(--s));
    display: flex;
    gap: calc(40 * var(--s));
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(19.9 * var(--s));
    color: #fff;
    align-items: center;
  }

  nav a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: calc(4 * var(--s));
  }

  nav a:nth-child(2) { margin-left: calc(13 * var(--s)); }
  nav a:nth-child(4) { margin-left: calc(-3 * var(--s)); }

  nav svg {
    width: calc(11.6 * var(--s));
    height: calc(7.2 * var(--s));
    margin-top: calc(-2.6 * var(--s));
    stroke: currentColor;
    stroke-width: 1.7;
    fill: none;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--red);
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 480;
  }

  .btn-top {
    position: absolute;
    left: calc(1232 * var(--s));
    top: calc(30 * var(--s));
    width: calc(212 * var(--s));
    height: calc(58 * var(--s));
    font-size: calc(20.85 * var(--s));
    letter-spacing: -0.62px;
    gap: calc(11 * var(--s));
    padding: 0 calc(22 * var(--s)) 0 calc(18 * var(--s));
  }

  .btn span {
    transform: translateY(calc(1.5 * var(--s)));
  }

  .btn svg {
    width: calc(21.5 * var(--s));
    height: calc(18 * var(--s));
    stroke: #fff;
    stroke-width: 2;
    fill: none;
    transition: transform 0.2s;
  }

  .btn:hover {
    background: #b01617;
  }

  .btn:hover svg {
    transform: translateX(calc(3 * var(--s)));
  }

  .hero {
    position: relative;
    width: 100%;
  }

  h1 {
    position: absolute;
    left: calc(73 * var(--s));
    top: calc(var(--h1y) * var(--s));
    margin: 0;
    font-size: calc(68.7 * var(--s));
    line-height: calc(76 * var(--s));
    letter-spacing: calc(-2.4 * var(--s));
    color: #fff;
    font-weight: 700;
  }

  .ln {
    display: block;
    overflow: hidden;
    padding-bottom: calc(6 * var(--s));
    margin-bottom: calc(-6 * var(--s));
  }

  .ln span {
    display: block;
  }

  .sub {
    position: absolute;
    left: calc(73 * var(--s));
    top: calc(var(--suby) * var(--s));
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(18.7 * var(--s));
    line-height: calc(26 * var(--s));
    letter-spacing: calc(-0.87 * var(--s));
    color: var(--sub);
    margin: 0;
  }

  .btn-cta {
    position: absolute;
    left: calc(73 * var(--s));
    top: calc(248 * var(--s));
    width: calc(212 * var(--s));
    height: calc(58 * var(--s));
    font-size: calc(20.85 * var(--s));
    letter-spacing: -0.62px;
    gap: calc(11 * var(--s));
    padding: 0 calc(22 * var(--s)) 0 calc(18 * var(--s));
  }

  .stats {
    position: relative;
    width: 100%;
    height: calc(120 * var(--s));
  }

  .stat {
    position: absolute;
    display: flex;
    flex-direction: column;
  }

  .stat-1 { left: calc(70.4 * var(--s)); }
  .stat-2 { left: calc(213.1 * var(--s)); }
  .stat-3 { left: calc(392.6 * var(--s)); }

  .stat .num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 480;
    font-size: calc(33.45 * var(--s));
    color: #fff;
  }

  .stat .lab {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 400;
    font-size: calc(21.9 * var(--s));
    letter-spacing: calc(-0.62 * var(--s));
    color: var(--lab);
    margin-top: calc(4 * var(--s));
  }

  .stat-3 .num {
    transform: translateX(calc(-4.4 * var(--s)));
  }

  .rule {
    position: absolute;
    top: 0;
    width: calc(1.5 * var(--s));
    height: calc(100 * var(--s));
    background: linear-gradient(180deg, rgba(255,255,255,.085), rgba(255,255,255,.21) 50%, rgba(255,255,255,.085));
    transform-origin: center;
  }

  .r1 { left: calc(181 * var(--s)); }
  .r2 { left: calc(356 * var(--s)); }

  .sp-a { flex: 239; }
  .sp-b { flex: 194; }
  .sp-c { flex: 115; }

  @media (max-width:1023px) {
    nav, .btn-top { display: none; }
    .sp-a { flex: 340; }
    .sp-b { flex: 276; }
    .sp-c { flex: 163; }
  }

  @media (max-width:599px) {
    .sp-a { flex: 106; }
    .sp-b { flex: 92; }
    .sp-c { flex: 56; }
  }

  /* Intro State */
  .intro .logo,
  .intro nav a,
  .intro .sub,
  .intro .stat .num,
  .intro .stat .lab {
    opacity: 0;
  }
  .intro .logo { transform: scale(0.9); }
  .intro nav a { transform: translateY(calc(7 * var(--s))); }
  .intro .sub { transform: translateY(calc(14 * var(--s))); }
  .intro .stat .num { transform: translateY(calc(12 * var(--s))); }
  .intro .stat .lab { transform: translateY(calc(10 * var(--s))); }
  .intro .rule { transform: scaleY(0); }
  .intro .btn-top,
  .intro .btn-cta { clip-path: inset(0 100% 0 0); }
  .intro .ln span { transform: translateY(120%); }

  /* Animations */
  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(var(--dy)); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes logoIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes wipe {
    0% { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  @keyframes lineRise {
    0% { transform: translateY(120%); }
    100% { transform: translateY(0); }
  }
  @keyframes ruleGrow {
    0% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }

  /* Easing */
  :root {
    --EXPO: cubic-bezier(.16,1,.3,1);
    --QUINT: cubic-bezier(.22,1,.36,1);
    --QUART: cubic-bezier(.25,1,.5,1);
    --TYPE: cubic-bezier(.22,.85,.24,1);
  }

  html:not(.intro) .logo { animation: logoIn 0.70s var(--EXPO) 0s both; }
  html:not(.intro) nav a:nth-child(1) { --dy: calc(7 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 0.12s both; }
  html:not(.intro) nav a:nth-child(2) { --dy: calc(7 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 0.175s both; }
  html:not(.intro) nav a:nth-child(3) { --dy: calc(7 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 0.23s both; }
  html:not(.intro) nav a:nth-child(4) { --dy: calc(7 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 0.285s both; }
  
  html:not(.intro) .btn-top { animation: wipe 0.66s var(--EXPO) 0.28s both; }
  
  html:not(.intro) .ln:nth-child(1) span { animation: lineRise 0.98s var(--TYPE) 0.34s both; }
  html:not(.intro) .ln:nth-child(2) span { animation: lineRise 0.98s var(--TYPE) 0.43s both; }
  
  html:not(.intro) .sub { --dy: calc(14 * var(--s)); animation: fadeUp 0.72s var(--QUINT) 0.74s both; }
  
  html:not(.intro) .btn-cta { animation: wipe 0.70s var(--EXPO) 0.90s both; }
  
  html:not(.intro) .r1 { animation: ruleGrow 0.60s var(--QUART) 0.98s both; }
  html:not(.intro) .r2 { animation: ruleGrow 0.60s var(--QUART) 1.05s both; }
  
  html:not(.intro) .stat-1 .num { --dy: calc(12 * var(--s)); animation: fadeUp 0.66s var(--QUINT) 1.04s both; }
  html:not(.intro) .stat-2 .num { --dy: calc(12 * var(--s)); animation: fadeUp 0.66s var(--QUINT) 1.125s both; }
  html:not(.intro) .stat-3 .num { --dy: calc(12 * var(--s)); animation: fadeUp 0.66s var(--QUINT) 1.21s both; }
  
  html:not(.intro) .stat-1 .lab { --dy: calc(10 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 1.10s both; }
  html:not(.intro) .stat-2 .lab { --dy: calc(10 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 1.185s both; }
  html:not(.intro) .stat-3 .lab { --dy: calc(10 * var(--s)); animation: fadeUp 0.62s var(--QUINT) 1.27s both; }
</style>
</head>
<body class="intro">

  <svg class="svgdefs">
    <filter id="grade" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.0018 0.0105 0.0154 0.0228 0.0307 0.0404 0.0485 0.0585 0.0719 0.0923 0.1205 0.1466 0.1657 0.1866 0.2197 0.2405 0.2485 0.2921 0.3362 0.3465 0.3472 0.3781 0.3781 0.4078 0.4199 0.4391 0.4604 0.4763 0.4798 0.5197 0.5473 0.5720 0.5995 0.6048 0.6232 0.6322 0.6483 0.6734 0.7201 0.7201 0.7410 0.7707 0.7707 0.7790 0.8084 0.8084 0.8390 0.8595 0.8707 0.8870 0.8993 0.9085 0.9132 0.9132 0.9162 0.9162 0.9162 0.9162 0.9162 0.9162 0.9162 0.9162 0.9162 0.9238 0.9300"/>
        <feFuncG type="table" tableValues="0.0023 0.0106 0.0159 0.0250 0.0333 0.0445 0.0535 0.0620 0.0707 0.0827 0.0936 0.1063 0.1214 0.1402 0.1678 0.1727 0.2029 0.2176 0.2461 0.2757 0.2814 0.3050 0.3415 0.3692 0.3826 0.3884 0.4617 0.4617 0.4617 0.4643 0.4643 0.4808 0.5706 0.6005 0.6005 0.6390 0.6390 0.6390 0.6390 0.6390 0.6390 0.6390 0.6390 0.6390 0.6524 0.6664 0.6805 0.6945 0.7086 0.7227 0.7367 0.7508 0.7648 0.7789 0.7929 0.8070 0.8211 0.8351 0.8492 0.8632 0.8773 0.8913 0.9054 0.9195 0.9300"/>
        <feFuncB type="table" tableValues="0.0021 0.0110 0.0187 0.0311 0.0377 0.0466 0.0584 0.0706 0.0791 0.0924 0.1039 0.1145 0.1316 0.1464 0.1614 0.1719 0.1887 0.2014 0.2247 0.2458 0.2954 0.2954 0.3089 0.3938 0.3938 0.3988 0.3988 0.4581 0.4581 0.4762 0.4762 0.4763 0.5374 0.5560 0.5813 0.5813 0.5813 0.5813 0.5835 0.5969 0.6104 0.6238 0.6373 0.6507 0.6642 0.6777 0.6911 0.7046 0.7181 0.7315 0.7449 0.7584 0.7719 0.7853 0.7988 0.8123 0.8257 0.8391 0.8526 0.8661 0.8795 0.8930 0.9065 0.9199 0.9300"/>
      </feComponentTransfer>
    </filter>
    <filter id="grade2" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.0016 0.0092 0.0136 0.0201 0.0270 0.0356 0.0427 0.0515 0.0633 0.0812 0.1060 0.1290 0.1458 0.1642 0.1933 0.2116 0.2187 0.2570 0.2959 0.3049 0.3055 0.3327 0.3327 0.3589 0.3695 0.3864 0.4052 0.4191 0.4222 0.4573 0.4816 0.5034 0.5276 0.5322 0.5484 0.5563 0.5705 0.5926 0.6337 0.6337 0.6521 0.6782 0.6782 0.6855 0.7114 0.7114 0.7383 0.7564 0.7662 0.7806 0.7914 0.7995 0.8036 0.8036 0.8063 0.8063 0.8063 0.8063 0.8063 0.8063 0.8063 0.8063 0.8063 0.8129 0.8184"/>
        <feFuncG type="table" tableValues="0.0015 0.0069 0.0103 0.0163 0.0216 0.0289 0.0348 0.0403 0.0460 0.0538 0.0608 0.0691 0.0789 0.0911 0.1091 0.1123 0.1319 0.1414 0.1600 0.1792 0.1829 0.1983 0.2220 0.2400 0.2487 0.2525 0.3001 0.3001 0.3001 0.3018 0.3018 0.3125 0.3709 0.3903 0.3903 0.4153 0.4153 0.4153 0.4153 0.4153 0.4153 0.4153 0.4153 0.4153 0.4241 0.4332 0.4423 0.4514 0.4606 0.4698 0.4789 0.4880 0.4971 0.5063 0.5154 0.5246 0.5337 0.5428 0.5520 0.5611 0.5702 0.5793 0.5885 0.5977 0.6045"/>
        <feFuncB type="table" tableValues="0.0013 0.0066 0.0112 0.0187 0.0226 0.0280 0.0350 0.0424 0.0475 0.0554 0.0623 0.0687 0.0790 0.0878 0.0968 0.1031 0.1132 0.1208 0.1348 0.1475 0.1772 0.1772 0.1853 0.2363 0.2363 0.2393 0.2393 0.2749 0.2749 0.2857 0.2857 0.2858 0.3224 0.3336 0.3488 0.3488 0.3488 0.3488 0.3501 0.3581 0.3662 0.3743 0.3824 0.3904 0.3985 0.4066 0.4147 0.4228 0.4309 0.4389 0.4469 0.4550 0.4631 0.4712 0.4793 0.4874 0.4954 0.5035 0.5116 0.5197 0.5277 0.5358 0.5439 0.5519 0.5580"/>
      </feComponentTransfer>
    </filter>
  </svg>

  <div class="screen">
    <div class="bg">
      <video id="vid1" autoplay muted loop playsinline preload="auto">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4">
      </video>
    </div>
    <div class="bg2">
      <video id="vid2" autoplay muted loop playsinline preload="auto">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4">
      </video>
    </div>

    <div class="frame">
      <header>
        <div class="logo">
          <svg viewBox="0 0 46 46">
            <path d="M23 0V19.5 M14 10.2L23 19.2L32 10.2" />
            <path d="M46 23H26.5 M35.8 14L26.8 23L35.8 32" />
            <path d="M23 46V26.5 M32 35.8L23 26.8L14 35.8" />
            <path d="M0 23H19.5 M10.2 32L19.2 23L10.2 14" />
          </svg>
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Resources
            <svg viewBox="0 0 11.6 7.2"><path d="M1 1L5.5 5L10 1"/></svg>
          </a>
          <a href="#">Benefits
            <svg viewBox="0 0 11.6 7.2"><path d="M1 1L5.5 5L10 1"/></svg>
          </a>
          <a href="#">Contact</a>
        </nav>
        <a href="#" class="btn btn-top">
          <span>Secure system</span>
          <svg viewBox="0 0 21.5 18">
            <path d="M0 9H20.1 M12.1 1L20.1 9L12.1 17"/>
          </svg>
        </a>
      </header>
      
      <div class="sp-a"></div>
      
      <section class="hero">
        <h1>
          <span class="ln"><span>Security built into</span></span>
          <span class="ln"><span>every system layer</span></span>
        </h1>
        <p class="sub">
          Engineered to stay resilient, controlled,<br>
          and uncompromised under pressure.
        </p>
        <a href="#" class="btn btn-cta">
          <span>Secure system</span>
          <svg viewBox="0 0 21.5 18">
            <path d="M0 9H20.1 M12.1 1L20.1 9L12.1 17"/>
          </svg>
        </a>
      </section>

      <div class="sp-b"></div>

      <section class="stats">
        <div class="stat stat-1">
          <span class="num">300+</span>
          <span class="lab">Clients</span>
        </div>
        <div class="rule r1"></div>
        <div class="stat stat-2">
          <span class="num">99%</span>
          <span class="lab">Satisfaction</span>
        </div>
        <div class="rule r2"></div>
        <div class="stat stat-3">
          <span class="num">$5M+</span>
          <span class="lab">Revenue</span>
        </div>
      </section>

      <div class="sp-c"></div>
    </div>
  </div>
  
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // Sync videos
      const master = document.getElementById('vid1');
      const slave = document.getElementById('vid2');
      if(master && slave) {
        master.addEventListener('timeupdate', () => {
          if (Math.abs(master.currentTime - slave.currentTime) > 0.12) {
            slave.currentTime = master.currentTime;
          }
        });
      }

      // Simulate load + ready
      setTimeout(() => {
        document.body.classList.remove('intro');
      }, 50);
    });
  </script>
</body>
</html>
`;

export default function SecurityLayer({ isPreview = false }: { isPreview?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return <div className="w-full h-[100vh] bg-[#000]" />;

  return (
    <div className={`w-full h-[100vh] min-h-[600px] bg-[#000] ${isPreview ? 'pointer-events-none' : ''}`}>
      <iframe
        srcDoc={htmlContent}
        title="Security Layer"
        className="w-full h-full border-none outline-none"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
