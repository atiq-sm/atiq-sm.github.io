# new-profile

Personal portfolio site — built with Vite + React, deployed to GitHub Pages.

Live site (after first deploy): https://atiq-sm.github.io/new-profile/

## Quickstart

```bash
npm install
npm run dev       # local dev server on http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build locally
```

## Editing your content

All text, links, and project entries live in one file:

- `src/data/site.js`

Change your name, tagline, bio, social links, and project cards there. No other file needs to be touched for a content update.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

**One-time setup** (in the GitHub repo UI):

1. Settings → Pages
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the workflow manually from the Actions tab)

The site will be live at `https://atiq-sm.github.io/new-profile/`.

> If you rename this repo to `atiq-sm.github.io` (a user site), change `base` in `vite.config.js` from `'/new-profile/'` to `'/'`.

## Project structure

```
src/
  data/site.js        # content — edit here
  sections/           # Hero, About, Projects, Contact, Footer
  App.jsx             # composes the sections
  main.jsx            # React entry
  styles.css          # theme tokens + layout
```
