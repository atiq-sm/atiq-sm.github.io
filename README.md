# new-profile

Personal portfolio site — built with Vite + React, pre-rendered to static HTML at
build time, and deployed to GitHub Pages.

Live site: https://atiq-sm.github.io

## Quickstart

```bash
npm install
npm run dev       # local dev server on http://localhost:5173
npm run build     # production build into dist/ (client, SSR, then pre-render)
npm run preview   # serve the production build locally
```

## Pages

| URL                 | Source                   | What it holds                                                    |
| ------------------- | ------------------------ | ---------------------------------------------------------------- |
| `/`                 | `src/pages/Home.jsx`     | The overview: hero and stats, the four flagships, a timeline of roles |
| `/work/`            | `src/pages/Work.jsx`     | The flagships at full width, more work, then a one-line archive  |
| `/work/mr-pocus/`   | `src/pages/Story.jsx`    | The MR POCUS case study: footage, the story, the study results   |
| `/work/cardalive/`  | `src/pages/Story.jsx`    | The CardAlive case study: gameplay video and how it plays        |
| `/about/`           | `src/pages/About.jsx`    | Bio, what I'm working on now, full experience and education      |
| 404                 | `src/pages/NotFound.jsx` | GitHub Pages serves `dist/404.html` for unknown paths            |

Each page is its own HTML file (`index.html`, `work/index.html`,
`work/mr-pocus/index.html`, `work/cardalive/index.html`, `about/index.html`,
`404.html`) with its own title and share tags. All of them
load `src/main.jsx`, which renders the page named by `<body data-page>`. Links
between pages are always absolute (`/work/`, `/about/#experience`).

Old single-page links keep working: `/#about`, `/#projects` and `/#experience`
redirect to their new homes, and `/#contact` still lands on the contact band.

## Editing your content

Everything the pages say about you lives in one file:

- `src/data/site.js`

Section headings ("Selected work.", "Now.") live in the page files. In
`site.js`:

- `intro`, `stats`: the homepage hero's lede, fine print and four facts
- `status`: the short tag in the top bar
- `cta`: the closing band on every page
- `about`, `now`, `focus`, `approach`, `location`: the About page
- `experience`: each entry has a `kind`, `'work'` or `'education'`; the homepage
  shows the work roles, About shows both with their bullets
- `projects`: each has a `tier` and a `category` (its label), and optionally:
  - `tier: 'flagship'` puts it on the homepage and at full width on /work/,
    with a one-line `summary`, a `headline` and `facts`; `'more'` gives it a
    full entry, `'archive'` one line
  - `viz` to give it an animated illustration (`cardalive`, `pocus`, `knockout`,
    `rag`, `snake`)
  - `story` to give it its own page at `/work/<slug>/`: a `pitch`, a `video` or
    lead `figure`, `facts`, `sections` (each with `body` paragraphs and
    optional `figures`), `results`, `credits`, `evidence` links and the `next`
    story. A new story also needs its HTML file, and an entry in
    `vite.config.js` (`input` and `PAGE_DIRS`) and in `scripts/prerender.mjs`
  - `liveLabel` to name its live link (it reads "Live" otherwise)
  - `slug` to choose its anchor and page URL (otherwise it comes from the title)

Descriptions lead with what exists and what was hard; the stack goes in `tags`.

The Repository button only appears when `href` points at a repository, so a
project linked to your profile shows none until its URL is filled in.

## How it is built

`npm run build` runs three steps:

1. `vite build`: the client bundle and the four HTML files, into `dist/`
2. `vite build --ssr src/entry-server.jsx`: a render function, into the
   git-ignored `dist-ssr/`
3. `node scripts/prerender.mjs`: renders each page to HTML and writes it into
   its file in `dist/`

The browser then hydrates that markup, so every page paints before any
JavaScript runs and reads fully without it. Keep render output deterministic
(no `Date.now()`, `Math.random()` or `window` while rendering) so the
pre-rendered page and the hydrated one agree; browser-only work belongs in
`useEffect`.

Live GitHub stats (language, stars, last push) come from one request to the
GitHub API per visit, cached for 30 minutes in `sessionStorage`.

## Footage and figures

Real footage and stills live in `public/media/` and are committed. The
CardAlive recording is H.264 (the source was HEVC, which most browsers can't
play), made with [ffmpeg](https://ffmpeg.org/):

```bash
ffmpeg -i CardAlive_Today.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 \
  -profile:v high -pix_fmt yuv420p -preset slow -crf 28 -maxrate 1050k \
  -bufsize 2100k -c:a aac -b:a 96k -ac 2 -movflags +faststart \
  public/media/cardalive-gameplay.mp4
ffmpeg -ss 48.5 -i CardAlive_Today.mp4 -frames:v 1 -vf scale=1280:-2 \
  -q:v 4 public/media/cardalive-turn.jpg
```

Every image needs its `width`, `height` and `alt` in `site.js`. Show only
in-headset views and diagrams unless the people in a photo have agreed.

## Illustrations

The animated project illustrations are drawn in grayscale on a canvas and
presented through an ordered (Bayer) dither in ink and lime:

- `src/lib/dither.js`: the dither stage
- `src/lib/ticker.js`: one animation loop, running only while an illustration
  is on screen
- `src/viz/*.js`: one scene each, a pure function of time drawn with the
  pixel-snapped kit in `src/viz/kit.js`

To add one, write a scene in `src/viz/`, register it in `src/viz/index.js`,
and set that key as a project's `viz`. Visitors who prefer reduced motion see a
single still frame.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

**One-time setup** (in the GitHub repo UI):

1. Settings → Pages
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually from the Actions tab)

The site is live at `https://atiq-sm.github.io/`. This is a user site, so `base` in
`vite.config.js` is `'/'` and all asset paths are root-relative.

## Regenerating share assets

`public/og-image.png` and `public/apple-touch-icon.png` are rasterized from the
matching SVGs and committed to the repo (the deploy workflow does not regenerate
them). After editing `public/og-image.svg` or `public/favicon.svg`, run:

```bash
npm run generate:og
```

The SVGs use generic font families; the script maps them to the fonts the site
itself uses on your OS.

## Design

The design language (lime on ink, the 12-column grid, the type scale, the
dithered seams and canvases) is adapted from the
[Laya playground](https://brainfunctioncollapse.com/laya) by brain function
collapse, used under the MIT License. See `THIRD_PARTY_NOTICES.md`.

## Project structure

```
index.html, work/, about/, 404.html   # one HTML entry per page
public/media/         # footage and stills for the story pages
src/
  data/site.js        # content — edit here
  pages/              # Home, Work, Story, About, NotFound
  components/         # TopBar, Hero, Section, Band, Footer, ProjectCard, …
  viz/                # the illustration scenes
  lib/                # dither stage, animation ticker, formatters
  hooks/              # useGithubRepo
  App.jsx             # the page map and shared layout
  main.jsx            # browser entry: hydrates the pre-rendered page
  entry-server.jsx    # build-time render for scripts/prerender.mjs
  styles.css          # the design system
scripts/
  prerender.mjs       # writes pre-rendered markup into dist/
  generate-og.mjs     # rasterizes the share image and touch icon
```
