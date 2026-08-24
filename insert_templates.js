require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    realtime: { transport: ws }
  }
);

const prompt1 = `### Overview
Build a full-screen, scroll-driven fashion/archive landing page for a brand called "prmpt". The page has two main phases:

1. **Hero phase** (first 100vh of scroll): Full-viewport video background with overlaid UI (logo, nav, product info, custom cursor). A black panel slides up from below covering the video.
2. **Gallery phase** (continues scrolling): The black panel contains a scattered grid of product images that scale in/out as they enter/exit the viewport. At the end, a white overlay fades in with a "view" CTA button.

---

### Tech Stack
- **React 19** + **TypeScript**
- **Vite 6** with \`@vitejs/plugin-react\`
- **Tailwind CSS v4** via \`@tailwindcss/vite\` plugin
- **GSAP 3.15** + \`@gsap/react\` (ScrollTrigger)
- **Motion (Framer Motion) 12** (\`motion/react\`)
- **Font**: "Inter Tight" (Google Fonts, weight 500) -- loaded via \`<link>\` or import

---

### Asset URLs
**Videos (CloudFront):**
- LEFT video: \`https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4\`
- RIGHT video: \`https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4\`

**Gallery Images (10 total, in order):**
1. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85\`
2. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85\`
3. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85\`
4. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85\`
5. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85\`
6. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85\`
7. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85\`
8. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85\`
9. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85\`
10. \`https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85\`

---

### SECTION 1: Hero (Video Background + Overlaid UI)

#### Root Container
- \`id="scroll-spacer"\`, \`position: relative\`, \`user-select: none\`, \`background: white\`
- Height is dynamically calculated (initially \`500vh\`, then overridden by GSAP to \`vh + maxScroll + 2*vh\`)
- Custom cursor hidden on desktop (\`cursor: none\`), default on touch devices

#### 1A. Custom Cursor (Desktop Only)
- Hidden on mobile/tablet (< 1024px)
- A \`fixed\`, \`pointer-events-none\`, \`z-index: 50\` div that follows \`mousemove\`
- Positioned via direct DOM manipulation (\`style.left/top = clientX/clientY\`)
- \`transform: translate(-50%, -50%)\` to center on pointer
- \`mix-blend-mode: exclusion\`
- Contains a 48x48 SVG: a circle with stroke (r=22.75, strokeWidth=2.5) containing a custom Japanese/decorative glyph path, all filled white

#### 1B. Logo (Top Left)
- \`position: fixed\`, \`pointer-events-none\`, \`z-index: 20\`
- \`mix-blend-mode: exclusion\`
- Responsive width: 124px (mobile < 640), 266px (tablet 640-1024), 355px (desktop)
- Position: \`top: 16px, left: 16px\` (mobile), \`top: 32px, left: 32px\` (desktop)
- Motion animation: fade in + slide up (\`opacity: 0->1, y: 12->0\`), duration 0.6s, ease \`[0.25, 0.1, 0.25, 1]\`, delay 0s
- SVG viewBox \`0 0 355 110\`, contains the "prmpt" wordmark + circled "R" mark, all paths filled white

#### 1C. Caption (Below Logo, Left Side)
- \`position: fixed\`, \`pointer-events-none\`, \`z-index: 20\`
- \`mix-blend-mode: exclusion\`
- Position: \`left: 32px\` (desktop), \`left: 16px\` (mobile)
- Top: 244px (desktop), 180px (tablet), 118px (mobile)
- Width: 692px (desktop), \`calc(50vw - 48px)\` (tablet), \`calc(100vw - 32px)\` (mobile)
- Font: Inter Tight, weight 500, size 12px, line-height 140%, letter-spacing -0.04em, color #FFFFFF
- Motion animation: same as logo but delay 0.3s
- Text content: "When switching between videos near the center, do not reset currentTime to 0 abruptly. Add a small dead zone: if cursor is within +/-50px of center, keep both videos at currentTime = 0 and show whichever was last active."

#### 1D. Header Navigation (Top Right)
- \`position: fixed\`, \`z-index: 20\`, \`pointer-events-none\`
- \`mix-blend-mode: exclusion\`
- Position: \`top: 32px, right: 32px\` (desktop), \`top: 16px, right: 16px\` (mobile)
- Width: 330px (desktop), auto (mobile)
- Height: 30px
- Flex row, justify-content: space-between, align-items: center
- Motion animation: same easing, delay 0.15s
- Contains:
  - "ABOUT" text (hidden on mobile): Inter Tight, 500, 15px, uppercase, white
  - A flex row with gap 50px (desktop) / 20px (mobile):
    - Hamburger SVG icon: viewBox \`0 0 40 40\`, two horizontal lines (\`M0 14H40\` and \`M0 26H40\`), stroke white, strokeWidth 2.5. Size: 30x30 (desktop), 24x24 (mobile)
    - "[ CART ]" text: Inter Tight, 500, 15px (desktop) / 13px (mobile), white

#### 1E. Product Info (Bottom Right)
- \`id="outro-info"\`, \`position: fixed\`, \`pointer-events-none\`, \`z-index: 20\`
- \`mix-blend-mode: exclusion\`
- **Desktop**: right: 32px, bottom: 80px, width: 330px, flex-column, align center
- **Mobile**: left: 0, right: 0, bottom: 48px, flex-column, align center
- Motion animation: opacity 0->1, delay 0.45s
- \`data-outro-offset\`: 166 (desktop), 132 (mobile) -- used by scroll animation
- Contains:
  - Top block (flex-column, align flex-start, width 100% desktop / 252px mobile, margin-bottom 32px desktop / 12px mobile):
    - Circle icon: relative div (30x30 desktop, 20x20 mobile) containing:
      - SVG circle (cx=20, cy=20, r=18.75, stroke white, strokeWidth 2.5 desktop / 2 mobile)
      - \`<span id="circle-symbol">\` centered inside, shows "8" initially, changes to random symbol from \`['8', '$', '^^', '%', '/']\` on scroll (throttled 80ms)
      - Font: Inter Tight, 500, 15px (desktop) / 10px (mobile), letter-spacing -0.04em, uppercase, white
    - Collection label: Inter Tight, 500, 30px (desktop) / 20px (mobile), line-height 100%, text-align center, letter-spacing -0.04em, uppercase, white. Content: \`ARCHIVE COLLECTION\` + line break + \`"PROMPT"\`
  - Price: Inter Tight, 500, 80px (desktop) / 60px (mobile), line-height 100%, text-align center, letter-spacing -0.04em, white. Content: \`$97,33\`

#### 1F. "View" Button (Bottom Right, Initially Hidden)
- \`id="outro-buy"\`, \`position: fixed\`, \`pointer-events-none\`, \`z-index: 20\`
- \`mix-blend-mode: exclusion\`
- **Desktop**: right: 32px, bottom: 32px, width: 330px, height: 174px
- **Mobile**: left: 16px, right: 16px, bottom: 60px, height: 100px
- \`transform-origin: right bottom\`, \`transform: scale(0)\` (starts hidden, scales to 1 via scroll)
- Background: #fff, border-radius: 1335px (pill shape)
- Flex center
- Text "view": Inter Tight, 500, 110px (desktop) / 72px (mobile), letter-spacing -0.04em, color #fff, \`mix-blend-mode: exclusion\`

#### 1G. Video Container
- \`id="main-canvas"\`, \`pointer-events-none\`
- **Desktop**: \`position: fixed, inset: 0, width: 100%, height: 100%, z-index: 0\`
- **Mobile**: \`position: fixed, left: 0, top: 220px, width: 100vw, height: calc(100vh - 220px), z-index: 0\`
- Opacity transition: 0 -> 1 when both videos loaded (\`opacity 0.3s ease\`)
- \`overflow: hidden\`
- Contains two \`<video>\` elements (muted, playsInline, preload="auto"), absolutely positioned to fill container, \`object-fit: cover\`
- Left video starts \`display: none\`, right starts \`display: block\`

**Desktop (non-touch):**
- Videos are NOT auto-played. They are scrubbed based on cursor X position via \`requestAnimationFrame\`.
- Dead zone: \`Math.max(30, width * 0.05)\` pixels from center
- If cursor is in dead zone, keep current video at \`currentTime = 0\`
- If cursor moves left of dead zone: show RIGHT video, scrub it based on distance from center-left-edge to left edge
- If cursor moves right of dead zone: show LEFT video, scrub it based on distance from center+deadzone to right edge
- \`activeSideRef\` tracks which side was last active, only changes when cursor exceeds dead zone
- Progress calculation: \`(distance from dead zone edge) / (available range)\` mapped to \`0...video.duration\`
CRITICAL: Only update currentTime when !video.seeking -- this prevents jittery playback by waiting for the browser to finish rendering the previous seek before requesting a new one.

#### 1H. Video Interaction Logic
**Mobile/Tablet (touch):**
- Videos auto-play alternately: left plays first, on \`ended\` event switches to right, on right \`ended\` switches back to left
- Respects \`prefers-reduced-motion\`

#### 1I. White Overlay
- \`id="outro-overlay"\`, \`position: fixed, inset: 0\`, \`pointer-events-none\`, \`z-index: 12\`
- Background: #fff, opacity: 0 (controlled by scroll)

#### 1J. Footer
- \`id="outro-footer"\`, \`position: fixed\`, \`pointer-events-none\`
- Left: 16px, bottom: 32px (desktop) / 24px (mobile)
- \`mix-blend-mode: exclusion\`, opacity: 0 (controlled by scroll)
- Flex row, gap: 80px (desktop) / space-between (mobile)
- Two spans: "PRMPT (R) 2026" and "PRIVACY POLICY"
- Font: Inter Tight, 500, 13px (desktop) / 11px (mobile), letter-spacing -0.02em, uppercase, white

---

### SECTION 2: Black Panel (Gallery)

#### Container
- \`position: fixed, inset: 0\`, background: black, \`z-index: 10\`
- Initially translated \`translateY(100vh)\` (off-screen below)
- Slides up to \`translateY(0)\` during first 100vh of scroll via GSAP ScrollTrigger (scrub: true, ease: none)

#### Inner Wrapper
- \`width: 100%\`, \`padding-top: min(400px, 40vh)\`

#### Grid Layout Algorithm
- Responsive columns: 2 (< 640px), 3 (640-1024px), 4 (>= 1024px)
- Each cell has \`aspect-ratio: 2/3\`
- Layout function \`buildLayout(count, cols)\` creates rows:
  - For each row \`r\`, compute primary column: \`a = (r * 2 + (r % 2)) % cols\`
  - Place one image at column \`a\`
  - Every 3rd row (\`r % 3 === 0\`), place a second image at \`b = (a + 2) % cols\` (or \`(a+1)%cols\` if same as a)
  - Empty cells get \`-1\` (rendered as empty spacer divs)

#### Card Behavior
- Each card has class \`bp-card\`, \`will-change: transform\`
- \`transform: scale(0)\` initially
- \`transform-origin\`: cards in left half of grid get \`right bottom\`, right half get \`left bottom\`
- Scale is computed per-frame in RAF based on card's vertical position:
  - **Enter**: \`Math.min(1, (vh - top) / (vh * 0.6))\` -- scales from 0 to 1 as it enters viewport
  - **Exit**: \`Math.min(1, bottom / (vh * 0.4))\` -- scales from 1 to 0 as it exits top
  - Final scale: \`Math.min(enter, exit)\`
  - If card is fully off-screen (bottom <= 0 or top >= vh): \`scale(0)\`

#### Scroll Phases (RAF-based, NOT scroll events)
- **Phase 1** (scrollY 0 to vh): Panel slides up. Cards are computed with panelOffset = \`vh - scrollY\`
- **Phase 2** (scrollY > vh): Panel is fixed at top. Inner wrapper translates up: \`translateY(-(scrollY - vh))\`. Cards recomputed with phase2 offset.
- **Outro** (scrollY > vh + maxScroll): White overlay fades in, product info slides up by \`outroOffset\` px, "view" button scales from 0 to 1, footer fades in. Progress: \`(scrollY - vh - maxScroll) / (vh - 100)\`

#### Spacer Height Calculation
- Set dynamically: \`vh + maxScroll + 2 * vh\` where \`maxScroll = wrapScrollHeight - vh\`

---

### CSS (index.css)

\`\`\`css
@import "tailwindcss";

.bp-card {
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .bp-card {
    will-change: auto;
  }
}
\`\`\`

---

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: >= 1024px

---

### Key Design Principles
- All text overlays use \`mix-blend-mode: exclusion\` to remain visible against both light and dark backgrounds
- No visible scroll bar interaction -- entirely RAF-driven position tracking
- \`pointer-events-none\` on all overlaid UI elements
- \`user-select: none\` on root container
- Videos hidden (\`visibility: hidden\`) once scroll passes first viewport height
- Circle symbol randomizes on scroll (throttled to 80ms)
- Entry animations staggered: logo (0s), nav (0.15s), caption (0.3s), product info (0.45s)`;

const prompt2 = `Create a single-page React + Vite landing page for "Marketeam" -- a marketing talent platform. Use Inter (400, 500, 600, 700) and Urbanist (600, 700) from Google Fonts. The page is a full-viewport hero with a header, left content area, right animated circles visualization, and a bottom logo ticker strip.

---

### Background

Full-page background image covering the entire viewport:
\`\`\`
https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_111401_56af5012-2263-45d3-849a-8688084d7c2a.png&w=1280&q=85
\`\`\`
Applied as \`background: url(...) center center / cover no-repeat\` on the root \`.app\` container.

---

### Header

- Flexbox row, \`justify-content: space-between\`, padding \`24px 64px\`, max-width \`1920px\`, centered.
- **Left side**: Logo image + nav links
  - Logo: \`<img>\` with height 32px from: \`https://polo-pecan-73837341.figma.site/_assets/v11/17ae538989a509947a8de3892c644664895e69b1.png\`
  - Nav links: "Your Team", "Solutions", "Blog", "Pricing" -- color \`#000000\`, 15px, font-weight 400, with underline animation on hover (scaleX from 0 to 1, transform-origin left, 0.3s ease).
- **Right side**: "Log In" link + "Join Now" button
  - Log In: color \`#ffffff\`, 15px, weight 500, same underline hover as nav but white.
  - Join Now: pill button (border-radius 50px), black bg (\`#000000\`), white text, padding \`12px 26px\`, 15px, weight 500. On hover a \`#A068FF\` fill slides in from left using \`::after\` with \`translateX(-100%)\` to \`translateX(0)\`, cubic-bezier(0.22, 1, 0.36, 1), 0.4s. Button uses \`overflow: hidden\`.
  - The button is wrapped in a \`.btn-border-wrap\` div that has a rotating conic-gradient border using \`::before\` with \`inset: -3px\`, \`padding: 3px\`, mask technique for border-only effect. The gradient is: \`conic-gradient(from var(--border-angle), #A068FF, #070319, #A068FF, #070319, #A068FF)\`. It rotates via CSS \`@property --border-angle\` from \`0deg\` to \`360deg\` in 3s linear infinite.

---

### Hero Left

- \`flex: 0 1 600px\`, \`padding-top: 40px\`
- **Heading**: Typewriter effect, font Urbanist, 64px, weight 600, line-height 64px, letter-spacing -1.5px. Text: "Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!". The first 67 characters are colored \`#000000\`, the rest \`#ffffff\`. A blinking purple cursor (\`#A068FF\`) appears during typing. Typing speed: 35ms per character, starts after 400ms delay.
- **"Start Project" button**: Same pill style as Join Now but slightly larger (padding \`14px 28px\`, 16px), bg \`#060218\`. Has a right-arrow chevron SVG icon (18x18). Hover fill slides from right (\`translateX(100%)\` to \`translateX(0)\`). Also wrapped in \`.btn-border-wrap\` with the same rotating gradient border. Appears after typing finishes (animation-delay 3.2s).
- **Cursor element**: A purple cursor icon (SVG: pointer arrow filled \`#A068FF\`) + "David" label (pill badge, bg \`#A068FF\`, white text, 16px, weight 500, padding \`8px 16px\`, border-radius 20px). Positioned \`margin-left: 290px\`, \`margin-top: 40px\`. Appears with animation-delay 3.6s.

---

### Hero Right -- Circles Visualization

- Container: \`720x720px\`, centered.
- 4 concentric circles (orbits), each rotating slowly:
  - Orbit 1 (innermost): 353px diameter, spins left (counterclockwise) 30s
  - Orbit 2: 501px diameter, spins right 40s
  - Orbit 3: 649px diameter, spins right 50s
  - Orbit 4 (outermost): 797px diameter, spins left 60s
- Each circle has a 1px gradient border: \`linear-gradient(180deg, rgba(217, 161, 255, 0) 0%, rgba(217, 161, 255, 1) 43%, rgba(217, 161, 255, 0) 100%)\` applied via the mask technique.
- **Center circle (orbit-1)**: Displays an animated count-up number "20k+" (Urbanist 64px, weight 500) and "Specialists" label (Urbanist 16px, weight 600). Counter-rotates to stay upright.
- **Avatars** placed on orbits using \`transform: translate(-50%, -50%) rotate(Xdeg) translate(radius) rotate(-Xdeg)\`:
  - Avatar images (58px default, some 78px/88px) from these URLs:
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/aa51718fb3af3637e6d666b6543fc27a175fada6.png\` (orbit 1, at 270deg, 177px radius, square with border-radius 20px, purple glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/ca755f7f93c1126fb8bdbf99ab364a33aa9ab272.png\` (orbit 2, at 60deg, 251px, round, yellow glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/dc01064c7093dcc32674876ee3cf5e41c4a485c6.png\` (orbit 2, at 180deg, 251px, 78px, pink glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/d5470a58b02388336141575048720f19a50de832.png\` (orbit 2, at 300deg, 251px, square border-radius 20px, blue glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/018736aa5d0275c4ce56cfebaf2ae3007d81ca1e.png\` (orbit 3, at 130deg, 325px, 88px, pink glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/c76d8a0b99676de31c014344bfaf75bad090758d.png\` (orbit 4, at 30deg, 399px, purple glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/7b1b5f039de7b54cc9913e96c1923c3b15a157fa.png\` (orbit 4, at 95deg, 399px, 88px, square border-radius 24px, orange glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/9ae171d8895199349755c43fbff00e122221a027.png\` (orbit 4, at 220deg, 399px, 88px, square border-radius 24px, pink glow)
    - \`https://polo-pecan-73837341.figma.site/_assets/v11/926c9eb7b4bc1df846fa0e39f0b0dc3fefd80671.png\` (orbit 4, at 320deg, 399px, purple glow)
  - Each avatar has a staggered fly-in animation (scale 0.3 + rotate -180deg + blur -> normal), delays from 0.6s to 2.3s.

---

### Logo Ticker (Bottom)

- Horizontal infinitely scrolling strip of partner logos, \`gap: 64px\`, 20s animation.
- Fade masks on left/right edges (linear-gradient mask).
- 5 unique SVG logos repeated 4x for seamless loop:
  - \`https://polo-pecan-73837341.figma.site/_assets/v11/1e7b0e6fcc016cd28aec5c68990118b8c54c35a5.svg\`
  - \`https://polo-pecan-73837341.figma.site/_assets/v11/3eac03c183db2ae080d910159211c14843398b61.svg\`
  - \`https://polo-pecan-73837341.figma.site/_assets/v11/17705a4c0023a0e5a99154dfb10582adbbf4260b.svg\`
  - \`https://polo-pecan-73837341.figma.site/_assets/v11/0e5f442b09dc5c248e3e60d40a65505fb1887228.svg\`
  - \`https://polo-pecan-73837341.figma.site/_assets/v11/63f99030ceb459e3c9ab9e429cfa2353491d3816.svg\`
- Each logo: \`width: 137px\`, \`height: 40px\`, \`object-fit: contain\`.

---

### Entrance Animations

- Header: fade-down (translateY -20px to 0, 0.8s)
- Hero left: fade-up (translateY 40px to 0, 1s)
- Hero right circles: scale-in (scale 0.85 to 1 + opacity, 1.2s, delay 0.3s)
- Logos section: fade-up, delay 0.6s
- All using \`cubic-bezier(0.22, 1, 0.36, 1)\` easing.

---

### Responsive Breakpoints

- **1280px**: circles scale 0.85
- **1024px**: stack layout (flex-direction column), heading 48px, circles scale 0.7, nav gap shrinks
- **768px**: hide nav, heading 36px, circles scale 0.5
- **480px**: heading 28px, circles scale 0.4, smaller buttons/logos

---

### Key Colors

- Primary accent: \`#A068FF\`
- Background dark: \`#060218\` / \`#070319\`
- Text dark: \`#000000\`
- Text light: \`#ffffff\`
- Body bg fallback: \`#0a0a0a\`

---

### Technical Details

- React (useState, useEffect, useRef), Vite build
- Custom \`useCountUp\` hook: animates 0 to 20 over 2s with easeOutCubic, starts after 1.2s delay
- \`TypewriterHeading\` component: types char by char at configurable speed
- CSS \`@property --border-angle\` for the animated border gradient
- No external animation libraries -- pure CSS animations + JS for typewriter/counter`;

const prompt3 = `## Prompt to Recreate This Hero Section

Build a full-screen hero section for a creative portfolio using React, Vite, Tailwind CSS, and the Figtree Google Font. The page has two components: a **Navbar** and a **Hero**. No additional packages beyond \`lucide-react\` (though it's not used here). The entire page is black background with white text.

---

### Setup

- **Font:** Figtree (400, 500, 600) from Google Fonts, loaded in \`index.html\`
- **Tailwind custom breakpoints (max-width based):**
  - \`mobile\`: max 809.98px
  - \`md-tablet\`: min 810px, max 1199.98px
- **CSS variable:** \`--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)\`

---

### Video Background

Three full-screen looping videos (muted, autoPlay, playsInline, loop) stacked absolutely with crossfade switching. All three render simultaneously; only the active one has \`opacity-100\`, the others have \`opacity-0\` with \`transition-opacity duration-[1200ms] ease-in-out\`.

**Video URLs (CloudFront):**
1. \`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4\`
2. \`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4\`
3. \`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4\`

**Preloading:** On mount, fetch all videos as blobs and create object URLs for instant playback. Fall back to original URL on failure.

A \`bg-black/10\` overlay sits above videos at \`z-[1]\`.

---

### Navbar (absolute positioned, z-10, on top of hero)

- **Layout:** Centered container, max-width 1340px, \`py-9 px-[15px]\`
- **Left side:** Navigation items formatted as \`01 / Works\`, \`02 / Services\`, \`03 / About\`, \`04 / Contact\`
  - Index number: \`text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase\`
  - Label: \`text-xs leading-4 tracking-[-0.12px] font-medium uppercase\`
  - Each link has a \`.nav-link-underline\` effect (underline slides in from right on hover via \`scaleX\` transform)
- **Right side (aligned right):** Email \`Davies@gmail.com\` and live clock showing \`CUP HH:MM:SS\` (24h format, updates every second using \`Intl.DateTimeFormat('en-GB')\`)
- **Mobile:** Nav items hidden, replaced by a \`Menu\`/\`Close\` toggle button. Mobile panel uses CSS Grid \`grid-rows-[0fr]\`/\`grid-rows-[1fr]\` transition (420ms, spring ease) for smooth expand/collapse. Mobile nav links are large: \`text-[28px] leading-8 tracking-[-0.84px]\`

---

### Hero Content (z-[2], relative)

Container: \`max-w-[1340px]\`, full height, flex column, \`justify-end items-end\`, \`gap-[150px]\`, \`pt-[190px] px-[15px]\`

**Section 1 - Video Switcher + Availability (upper area):**
- Left column (\`flex-[4]\`): Three buttons labeled \`01 / WATER WAVE\`, \`02 / GRIDWAVE\`, \`03 / LIGHT TUNNEL\`. Active button is full opacity, inactive is \`opacity-55\` with \`hover:opacity-75\`. On click, sets \`activeIndex\` to crossfade videos. Each has a \`.role-link\` class that translates 4px right on hover.
- Right column (\`flex-1\`): Pulsing dot + "Available for work" text. Dot is 7px circle with glow shadow and infinite pulse animation (scale 1 to 1.45, opacity 1 to 0.45, 1.6s). On slide 1, dot is \`#F598F2\` pink with pink glow. On slides 2-3, dot is white with white glow.

**Section 2 - Name + CTA (bottom area, pb-[60px]):**
- Left column (\`flex-[2]\`): Giant name "Viktor." in \`text-[200px] leading-[81%] tracking-[-6px] font-medium uppercase\`. The period is accent-colored: pink \`#F598F2\` on slide 1, white on slides 2-3. Animate in with \`revealUp\` (translateY 80px to 0, 0.9s spring ease).
- Right column (\`flex-1\`, \`pl-[50px]\`): Paragraph text ("I craft bold brands and modern websites with purpose...") at \`text-base leading-6 tracking-[-0.16px] font-medium\`. Below it, a "start a project" button (lowercase) with white border. Button has a fill-up hover effect: \`::before\` pseudo-element with \`#F598F2\` background that translateY from 101% to 0 on hover, text turns black, border turns pink. Both animate in with \`revealRight\` (translateX 100px to 0, 0.9s spring ease), button delayed by 0.08s.

**Reveal animations** trigger once via IntersectionObserver at 0.35 threshold.

---

### Responsive Tablet (810px-1199px)
- Navbar: \`py-[30px] px-[18px]\`, nav gaps shrink to \`gap-4\`
- Hero name: \`text-[129.6px] leading-[113.4px] tracking-[-7.7px]\`
- Bottom section: gap 28px, pb 52px, left padding 24px

### Responsive Mobile (<810px)
- Navbar: \`py-6 px-[18px]\`, desktop nav hidden, hamburger menu shown
- Hero content: \`justify-end items-start gap-[72px] pt-[140px] px-[18px]\`
- Switcher + availability stack vertically with \`gap-7\`
- Bottom section: column layout, \`gap-8 pb-11\`
- Name: \`text-[clamp(68px,21vw,80px)] leading-[96px] tracking-[-4.8px]\`
- Paragraph: \`max-w-[420px]\`

---

### Custom CSS Animations

\`\`\`css
@keyframes videoFadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes revealUp { from { opacity: 0; transform: translateY(80px) } to { opacity: 1; transform: translateY(0) } }
@keyframes revealRight { from { opacity: 0; transform: translateX(100px) } to { opacity: 1; transform: translateX(0) } }
@keyframes dotPulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.45; transform:scale(1.45) } }
\`\`\`

### Accessibility
- \`prefers-reduced-motion: reduce\` disables all animations
- Semantic landmarks: \`<header>\`, \`<main>\`, \`<nav>\`, \`<section>\`
- ARIA labels on navigation regions and status elements
- Videos are \`aria-hidden="true"\``;

const prompt4 = `Build a **single-file** \`index.html\` full-viewport poster. No scroll. No frameworks. No redesign. Match layout, type, color, both image URLs, entrance choreography, mobile menu, and mouse morph-reveal **exactly**.

---

## 0. Document shell

\`\`\`html
<!doctype html>
<html lang="en" class="anim">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#161616">
  <title>Orbit — Secure system</title>
\`\`\`

- Root \`<html>\` starts with class \`anim\`
- \`html, body\`: \`width/height 100%\`, \`margin: 0\`, \`overflow: hidden\`, background \`#161616\`
- Body: \`"Orbit Sans", Arial, Helvetica, sans-serif\`, color \`#fff\`, antialiased
- CSS vars:
  - \`--ink: #ffffff\`
  - \`--surface: #161616\`
  - \`--orb-reveal: cubic-bezier(.16, 1, .3, 1)\`
  - \`--orb-soft: cubic-bezier(.25, .8, .28, 1)\`

Structure:

\`\`\`
main.viewport (fixed, inset 0, black)
  section.stage (absolute, inset 0, contain:strict, isolation:isolate)
    [all poster elements]
\`\`\`

Z-order: wordmark \`1\` → flower \`2\` → corner copy \`3\` → brand/nav/pill \`4\`. Mobile: scrim \`9\`, sheet \`10\`, burger \`12\`.

---

## 1. Fonts (mandatory)

Two custom TrueType faces, weight 400, \`font-display: block\`, embedded as \`@font-face\` data-URLs:

1. **\`"Orbit Sans"\`** — nav, pill, corner copy. Fallback: Arial, Helvetica, sans-serif  
2. **\`"Orbit Display"\`** — giant wordmark only. Fallback: \`"Times New Roman", Times, serif\`

Do **not** use Inter, Roboto, system-ui, or Playfair. Extract the original base64 TTFs from the existing \`index.html\` \`@font-face\` blocks if needed.

---

## 2. The two image URLs (use exactly — do not replace)

Both are Higgsfield-proxied PNGs as webp \`w=1280&q=85\`. Transparent backgrounds. Pixel-art / halftone lilies.

### FRONT / BG lily (default visible)

\`\`\`
https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85
\`\`\`

Raw source:

\`\`\`
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png
\`\`\`

### REVEAL / TOP lily (only visible inside morph trail)

\`\`\`
https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85
\`\`\`

Raw source:

\`\`\`
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png
\`\`\`

Front \`alt\`: \`Pixel-art pink and violet lily\`. Reveal \`alt=""\`. No other images.

---

## 3. Every on-stage element (desktop)

### Brand mark
SVG \`.brand-mark\`, \`viewBox="0 0 66 62"\`, white 4-stroke asterisk, \`stroke-width: 5px\`, square caps:
- \`(33,1)→(33,61)\`, \`(3,31)→(63,31)\`, \`(11.8,9.8)→(54.2,52.2)\`, \`(54.2,9.8)→(11.8,52.2)\`
- Position: \`top: 2.141745dvh; left: 3.854167vw; width: clamp(34px, min(3.4375vw, 5.2dvh), 66px)\`

### Primary nav
Links: Home / Resources / Benefits / Contact → \`#home\` \`#resources\` \`#benefits\` \`#contact\`  
White, size \`clamp(13px, min(1.302083vw, 2.05dvh), 25px)\`, each \`li\` at \`top: 3.426791dvh\`:

| Item | left | scaleX |
|---|---|---|
| Home | \`10.104167vw\` | \`1.165\` |
| Resources | \`17.526042vw\` | \`1.052\` |
| Benefits | \`27.578125vw\` | \`1.126\` |
| Contact | \`36.171875vw\` | \`1.168\` |

\`.primary-nav\` is full-stage but \`pointer-events: none\`; links opt back in with \`pointer-events: auto\` so the lily stays hoverable.

### Secure system pill
White pill, text \`#161616\`, \`top: 2.336449dvh; right: 7.5vw\`, height \`clamp(34px, 4.439252dvh, 57px)\`, \`border-radius: 999px\`, tracking \`0.026923em\`.

### Wordmark ORBIT
\`\`\`html
<h1 class="orbit-word" id="orbit-title" aria-label="Orbit">
  <span class="orbit-word__mask">
    <span class="orbit-word__inner">
      <span class="orbit-word__white"><span class="orbit-word__o">O</span>R</span>
      <span class="orbit-word__pink">BIT</span>
    </span>
  </span>
</h1>
\`\`\`
- \`top: 11.565421dvh; left: 4.348958vw\`
- \`"Orbit Display"\`, size \`min(27.8125vw, 55dvh)\`, tracking \`0.033708em\`
- **OR** solid \`#fff\`; **O** has \`scaleX(1.0866)\`, \`margin-right: 0.042135em\`
- **BIT** gradient: \`linear-gradient(180deg, #ffc5dc 0%, #fd86db 100%)\` via \`background-clip: text\`

### Flower stack
\`\`\`html
<div class="flower">
  <img class="flower__sizer" src="[FRONT]" alt="" aria-hidden="true">
  <div class="flower__layer flower__layer--bg">
    <img src="[FRONT]" alt="Pixel-art pink and violet lily">
  </div>
  <div class="flower__layer flower__layer--top" aria-hidden="true">
    <img src="[REVEAL]" alt="">
  </div>
</div>
\`\`\`
- \`top: 14.749065dvh; left: 49.121328vw; height: 106.109034dvh; transform: translateX(-50%); pointer-events: none\`
- Sizer: hidden, \`height: 100%; width: auto\` (sets intrinsic width)
- Layers: \`absolute; inset: 0\`; imgs \`object-fit: cover\`
- Top layer starts fully masked out: \`mask-image: linear-gradient(#0000, #0000)\`

### Corner copy
Color \`#f7f7f7\`, size \`clamp(14px, min(1.40625vw, 2.102804dvh), 27px)\`, \`bottom: 4.361371dvh\`  
Left (\`left: 3.177083vw; scaleX(1.073)\`): \`Every workflow, / intelligently connected.\`  
Right (\`left: 78.28125vw; scaleX(1.058)\`): \`Less manual work. / More meaningful output.\`  
Animate via inner \`.support-copy__inner\` only.

### Mobile chrome (hidden on desktop)
Burger + scrim buttons. Shown only at \`(max-width: 900px), (max-aspect-ratio: 4 / 5)\`.

---

## 4. Mouse morph-reveal trail (implement exactly)

**Not** a CSS circle spotlight. Organic morphing blob trail that punches holes in the front lily and paints the reveal lily in the same shape.

### Constants
\`\`\`
TRAIL_MAX_POINTS  = 60
TRAIL_HEAD_R      = 140
TRAIL_NOISE_AMP   = 44
TRAIL_BLOB_PTS    = 24
TRAIL_FADE_SPEED  = 0.92
TRAIL_SAMPLE_DIST = 8
\`\`\`

### Architecture
Each \`MorphTrailLayer\`:
- Hidden offscreen canvas (\`display:none\`) sized to \`.flower\`
- Visible absolute layer with cover-fit \`<img>\`
- Every active frame: \`maskImage = url(canvas.toDataURL())\`, size \`100% 100%\`, no-repeat

Two layers, same trail:
- \`invert=false\` → FRONT/BG (white fill → \`destination-out\` blobs = holes)
- \`invert=true\` → REVEAL/TOP (clear canvas → white blobs = only trail shows)

Mouse on **\`.stage\`**: \`mousemove\` / \`mouseenter\` / \`mouseleave\`. Convert to flower canvas space via getBoundingClientRect + scale.

### Per frame
\`\`\`
targetR = hovering ? 140 : 0
headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04)
\`\`\`
When hovering and \`headRadius > 5\`, if distance from last sample \`> 8px\`, push \`{x,y,r:headRadius,alpha:1,seed:random*100}\`; cap 60.  
Decay: \`alpha *= 0.92; r *= 0.995\`; remove if \`alpha < 0.01\`.  
\`time += 0.016\`.

### \`drawMorphBlob(ctx, cx, cy, r, t, seed)\`
Skip if \`r < 2\`. 24 points:
\`\`\`
n1 = sin(angle*3 + t*1.4 + seed) * 0.45
n2 = sin(angle*5 - t*0.9 + seed*2.3) * 0.3
n3 = cos(angle*2 + t*1.8 + seed*0.7) * 0.25
noise = (n1+n2+n3) * 44 * (r/140)
\`\`\`
Closed path via midpoints + \`quadraticCurveTo\` (organic blob, not circle). Fill white.

Result: moving the mouse leaves a morphing organic wipe that cuts the front lily away and paints the second lily along a fading trail. Wordmark still shows through transparent petals. Leave stage → head lerps shut, trail dies.

---

## 5. Entrance animation (once)

Pure CSS while \`<html class="anim">\`. JS removes \`.anim\` after last \`orb-*\` animation finishes (6000ms safety). Never replays.

Keyframes:
- \`orb-word\`: \`translateY(118%) → 0\` (no fade)
- \`orb-subject\`: fade + \`translateX(-50%) translateY(3.4dvh → 0)\` — do **not** scale the lily
- \`orb-corner\` / \`orb-quiet\`: small rise + fade
- \`orb-dim\`: fade only

Desktop timing:
| Element | anim | dur | delay |
|---|---|---|---|
| brand | quiet | 620ms | 100ms |
| nav 1–4 | dim | 550ms | 180 / 225 / 270 / 315ms |
| pill | quiet | 620ms | 340ms |
| word inner | word | 1150ms | 300ms |
| flower | subject | 1150ms | 660ms |
| both corners | corner | 720ms | **980ms same** |

Easing: word/flower use \`--orb-reveal\`; rest use \`--orb-soft\`.  
While animating, wordmask has overflow hidden + padding/negative margin so the serif can rise without clipping layout.  
Do **not** animate transform on nav \`li\`, corner parents, or the O — their \`scaleX\` is optical.

Reduced motion: only whole-stage 280ms fade.  
Mobile entrance: burger instead of pill/nav; slightly tighter delays.

---

## 6. Responsive essentials

**(max-width: 900px) or (max-aspect-ratio: 4/5):** white circular burger, frosted sheet menu, scrim, Escape/Tab-trap/inert when closed.

**(max-aspect-ratio: 4/5):** smaller centered lily \`height: min(55dvh, 110vw)\`, word \`min(27.5vw, 18dvh)\`, wrapping corner copy.

**(max-width: 1200px) or portrait:** center the wordmark (\`left:0; width:100%; text-align:center\`).

---

## 7. Acceptance checklist

- Black \`#161616\` poster, no scroll
- Asterisk + 4 nav words with exact scaleX + white Secure system pill
- Giant OR white + BIT pink gradient; O slightly wider
- FRONT lily at exact desktop coords, overlapping BIT
- Load: frame → word rises → lily rises in front → both corners together; then \`.anim\` gone
- Mouse: 140px-head morphing trail, 24-point noisy blobs, fade 0.92, sample every 8px, max 60 points
- Trail punches FRONT and paints REVEAL; wordmark readable through transparency
- Exact two Higgsfield URLs above
- Orbit Sans + Orbit Display embedded`;

async function run() {
  // Get Templates category
  const { data: catData, error: catError } = await supabase.from('categories').select('*').eq('slug', 'templates').single();

  if (catError && catError.code !== 'PGRST116') { // PGRST116 is no rows
    console.error('Error fetching category:', catError);
    return;
  }

  let catId;
  if (!catData) {
    const { data: newCat, error: createError } = await supabase.from('categories').insert({
      slug: 'templates',
      name: 'Templates',
      selection_type: 'single',
      sort_order: 10
    }).select().single();
    if (createError) throw createError;
    catId = newCat.id;
  } else {
    catId = catData.id;
  }

  // Insert pills
  const pills = [
    {
      category_id: catId,
      label: 'Fashion Landing Page',
      prompt_snippet: prompt1,
      color: 'white',
      icon: 'LayoutTemplate',
      is_active: true
    },
    {
      category_id: catId,
      label: 'Marketing Platform Hero',
      prompt_snippet: prompt2,
      color: 'white',
      icon: 'LayoutTemplate',
      is_active: true
    },
    {
      category_id: catId,
      label: 'Creative Portfolio Hero',
      prompt_snippet: prompt3,
      color: 'white',
      icon: 'LayoutTemplate',
      is_active: true
    },
    {
      category_id: catId,
      label: 'Orbit Secure System',
      prompt_snippet: prompt4,
      color: 'white',
      icon: 'LayoutTemplate',
      is_active: true
    }
  ];

  for (let pill of pills) {
    const { error: pillError } = await supabase.from('pills').upsert(pill);
    if (pillError) console.error('Error inserting pill:', pillError);
  }

  console.log('Inserted successfully!');
}

run();
