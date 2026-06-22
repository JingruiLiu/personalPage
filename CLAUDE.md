# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A set of **independent, private personal contact-card pages** — one per person — that
share one repo and one Cloudflare Pages deploy. It is **not** a public directory: no page
lists, links to, or hints at any other page. Each page is reachable only by someone who
already has its exact random-slug URL (e.g. `/p/8f3kd9qa2x/`).

Plain static HTML/CSS/JS — **no build step, no framework, no package manager**. Cloudflare
Pages serves files as-is, so a colleague's edit can never break a build.

> Privacy model: this is **obscurity, not access control**. Files are public static
> assets; anyone with a link can open the page. Random 10–12 char slugs +
> `robots.txt`/`noindex` keep pages unguessable and unindexed, not secret.

## Architecture (data-driven)

Two layers, deliberately separated:

- **Shared layer (maintainer-owned)** — `shared/card.css` and `shared/card.js`. This is
  the single source of truth for design *and* behavior: the renderer, the inline-SVG icon
  set, and the `LINK_TYPES` registry (each type defines its icon, default label, href
  builder, and subtitle builder). **Restyle or re-type everyone at once by editing
  `shared/` only.**
- **Per-person layer (colleague-edited)** — `p/<slug>/profile.js`, a heavily commented
  object literal assigned to `window.PROFILE`. It holds `name`, `tagline`, `avatar`, and
  an ordered `links` array of `{ type, value, label? }`. This is the ONLY file a
  colleague edits.

Each `p/<slug>/index.html` is a fixed shell (colleagues don't touch it) that loads
`/shared/card.css`, the local `profile.js`, then `/shared/card.js`. The renderer reads
`window.PROFILE` into `<main id="card-root">`.

### Renderer contract (in `shared/card.js`)

- Iterates `links` in order; **skips any entry whose `value` is empty** (so half-filled
  templates still look clean).
- Unknown `type` falls back to the generic `link` type — never throws. Aliases like
  `x`→`twitter`, `google_scholar`→`scholar` are supported.
- URLs are sanitized (only `http(s)`/`mailto`/`tel`; bare domains get `https://`;
  `javascript:`/`data:` are dropped).
- Missing/malformed `window.PROFILE` → a friendly fallback message (mailto
  jingruiliu09@gmail.com), not a blank page. A broken avatar image swaps to an inline SVG
  placeholder via `onerror`.
- Rows render in the iOS Settings grouped-list style: accent icon + label + optional grey
  sub-label + chevron, 44px min tap target.

## Isolation / neutrality rules (must preserve)

- **No directory and no cross-links.** Don't add a page that lists people, and don't link
  one person's page to another or to any group. The root `index.html` is an intentionally
  near-blank neutral placeholder.
- **Random slugs only.** Person folders under `p/` are named with random 10–12 char
  `[a-z0-9]` slugs, never real names. Generate a fresh one per person.
- **`robots.txt`** disallows all crawling; every page shell also has
  `<meta name="robots" content="noindex, nofollow">`.
- **Keep it neutral.** No group name, logo, or footer branding on any page; keep the
  Cloudflare project name neutral (it shows in the `pages.dev` URL).
- **Private/local-only files** (git-ignored, never deployed): `slug-map.local.txt`
  (the real-name → slug map) and `original-card.local.html` (backup of the original
  single-file card).

## Adding a person (3 steps)

1. Copy `_template/` → `p/<fresh-random-slug>/`.
2. Fill in that folder's `profile.js`; put the photo at `assets/avatar.jpg`.
3. Record `Name -> <slug>` in `slug-map.local.txt` (local only) and share the link
   privately.

See `EDITING-GUIDE.md` for the colleague-facing, GitHub-web-editor workflow.

## Running / previewing

No build/test/lint tooling. Pages use **absolute** paths (`/shared/...`), so opening an
`.html` directly via `file://` shows a blank page. Serve the repo root instead:

```
python -m http.server
```

then visit `http://localhost:8000/p/<slug>/` (a person page) or `http://localhost:8000/`
(the neutral root). Deployment assumes the repo root is served at the domain root.
