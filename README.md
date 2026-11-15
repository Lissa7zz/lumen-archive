[English](README.md) | [简体中文](README.zh-CN.md)

[![Deploy to GitHub Pages](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml)

**Quick access: [Open Lumen Archive](https://lissa7zz.github.io/lumen-archive/) ·
[Browse the complete catalogue](https://lissa7zz.github.io/lumen-archive/archive.html) ·
[Follow the complete timeline](https://lissa7zz.github.io/lumen-archive/timeline.html)**

# Lumen Archive

Lumen Archive is an open-source, cross-media timeline of art, objects,
photography, and historical images. The current catalogue brings together 500
works from 1400 to 2000,
with local high-resolution images, source information, and a viewer designed
for close inspection.

The site is a static build. It has no backend, account system, analytics, or
image-processing service.

## Highlights

- 500 works from Asia, Europe, Africa, the Americas, and Oceania
- Chronological exhibition wall and a scroll-driven timeline
- Search by title, artist, year, medium, or origin
- Traditional catalogue with sorting, pagination, and deep-linkable page state
- Dedicated scrollable chronology wall covering all 500 works
- Chunked catalogue data and a separate, lazily loaded search index
- 480 px thumbnails, 1600 px previews, and 3200 px assets for selected works
- Zoom with the mouse wheel, buttons, double-click, or a touch pinch gesture
- Drag to pan when enlarged, with touch swipe navigation at fit scale
- Keyboard controls, fullscreen mode, and a mobile artwork-information drawer
- Direct links to original Wikimedia Commons and museum records
- Per-work licensing and attribution documentation

## Viewer controls

| Action | Control |
|---|---|
| Zoom in or out | Mouse wheel, `+` / `-`, or the viewer toolbar |
| Inspect another area | Drag the enlarged image |
| Fit to the screen | Double-click the image, press `0`, or use the reset button |
| Previous or next work | Arrow keys or the side controls |
| Pan with the keyboard | `Shift` + arrow key |
| Enter or leave fullscreen | `F` or the fullscreen button |
| Close the viewer | `Esc` |

On touch screens, pinch to zoom, drag with one finger after zooming, and swipe
horizontally at fit scale to change works.

## Catalogue

The complete catalogue is available at `/archive.html`. It loads artwork
metadata in twenty JSON chunks, reads a separate search index on demand, and
shows 12 works per page. Sort order, search text, and page number are preserved
in the URL for reloading or sharing.

## Timeline

The dedicated timeline at `/timeline.html` displays every work in five
chronological eras without pagination or a horizontal slider. A sticky
year rail follows the current work, while thumbnails load lazily as the wall is
scrolled.

## Scaling path

The static chunk architecture supports the current 500-work collection.
New Cleveland Museum of Art works use a two-tier 480/1600 image pipeline to
keep deployment size manageable. At the scale of
thousands, image files should move to object storage behind a CDN, catalogue
metadata should be served through a lightweight API or database, and search
should move to a dedicated index rather than shipping the full dataset to the
browser.

## Quick start

Node.js 20 or newer is required.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Artwork assets

Curated homepage records live in `src/data/artworks.js`; the generated world
collection lives in `src/data/world-collection.json`. The image pipeline pulls
from Wikimedia Commons and the Cleveland Museum of Art Open Access CDN, then
generates local WebP variants:

```bash
npm run fetch:artworks
```

Wikimedia source files are cached under `work/artwork-sources/` and are not
committed. Cleveland source files are processed as temporary downloads.
Deployable images are written to `public/artworks/`.

## Project layout

```text
src/
  data/artworks.js      artwork records and source links
  data/world-collection.json  generated CC0 museum records
  main.js               page rendering, search, timeline, and image viewer
  styles.css            responsive site and viewer styles
  timeline.js           full chronology loading and scroll tracking
  timeline.css          five-era chronology wall
scripts/
  build-catalog.mjs     homepage data, JSON chunks, and search index generation
  fetch-artworks.mjs    artwork download and WebP generation
  fetch-cleveland.mjs   CC0 world-art metadata refresh
public/data/            generated catalogue chunks and search index
public/artworks/        local thumbnail, preview, and large images
```

## Artwork rights

The MIT License applies to the original project code and written content. It
does not apply to the reproduced artworks.

Most images in this collection are in the public domain. *The Second Sunset of
the Day* is used under CC BY 2.0. The photograph of *The School of Athens* is
used under CC BY-SA 4.0. The Sputnik photograph is dedicated to the public
domain under CC0, and Cleveland Museum of Art works come from its CC0 open
access program. These images require the attribution recorded for each work.
Source pages, licenses, and attribution strings are listed in
[ATTRIBUTION.md](ATTRIBUTION.md); additional third-party notices are in
[NOTICE.md](NOTICE.md).

This is an independent educational project. It is not affiliated with or
endorsed by the museums, archives, photographers, or estates referenced in the
collection. Institutional names and artwork titles remain the property of
their respective owners.

## Developer

- Developer: Lissa7zz
- AI collaboration: OpenAI Codex
- Repository: [Lissa7zz/lumen-archive](https://github.com/Lissa7zz/lumen-archive)

## License

Copyright (C) 2026 Lissa7zz

Original project code, documentation, and original curatorial text are
released under the [MIT License](LICENSE). You may copy, modify, and distribute
them under its terms.

The software is provided "AS IS", without any express or implied warranty.
Artwork reproductions and third-party material remain subject to their
respective rights and licenses.

---

<p align="center"><em>كأن قلبي لم يعد ينبض؛ والريح الباردة تطلق تنهداتها — سانتاباد.</em></p>
