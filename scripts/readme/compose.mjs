// An animated card: a still SVG, with dithered scenes playing in some of its
// rectangles and layers that switch on and off, encoded as one GIF.

import { encodeGif } from './gif.mjs';
import { C, rgb, rasterize, palettize } from './raster.mjs';

export const SCALE = 2; // device pixels per CSS pixel, for sharp text on high-density screens

/**
 * @param width, height  the card, in CSS pixels
 * @param base    the still card, as SVG
 * @param scenes  [{ x, y, w, h, frame(t) }]: frame returns w*h pixels, 0 ink and 1 lime
 * @param top     SVG drawn over the scenes (their labels), or ''
 * @param layers  [{ svg, on(t) }]: drawn over everything while on(t)
 * @param fps, done(t)  the frame rate, and the test for the first frame past the loop
 */
export function animate({ width, height, base, scenes, top = '', layers = [], fps, done, svg }) {
  const still = rasterize(svg(base + top), SCALE);
  const extra = layers.map((l) => rasterize(svg(l.svg), SCALE).rgba);
  const all = new Uint8Array(still.rgba.length * (1 + extra.length));
  all.set(still.rgba);
  extra.forEach((px, i) => all.set(px, still.rgba.length * (i + 1)));
  const { palette, index } = palettize(all, [rgb(C.ink), rgb(C.accent)]);
  const n = still.rgba.length / 4;
  const baseIndex = index.subarray(0, n);

  // the pixels each overlay covers, and the index it puts there
  const cover = (rgba, offset) => {
    const list = [];
    for (let i = 0; i < n; i++) if (rgba[i * 4 + 3] > 0) list.push(i, index[offset + i]);
    return Int32Array.from(list);
  };
  const topCover = top ? cover(rasterize(svg(top), SCALE).rgba, 0) : new Int32Array();
  const layerCover = extra.map((px, i) => cover(px, n * (i + 1)));

  const W = still.width;
  const frames = [];
  for (let k = 0; ; k++) {
    const t = k / fps;
    const drawn = scenes.map((s) => s.frame(t));
    if (k > 0 && done(t)) break;
    if (k > fps * 90) throw new Error('the animation never looped');
    const out = baseIndex.slice();
    scenes.forEach((s, j) => {
      const px = drawn[j];
      for (let y = 0; y < s.h * SCALE; y++) {
        const row = ((y / SCALE) | 0) * s.w;
        const o = (s.y * SCALE + y) * W + s.x * SCALE;
        for (let x = 0; x < s.w * SCALE; x++) out[o + x] = px[row + ((x / SCALE) | 0)];
      }
    });
    for (let i = 0; i < topCover.length; i += 2) out[topCover[i]] = topCover[i + 1];
    layers.forEach((l, j) => {
      if (!l.on(t)) return;
      const c = layerCover[j];
      for (let i = 0; i < c.length; i += 2) out[c[i]] = c[i + 1];
    });
    frames.push({ pixels: out, ms: 1000 / fps });
  }
  const gif = encodeGif({ width: still.width, height: still.height, palette, frames });
  return { gif, width, height, frames: frames.length };
}
