# AhmadGolbooee.github.io

Personal resume website for **Ahmad Golbooee** — software developer and physics student at Isfahan University of Technology.

Live: **https://ahmadgolbooee.github.io**

## Features

- Bilingual (Persian / English) with one-click language switch
- Full RTL layout support with `dir="rtl"` for Persian
- Dark / light theme toggle, respects `prefers-color-scheme`
- Sticky navigation with active-section scroll spy
- Zero build step and zero dependencies — plain HTML, CSS and JavaScript

## Structure

```
index.html
assets/
  css/style.css
  js/app.js        # i18n strings + dynamic section rendering
  favicon.svg
robots.txt
```

## Local preview

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Editing content

All bilingual copy lives in the `I18N` object at the top of `assets/js/app.js`.
Add an English string and its Persian counterpart with the same key, then reference
it in the HTML via `data-i18n="key"`.

Projects, stack groups and contact links are plain arrays in the same file.

## Deploy

Pushes to the `main` branch are published automatically by GitHub Pages.
