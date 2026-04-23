# Mysterium Tech — Design System

**Mysterium Tech** is a Russian-speaking B2C tech portal that sells:
- **VPN subscriptions** (primary business) — paid via Telegram bot [@MysteriumTechBot](https://t.me/MysteriumTechBot); support via [@SecretumHelp_bot](https://t.me/SecretumHelp_bot); contact via [@GhostOfSecretum](https://t.me/GhostOfSecretum). Tariffs: **300 ₽/mo, 1500 ₽/6 mo, 2900 ₽/yr**; servers in USA, Latvia, Netherlands, Sweden; up to 3 devices per plan with paid upgrades; 5-day trial.
- **Telegram bot development** (custom bots for clients)
- **Website development**
- **Personal cloud solutions** + **security services**

The brand's aesthetic is a dark, cool, cyberpunk-tinged "IT / network / security" world — think deep-ocean turquoise on near-black, 3D reactive scenes in a glass shell, Unbounded display type. The whole portal runs on a single landing page built with React 19 + Vite + React Three Fiber + drei + GSAP.

---

## Sources

- **Repo:** [GhostOfSecretum/mysterium-tech-landing](https://github.com/GhostOfSecretum/mysterium-tech-landing) (`main` branch)
- **Spec:** original in `source_ref/SPEC.md`
- **Service knowledge base (FAQ, onboarding flows):** `source_ref/service-instructions.md`
- **Original CSS:** `source_ref/styles.css` (single-file, CSS vars + component rules)
- **Scenes (3D hero backdrops):** `source_ref/scenes/*.jsx` — the repo actually contains 27+ scene candidates; the live app wires 4: `CryptoGridScene` (default "Матрица"), `ChromeLuxuryScene` ("Хром"), `ChromeRippleScene` ("Риппл"), `DataStreamsScene` ("Потоки").

---

## Index

| File / folder | What's in it |
|---|---|
| `README.md` | This file — brand + content + visual foundations |
| `SKILL.md` | Agent-invocable skill definition |
| `colors_and_type.css` | CSS vars for colors, fonts, spacing, shadows, radii |
| `assets/` | Logos, marks |
| `source_ref/` | Original imported files from the landing repo — do not edit, use as source of truth |
| `preview/` | Design-system preview cards (Type, Colors, Spacing, Components, Brand) |
| `ui_kits/landing/` | Recreation of the Mysterium Tech landing with original + new advanced 3D scenes |

---

## Content fundamentals

**Language:** Russian only. All UI copy, CTAs, system messages are in Russian. Latin characters appear only for brand names ("Mysterium Tech"), tech jargon ("VPN", "V2RayTun", "QR"), and Telegram handles (`@MysteriumTechBot`).

**Voice:** second-person plural / polite ("вы", "для вас"). Friendly but not cutesy. Direct and functional — tells the user what to do in numbered steps. No marketing fluff; a single-paragraph service pitch, then straight to the price + CTA.

**Tone examples from the live site:**
- *"Разработаем для вас сайт или бота под ваши запросы, а также можем предложить комплексные решения для вашей компании…"*
- *"Пример того, как может выглядеть продвинутая 3D-анимация, вы можете посмотреть, переключаясь между вариантами ниже."*
- *"Связаться с нами"* — the primary CTA. Never "Buy now" or "Get started" bluster.
- *"Привет! Я локальный AI-помощник. Отвечаю по вашей базе инструкций о сервисе."* — the AI widget's greeting.

**Casing:** Sentence case for headings and body. Nav items and eyebrows are UPPERCASE with letter-spacing (`0.08em`). CTA buttons use Unbounded at small sizes — capitals rendered as sentence case with optical tracking.

**Pronouns:** "Мы" (we) for the company, "вы / ваш" (formal you) for the user. Never "I" — the brand speaks as a team.

**Emoji:** **Not used** on the marketing surface. The knowledge base uses none. Keep emoji out of product copy. Iconography is reserved for either brand dots (`●` pulse) or Telegram handles (`@`).

**FAQ / support style:** Numbered step lists, imperative verb first ("Открыть бота → Нажать "Подключиться" → …"). Actions are quoted so the user can Ctrl-F the bot UI. When uncertain: *"уточнение условий — через поддержку @SecretumHelp_bot"* — always defer to support rather than invent.

**Never say:** "AI-powered", "revolutionary", "disrupt", "game-changer". The one AI mention is *"локальный AI-помощник"* — specifically framed as local/private, consistent with the security-first positioning.

**Russian typography:** Em-dashes (`—`) used liberally in running copy. Ranges written with en-dash or just hyphen. Numbers keep the ruble symbol (`₽`) with a thin space: `300 ₽`.

---

## Visual foundations

### Background
Near-black abyssal canvas (`#010810`) layered with two soft radial washes of teal (top-right and mid-left) that feel like distant network nodes glowing through the dark. A **fixed full-viewport `<Canvas>`** renders the active 3D scene at `opacity: 0.85` behind a smoky `ambient-mesh` overlay (linear gradient of black fading to transparent) that pushes text legibility. Effect: the scene is alive but never competes with copy. Scenes mutate via `--phase-mix` as the user scrolls, shifting the wash intensity.

No full-bleed photography. No illustration. No textures. No hand-drawn anything. The "imagery" **is** the 3D scene — everything else is glass chrome over it.

### Color vibe
Monochromatic cool. Every accent is a shade of turquoise → teal (`#40e0d0` → `#1a8fa8` → `#0d6878`) on near-black, with a single rare warm gold (`#d4a843`) reserved for "premium" / featured price cards. No purples, no pinks, no blues outside the teal family. Text is icy off-white (`#d8eaf4`) with muted teal-grey (`#6ba8c8`) for secondary.

### Typography
- **Display / headings / logo / CTAs:** Unbounded (400–800). Tight line-height (1.08–1.15) for impact headings, paired with wide letter-spacing on uppercase eyebrows (`0.08em`).
- **Body:** Manrope (400–700). Line-height 1.65 for relaxed reading.
- **Mono (system-adjacent):** JetBrains Mono for code/terminal moments.
- Scale is fluid (`clamp(2rem, 4.3vw, 4rem)` for h1). H1 caps around 4rem; body at 1rem; eyebrow at ~0.72rem.

### Spacing
Token ladder: 4, 8, 12, 16, 20, 24, 32, 44, 56, 80 px. Section padding is generous (44–72px vertical). Containers cap at 1180px wide with 24px side gutters, shrinking to 14px at ≤720px.

### Radii
`8 / 10 / 14 / 18 / 24 / 32 / pill`. The default card radius is **24px** (`--r-xl`). Buttons are pills (`999px`). Inputs and small pills use 10–14px.

### Borders
Always a 1px accent-colored stroke at low alpha — `rgba(64, 224, 208, 0.07)` for glass cards, `0.10` for lines, `0.25` for emphasized lines (active pill, featured price card). Borders are visible but nearly invisible; they define the card silhouette without announcing themselves. Never use plain white borders.

### Glass / cards
The signature surface. Parameters:
```
background:  rgba(2, 10, 24, 0.62)    /* --glass */
border:      1px solid rgba(64, 224, 208, 0.07)
box-shadow:  0 20px 45px rgba(1, 4, 10, 0.6)
backdrop-filter: blur(14px)
border-radius: 24px
```
A stronger variant (`--glass-strong`, 0.9 opacity) is used for the scrolled topbar and mobile nav. Featured cards layer a 150° gradient of `rgba(64, 224, 208, 0.1) → rgba(26, 143, 168, 0.05)` on top.

### Shadows
Two systems, never mixed:
1. **Drop shadows** — `0 20px 45px rgba(1, 4, 10, 0.6)` under glass cards. Soft, deep, never hard.
2. **Glow shadows** — `0 0 16px rgba(64, 224, 208, 0.6)` around the brand dot, active scene pills, CTA hover. These communicate "live signal".

No inner shadows. No colored-light spills except teal glow.

### Gradients
Used sparingly:
- **CTA fill:** `linear-gradient(135deg, #1a8fa8, #0d6878)` — the only solid-fill gradient.
- **Radial washes** behind the whole page (see Background).
- **Featured-card subtle 150° teal wash.**
No purple-to-pink tech-startup gradients. No cyan-to-magenta synthwave.

### Animation & motion
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entries, `0.28s ease` for small reveals, `0.4s ease` for topbar background transition.
- **Reveal on scroll:** `[data-reveal]` elements fade up 20px over 0.7s when intersecting (threshold 0.18).
- **Hover:** CTAs translate up `-2px` and gain a brighter glow. Scene pills gain a glow on the dot and a teal-tinted fill.
- **Press:** not explicitly styled (default browser feedback). No shrink / squish.
- **3D scenes:** continuous `useFrame` loops; respond to scroll (`scrollProgress`) and mouse (`pointer`). Lerp smoothing on mouse (0.04–0.08).
- No bouncy spring animations. No parallax illustrations. Motion is smooth, slow, atmospheric — network-like.

### Hover / press / focus states
- **Hover:** lift 2px + deepen glow (CTA); brighten background to `rgba(255,255,255,0.05)` (ghost / nav); bump accent color (`--text-muted` → `--text-main`).
- **Active / selected:** `rgba(64, 224, 208, 0.10)` fill, `rgba(64, 224, 208, 0.25)` border, accent text, glowing dot.
- **Focus:** `border-color: rgba(64, 224, 208, 0.4)` on inputs.
- **Disabled:** `opacity: 0.55`.

### Transparency & blur
Used strategically: topbar becomes `rgba(1, 8, 16, 0.85)` + 14px blur only after scrolling 24px. Mobile nav / widgets use `0.95` opacity + 14–16px blur to stay legible over the 3D canvas. Never blur static content surfaces.

### Layout rules
- Fixed topbar (82px tall), fixed bottom-left AI widget toggle, fixed full-viewport 3D scene canvas behind everything.
- One-column hero centered, max 840px wide.
- Feature grid: 3 cols desktop, 2 tablet, 1 mobile.
- Pricing grid: 3 cols desktop, 2 tablet, 1 mobile.
- Section padding: 44px default, 72px for hero.

### Imagery
None of the traditional kind. The only "image" is the animated 3D scene behind everything. Keep brand imagery restricted to logos and the brand dot.

---

## Iconography

**The original site uses almost no icons.** It deliberately leans on typography + the 3D scene + brand dot. When icons are needed:

- **Brand dot** (`<span class="brand-dot">`) — turquoise circle with a teal glow. Used next to the logo and inside scene pills. This is the closest thing to a brand icon on the site.
- **Hamburger menu** — 2 spans forming an animated X/lines, hand-rolled in CSS.
- **Telegram bot links** — rendered as plain text (`@MysteriumTechBot`), no Telegram paper-plane glyph.

**When additional iconography is needed for new surfaces** (dashboard, settings, etc.) use **Lucide** (`lucide-static` via CDN) at `1.5px` stroke, turquoise (`#40e0d0`) for active state, muted teal (`#6ba8c8`) for default. Lucide's minimal line style matches the site's restrained aesthetic better than filled/color icon sets.

CDN to use in new artifacts:
```html
<script src="https://unpkg.com/lucide@latest"></script>
<!-- or per-icon -->
<img src="https://unpkg.com/lucide-static@latest/icons/shield.svg" />
```

**No emoji.** **No unicode glyph icons** (✓, ★, →, etc.) except `—` (em-dash) as a typographic element. **No PNG icons.** **No icon fonts** (Font Awesome, Material) — they feel too web-2.0 for this brand.

**Flagged substitution:** The original repo ships no icon files. Lucide is a substitution we've introduced for future needs — swap it out when the team picks a definitive set.
