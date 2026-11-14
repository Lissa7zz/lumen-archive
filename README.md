[English](README.md) | [简体中文](README.zh-CN.md)

[![Deploy to GitHub Pages](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml)

**Quick access: [Open Lumen Archive](https://lissa7zz.github.io/lumen-archive/)**

# Lumen Archive

Lumen Archive is an open-source, cross-media timeline of paintings, prints, and
photography. The first collection brings together 12 works from 1434 to 1984,
with local high-resolution images, source information, and a viewer designed
for close inspection.

The site is a static build. It has no backend, account system, analytics, or
image-processing service.

## Highlights

- 12 curated paintings, prints, and photographs
- Chronological exhibition wall and horizontal timeline
- Search by title, artist, year, medium, or origin
- 1600 px and 3200 px WebP viewing assets
- Zoom with the mouse wheel, buttons, double-click, or a touch pinch gesture
- Drag to pan when enlarged, with touch swipe navigation at fit scale
- Keyboard controls, fullscreen mode, and a mobile artwork-information drawer
- Direct links to the original Wikimedia Commons records
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

Work metadata and source records are stored in `src/data/artworks.js`. The
image pipeline downloads high-resolution files from Wikimedia Commons and
generates the local WebP variants:

```bash
npm run fetch:artworks
```

Downloaded source files are cached under `work/artwork-sources/` and are not
committed. Deployable images are written to `public/artworks/`.

## Project layout

```text
src/
  data/artworks.js      artwork records and source links
  main.js               page rendering, search, timeline, and image viewer
  styles.css            responsive site and viewer styles
scripts/
  fetch-artworks.mjs    artwork download and WebP generation
public/artworks/        local display images
```

## Artwork rights

The MIT License applies to the original project code and written content. It
does not apply to the reproduced artworks.

Most images in this collection are in the public domain. *The Second Sunset of
the Day* is used under CC BY 2.0 and requires attribution. Source pages,
licenses, and attribution strings are listed in
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
