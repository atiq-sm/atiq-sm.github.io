// The terminal card: `neofetch` run on a headset. The ASCII headset turns on
// the left; on the right, the facts, the palette and a waiting prompt.

import { site } from '../../src/data/site.js';
import { player } from './stage.mjs';
import { animate } from './compose.mjs';
import headset, { LOOK } from './headset.mjs';
import { C } from './raster.mjs';
import { MONO, text, withDefs } from './type.mjs';
import { W } from './art.mjs';

const school = site.experience.find((e) => e.kind === 'education');
const now = site.experience.find((e) => e.kind === 'work');

// key, value; a value can be [[text, color], ...] for more than one color
const ROWS = [
  ['name', site.name],
  ['role', 'XR engineer who builds with AI agents'],
  ['now', `${now.role} @ ${now.company}`],
  ['before', 'Roux Institute × MaineHealth · Aosenuma · Capgemini'],
  ['study', `MS CS, ${school.company} · GPA 4.0 · 2026`],
  ['os', 'Meta Quest 3, passthrough mixed reality'],
  ['engine', 'Unity 6 · C# · OpenXR · Meta XR SDK · MRUK'],
  ['agents', 'MCP into Unity, Blender and Mixamo'],
  ['kernel', 'my own, ~9 KB, on a bare Raspberry Pi 4'],
  ['base', site.location],
  ['status', [['■ ', C.accent], ['open to XR engineering roles', C.accent]]],
];

const PROMPT = 'atiq@quest-3';

export function fetchCard() {
  const size = 12.5;
  const mono = (str, o) => text(str, { font: MONO, size, ...o });
  const lead = 20;
  const x0 = 318;
  const keyW = 74;

  let body = '';
  let y = 76;
  // the command
  const p = mono(PROMPT, { x: x0, y, fill: C.accent });
  const tilde = mono(' ~ % ', { x: x0 + p.width, y, fill: C.faint });
  body += p.svg + tilde.svg + mono('neofetch', { x: x0 + p.width + tilde.width, y, fill: C.text }).svg;
  y += 30;
  // the title and its rule
  const title = mono('atiq-sm@github', { x: x0, y, fill: C.text });
  body += title.svg + `<rect x="${x0 + title.width + 10}" y="${y - 4}" width="${W - 24 - x0 - title.width - 10}" height="1" fill="${C.rule}"/>`;
  y += 26;
  for (const [key, value] of ROWS) {
    body += mono(key, { x: x0, y, fill: C.accent }).svg;
    let x = x0 + keyW;
    for (const [str, fill] of typeof value === 'string' ? [[value, C.text]] : value) {
      const t = mono(str, { x, y, fill });
      body += t.svg;
      x += t.width;
    }
    if (x > W - 24) throw new Error(`fetch row "${key}" is too long`);
    y += lead;
  }
  // the palette: the site's tokens, darkest to lime
  y += 8;
  ['ink', 'surface', 'line', 'rule', 'faint', 'dim', 'text', 'accent'].forEach((tok, i) => {
    body += `<rect x="${x0 + i * 30}" y="${y - 12}" width="26" height="14" fill="${C[tok]}"${tok === 'ink' ? ` stroke="${C.rule}"` : ''}/>`;
  });
  y += 32;
  // and the prompt, waiting
  const p2 = mono(PROMPT, { x: x0, y, fill: C.accent });
  const t2 = mono(' ~ % ', { x: x0 + p2.width, y, fill: C.faint });
  const cursorX = x0 + p2.width + t2.width;
  body += p2.svg + t2.svg;
  const H = y + 30;

  // the window: a title bar, and the headset on the left
  const bar = 34;
  const frame =
    `<rect width="${W}" height="${H}" fill="${C.ink}"/>` +
    `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${C.line}"/>` +
    `<rect x="1" y="${bar}" width="${W - 2}" height="1" fill="${C.line}"/>` +
    [C.accent, C.rule, C.rule].map((c, i) => `<rect x="${16 + i * 14}" y="13" width="8" height="8" fill="${c}"/>`).join('') +
    text(`${PROMPT} — neofetch`, { font: MONO, size: 11, x: W / 2, y: 21.5, fill: C.faint, anchor: 'middle' }).svg;
  const scene = { x: 22, y: bar + 14, w: x0 - 22 - 26, h: H - bar - 14 - 14 };
  scene.frame = player(headset, scene.w, scene.h);

  const fps = 20;
  const svg = (b) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${withDefs(b)}</svg>`;
  const cursor = `<rect x="${cursorX}" y="${y - 11}" width="8" height="14" fill="${C.text}"/>`;
  const card = animate({
    width: W,
    height: H,
    svg,
    base: frame + body,
    scenes: [scene],
    layers: [{ svg: cursor, on: (t) => t % 1 < 0.55 }],
    fps,
    done: (t) => t >= LOOK,
  });
  const alt = `${PROMPT} ~ % neofetch. ${ROWS.map(([k, v]) => `${k}: ${typeof v === 'string' ? v : v.map(([s]) => s).join('')}`).join('; ')}`;
  return { ...card, alt };
}
