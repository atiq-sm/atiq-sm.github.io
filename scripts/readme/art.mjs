// The vector pieces of the profile README: the hero, the link buttons,
// section heads, the stack, the study chart and the closing band. Each is a
// self-contained SVG in the site's colors, with its text as outlines.
//
// An SVG shown as an image on GitHub can't run script or load anything, but
// its CSS animations play, so motion is kept to a few quiet loops.

import * as icons from 'simple-icons';
import { site } from '../../src/data/site.js';
import { C } from './raster.mjs';
import { MONO, SANS, SANS_MEDIUM, measure, paragraph, text, withDefs } from './type.mjs';

export const W = 840; // the README column, in CSS pixels
const M = 24; // the margin

const doc = (w, h, body, { style = '', label = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"${label ? ` aria-label="${esc(label)}"` : ''}>` +
  `<style>${style}@media (prefers-reduced-motion: reduce){*{animation:none!important}}</style>${withDefs(body)}</svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// the site's CSS dithers: a quarter of each 4px tile, or half of it (a checker)
const patterns = (pairs) =>
  `<defs>${pairs
    .map(([id, color, half]) =>
      `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect x="2" width="2" height="2" fill="${color}"/>${half ? `<rect y="2" width="2" height="2" fill="${color}"/>` : ''}</pattern>`,
    )
    .join('')}</defs>`;

// Where lime meets ink, as on the site: three 8px steps. `up` runs ink to lime.
function seam(y, up = false) {
  const [a, b] = up ? [C.ink, C.accent] : [C.accent, C.ink];
  const id = up ? 'su' : 'sd';
  return (
    patterns([[`${id}1`, b, false], [`${id}2`, C.accent, true], [`${id}3`, a, false]]) +
    `<rect y="${y}" width="${W}" height="8" fill="${a}"/><rect y="${y}" width="${W}" height="8" fill="url(#${id}1)"/>` +
    `<rect y="${y + 8}" width="${W}" height="8" fill="${C.ink}"/><rect y="${y + 8}" width="${W}" height="8" fill="url(#${id}2)"/>` +
    `<rect y="${y + 16}" width="${W}" height="8" fill="${b}"/><rect y="${y + 16}" width="${W}" height="8" fill="url(#${id}3)"/>`
  );
}

const mono = (str, o) => text(str, { font: MONO, size: 11, tracking: 0.06, upper: true, ...o });

// a control as the site draws one: small caps in a box, solid or outlined
function control(str, x, y, { solid = false, fg = C.ink, bg = C.accent, h = 28, size = 11, anchor = 'start' } = {}) {
  const tw = measure(str.toUpperCase(), { font: MONO, size, tracking: 0.06 });
  const bw = Math.round(tw + 26);
  const x0 = anchor === 'end' ? x - bw : x;
  const box = solid
    ? `<rect x="${x0}" y="${y}" width="${bw}" height="${h}" fill="${bg}"/>`
    : `<rect x="${x0 + 0.5}" y="${y + 0.5}" width="${bw - 1}" height="${h - 1}" fill="none" stroke="${bg}"/>`;
  return { svg: box + mono(str, { x: x0 + 13, y: y + h / 2 + size * 0.36, fill: fg, size }).svg, width: bw };
}

// the favicon's mark, at any size
const mark = (x, y, s) =>
  `<g transform="translate(${x} ${y}) scale(${s / 32})"><rect width="32" height="32" fill="${C.accent}"/>` +
  `<path d="M11 6h10v5H11zM6 11h5v15H6zM21 11h5v15h-5zM11 17h10v4H11z" fill="${C.ink}"/></g>`;

// ---------------------------------------------------------------- the hero

const HEADLINE = ['Mixed reality that', 'works in real rooms.']; // as in src/pages/Home.jsx

export function hero() {
  // the top bar, as on the site
  const bar = 48;
  const status = site.status.label;
  const touch = control('Get in touch', W - M, 10, { solid: true, anchor: 'end' });
  const tagW = measure(status.toUpperCase(), { font: MONO, size: 11, tracking: 0.06 }) + 34;
  const tagX = W - M - touch.width - 14 - tagW;
  let body =
    `<rect width="${W}" height="${bar}" fill="${C.ink}"/>` +
    mark(M, 13, 22) +
    text(site.name.split(' ').filter((_, i, a) => i === 0 || i === a.length - 1).join(' '), { font: SANS_MEDIUM, size: 15, x: M + 32, y: 29.5, fill: C.text, tracking: -0.01 }).svg +
    mono('Work', { x: 196, y: 28, fill: C.dim }).svg +
    mono('About', { x: 248, y: 28, fill: C.dim }).svg +
    `<rect x="${tagX + 0.5}" y="12.5" width="${tagW - 1}" height="23" fill="none" stroke="${C.rule}"/>` +
    `<rect class="blink" x="${tagX + 9}" y="21" width="6" height="6" fill="${C.accent}"/>` +
    mono(status, { x: tagX + 21, y: 28, fill: C.dim }).svg +
    touch.svg;

  // the headline, sized so its longer line fills the measure
  const tracking = -0.055;
  const unit = Math.max(...HEADLINE.map((l) => measure(l, { font: SANS_MEDIUM, size: 1, tracking })));
  const size = Math.floor((W - M * 2) / (unit + 0.14)); // room for the cursor
  const base1 = bar + 34 + Math.round(size * 0.73);
  const space = measure(' ', { font: SANS_MEDIUM, size, tracking }) + tracking * size;
  let end = 0; // where the last word ends
  const words = HEADLINE.flatMap((line, i) => {
    let x = M - size * 0.02;
    // each word rises in on its own, one after another
    return line.split(' ').map((word, j) => {
      const t = text(word, { font: SANS_MEDIUM, size, tracking, x, y: base1 + i * size * 0.9, fill: C.ink, attrs: `class="rise" style="animation-delay:${(i * 3 + j) * 70}ms"` });
      end = x + t.width;
      x = end + space;
      return t.svg;
    });
  });
  const cursorX = Math.round(end + size * 0.06);
  const base2 = base1 + size * 0.9;
  const head = words.join('') +
    `<rect class="cursor" x="${cursorX}" y="${base2 - size * 0.71}" width="${Math.round(size * 0.09)}" height="${Math.round(size * 0.71)}" fill="${C.ink}"/>`;

  // the lede and the fine print, side by side
  const top = base2 + 44;
  const lede = paragraph(site.intro.lede, { font: SANS, size: 17, tracking: -0.02, fill: C.ink, x: M, y: top + 14, width: 420, leading: 22 });
  const fineX = 492;
  const fineLines = paragraph(site.intro.fine, { font: MONO, size: 11, fill: C.ink, x: fineX, y: 0, width: W - M - fineX, leading: 17.6 }).lines;
  const fineTop = top + lede.height - fineLines.length * 17.6 + 2;
  const fine = paragraph(site.intro.fine, { font: MONO, size: 11, fill: C.ink, x: fineX, y: fineTop + 10, width: W - M - fineX, leading: 17.6 });

  // the four stats, each under a rule
  const sTop = top + lede.height + 40;
  const colW = (W - M * 2) / 4;
  let stats = '';
  let sH = 0;
  site.stats.forEach((s, i) => {
    const x = M + i * colW;
    const cap = paragraph(s.label, { font: MONO, size: 10.5, fill: C.ink, x: x + 12, y: sTop + 62, width: colW - 28, leading: 16 });
    sH = Math.max(sH, 50 + cap.height + 4);
    stats +=
      `<g class="up" style="animation-delay:${600 + i * 90}ms">` +
      text(s.value, { font: SANS_MEDIUM, size: 46, tracking: -0.048, x: x + 11, y: sTop + 38, fill: C.ink }).svg +
      cap.svg +
      `</g>`;
  });
  stats += site.stats.map((_, i) => `<rect x="${M + i * colW}" y="${sTop}" width="1" height="${sH}" fill="${C.ink}"/>`).join('');

  const fieldEnd = sTop + sH + 36;
  const H = fieldEnd + 24;
  const style =
    '.rise{animation:rise .8s cubic-bezier(.2,.7,0,1) both}' +
    '.up{animation:fade .9s cubic-bezier(.2,.7,0,1) both}' +
    '.blink{animation:blink 1.1s steps(1) infinite}' +
    // the cursor arrives with the last word, then blinks
    `.cursor{animation:rise .8s cubic-bezier(.2,.7,0,1) ${(HEADLINE.join(' ').split(' ').length - 1) * 70}ms both,blink 1.1s steps(1) 1.4s infinite}` +
    '@keyframes rise{from{transform:translateY(28px);opacity:0}}' +
    '@keyframes fade{from{transform:translateY(10px);opacity:0}}' +
    '@keyframes blink{50%{opacity:0}}';
  return {
    svg: doc(
      W,
      H,
      `<rect width="${W}" height="${H}" fill="${C.accent}"/>` + body + head +
        `<g class="up" style="animation-delay:450ms">${lede.svg}</g>` +
        `<g class="up" style="animation-delay:520ms" fill-opacity=".78" opacity=".78">${fine.svg}</g>` +
        stats + seam(fieldEnd),
      { style, label: `${HEADLINE.join(' ')} ${site.intro.lede}` },
    ),
    width: W,
    height: H,
  };
}

// ------------------------------------------------------- buttons and heads

/** A link button: lime and solid for the main one, ink for the rest. */
export function button(str, { primary = false } = {}) {
  const size = 12;
  const tw = measure(`${str} ↗`.toUpperCase(), { font: MONO, size, tracking: 0.06 });
  const w = Math.round(tw + 30);
  const h = 36;
  const [bg, fg] = primary ? [C.accent, C.ink] : [C.ink, C.text];
  const body =
    `<rect width="${w}" height="${h}" fill="${bg}"/>` +
    (primary ? '' : `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${C.rule}"/>`) +
    mono(`${str} `, { x: 15, y: h / 2 + 4.3, fill: fg, size }).svg +
    text('↗', { font: MONO, size, x: 15 + measure(`${str} `.toUpperCase(), { font: MONO, size, tracking: 0.06 }) + 1, y: h / 2 + 4.3, fill: primary ? C.ink : C.accent }).svg;
  return { svg: doc(w, h, body, { label: str }), width: w, height: h };
}

/** A section head: the title large on the left, a lead on the right. */
export function head(title, lead) {
  const size = 54;
  const leadX = 440;
  const p = paragraph(lead, { font: SANS, size: 17, tracking: -0.02, fill: C.dim, x: leadX, y: 0, width: W - M - leadX, leading: 22 });
  const H = Math.max(size + 56, p.height + 56);
  const lead2 = paragraph(lead, { font: SANS, size: 17, tracking: -0.02, fill: C.dim, x: leadX, y: H - 28 - p.height + 15, width: W - M - leadX, leading: 22 });
  const body =
    `<rect width="${W}" height="${H}" fill="${C.ink}"/>` +
    text(title, { font: SANS_MEDIUM, size, tracking: -0.048, x: M - 2, y: H - 28, fill: C.text }).svg +
    lead2.svg;
  return { svg: doc(W, H, body, { label: `${title} ${lead}` }), width: W, height: H };
}

// ---------------------------------------------------------------- the stack

// Each group's tools, with the simple-icons glyph to draw where there is one.
const STACK = [
  ['XR & 3D', [['Unity 6', 'siUnity'], ['C#'], ['Meta Quest 3', 'siMeta'], ['OpenXR'], ['MRUK'], ['Blender', 'siBlender'], ['OpenCV', 'siOpencv']]],
  ['AI & agents', [['Python', 'siPython'], ['LangGraph', 'siLanggraph'], ['MCP', 'siModelcontextprotocol'], ['Ollama', 'siOllama'], ['FastAPI', 'siFastapi'], ['pgvector', 'siPostgresql'], ['Whisper']]],
  ['Web & games', [['TypeScript', 'siTypescript'], ['React', 'siReact'], ['Next.js', 'siNextdotjs'], ['Phaser 3'], ['Socket.IO', 'siSocketdotio'], ['Web Audio']]],
  ['Systems & data', [['C', 'siC'], ['AArch64', 'siArm'], ['Raspberry Pi', 'siRaspberrypi'], ['Postgres', 'siPostgresql'], ['Docker', 'siDocker'], ['GitHub Actions', 'siGithubactions']]],
];

export function stack() {
  const labelW = 132;
  const chipH = 28;
  const gap = 8;
  let y = 72;
  let body = '';
  for (const [group, tools] of STACK) {
    body += `<rect x="${M}" y="${y - 16}" width="${W - M * 2}" height="1" fill="${C.line}"/>`;
    body += mono(group, { x: M, y: y + 18, fill: C.faint }).svg;
    let x = M + labelW;
    for (const [name, icon] of tools) {
      const tw = measure(name.toUpperCase(), { font: MONO, size: 11, tracking: 0.06 });
      const w = Math.round(tw + 16 + 19);
      if (x + w > W - M) {
        x = M + labelW;
        y += chipH + gap;
      }
      const glyph = icon && icons[icon];
      body +=
        `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${chipH - 1}" fill="none" stroke="${C.line}"/>` +
        (glyph
          ? `<path transform="translate(${x + 8} ${y + 8}) scale(${12 / 24})" fill="${C.accent}" d="${glyph.path}"/>`
          : `<rect x="${x + 11}" y="${y + 11}" width="6" height="6" fill="${C.accent}"/>`) +
        mono(name, { x: x + 27, y: y + 18, fill: C.dim }).svg;
      x += w + gap;
    }
    y += chipH + 32;
  }
  const H = y - 8;
  const title = text('Tools.', { font: SANS_MEDIUM, size: 30, tracking: -0.04, x: M - 1, y: 38, fill: C.text }).svg;
  const note = mono('What the work above is built with', { x: W - M, y: 36, fill: C.faint, anchor: 'end' }).svg;
  return { svg: doc(W, H, `<rect width="${W}" height="${H}" fill="${C.ink}"/>` + title + note + body, { label: STACK.map(([g, t]) => `${g}: ${t.map(([n]) => n).join(', ')}`).join('. ') }), width: W, height: H };
}

// ------------------------------------------------------------- the chart

/** The MR POCUS study, as the case study draws it: paired bars per domain. */
export function chart(c) {
  const labelW = 210;
  const barW = W - M * 2 - labelW - 40;
  const rowH = 46;
  let y = 64;
  let body = patterns([['dim50', C.dim, true]]);
  body += text('Learners who agreed, per training domain', { font: SANS_MEDIUM, size: 20, tracking: -0.02, x: M, y: 38, fill: C.text }).svg;
  // the legend
  const lx = W - M;
  const b = mono(c.series[1], { x: lx, y: 36, fill: C.dim, anchor: 'end' });
  const bx = lx - b.width - 20;
  const a = mono(c.series[0], { x: bx - 22, y: 36, fill: C.dim, anchor: 'end' });
  body +=
    `<rect x="${bx}" y="26" width="12" height="12" fill="url(#dim50)"/>` + b.svg +
    `<rect x="${bx - 22 - a.width - 20}" y="26" width="12" height="12" fill="${C.accent}"/>` + a.svg;
  c.rows.forEach(([label, va, vb], i) => {
    const hot = va - vb >= 5;
    body += `<rect x="${M}" y="${y}" width="${W - M * 2}" height="1" fill="${C.line}"/>`;
    body += mono(label, { x: M, y: y + rowH / 2 + 4, fill: hot ? C.accent : C.dim, upper: false, tracking: 0 }).svg;
    const x = M + labelW;
    const wa = (va / c.max) * barW;
    const wb = (vb / c.max) * barW;
    body +=
      `<rect x="${x}" y="${y + 9}" width="${wa}" height="12" fill="${C.accent}"/>` +
      text(String(va), { font: MONO, size: 12, x: x + wa + 8, y: y + 19.5, fill: C.text }).svg +
      `<rect x="${x}" y="${y + 25}" width="${wb}" height="12" fill="url(#dim50)"/>` +
      text(String(vb), { font: MONO, size: 12, x: x + wb + 8, y: y + 35.5, fill: C.text }).svg;
    y += rowH;
  });
  body += `<rect x="${M}" y="${y}" width="${W - M * 2}" height="1" fill="${C.line}"/>`;
  const cap = paragraph(c.caption, { font: MONO, size: 11, fill: C.faint, x: M, y: y + 26, width: W - M * 2, leading: 17.6 });
  const H = y + 26 + cap.height + 6;
  return {
    svg: doc(W, H, `<rect width="${W}" height="${H}" fill="${C.ink}"/>` + body + cap.svg, {
      label: `${c.caption} ${c.rows.map(([l, va, vb]) => `${l}: ${va} vs ${vb}`).join('; ')}`,
    }),
    width: W,
    height: H,
  };
}

// ------------------------------------------------------------- the band

/** The closing lime band: the call to action, with the email under it. */
export function band() {
  const { title, lede } = site.cta;
  const top = 24 + 40;
  const size = 50;
  const t = text(title, { font: SANS_MEDIUM, size, tracking: -0.048, x: M - 1, y: top + size * 0.73, fill: C.ink });
  const p = paragraph(lede, { font: SANS, size: 17, tracking: -0.02, fill: C.ink, x: M, y: top + size + 34, width: 560, leading: 22 });
  const by = top + size + 34 + p.height + 14;
  const email = control('Email me', M, by, { solid: true, fg: C.accent, bg: C.ink, h: 32 });
  const addr = text(site.links.email, { font: MONO, size: 11, x: M + email.width + 16, y: by + 20, fill: C.ink });
  const H = by + 32 + 40 + 24;
  const body =
    `<rect width="${W}" height="${H}" fill="${C.accent}"/>` + seam(0, true) + t.svg + p.svg + email.svg +
    `<g opacity=".78">${addr.svg}</g>` +
    `<rect class="blink" x="${M + email.width + 16 + addr.width + 6}" y="${by + 11}" width="7" height="11" fill="${C.ink}"/>` +
    seam(H - 24);
  return {
    svg: doc(W, H, body, { style: '.blink{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}', label: `${title} ${lede} ${site.links.email}` }),
    width: W,
    height: H,
  };
}
