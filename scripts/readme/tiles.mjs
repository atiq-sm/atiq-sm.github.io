// The "Selected work" tiles: each is a project card from the site (its
// dithered illustration with its labels, then title, summary and stack)
// baked into one GIF. Only the illustration moves, so after the first frame
// each frame stores just that rectangle.

import { site } from '../../src/data/site.js';
import { VIZ } from '../../src/viz/index.js';
import { player } from './stage.mjs';
import { animate } from './compose.mjs';
import { C } from './raster.mjs';
import { MONO, SANS, SANS_MEDIUM, paragraph, measure, text, withDefs } from './type.mjs';

export const SITE = 'https://atiq-sm.github.io';
const FPS = 25;

// the tile, in CSS pixels: an illustration the site's card shape, inset by a border
export const TILE_W = 414;
const PAD = 17;
const SW = TILE_W - PAD * 2; // the scene, in scene pixels (one per CSS pixel, like the site)
const SH = Math.round((SW * 262) / 420);
const TEXT_W = SW;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const project = (slug) => {
  const p = site.projects.find((q) => (q.slug ?? slugify(q.title)) === slug);
  if (!p) throw new Error(`no project ${slug} in site.js`);
  return p;
};

// How long each scene runs before it repeats (each entry makes a fresh test). The timed scenes loop on their
// own clocks; the two simulations are cut where they come back to the start.
const seconds = (s) => () => (frame, t) => t >= s;
const loops = {
  pocus: seconds(0.95 * 3 + 0.9 + 2.6 * 2 + 0.9), // three beats, two breaths, two dissolves
  cardalive: seconds(2.4 + 3 * 1.8 + 2), // scan, three turns, the knockout and the reset
  npc: seconds(5.6 * 2), // a clean exchange, then a repaired one
  rag: seconds(4.2 * 3),
  // one whole game, from three cells to 28 and the reset
  snake: () => {
    let over = false;
    return (frame) => {
      if (frame.state.over >= 0) over = true;
      return over && frame.state.over < 0;
    };
  },
  // one bout: hits until a knockout, then the fresh target landing again
  knockout: () => {
    let phase = 0;
    return (frame) => {
      const st = frame.state;
      if (phase === 0 && st.ko >= 0) phase = 1;
      if (phase === 1 && st.ko < 0) phase = 2;
      return phase === 2 && !st.air;
    };
  },
};

export const TILES = [
  { slug: 'mr-pocus', file: 'work-mr-pocus.gif', href: `${SITE}/work/mr-pocus/` },
  { slug: 'cardalive', file: 'work-cardalive.gif', href: `${SITE}/work/cardalive/` },
  { slug: 'npc-dialogue-engine', file: 'work-npc.gif' },
  { slug: 'bare-metal-snake', file: 'work-snake.gif' },
  { slug: 'cosmic-knockout', file: 'work-knockout.gif' },
  {
    file: 'work-more.gif',
    viz: 'rag',
    href: `${SITE}/work/`,
    title: 'More work',
    // the 'more' tier on the site, in a sentence
    summary:
      'A room-scale zombie shooter that paths around your real furniture, voice RAG and screenshot search that never leave your machine, and Fraction Kitchen, a math game you can play.',
    meta: ['atiq-sm.github.io/work'],
  },
].map((tile) => {
  if (!tile.slug) return { ...tile, alt: `More work: ${tile.summary}` };
  const p = project(tile.slug);
  return {
    ...tile,
    viz: p.viz,
    title: p.title,
    summary: p.summary,
    meta: p.tags,
    href: tile.href ?? p.href,
    alt: `${p.title}: ${p.summary}`,
  };
});

// the text under the illustration, from `top`; returns its svg and height
function caption(tile, top) {
  let y = top;
  const title = paragraph(`${tile.title} →`, {
    font: SANS_MEDIUM, size: 21, tracking: -0.02, fill: C.text, x: PAD, y: y + 17, width: TEXT_W, leading: 25,
  });
  y += title.height + 8;
  const body = paragraph(tile.summary, { font: SANS, size: 15, fill: C.dim, x: PAD, y: y + 13, width: TEXT_W, leading: 22 });
  y += body.height + 12;
  // as many tags as fit on one line
  const metaOpts = { font: MONO, size: 11, tracking: 0.06, fill: C.faint, x: PAD, y: y + 10, upper: true };
  let tags = [];
  for (const tag of tile.meta) {
    const next = [...tags, tag].join(' · ');
    if (measure(next.toUpperCase(), metaOpts) > TEXT_W) break;
    tags.push(tag);
  }
  const meta = text(tags.join(' · '), metaOpts);
  y += 14;
  return { svg: title.svg + body.svg + meta.svg, height: y - top };
}

// a scene's labels, as the site sets them: small caps in an ink box
function labels(scene) {
  const list = typeof scene.labels === 'function' ? scene.labels(420 / 262) : scene.labels;
  return list
    .map(([str, px, py, align]) => {
      const size = 12;
      const opts = { font: MONO, size, tracking: 0.06, upper: true, fill: C.text };
      const bw = measure(str.toUpperCase(), opts) + 8;
      const bh = size + 4;
      let x = PAD + (px / 100) * SW;
      let y = PAD + (py / 100) * SH;
      if (align === 'center') [x, y] = [x - bw / 2, y - bh / 2];
      return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${C.ink}"/>${text(str, { ...opts, x: x + 4, y: y + 2 + size * 0.86 }).svg}`;
    })
    .join('');
}

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${withDefs(body)}</svg>`;

/** Render one row of tiles (equal heights); returns [{ file, gif, width, height, ... }]. */
export function renderRow(row) {
  const textTop = PAD + SH + 1 + 18;
  const height = textTop + Math.max(...row.map((t) => caption(t, textTop).height)) + 18;
  return row.map((tile) => {
    const scene = VIZ[tile.viz];
    const done = loops[tile.viz]();
    const frame = player(scene, SW, SH);
    const card = animate({
      width: TILE_W,
      height,
      svg: (body) => svgDoc(TILE_W, height, body),
      base:
        `<rect width="${TILE_W}" height="${height}" fill="${C.ink}"/>` +
        `<rect x="${PAD - 0.5}" y="${PAD - 0.5}" width="${SW + 1}" height="${SH + 1}" fill="none" stroke="${C.line}"/>` +
        caption(tile, textTop).svg,
      top: labels(scene),
      scenes: [{ x: PAD, y: PAD, w: SW, h: SH, frame }],
      fps: FPS,
      done: (t) => done(frame, t),
    });
    return { ...tile, ...card };
  });
}
