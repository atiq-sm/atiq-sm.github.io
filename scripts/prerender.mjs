// Runs after the client and SSR builds: renders every page to HTML and writes
// it into the built file, so content paints before any JavaScript runs.
import { readFileSync, writeFileSync } from 'node:fs';
import { render, PAGES } from '../dist-ssr/entry-server.js';

const SLOT = '<div id="root"><!--app--></div>';
const FILES = ['index.html', 'work/index.html', 'about/index.html', '404.html'];

for (const file of FILES) {
  const url = new URL(`../dist/${file}`, import.meta.url);
  const html = readFileSync(url, 'utf8');
  const page = /<body[^>]*\sdata-page="([^"]+)"/.exec(html)?.[1];
  if (!page || !(page in PAGES)) throw new Error(`${file}: unknown data-page "${page}"`);
  if (html.split(SLOT).length !== 2) throw new Error(`${file}: expected exactly one ${SLOT}`);

  const markup = render(page);
  // A function replacer, so a "$&" in the content is never expanded.
  writeFileSync(url, html.replace(SLOT, () => `<div id="root">${markup}</div>`));
  console.log(`prerendered dist/${file} (${page}, ${markup.length} chars)`);
}
