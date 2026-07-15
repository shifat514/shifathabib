# Portfolio Redesign Plan — Terminal Theme, Senior Fidelity

Source: Impeccable dual-agent critique 2026-07-15 (score 19/40, snapshot in
`.impeccable/critique/2026-07-15T04-41-50Z__src-pages-index-astro.md`).
Decisions from Shifat: do everything · crank the theme up to a **real interactive terminal** · **remove** the blog for now.

**North star:** keep the hand-made terminal/pixel identity, raise execution to senior level.
The site should make a recruiter curious in 5 seconds and give them an obvious way to start a conversation.

---

## Guardrails (apply to every phase)

- Palette stays the CRT triad: `background #092537`, `terminal1 #081f2d`, `accent #A6EC61`. No gradients, no glassmorphism, no gradient text, no icon-card grids, no uppercase eyebrow labels.
- Motion language is **discrete, not continuous**: `steps()`, hard cuts, character-by-character typing. Smooth `ease-out` only on non-diegetic UI (mobile menu). No bounce/elastic.
- Every animation gets a `@media (prefers-reduced-motion: reduce)` fallback that renders the final state instantly.
- Hover/focus semantics are terminal-native: **inverse video** (accent background, navy text) or a `>` prefix — never `hover:text-blue-500` (off-palette; remove everywhere).
- Body text contrast ≥ 4.5:1 (grey `#d2d2d2` on `#092537` ≈ 10:1 — fine; never go lighter than `#9aa8a0`-range grays).
- `text-align: left` everywhere. Remove every `text-justify` (index.astro:26, about.astro:12, all project cards).
- All titles keep their current *visual* style but become real `h1/h2/h3` elements.
- After each phase: `npm run build` must pass.

---

## Phase 0 — Foundations (P0: the production site currently loses all custom fonts)

### 0.1 Fix font + stylesheet delivery
Current bugs: `@font-face src: url("/public/fonts/…")` in `src/layouts/Layout.astro:28-51` 404s in a built site (the `/public` prefix only works in dev). `<link href="/Styles/style.css">` (Layout.astro:18) 404s always — `Styles/` is not inside `public/`.

1. Create `src/styles/global.css`, imported from Layout frontmatter (`import "../styles/global.css";`) so Vite bundles it. Delete the `<link>` tag and the whole `Styles/` directory (move the scrollbar rules into global.css, restyled: track `#081f2d`, thumb `#476272`, hover thumb `#A6EC61`).
2. Move all `@font-face` rules into global.css with corrected URLs (`/fonts/...`), each with `font-display: swap`.
3. **Reduce to two families** (theme is mono-first now):
   - `jersey` (Jersey 25) — display/headings/nameplate.
   - `spacemono` + `spacemono_bold` (Space Mono) — everything else, including body.
   - Drop the three Ubuntu faces entirely; replace `font-ubuntu*` classes with `font-spacemono` (body defaults to it, so most can just be deleted). Delete `Ubuntu-*.ttf` files (~930 KB).
4. Convert remaining TTFs to WOFF2 (try `npx ttf2woff2` or python `fonttools`; if no tooling works offline, keep TTF but fixed paths — correctness first, weight second). Delete `public/fonts/Jersey25Charted-Regular.ttf` (1.3 MB, never referenced).
5. `<link rel="preload" as="font" type="font/woff2" crossorigin>` for Jersey and Space Mono Regular.
6. Fallback stacks in tailwind.config: `jersey: ["jersey", "monospace"]`, `spacemono: ["spacemono", "ui-monospace", "Menlo", "monospace"]`.

### 0.2 Head / metadata (Layout.astro)
- Title template: pages pass short titles, Layout renders `{title} | Shifat Habib` (home page: `Shifat Habib — Frontend Engineer`).
- Real description: `Frontend engineer with 3+ years building healthcare and edtech interfaces. Vue, TypeScript, Playwright. Dhaka, Bangladesh.` Accept `description` as optional prop with this default.
- Add OpenGraph + Twitter card tags (og:title, og:description, og:type=website, og:image → use `/pix-shifat.png` until a proper 1200×630 card exists; twitter:card=summary).
- `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
- Favicon: point at `/favicon.svg` with correct type (file already exists in public/).
- Move `html { background: #092537; }` into global.css; also set `color-scheme: dark`.

### 0.3 tailwind.config.mjs cleanup
- Fix or delete the malformed `darkMode: ["selector", '[data-mode="dark']` (site is single-theme — delete it).
- Prune `colors` to what's used: `background`, `surface: #081f2d` (rename terminal1), `accent: #A6EC61`, `accent-dim: #6b9e3f` (new, for glow/borders), `chrome: #476272` (rename header2), `chromeIcon: #506d7f`, `ink: #f8f8f8`, `muted: #d2d2d2`, `faint: #9aa8a0` (comments/metadata), `string: #67e8f9` (the cyan JSON strings), `path: #c084fc` (the purple ls output). Update all class usages accordingly. Delete the ~25 unused tokens.
- Add a fluid type scale (~1.25 ratio) under `fontSize`:
  `display: clamp(2.5rem, 6vw, 4rem)`, `h1: clamp(1.9rem, 4vw, 2.6rem)`, `h2: clamp(1.5rem, 3vw, 2rem)`, `body: 0.9375rem/1.7`, `small: 0.8125rem/1.6`. Use these instead of ad-hoc `text-3xl sm:text-5xl` jumps.

### 0.4 Delete dead weight
- `src/pages/blogs/` (both files) and `src/components/blog.astro` — blog is removed for now. Also remove commented blog links in Navbar.astro:16,106 and Footer.astro:26-29.
- Unused assets: `public/pxArt.png`, `public/remove.png`, `public/Shifat.jpg`.
- All commented-out dead code: about.astro:172-188, projects.astro:249-265, Navbar.astro:11-15,146, Terminal.astro `.text-header` rules (223-238).
- Duplicate/broken CSS: `.cursor-sm` contradictory z-index pair (index.astro:86-89), webkit/standard blink duration mismatches.

**Acceptance:** `npm run build` passes; `grep -r "public/fonts" dist/` finds nothing; built HTML references hashed CSS containing the @font-face rules; no `/blogs` routes in dist; fonts visibly load in `npm run preview`.

---

## Phase 1 — Structure, accessibility, robustness

### 1.1 Semantic headings (zero exist today)
- index: `h1` = "Shifat Habib" (the nameplate text). Visually unchanged.
- about: `h1` "About" (can be sr-only if no visual slot), `h2` "Working Experience", `h3` per company.
- projects: `h1` "Projects", `h2` per project name.
- 404: `h1` in the terminal output.

### 1.2 Focus + keyboard
In global.css:
```css
:focus-visible { outline: 2px solid #A6EC61; outline-offset: 2px; }
a:focus-visible, button:focus-visible { background: #A6EC61; color: #092537; outline-offset: 0; }
```
(The inverse-video focus doubles as the hover style — one system.)

### 1.3 Navbar.astro fixes
- Label mismatch: mobile menu says "work" for `/about` (line 104) — change to "about".
- Current-page indicator: prefix the active link with `>` and render it inverse-video. (Compare `Astro.url.pathname`.)
- Hamburger `<button>`: `aria-label="Menu"`, `aria-expanded` toggled in the script, `aria-controls="menubar"`.
- Mobile menu panel: replace fixed `w-[350px]` with `w-[calc(100vw-2rem)] max-w-[350px]`; close on Escape, on outside click, and on link click; animate open/close 200ms translate+fade with `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) — this is the one smooth animation allowed.
- Social SVGs: add `aria-label` on the anchors ("GitHub", "LinkedIn").
- Wrap links in a real `<nav aria-label="Main">`.

### 1.4 Global link hygiene
- Every `target="_blank"` gets `rel="noopener noreferrer"` (Navbar ×4, Terminal ×5, about ×1, projects ×3).
- Replace the Gmail-account URL `https://mail.google.com/mail/u/1/...` (Terminal.astro:143) with `mailto:shifat514@gmail.com`.

### 1.5 Reduced motion
One global rule + per-component handling (see Phase 3):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

### 1.6 Themed 404 — `src/pages/404.astro`
Terminal window (reuse the chrome from Terminal.astro) containing:
```
shifat@pc:~$ cd /that/page
bash: cd: /that/page: No such file or directory
shifat@pc:~$ ls
home/   about/   projects/
shifat@pc:~$ _
```
where `home/ about/ projects/` are real links (purple `path` color). `h1` = "404 — No such file or directory".

### 1.7 Misc bugs from the critique
- index.astro:28 `text-terminal2` undefined → use `text-accent`.
- Terminal.astro:77 `fill="092537"` → `fill="#092537"`.
- about.astro:23 delete the 24 `&nbsp` entities (use normal flow / a styled blockquote); fix "procastinating" → "procrastinating".
- index.astro:19 `&nbsp` → `&nbsp;`.
- Portrait alt (about.astro:35): `alt="Pixel-art portrait of Shifat Habib"`.

**Acceptance:** Tab-walk the whole site with visible focus everywhere; axe/lighthouse a11y pass has no heading/aria/alt errors; `/nonexistent` shows the themed 404.

---

## Phase 2 — Conversion: give every page an ending

### 2.1 New component `src/components/ContactPrompt.astro`
A short terminal block rendered at the bottom of **every page** (slot it into Layout above Footer):

```
shifat@pc:~$ ./contact --start-a-conversation
```
Output: one line of copy ("Building something? I reply fast.") + a row of chunky pixel-bordered buttons (reuse the `.pixel` box-shadow style from index.astro):
- `[ email shifat514@gmail.com ]` → `mailto:` — primary, inverse-video by default (accent bg, navy text)
- `[ copy ]` → copies the address (`navigator.clipboard`), swaps label to `copied ✓` for 1.5s (announced via `aria-live="polite"`)
- `[ linkedin ]`, `[ github ]`
- `[ resume.pdf ]` → keep the Google Drive URL for now, but labeled plainly "resume.pdf"

Buttons are real `<a>`/`<button>` elements, 44px min touch height, focus-visible per 1.2.

### 2.2 Footer.astro rewrite
- Replace generic `font-mono` with the brand stack; kill `text-blue-500`.
- Content: `© Shifat Habib` + `shifat514@gmail.com` (mailto) + GitHub/LinkedIn text links + nav links. Small, one line on desktop, wraps on mobile.

**Acceptance:** every page ends with the contact prompt; email opens a mail client; copy button works and announces.

---

## Phase 3 — The interactive terminal (centerpiece)

Rewrite `src/components/Terminal.astro`. This is the largest task — budget the most care here.

### 3.1 Progressive enhancement skeleton
- The **full final transcript stays in the HTML** (SEO, no-JS, reduced-motion all see it). JS enhances by hiding it and replaying it as a boot sequence.
- `prefers-reduced-motion: reduce` (checked in JS too): skip the replay entirely, show final state, still enable the live prompt.

### 3.2 Boot sequence (on index load)
1. Prompt types `cd Desktop/Shifat` char-by-char (~30ms/char), then `ls`, output appears as one hard cut.
2. Types `node personal-info.js`; the JSON prints **line-by-line** (~45ms/line — per-char JSON is too slow).
3. **Restructure the JSON for chunking** (currently a 40-line wall). Target shape, with blank lines between groups:
   ```js
   {
     name: 'Shifat Habib',
     role: 'Frontend Engineer @ Brick Line Technology',
     location: 'Dhaka, Bangladesh',

     contact: ['shifat514@gmail.com', 'linkedin', 'github'],   // each a real link
     resume: 'shifat-habib.pdf',                               // link

     skills: {
       daily:    ['JavaScript', 'TypeScript', 'Vue', 'Nuxt', 'Vuetify', 'Tailwind', 'Playwright'],
       familiar: ['Pinia', 'Astro', 'Electron', 'SQL', 'Node.js'],
     },
     interests: ['cycling', 'movies', 'tech content', 'building PCs'],
   }
   ```
   Skills arrays wrap with `break-words` (never `break-all` — no more "TypeScr/ipt" splits). Phone number: drop from public JSON (spam-bait); it lives in the resume.
4. **Skippable:** any click/keypress/scroll during boot jumps straight to final state. Store `sessionStorage.bootPlayed = 1` — replay only once per session.
5. Sequencing with small promise-based helper; no external animation library needed (all discrete steps).

### 3.3 Live prompt (after boot)
A real `<input>` styled invisibly into the last prompt line (label: `aria-label="Terminal input. Type 'help' for commands."`). A hint line below chrome: `type 'help'` in faint color so Jordan-the-recruiter knows it's real.

Whitelisted commands (anything else → `bash: <cmd>: command not found — try 'help'`):
| command | output |
|---|---|
| `help` | list of commands with one-line descriptions |
| `whoami` | one-liner bio |
| `skills` | the skills block |
| `projects` | list of 5 projects, each name a link to /projects |
| `contact` | the ContactPrompt button row |
| `resume` | opens resume link + prints confirmation |
| `hire` | easter egg: fake progress bar `[##########] offer_accepted: pending…` then prints the mailto link |
| `ls` | `personal-info.js  shifat-habib.pdf  projects/` |
| `clear` | clears output back to a bare prompt |
| `sudo …` | `Nice try.` |

Output area: `role="log"` `aria-live="polite"`. Cap history at ~200 lines. Input never traps focus; global keys untouched until the input itself is focused.

### 3.4 Cursor system (one system, three sites)
- Shared `@keyframes blink` with `steps(1, end)`, duration **1.06s** (classic 530ms on/off). Define once in global.css; delete all duplicated keyframes (index, Terminal, about).
- Terminal cursor is a block that sits **at the input caret position** (simplest robust approach: cursor element right after the input's mirrored text, or just after the input when empty).
- Nameplate cursor on index keeps its size but adopts the shared timing; delete the broken/dead variants (`.text-header::after`, about.astro timeline-dot blink — remove that dot animation entirely).

### 3.5 Window chrome cleanup
- Remove the fake search and hamburger icons (Terminal.astro:22-55) — dead affordances.
- Minimize/maximize: `aria-hidden="true"`, `pointer-events: none` decorations.
- Close button: functional easter egg — collapses the terminal to a taskbar chip reading `> terminal (click to restore)`. Keyboard accessible, `aria-label="Close terminal (it comes back)"`. If this proves fiddly, make it decorative like the others — do not ship a broken interactive.
- Fix the title centering hack (`ml-12 sm:ml-32`, line 20) with a proper 3-column grid (`grid-cols-[auto_1fr_auto]` + centered title).

### 3.6 CRT flavor (subtle, terminal-window-only)
- Phosphor glow on Jersey headings and the nameplate: `text-shadow: 0 0 8px rgba(166,236,97,0.35)`.
- Scanlines on the terminal body only (not the page): `repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 3px)` as an overlay pseudo-element at ~3% perceived intensity, `pointer-events: none`.
- No flicker, no full-screen effects, no curvature.
- Mobile: bump terminal text from `text-xs` to `0.8125rem` and **remove `tracking-widest`** (Terminal.astro:86) — letter-spaced dense code at 12px is the biggest mobile legibility issue.

**Acceptance:** with JS disabled the full transcript renders; with reduced-motion no typing occurs; boot is skippable; `help`/`projects`/`contact`/`sudo` work; screen reader announces command output; nothing blinks at more than one rate.

---

## Phase 4 — Pages

### 4.1 index.astro
- Hero copy: drop the wrapping quotation marks around the whole bio. Greeting "Hey, I'm Shifat!" in `text-accent` (fixes the dead `text-terminal2`).
- Pixel nameplate hover: replace `transition: linear 0.2s` (all-property tween) with an instant swap or `steps(2)` — pixel art snaps.
- Verify the `-mt-12` nameplate overlap at 640–768px widths; if it collides with the bio text, adjust the breakpoint padding.

### 4.2 about.astro
- Opening block: portrait + 2 short left-aligned paragraphs (typo fixed, `&nbsp` hack gone, quote as a styled one-line `<blockquote>` with attribution or removed).
- Experience timeline: keep the structure (the spine at line 62 was a detector false-positive — it's fine). Remove the blinking dot animation. `h2`/`h3` semantics per 1.1.
- Bullets: keep content, `text-left`, consistent `-` markers.

### 4.3 projects.astro — render as terminal output
Replace the five identical bordered boxes:
- Each project = one "command block": header line `shifat@pc:~/projects$ cat zeda-ctms.md`, then the content inside a thin `border border-accent/30` window with the project name as `h2` (Jersey, glow), description, bullets, and a final `utilized:` line where each tech is a small inverse-video-on-hover token (text, not pill-soup — bracket-delimited like `[vue]` fits the theme).
- **Differentiate the flagship:** Zeda CTMS first and visually larger (full-width, slightly bigger heading); the rest follow at standard size. Not identical clones.
- On-scroll reveal: each block's lines appear with an 80ms stagger via IntersectionObserver, discrete (no fade-translate; `visibility` steps). Reduced-motion: all visible.
- Fix: `projects.astro:267` malformed nesting (`</main></Layout>` with the script inside the content div) — move the (currently dead, being deleted) script out and close tags properly.

### 4.4 Typography sweep (all pages)
- Apply the Phase 0.3 scale; body copy at `max-width: 70ch`.
- `text-wrap: balance` on h1–h3.
- Replace every `font-ubuntu*` per Phase 0.1.

**Acceptance:** no text-justify remains; headings use the fluid scale; projects page reads as terminal output with Zeda visually leading; 320px-wide viewport shows no horizontal scroll on any page.

---

## Phase 5 — Verification (run before calling it done)

1. `npm run build && npm run preview` — click every route incl. `/404`-triggering URL; confirm custom fonts render (compare against dev).
2. `grep -rn "public/fonts\|Styles/style.css\|text-blue-500\|text-justify\|mail.google.com" src/ dist/` → all zero hits.
3. Keyboard-only pass: tab through nav → terminal → contact prompt → footer with visible focus at every stop; Escape closes mobile menu.
4. Reduced-motion pass (emulate in devtools): no typing animation, no blinks, content all visible.
5. Mobile pass at 320px and 375px: menu fits, terminal text legible, no mid-word breaks in skills.
6. Persona spot-checks: Jordan can find email within 5s of landing (contact prompt + `type 'help'` hint); Riley gets the themed 404 on garbage URLs.
7. Re-run `/impeccable critique src/pages/index.astro` and compare against the 19/40 baseline.

## Suggested commit sequence
One commit per phase (0–4), verification fixes folded into the phase they touch. Work on a branch (`redesign/terminal-v2`), not master.
