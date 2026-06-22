# Editing your contact page

This is a short, no-jargon guide. You do **not** need to install anything, use a
terminal, or know how to code. Everything happens in your web browser on GitHub.

---

## A quick honest note about privacy

Your page lives at a hard-to-guess web address like:

```
https://<project>.pages.dev/p/8f3kd9qa2x
```

The random part (`8f3kd9qa2x`) means people can't stumble onto your page, and search
engines are told not to list it. **But it is not password-protected.** Anyone you give
the link to can open it, and could forward it on. So treat the link as *semi-private*:
share it with people you choose, but don't put anything on the page you'd mind a stranger
seeing if the link leaked.

---

## 1. Edit your details (the only file you touch: `profile.js`)

1. Go to the project on GitHub and open the folder **`p/`**.
2. Open the folder with **your** code (your maintainer will tell you which one — e.g.
   `p/8f3kd9qa2x/`). Each person has their own folder; you only edit your own.
3. Click the file **`profile.js`**.
4. Click the **pencil icon** (✏️ "Edit this file") near the top right.
5. Change the text **between the quotation marks**. The file has comments at the top that
   show exactly how to:
   - **add** a contact (copy a line, paste it, change the values),
   - **remove** a contact (delete its line),
   - **reorder** contacts (move a line up or down),
   - and the full **list of types** you can use (email, phone, website, linkedin,
     github, scholar, orcid, researchgate, twitter, and a generic `link` for anything
     else).
   - Leaving a `value` empty (`""`) just hides that row — that's fine.
6. Scroll down, click the green **Commit changes** button, then **Commit changes** again
   in the popup. Done — your page updates automatically in a minute or two.

> Tip: keep the commas, quotes, and curly braces exactly as they are. If your page ever
> shows a short "couldn't load" message, you probably deleted a quote or comma by
> accident — undo your last change and try again.

## 2. Add or replace your photo

Your photo is the file **`assets/avatar.jpg`** inside your folder. A square image looks
best (it's shown as a circle).

1. Open your folder, then the **`assets`** folder.
2. To replace the photo: click **`avatar.jpg`**, then the **trash/delete** option to
   remove it, and commit. Then use **Add file → Upload files** to upload your own image.
   **Name it exactly `avatar.jpg`** so the page finds it.
3. Commit the change. If no photo is found, a neutral placeholder is shown automatically —
   nothing breaks.

---

## For the maintainer: adding a new person (3 steps)

1. **Copy** the `_template/` folder and rename the copy to a **freshly generated** random
   slug of 10–12 lowercase letters/digits, placed under `p/` — e.g. `p/q9w2e7r4t1/`.
   (Generate a new random slug every time; don't reuse or hand-pick memorable ones.)
2. **Fill in** that folder's `profile.js` and drop the person's photo at
   `assets/avatar.jpg`.
3. **Record** the mapping in `slug-map.local.txt` (e.g. `Jane Doe -> q9w2e7r4t1`). That
   file is git-ignored and stays on your machine only. Share the
   `/p/q9w2e7r4t1` link privately with that person.

### Things to keep neutral (so nothing ties pages together or to a group)

- There is **no directory page** and pages never link to each other — keep it that way.
- Keep the Cloudflare **project name neutral**; it appears in the public URL.
- Don't add a group name, logo, or footer branding to any page.
- The design for *everyone* lives in `shared/card.css` and `shared/card.js`. Edit those
  to restyle all pages at once. Colleagues only ever edit their own `profile.js`.

### Note on previewing locally

Double-clicking an `.html` file to open it from your disk will show a **blank page** —
the pages load shared files via absolute paths (`/shared/...`) that only resolve when
served by a web server. It works correctly once deployed (Cloudflare Pages), or locally
if you run a small server in the project folder (e.g. `python -m http.server`) and visit
`http://localhost:8000/p/<slug>/`.
