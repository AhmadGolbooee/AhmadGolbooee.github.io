# AhmadGolbooee.github.io

Bilingual (Persian / English) personal resume site for **Ahmad Golbooee** — software developer and physics student at Isfahan University of Technology.

**Live:** https://ahmadgolbooee.github.io

---

## Quick edits — everything lives in one file

`assets/js/content.js` is the single source of truth for all text. You never need to touch HTML to change content.

### Change a string

Every string is an object with an English and a Persian value:

```js
about: {
  title: { en: "About", fa: "درباره من" }
}
```

### Change the skills and their levels

```js
skills: {
  groups: [
    {
      label: { en: "Languages", fa: "زبان‌ها" },
      icon: "⌨️",
      items: [
        { name: "C", level: 65, state: "core" },      // level = 0-100 bar width
        { name: "Rust", level: 30, state: "learning" } // state: "core" | "learning"
      ]
    }
  ]
}
```

### Add a project

```js
projects: {
  items: [
    {
      title: "My Simulation",
      desc: { en: "What it does.", fa: "توضیح کوتاه." },
      tags: ["Python", "NumPy"],   // the filter buttons build themselves from tags
      url: "https://github.com/AhmadGolbooee/my-simulation",
      status: "live",              // "live" | "draft"
      featured: true               // optional, swaps the card icon to a star
    }
  ]
}
```

Setting `status: "draft"` (and leaving `url` empty) shows a dashed card with a *Draft* badge instead of a link.

### Add a timeline entry

```js
journey: {
  items: [
    {
      type: "education",            // or "experience" — changes the dot colour
      period: "2021 — 2025",
      title: { en: "BSc in Physics", fa: "کارشناسی فیزیک" },
      org: { en: "Isfahan University of Technology", fa: "دانشگاه صنعتی اصفهان" },
      location: { en: "Isfahan, Iran", fa: "اصفهان، ایران" },
      desc: { en: "…", fa: "…" },
      tags: ["Physics", "Maths"]
    }
  ]
}
```

### Change the numbers in the hero

```js
stats: [
  { label: { en: "Languages", fa: "زبان برنامه‌نویسی" }, value: 3, suffix: "" }
]
```

### Change contact details

Edit `site.email` (used by the mailto form, the copy button and the vCard export) and `contact.channels`.
Add or remove a channel with `copy: true` to get a copy-to-clipboard button.

### Hero roles and the code window

`hero.roles` is the typewriter list. `codeSnippets` is the rotating code panel — plain strings, RTL/LTR handled automatically.

---

## Features

- **Bilingual** with a one-click switch, full RTL layout, and language remembered per visitor
- **Dark / light theme**, follows `prefers-color-scheme`, remembered per visitor
- **Command palette** — `Ctrl`/`Cmd` + `K` or `/`: jump to a section, toggle theme, switch language, print, export contact
- **Animated skill bars** with core vs. learning distinction
- **Filterable projects** built automatically from tags
- **Timeline** for education and experience
- **Print stylesheet** — the site prints as a clean one-page A4 CV, so `Ctrl`+`P` gives you a real résumé PDF
- **vCard export** so people can save your contact details
- **Contact form** that opens the visitor's mail client (no server, no data stored)
- **Copy-to-clipboard** for the email address
- **SEO** — Open Graph, Twitter card, JSON-LD `Person` schema, canonical URL, `sitemap.xml`, `robots.txt`
- **PWA** — installable, offline-capable, custom 404 page
- **Accessibility** — skip link, focus-visible outlines, ARIA roles, `prefers-reduced-motion` support
- **Zero dependencies, zero build step**

---

## Project layout

```
index.html                 markup shell, meta tags, JSON-LD
404.html                   styled bilingual 404
sw.js                      service worker (network-first for pages)
manifest.webmanifest       PWA manifest
sitemap.xml, robots.txt    search engine files
.nojekyll                  stops GitHub Pages from running Jekyll
package.json               only for the optional dev commands below
assets/
  css/style.css            site styles (dark + light themes, RTL-safe)
  css/print.css            print / PDF stylesheet
  js/content.js            ALL bilingual content — edit this
  js/app.js                rendering + interactions
  favicon.svg
  img/                     icons, OG image, avatar (generated)
tools/
  build-assets.py          regenerates icons + OG image (needs Pillow)
  smoke-test.cjs           headless DOM test of every section
```

---

## Local preview

```bash
python -m http.server 8080   # or: npm start
```

Then open http://localhost:8080

## Optional dev commands

```bash
npm install       # installs jsdom for the test runner only
npm test          # renders the site headlessly and asserts every section works
npm run assets    # regenerates icons + og-image.png (needs Pillow)
```

## Deploy

Pushes to `main` are published automatically by GitHub Pages.

⚠️ After changing `assets/`, bump `CACHE` in `sw.js` (e.g. `ag-site-v2`) so returning visitors get the new files instead of the cached ones.

---

## Things you should verify or replace

These were filled in as reasonable placeholders — edit them if they are not true:

- `journey.items[0].period` — undergraduate years (`2021 — 2025`)
- The two entries in `projects.items` with `status: "draft"` are examples; replace them with your real projects or delete them
- `skills.groups[3]` ("Concepts") and the `level` percentages — self-assessed, adjust to taste
- `stats` numbers
- `site.avatar` points at your GitHub avatar URL and updates automatically; `assets/img/avatar.png` is a local fallback
