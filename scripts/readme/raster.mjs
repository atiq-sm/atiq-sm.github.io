// SVG to pixels (with resvg, which the share-image script already uses), and
// pixels to a palette for GIF frames.

import { readFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

// The design tokens, read from the stylesheet, the one place colors are set.
const css = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
const token = (name) => {
  const m = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css);
  if (!m) throw new Error(`no --${name} in styles.css`);
  return m[1];
};
export const C = Object.fromEntries(['ink', 'surface', 'line', 'rule', 'accent', 'text', 'dim', 'faint'].map((n) => [n, token(n)]));
export const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Rasterize an SVG string at `scale` device pixels per unit. */
export function rasterize(svg, scale = 2) {
  const img = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: scale },
    font: { loadSystemFonts: false },
  }).render();
  return { width: img.width, height: img.height, rgba: img.pixels };
}

/**
 * A palette (at most `max` colors, `fixed` first, in order) and each pixel's
 * index in it. Colors past the limit go to their nearest kept color.
 */
export function palettize(rgba, fixed = [], max = 255) {
  const count = new Map();
  for (let i = 0; i < rgba.length; i += 4) {
    const c = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
    count.set(c, (count.get(c) ?? 0) + 1);
  }
  const keys = fixed.map(([r, g, b]) => (r << 16) | (g << 8) | b);
  const rest = [...count.entries()].filter(([c]) => !keys.includes(c)).sort((a, b) => b[1] - a[1]);
  for (const [c] of rest) {
    if (keys.length >= max) break;
    keys.push(c);
  }
  const palette = keys.map((c) => [c >> 16, (c >> 8) & 0xff, c & 0xff]);
  const lookup = new Map(keys.map((c, i) => [c, i]));
  const nearest = (c) => {
    const [r, g, b] = [c >> 16, (c >> 8) & 0xff, c & 0xff];
    let best = 0;
    let bestD = Infinity;
    palette.forEach(([pr, pg, pb], i) => {
      const d = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
      if (d < bestD) [best, bestD] = [i, d];
    });
    lookup.set(c, best);
    return best;
  };
  const index = new Uint8Array(rgba.length / 4);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    const c = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
    index[p] = lookup.get(c) ?? nearest(c);
  }
  return { palette, index };
}
