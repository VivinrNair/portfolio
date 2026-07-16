# Vivin R. Nair — Portfolio (final build)

Built on Anna's original placeholder template (design system unchanged:
plum/cream palette, Libre Franklin + DM Sans, plain HTML/CSS/JS — no
framework, no build step).

## What changed vs the template

- **Content**: every placeholder filled from the approved content brief —
  bio, experience/education, featured writing (live WEF links, EN/ES/Asia
  editions), notes teasers, citation list, footer, SEO meta.
- **`#projects` → "Selected work" horizontal scroller**: the vertical
  3-card stack is now a horizontally scrollable row of **seven dedicated
  work boxes** (scroll-snap, prev/next buttons, keyboard-scrollable,
  reduced-motion aware). All new CSS is in a clearly marked *ADDITIONS*
  block at the end of `css/style.css`; nothing above it was touched.
- **`js/main.js` → v2**: original behaviours kept; every change is marked
  `CHANGED`/`ADDED` in comments. New: per-publication BibTeX via
  `data-cite` (the `CITES` map), focus return when the cite modal closes,
  null-safe guards so interior pages reuse the same file, safe
  localStorage access, guarded clipboard call, scroller controls.
- **New pages**: `work/deltamere.html` and `work/leip.html` case studies
  (same design system).
- **Deltamere artefacts**: `deltamere/index.html` and
  `deltamere/animatic.html` are **byte-identical** copies of Vivin's
  originals (sha256-verified during the build). Never edit these.
- **Images**: three labelled slot SVGs added (`images/slot-davos.svg`,
  `slot-deltamere.svg`, `slot-leip.svg`) marking exactly where real
  photos/screenshots go.

## Replace-me list (assets)

Find every marker with: `grep -rn "TODO" index.html work/`

1. `images/avatar.svg` → real headshot (roughly square, ≥800px)
2. `images/slot-davos.svg` → **the Summer Davos photo** (Tianjin) — the
   site's hero asset
3. `images/slot-deltamere.svg` → Deltamere product screenshot
4. `images/slot-leip.svg` → LEIP screenshot(s) — also used on `work/leip.html`
5. CV PDF → add at e.g. `cv/vivin-nair-cv.pdf` and point the 4th social
   icon (and any CV links) at it
6. ISCF Digest + LSE dissertation PDF links (`#` placeholders)
7. Favicon + OG image (optional polish)

When replacing an image, update the `<img src>` **and its alt text** to
describe the real image.

## Verify with Vivin (blockers for final copy)

- Summer Davos / AMNC attendance **year** (2025 assumed in copy)
- Global Shapers curator **term dates** (CV: Apr 2023–Jan 2024; LinkedIn:
  '24 / 2024–25) — homepage currently says 2023–2024
- Elsevier chapter: book title, year, pages, **DOI** → fill the `CITES`
  map in `js/main.js` and the modal fallback in `index.html`, and the DOI
  button link
- Deltamere public status (is deltamere.io live? add a link on
  `work/deltamere.html` if so)
- Is `http://leip.smartcitytvm.in/` still up? (commented-out button on
  `work/leip.html`)
- License choice (CC BY-NC-ND 4.0 currently) and the footer's last line —
  cut it if too playful

## Preview locally

```sh
python3 -m http.server 8000   # from this folder
# → http://localhost:8000
```

## Deploy to GitHub Pages (zero build)

1. Create the repo — cleanest URL: name it `<vivins-username>.github.io`
   on his account (site lands at the domain root; no path suffix).
2. Push this folder's contents to the repo root on `main`.
3. GitHub → Settings → Pages → Source: **Deploy from a branch** →
   `main` / `/ (root)` → Save.
4. Open `https://<vivins-username>.github.io/` and re-test: theme toggle,
   the work scroller, the cite modal, and both Deltamere artefacts.

No Actions workflow needed — plain static files. If the repo has a
different name, the site lives at `https://<user>.github.io/<repo>/`;
all links here are relative, so that works too.

**Custom domain later**: Settings → Pages → Custom domain (GitHub adds a
`CNAME` file — commit it), set DNS per GitHub's current docs
(`www` CNAME → `<user>.github.io`, apex A/ALIAS records), then enforce
HTTPS once the certificate issues.

## Structure

```
index.html               homepage (all sections)
work/deltamere.html      Deltamere case study
work/leip.html           LEIP case study
deltamere/index.html     Deltamere landing page — byte-identical artefact
deltamere/animatic.html  30s intro animatic — byte-identical artefact
css/style.css            template CSS + marked ADDITIONS block
js/main.js               template JS v2 (marked changes)
images/                  avatar + labelled slot placeholders
```
