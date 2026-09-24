import { GLYPHS, RAMP } from './font.js';

// Drawing kit bound to one frame of a Stage: its size, a line unit `u`, a
// station size `s`, and primitives snapped to whole pixels so edges never
// shimmer against the dither. Everything is drawn in grays: SOLID is full
// lime, SOFT a dithered half-tone, 0 is ink.

export const SOLID = 255;
export const SOFT = 96;

export const clamp = (p) => Math.max(0, Math.min(1, p));
export const out = (p) => 1 - (1 - clamp(p)) ** 3; // ease-out
export const mix = (a, b, p) => a + (b - a) * p;
export const between = (t, a, b) => clamp((t - a) / (b - a));
// A stable pseudo-random number in [0, 1) for each integer: scenes never call Math.random.
export const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const gray = (v) => `rgb(${v},${v},${v})`;

export function kit(stage) {
  const { ctx: c, w, h } = stage;
  const u = Math.max(2, Math.round(w / 210));
  const s = Math.round(w * 0.05);
  const r = Math.round;
  const fill = (x, y, ww, hh, v = SOLID) => {
    c.fillStyle = gray(v);
    c.fillRect(r(x), r(y), r(ww), r(hh));
  };
  const frame = (x, y, ww, hh, v = SOLID) => {
    fill(x, y, ww, u, v);
    fill(x, y + hh - u, ww, u, v);
    fill(x, y, u, hh, v);
    fill(x + ww - u, y, u, hh, v);
  };
  return {
    c,
    w,
    h,
    u,
    s,
    stage,
    gray,
    fill,
    frame,
    clear: () => fill(0, 0, w, h, 0),
    // horizontal or vertical only, like a circuit
    line: (x0, y0, x1, y1, v = SOFT) =>
      x0 === x1
        ? fill(x0 - u / 2, Math.min(y0, y1), u, Math.abs(y1 - y0), v)
        : fill(Math.min(x0, x1), y0 - u / 2, Math.abs(x1 - x0), u, v),
    item: (x, y, hollow = false, size = s, v = SOLID) =>
      hollow ? frame(x - size / 2, y - size / 2, size, size, v) : fill(x - size / 2, y - size / 2, size, size, v),
    station: (x, y, ww, hh, on) => (on ? fill(x - ww / 2, y - hh / 2, ww, hh) : frame(x - ww / 2, y - hh / 2, ww, hh)),
    // The dot-matrix font's size for this frame: one dot per pixel on a card,
    // two on a wide stage, so a glyph is always about the same share of it.
    dot: Math.max(1, Math.round(w / 440)),
    // A line of text in the dot-matrix font, from (x, y) at its top; `align`
    // 'center' or 'right' anchors it there instead. Returns its width.
    text(str, x, y, g = this.dot, align = 'left', v = SOLID) {
      const width = str.length * 6 * g - g;
      const x0 = r(align === 'center' ? x - width / 2 : align === 'right' ? x - width : x);
      [...str.toUpperCase()].forEach((ch, i) => {
        for (const [dx, dy] of GLYPHS[ch] ?? []) fill(x0 + (i * 6 + dx) * g, y + dy * g, g, g, v);
      });
      return width;
    },
    // Fill the frame with a grid of glyphs. `shade(x, y, col, row)` is called at
    // each cell's center and returns a brightness in [0, 1] (drawn as a symbol
    // from the shading ramp), a character to draw as is, or 0 for nothing.
    // It writes pixels directly, so draw anything else on top afterwards.
    ascii(shade, g = this.dot) {
      const cw = 6 * g;
      const ch = 8 * g;
      const cols = Math.floor(w / cw);
      const rows = Math.floor(h / ch);
      const ox = Math.floor((w - cols * cw) / 2);
      const oy = Math.floor((h - rows * ch) / 2);
      if (stage.asciiImage?.width !== w || stage.asciiImage.height !== h) stage.asciiImage = c.createImageData(w, h);
      const px = new Uint32Array(stage.asciiImage.data.buffer);
      px.fill(0xff000000);
      const top = RAMP.length - 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x0 = ox + col * cw;
          const y0 = oy + row * ch;
          const v = shade(x0 + cw / 2, y0 + ch / 2, col, row);
          if (!v) continue;
          const dots = GLYPHS[typeof v === 'string' ? v : RAMP[Math.min(top, Math.round(v * top))]];
          if (!dots) continue;
          for (const [dx, dy] of dots) {
            for (let b = 0; b < g; b++) {
              const i = (y0 + dy * g + b) * w + x0 + dx * g;
              px.fill(0xffffffff, i, i + g);
            }
          }
        }
      }
      c.putImageData(stage.asciiImage, 0, 0);
      return { cols, rows, cw, ch, ox, oy };
    },
  };
}
