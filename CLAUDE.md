# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single static HTML file (`index.html`) — a personal contact card page. No build step, no package manager, no dependencies, no JavaScript. Everything (markup, CSS) lives in this one file.

## Running it

There is no build/test/lint tooling. To preview, just open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python -m http.server`) if `file://` restrictions cause issues.

## Structure of `index.html`

- **Design tokens** (`:root` CSS variables near the top of `<style>`): colors, radii, shadows. A second `:root` block inside `@media (prefers-color-scheme: dark)` overrides the same variable names for dark mode — there is no JS theme toggle, it follows the OS setting automatically.
- **Card layout**: `.header` (avatar, name, tagline) followed by `.contact-list`, a `nav` of `.contact-row` links styled like an iOS Settings grouped list (icon, label, optional sub-label, chevron).
- Each contact row is a self-contained `<a class="contact-row">` block with an inline SVG icon, label/sub-label, and chevron SVG — copy an existing row to add a new contact method.
- Inline HTML comments marked `<!-- EDIT: ... -->` mark the values meant to be customized (title, name, tagline, avatar, and each contact link's URL/handle). Update content by editing those marked spots rather than restructuring the surrounding markup.
