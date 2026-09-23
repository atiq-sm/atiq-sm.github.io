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
  };
}
