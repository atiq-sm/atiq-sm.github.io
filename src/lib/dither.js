/*! Ordered dithering adapted from the Laya playground by brain function
    collapse (https://github.com/mahi424/laya-playground). MIT License,
    Copyright (c) 2026 brain function collapse. See THIRD_PARTY_NOTICES.md. */

// A scene is drawn in grayscale at one scene pixel per CSS pixel, then presented
// as an ordered (Bayer 8x8) dither between two tones: black becomes the first
// tone, white the second, and every gray a pattern of both.

const BAYER8 = [
   0, 32,  8, 40,  2, 34, 10, 42,   48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,   60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,   51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,   63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

// ImageData is little-endian RGBA, so a Uint32 view wants 0xAABBGGRR.
function abgr(hex) {
  const n = parseInt(hex.slice(1), 16);
  return ((0xff << 24) | ((n & 0xff) << 16) | (((n >> 8) & 0xff) << 8) | (n >> 16)) >>> 0;
}

export class Stage {
  /**
   * @param canvas the visible canvas; CSS sizes it, layout() sizes its pixels
   * @param tones  dark -> light colors, e.g. [ink, lime]
   * Draw into `stage.ctx` at `stage.w` x `stage.h` in grayscale, then present().
   */
  constructor(canvas, tones) {
    this.canvas = canvas;
    this.out = canvas.getContext('2d');
    this.scene = document.createElement('canvas');
    this.ctx = this.scene.getContext('2d', { willReadFrequently: true });
    this.pal = tones.map(abgr);
    this.w = 0;
    this.h = 0;
  }

  // Size the scene from the box's device pixels so every dither dot is the same
  // whole number of device pixels (uneven scaling would shimmer as moire).
  layout(deviceWidth, deviceHeight) {
    const k = Math.max(1, Math.round(window.devicePixelRatio || 1));
    this.w = Math.max(60, Math.round(deviceWidth / k));
    this.h = Math.max(40, Math.round(deviceHeight / k));
    this.scene.width = this.canvas.width = this.w;
    this.scene.height = this.canvas.height = this.h;
    this.img = this.out.createImageData(this.w, this.h);
    this.px = new Uint32Array(this.img.data.buffer);
    this.speckle = null;
  }

  // A fixed field of random grays at scene size, for textures like ultrasound
  // speckle; rebuilt only when the size changes.
  noise(seed = 1) {
    if (this.speckle) return this.speckle;
    const c = document.createElement('canvas');
    c.width = this.w;
    c.height = this.h;
    const g = c.getContext('2d');
    const img = g.createImageData(this.w, this.h);
    let x = seed * 2654435761;
    for (let i = 0; i < img.data.length; i += 4) {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      const v = ((x >>> 0) % 256) ** 1.5 / 16; // mostly dark gray, with bright specks
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    this.speckle = c;
    return c;
  }

  present() {
    const { w, h, px, pal } = this;
    if (!w || !px) return;
    const src = this.ctx.getImageData(0, 0, w, h).data;
    const top = pal.length - 1;
    for (let y = 0, i = 0; y < h; y++) {
      const row = (y & 7) << 3;
      for (let x = 0; x < w; x++, i++) {
        const t = (src[i << 2] / 255) * top;
        const base = t | 0;
        px[i] = pal[base + (t - base > BAYER8[row | (x & 7)] ? 1 : 0)];
      }
    }
    this.out.putImageData(this.img, 0, 0);
  }
}
