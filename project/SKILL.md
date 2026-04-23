---
name: mysterium-tech-design
description: Use this skill to generate well-branded interfaces and assets for Mysterium Tech — a Russian-speaking B2C portal selling VPN, Telegram bot development, website development, cloud and security services. The brand is a dark, cool, cyberpunk-tinged "IT / network / security" world (near-black canvas, turquoise teal accents, Unbounded + Manrope, glass cards over animated 3D scenes). Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill first — it covers the brand, content fundamentals, visual foundations and iconography.

Then explore:
- `colors_and_type.css` — every CSS variable you need (colors, fonts, type scale, spacing, radii, shadows).
- `assets/` — the logo marks.
- `ui_kits/landing/` — pixel-level reference recreation of the landing with multiple 3D scenes; lift components and styles from here rather than reinventing.
- `preview/*.html` — one-concept-per-card visual specimens (type, colors, spacing, components, brand).
- `source_ref/` — read-only original source from the GitHub repo. Use as the source of truth when fidelity matters.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of this skill and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build, ask a few clarifying questions (what surface? which products? do they want to keep or replace existing 3D scenes? Russian copy?), and act as an expert designer who outputs HTML artifacts or production code depending on the need.

Key non-negotiables to apply by default:
1. Copy in Russian, formal "вы", no emoji.
2. Near-black `#010810` canvas + turquoise `#40e0d0` accents only. No purple/pink gradients.
3. Unbounded for display, Manrope for body.
4. Glass cards (rgba(2,10,24,0.62) + 14px backdrop-blur + subtle teal border + 24px radius).
5. 3D scene behind everything if it's a hero surface — pick one from the scene library or generate a new one matching the aesthetic.
