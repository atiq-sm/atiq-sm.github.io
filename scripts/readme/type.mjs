// Text as SVG paths, so every card reads the same on every machine: an image
// on GitHub can't load web fonts, and system fonts differ in width. Inter
// stands in for the site's Helvetica, JetBrains Mono for its monospace.
//
// Glyphs are laid out by hand (advance widths plus tracking) rather than
// through opentype.js's shaper, which can't read Inter's substitution tables.

import { readFileSync } from 'node:fs';
import opentype from 'opentype.js';

const root = new URL('../../node_modules/@fontsource/', import.meta.url);
const load = (file) => {
  const b = readFileSync(new URL(file, root));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};

export const SANS = load('inter/files/inter-latin-400-normal.woff');
export const SANS_MEDIUM = load('inter/files/inter-latin-500-normal.woff');
export const MONO = load('jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff');

// Glyphs the latin subsets lack, drawn as outlines in em units (y up from
// the baseline), with their advance.
const EXTRA = {
  '→': {
    advance: 0.78,
    d: [
      [0.06, 0.315], [0.56, 0.315], [0.38, 0.135], [0.45, 0.065], [0.75, 0.365],
      [0.45, 0.665], [0.38, 0.595], [0.56, 0.415], [0.06, 0.415],
    ],
  },
  '↗': {
    advance: 0.72,
    d: [
      [0.08, 0.06], [0.48, 0.46], [0.48, 0.21], [0.58, 0.21], [0.58, 0.63],
      [0.16, 0.63], [0.16, 0.53], [0.41, 0.53], [0.01, 0.13],
    ],
  },
  '■': { advance: 0.62, d: [[0.1, 0.12], [0.52, 0.12], [0.52, 0.54], [0.1, 0.54]] },
};

const r2 = (n) => Math.round(n * 100) / 100;

// A glyph's outline as path data. (opentype.js's own toPathData can print
// NaN for some coordinates, so the commands are written out here.)
function outline(path) {
  let d = '';
  for (const c of path.commands) {
    if (c.type === 'Z') d += 'Z';
    else if (c.type === 'Q') d += `Q${r2(c.x1)} ${r2(c.y1)} ${r2(c.x)} ${r2(c.y)}`;
    else if (c.type === 'C') d += `C${r2(c.x1)} ${r2(c.y1)} ${r2(c.x2)} ${r2(c.y2)} ${r2(c.x)} ${r2(c.y)}`;
    else d += `${c.type}${r2(c.x)} ${r2(c.y)}`;
  }
  return d;
}

function glyphs(str, font, size, tracking) {
  const scale = size / font.unitsPerEm;
  const out = [];
  let x = 0;
  for (const ch of str) {
    const extra = EXTRA[ch];
    const g = extra ? null : font.charToGlyph(ch);
    if (!extra && !g.index && ch !== ' ') throw new Error(`no glyph for ${JSON.stringify(ch)} in ${font.names.fullName?.en}`);
    const advance = extra ? extra.advance * size : g.advanceWidth * scale;
    out.push({ ch, g, extra, x });
    x += advance + tracking * size;
  }
  // the trailing tracking isn't part of the text
  return { list: out, width: Math.max(0, x - (str.length ? tracking * size : 0)) };
}

export function measure(str, { font = SANS, size = 16, tracking = 0 } = {}) {
  return glyphs(str, font, size, tracking).width;
}

// Each glyph is outlined once, in font units, and placed with <use>: a page
// of text then costs a few dozen bytes a letter. withDefs() adds the outlines
// a document refers to.
const ids = new Map(); // `${font}:${glyph}` -> id
const outlines = new Map(); // id -> path data
const fontKey = new Map();
function glyphId(font, g) {
  if (!fontKey.has(font)) fontKey.set(font, fontKey.size);
  const key = `${fontKey.get(font)}:${g.index}`;
  if (!ids.has(key)) {
    const id = `g${ids.size}`;
    ids.set(key, id);
    outlines.set(id, outline(g.getPath(0, 0, font.unitsPerEm)));
  }
  return ids.get(key);
}

export function withDefs(body) {
  const used = [...new Set([...body.matchAll(/href="#(g\d+)"/g)].map((m) => m[1]))];
  return used.length ? `<defs>${used.map((id) => `<path id="${id}" d="${outlines.get(id)}"/>`).join('')}</defs>${body}` : body;
}

/**
 * One line of text, as outlines in a <g>. `y` is the baseline; `anchor` is
 * 'start', 'middle' or 'end'. Returns { svg, width }.
 */
export function text(str, { font = SANS, size = 16, x = 0, y = 0, fill = '#ededed', tracking = 0, anchor = 'start', upper = false, attrs = '' } = {}) {
  const s = upper ? str.toUpperCase() : str;
  const { list, width } = glyphs(s, font, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const k = +(size / font.unitsPerEm).toPrecision(5);
  let parts = '';
  let d = '';
  for (const { g, extra, x: gx } of list) {
    if (extra) {
      d += 'M' + extra.d.map(([px, py]) => `${r2(x0 + gx + px * size)} ${r2(y - py * size)}`).join('L') + 'Z';
    } else if (g.path?.commands?.length) {
      parts += `<use href="#${glyphId(font, g)}" transform="matrix(${k} 0 0 ${k} ${r2(x0 + gx)} ${r2(y)})"/>`;
    }
  }
  if (d) parts += `<path d="${d}"/>`;
  return { svg: parts ? `<g ${attrs} fill="${fill}">${parts}</g>` : '', width };
}

// Break a paragraph into lines no wider than `width`.
export function wrap(str, width, opts = {}) {
  const lines = [];
  let line = '';
  for (const word of str.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, opts) > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** A wrapped paragraph: lines `leading` apart, the first baseline at `y`. */
export function paragraph(str, { width, leading, ...opts }) {
  const lines = wrap(str, width, opts);
  const svg = lines.map((l, i) => text(l, { ...opts, y: opts.y + i * leading }).svg).join('');
  return { svg, lines, height: lines.length * leading };
}
