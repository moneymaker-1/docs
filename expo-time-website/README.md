# Expo Time — Company Website

A responsive, bilingual (English / Arabic + RTL) marketing website for **Expo Time
(expotime)** — Event Organizer & Exhibition House, Kingdom of Saudi Arabia.

Built from the official brand guidelines and company profile.

## Brand applied
- **Colors:** Navy `#293d50` · Yellow `#f3c716` · Cyan `#62b1b6`
- **Typography:** Poppins (English) · Cairo (Arabic fallback for Montserrat-Arabic)
- **Logo:** the `ex✓potime` checkmark wordmark (recreated as SVG in `assets/img/logo.svg`)

## Sections
Hero · Stats · About · Services (all 9) · Values · Vision & Goals · Why Us ·
Projects gallery · Call-to-action · Contact (with form) · Footer.

## Features
- **Interactive 3D hero (WebGL / Three.js):** an extruded brand checkmark with
  floating exhibition "stands", brand-coloured lighting, ambient particles and
  mouse / device-tilt parallax. Three.js is **vendored locally** in
  `assets/vendor/three.min.js` (no CDN dependency) and works straight from
  `file://` or a server. Falls back to the flat SVG checkmark if WebGL is off.
- **3D tilt interactions** on the service cards and project tiles (perspective +
  glare), on fine-pointer devices.
- **Language toggle (EN ⇄ AR)** with full right-to-left layout; preference saved in `localStorage`.
- Fully **responsive** (desktop / tablet / mobile) with a mobile nav drawer.
- Scroll animations, animated stat counters, sticky header, accessible focus states,
  and `prefers-reduced-motion` support.
- Contact form with front-end validation; submits via a `mailto:` to `info@expo-time.co`
  (no backend required). Swap in a form endpoint when you have a server.

## How to view
Just open `index.html` in any browser — it is a static site with no build step.

To serve locally:
```bash
cd expo-time-website
python3 -m http.server 8080
# then open http://localhost:8080
```

## Things to customize
- **Projects:** replace the placeholder gradient tiles in `assets/js/main.js`
  (`PROJECTS`) with real photos of your stands and events.
- **Stats:** the figures (234 stands, 22 exhibitions) come from your profile — update
  the `data-count` values in `index.html` as they grow.
- **Social links:** add your real Instagram / LinkedIn / X URLs in the contact section.
- **Contact form:** wire the form to your email service or CRM for automated handling.

## Structure
```
expo-time-website/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/{logo.svg, favicon.svg}
└── README.md
```
