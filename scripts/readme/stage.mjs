// The site's illustration scenes, run in Node: a stand-in for the few
// CanvasRenderingContext2D calls they make, drawing into one gray channel,
// and the same ordered dither as src/lib/dither.js, so each frame comes out
// exactly as the site would paint it (0 = ink, 1 = lime).

import { BAYER8 } from '../../src/lib/dither.js';
import { kit } from '../../src/viz/kit.js';

class GrayContext {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h);
    this.v = 0;
    this.tx = 0;
    this.ty = 0;
    this.stack = [];
    this.poly = [];
  }

  set fillStyle(css) {
    const m = /rgb\((\d+)/.exec(css);
    if (!m) throw new Error(`unsupported fillStyle ${css}`);
    this.v = +m[1];
  }

  fillRect(x, y, w, h) {
    // like a canvas, a negative size extends left or up from the corner
    let x0 = Math.round(x + this.tx);
    let y0 = Math.round(y + this.ty);
    let x1 = x0 + Math.round(w);
    let y1 = y0 + Math.round(h);
    if (x1 < x0) [x0, x1] = [x1, x0];
    if (y1 < y0) [y0, y1] = [y1, y0];
    x0 = Math.max(0, x0);
    y0 = Math.max(0, y0);
    x1 = Math.min(this.w, x1);
    y1 = Math.min(this.h, y1);
    for (let yy = y0; yy < y1; yy++) this.px.fill(this.v, yy * this.w + x0, yy * this.w + x1);
  }

  save() {
    this.stack.push([this.tx, this.ty]);
  }

  restore() {
    [this.tx, this.ty] = this.stack.pop() ?? [0, 0];
  }

  translate(x, y) {
    this.tx += x;
    this.ty += y;
  }

  beginPath() {
    this.poly = [];
  }

  moveTo(x, y) {
    this.poly.push([x + this.tx, y + this.ty]);
  }

  lineTo(x, y) {
    this.poly.push([x + this.tx, y + this.ty]);
  }

  closePath() {}

  // a filled polygon, sampled at pixel centers (even-odd)
  fill() {
    const p = this.poly;
    if (p.length < 3) return;
    const ys = p.map(([, y]) => y);
    const top = Math.max(0, Math.floor(Math.min(...ys)));
    const bottom = Math.min(this.h - 1, Math.ceil(Math.max(...ys)));
    for (let y = top; y <= bottom; y++) {
      const cy = y + 0.5;
      const xs = [];
      for (let i = 0; i < p.length; i++) {
        const [x0, y0] = p[i];
        const [x1, y1] = p[(i + 1) % p.length];
        if ((y0 <= cy && y1 > cy) || (y1 <= cy && y0 > cy)) xs.push(x0 + ((cy - y0) / (y1 - y0)) * (x1 - x0));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const a = Math.max(0, Math.ceil(xs[i] - 0.5));
        const b = Math.min(this.w, Math.ceil(xs[i + 1] - 0.5));
        if (b > a) this.px.fill(this.v, y * this.w + a, y * this.w + b);
      }
    }
  }

  createImageData(w, h) {
    return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
  }

  putImageData(img, dx, dy) {
    const { width, height, data } = img;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const X = x + dx;
        const Y = y + dy;
        if (X >= 0 && Y >= 0 && X < this.w && Y < this.h) this.px[Y * this.w + X] = data[(y * width + x) * 4];
      }
    }
  }
}

/** A scene played at a fixed size: frame(t) returns its dithered pixels. */
export function player(scene, w, h) {
  const stage = { w, h, ctx: new GrayContext(w, h) };
  stage.noise = () => {
    throw new Error('noise() is not supported outside the browser');
  };
  const io = { x: 0, y: 0, inside: false, taps: [], dt: 0, state: scene.init?.() ?? {} };
  let last = null;
  frame.state = io.state; // for finding where a simulated scene loops
  return frame;
  function frame(t) {
    io.dt = last === null ? 0 : t - last;
    last = t;
    scene.draw(kit(stage), t, io);
    io.taps.length = 0;
    const src = stage.ctx.px;
    const out = new Uint8Array(w * h);
    for (let y = 0, i = 0; y < h; y++) {
      const row = (y & 7) << 3;
      for (let x = 0; x < w; x++, i++) {
        const v = src[i] / 255;
        out[i] = v >= 1 || v > BAYER8[row | (x & 7)] ? 1 : 0;
      }
    }
    return out;
  }
}
