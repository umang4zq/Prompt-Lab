import React, { useState, useEffect } from 'react';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Stop Digging Through Dashboards</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
  /* The prompt mentions "Reference Sans" and "Reference Display" but those are commercial/private fonts. We'll fallback to a system UI or similar clean sans-serif like Roboto for the implementation */
  @font-face {
    font-family: 'Reference Sans';
    src: local('Roboto'), local('Helvetica Neue'), local('Arial');
  }
  @font-face {
    font-family: 'Reference Display';
    src: local('Roboto'), local('Helvetica Neue'), local('Arial');
  }

  :root {
    color-scheme: dark;
    font-family: "Reference Sans", Arial, sans-serif;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
  }
  
  .viewport {
    position: fixed;
    inset: 0;
    isolation: isolate;
    background: #000;
  }

  .screen {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: #000;
    
    /* Variables */
    --gutter-start: clamp(36px, 4.177vw, 96px);
    --gutter-end: clamp(36px, 4.04vw, 96px);
    --header-top: clamp(20px, 2.264vh, 30px);
    --hero-bottom: clamp(34px, 5.19vh, 64px);
    --display-size: clamp(58px, 7.64vh, 88px);
    --display-leading: clamp(72px, 9.34vh, 106px);
    --copy-size: clamp(14px, 1.70vh, 19px);
    --copy-leading: clamp(19px, 2.17vh, 24px);
    --title-copy-gap: clamp(15px, 2.08vh, 24px);
    --copy-cta-gap: clamp(24px, 3.11vh, 36px);
    --cta-width: clamp(142px, 15.09vh, 168px);
    --cta-height: clamp(38px, 3.96vh, 44px);
    --compact-control-font-size: clamp(17px, 1.75vh, 19px);
    --action-control-font-size: clamp(17px, 1.78vh, 19.5px);
    --primary-control-font-size: clamp(17px, 1.77vh, 19.25px);
    --control-inline-nudge: -1px;
    --control-baseline-shift: clamp(1px, .19vh, 2px);
    --copy-optical-shift: clamp(0px, .1vh, 1px);
    --watch-baseline-shift: clamp(2px, .38vh, 4px);
    --card-width: clamp(150px, 18.96vh, 215px);
  }

  .screen::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background: 
      linear-gradient(180deg, rgba(0,0,0,.03), transparent 24%, transparent 82%, rgba(0,0,0,.05)),
      radial-gradient(ellipse at 44% 54%, transparent 30%, rgba(0,0,0,.055) 100%);
    pointer-events: none;
  }

  .background {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
    user-select: none;
  }

  .header {
    position: absolute;
    inset: var(--header-top) var(--gutter-end) auto var(--gutter-start);
    height: 48px;
    display: flex;
    align-items: flex-start;
    white-space: nowrap;
  }

  .brand {
    position: relative;
    top: 10px;
    width: 25px;
    height: 25px;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,.3));
    display: block;
    cursor: pointer;
  }

  .brand svg {
    width: 100%;
    height: 100%;
    clip-path: circle(50% at 50% 50%);
  }

  .nav {
    display: flex;
    margin-left: clamp(36px, 3.03vw, 48px);
    gap: clamp(32px, 2.9vw, 43px);
    top: 9px;
    position: relative;
  }

  .nav a {
    text-decoration: none;
    font-size: 16px;
    font-weight: 430;
    letter-spacing: -.36px;
    color: rgba(229,229,230,.77);
    text-shadow: 0 1px 3px rgba(0,0,0,.55);
    position: relative;
  }

  .nav a:first-child { top: -3px; }
  .nav a:nth-child(4) { margin-left: 1px; }

  .nav a.active {
    color: #fff;
  }
  .nav a.active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 44px;
    height: 2px;
    background: rgba(255,255,255,.82);
  }

  .time-panel {
    margin-left: auto;
    width: 211px;
    height: 48px;
    padding-left: 8px;
    border-left: 2px solid rgba(230,230,230,.52);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .time-label {
    font-size: 15px;
    font-weight: 420;
    color: rgba(240,240,240,.77);
  }

  .time-value {
    font-size: 15px;
    font-weight: 440;
    color: rgba(255,255,255,.93);
    margin-top: 2px;
  }

  .sign-up {
    width: 109px;
    height: 42px;
    border-radius: 7px;
    background: #fff;
    color: #101010;
    font-weight: 500;
    letter-spacing: -.34px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 1px 5px rgba(0,0,0,.34);
    margin-left: clamp(20px, 1.95vw, 29px);
    border: none;
    cursor: pointer;
    font-size: 15px;
  }

  .menu-toggle {
    display: none;
  }

  .hero-content {
    position: absolute;
    left: var(--gutter-start);
    bottom: var(--hero-bottom);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-family: "Reference Display", "Reference Sans", Arial, sans-serif;
    font-weight: 500;
    font-optical-sizing: auto;
    letter-spacing: -2.1px;
    -webkit-text-stroke: .12px currentColor;
    white-space: nowrap;
    text-shadow: 0 2px 2px rgba(0,0,0,.44);
    margin: 0;
    font-size: var(--display-size);
    line-height: var(--display-leading);
  }

  .line {
    display: block;
    transform-origin: left center;
  }
  
  .line-one {
    color: #fff;
    transform: scaleX(.775);
  }
  
  .line-two {
    color: rgba(211, 207, 207, .78);
    transform: scaleX(.793);
  }
  
  .line-reveal {
    display: inline-block;
  }

  .hero-copy {
    color: rgba(226, 229, 228, .84);
    font-weight: 350;
    letter-spacing: .13px;
    width: clamp(390px, 31.67vw, 500px);
    position: relative;
    left: 1px;
    text-shadow: 0 1px 3px rgba(0,0,0,.7);
    font-size: var(--copy-size);
    line-height: var(--copy-leading);
    margin-top: var(--title-copy-gap);
    margin-bottom: var(--copy-cta-gap);
  }

  .primary-cta {
    position: relative;
    width: var(--cta-width);
    height: var(--cta-height);
    border-radius: 7px;
    background: #fff;
    color: #111;
    box-shadow: 0 1px 5px rgba(0,0,0,.38);
    border: none;
    cursor: pointer;
  }

  .primary-cta .label {
    position: absolute;
    left: 8.125%;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 450;
    letter-spacing: -.3px;
    font-size: var(--primary-control-font-size);
  }

  .primary-cta .arrow-box {
    position: absolute;
    right: 3.125%;
    top: 14.286%;
    width: 20.625%;
    height: 71.429%;
    border-radius: 7px;
    background: #070909;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .demo-card {
    position: absolute;
    right: var(--gutter-end);
    bottom: var(--hero-bottom);
    width: var(--card-width);
    aspect-ratio: 201 / 265;
    container-type: inline-size;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: clamp(12px, 1.52vh, 18px);
    background: linear-gradient(145deg, rgba(24,22,20,.80), rgba(5,12,14,.86));
    box-shadow: 0 2px 10px rgba(0,0,0,.44), 0 0 0 3px rgba(255,255,255,.035) inset, 0 0 0 1px rgba(0,0,0,.9);
    backdrop-filter: blur(14px) saturate(108%);
    -webkit-backdrop-filter: blur(14px) saturate(108%);
    padding: 4cqw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .demo-visual {
    position: relative;
    width: 92.5cqw;
    height: 92cqw;
    border-radius: 4cqw;
    background: #101a1e;
    overflow: hidden;
    margin: 0 auto;
    margin-top: -0.5cqw;
  }

  .demo-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(.89) saturate(.93) contrast(1.03);
  }

  .play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 29cqw;
    height: 29cqw;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.34);
    background: rgba(3,5,7,.47);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .play-button svg {
    width: 10cqw;
    height: 10cqw;
    fill: #fff;
    margin-left: 2cqw;
  }

  .watch-button {
    width: 100%;
    margin-top: auto;
    height: 20cqw;
    background: linear-gradient(145deg, rgba(26,34,36,.86), rgba(16,29,33,.9));
    border: 1px solid rgba(255,255,255,.21);
    border-radius: 4cqw;
    color: #fff;
    font-weight: 430;
    cursor: pointer;
    font-size: 8cqw;
  }
  
  /* Animations */
  .motion-pending .header,
  .motion-pending .nav,
  .motion-pending .time-panel,
  .motion-pending .sign-up,
  .motion-pending .hero-copy,
  .motion-pending .primary-cta,
  .motion-pending .demo-card {
    opacity: 0;
  }

  .motion-pending .hero-title .line {
    overflow: hidden;
  }
  
  .motion-pending .line-reveal {
    transform: translate3d(0, 110%, 0) skewY(2deg);
  }

  @keyframes entrance-brand {
    0% { opacity: 0; transform: translateY(7px) scale(.94); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes entrance-nav {
    0% { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes entrance-action {
    0% { opacity: 0; transform: translateY(8px) scale(.985); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes entrance-line {
    0% { transform: translate3d(0, 110%, 0) skewY(2deg); }
    100% { transform: translate3d(0, 0, 0) skewY(0); }
  }

  @keyframes entrance-copy {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes entrance-card {
    0% { opacity: 0; transform: translateY(12px) scale(.968); transform-origin: 82% 50%; }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* When JS runs, it will apply these animations */
  html:not(.motion-pending) .brand { animation: entrance-brand 580ms cubic-bezier(.16,1,.3,1) 60ms both; }
  html:not(.motion-pending) .nav a:nth-child(1) { animation: entrance-nav 480ms cubic-bezier(.16,1,.3,1) 130ms both; }
  html:not(.motion-pending) .nav a:nth-child(2) { animation: entrance-nav 480ms cubic-bezier(.16,1,.3,1) 175ms both; }
  html:not(.motion-pending) .nav a:nth-child(3) { animation: entrance-nav 480ms cubic-bezier(.16,1,.3,1) 220ms both; }
  html:not(.motion-pending) .nav a:nth-child(4) { animation: entrance-nav 480ms cubic-bezier(.16,1,.3,1) 265ms both; }
  html:not(.motion-pending) .time-panel { animation: entrance-nav 520ms cubic-bezier(.16,1,.3,1) 180ms both; }
  html:not(.motion-pending) .sign-up { animation: entrance-action 520ms cubic-bezier(.16,1,.3,1) 220ms both; }
  
  html:not(.motion-pending) .line-one .line-reveal { animation: entrance-line 800ms cubic-bezier(.22,1,.36,1) 300ms both; }
  html:not(.motion-pending) .line-two .line-reveal { animation: entrance-line 850ms cubic-bezier(.22,1,.36,1) 440ms both; }
  
  html:not(.motion-pending) .hero-copy { animation: entrance-copy 620ms cubic-bezier(.16,1,.3,1) 740ms both; }
  html:not(.motion-pending) .primary-cta { animation: entrance-action 560ms cubic-bezier(.16,1,.3,1) 960ms both; }
  html:not(.motion-pending) .demo-card { animation: entrance-card 920ms cubic-bezier(.22,1,.36,1) 1040ms both; }

  button, a { transition: filter 140ms, opacity 140ms; }
  button:hover, a:hover { filter: brightness(1.08); }
  button:focus-visible, a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

  @media (max-width: 619px) {
    .nav, .time-panel, .sign-up { display: none; }
    .hero-title { transform: scaleX(.78); }
    .hero-copy br { display: none; }
    .demo-card {
      top: clamp(176px, 32svh, 300px);
      bottom: auto;
    }
  }

  @media (min-width: 620px) and (max-width: 1100px) {
    .nav, .time-panel, .sign-up { display: none; }
  }
</style>
</head>
<body class="motion-pending">
  <main class="viewport">
    <section class="screen" id="screen">
      <video class="background" autoplay muted loop playsinline disablepictureinpicture aria-hidden="true">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4" type="video/mp4">
      </video>
      
      <header class="header">
        <a class="brand" aria-label="Vantage home">
          <svg viewBox="0 0 25 25">
            <rect width="25" height="25" fill="#ededed"/>
            <path d="M12.5 0 L25 12.5 L12.5 25 L0 12.5 Z" fill="#737778" opacity="0.5"/>
          </svg>
        </a>
        <div class="header-actions" id="tablet-navigation">
          <nav class="nav">
            <a href="#" class="active">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
          <div class="time-panel">
            <span class="time-label">Timezone</span>
            <span class="time-value">9:47 PM&nbsp; • &nbsp;14 July 2026</span>
          </div>
          <button class="sign-up">Sign Up</button>
        </div>
      </header>
      
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="line line-one"><span class="line-reveal">Stop Digging</span></span><br>
            <span class="line line-two"><span class="line-reveal">Through Dashboards.</span></span>
          </h1>
          <p class="hero-copy">
            Your metrics are scattered across a dozen dashboards.<br>
            Vantage bring them into one clear signal, so every<br>
            decision is backed by data you actually trust.
          </p>
          <button class="primary-cta">
            <span class="label">Get Started</span>
            <div class="arrow-box">
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="#fff" stroke-width="1.5">
                <path d="M2 7h10M7 2l5 5-5 5"/>
              </svg>
            </div>
          </button>
        </div>
        
        <article class="demo-card">
          <div class="demo-visual">
            <!-- Simulated thumbnail gradient since we don't have the exact image asset locally -->
            <div style="width:100%;height:100%;background:linear-gradient(45deg, #400, #004);"></div>
            <button class="play-button" aria-label="Play demo">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <button class="watch-button">Watch Demo</button>
        </article>
      </section>
    </section>
  </main>
  
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // Small timeout to simulate frame render, then trigger entrance
      setTimeout(() => {
        document.body.classList.remove('motion-pending');
      }, 50);
      
      const card = document.querySelector('.demo-card');
      card.addEventListener('animationend', () => {
        document.documentElement.classList.remove('motion-pending');
      });
    });
  </script>
</body>
</html>
`;

export default function Vantage({ isPreview = false }: { isPreview?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return <div className="w-full h-[100vh] bg-[#000]" />;

  return (
    <div className={`w-full h-[100vh] min-h-[600px] bg-[#000] ${isPreview ? 'pointer-events-none' : ''}`}>
      <iframe
        srcDoc={htmlContent}
        title="Vantage"
        className="w-full h-full border-none outline-none"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
