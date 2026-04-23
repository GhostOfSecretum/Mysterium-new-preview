# Mysterium Tech — Landing UI Kit

Pixel-level recreation of the live Mysterium Tech landing page, built to the visual foundations in the root `README.md` and `colors_and_type.css`.

## What's included

- `index.html` — full interactive landing: topbar, hero, features, pricing, services section with scene switcher, footer. Click any "Связаться с нами" or "Подключить" to see the fake-Telegram toast.
- `App.jsx` — top-level shell + data.
- `Topbar.jsx` — fixed glass topbar with brand wordmark + mobile hamburger.
- `Hero.jsx` — headline, lead, primary + ghost CTAs, glass KPI strip.
- `FeatureGrid.jsx` — three-up feature cards.
- `PricingGrid.jsx` — 3 tariff cards, the 12-month one featured.
- `ServicesSection.jsx` — scene switcher + contact CTA.
- `Footer.jsx` — footer row with copyright and nav links.
- `SceneSwitcher.jsx` — renders one of the 3D scenes into a full-viewport `<Canvas>` behind everything.
- `scenes/*.jsx` — scene library:
  - **Original 4** (lifted from the repo): `CryptoGridScene`, `ChromeLuxuryScene`, `ChromeRippleScene`, `DataStreamsScene`.
  - **New advanced 3** (more IT/security/cyber): `CyberShieldScene` (layered chrome shield with orbital glints), `NeuralMeshScene` (networked particle mesh connecting nodes), `QuantumTunnelScene` (procedural tunnel that reads as secure encrypted pipe).

## Interactions

- Scene selector pills swap the scene live; the previous scene unmounts.
- CTAs that would deeplink into Telegram pop a small toast ("Открываем @GhostOfSecretum…") for demo purposes — no real navigation.
- Mobile hamburger opens the glass nav sheet.
- AI-помощник toggle (bottom-left) opens a faux chat widget with the site's knowledge-base greeting.
