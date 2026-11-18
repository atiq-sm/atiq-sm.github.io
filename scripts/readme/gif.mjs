// A small GIF89a encoder for palette images. After the first frame, each frame
// stores only the rectangle that changed, with unchanged pixels inside it
// transparent, so an illustration that moves in one corner of a card costs
// only that corner.

class Bytes {
  constructor() {
    this.buf = new Uint8Array(1 << 16);
    this.n = 0;
  }
  byte(b) {
    if (this.n === this.buf.length) {
      const next = new Uint8Array(this.buf.length * 2);
      next.set(this.buf);
      this.buf = next;
    }
    this.buf[this.n++] = b;
  }
  word(w) {
    this.byte(w & 0xff);
    this.byte((w >> 8) & 0xff);
  }
  str(s) {
    for (const ch of s) this.byte(ch.charCodeAt(0));
  }
  bytes(list) {
    for (const b of list) this.byte(b);
  }
  done() {
    return this.buf.subarray(0, this.n);
  }
}

// LZW, as GIF wants it: variable-width codes, packed LSB first, in sub-blocks.
function lzw(out, pixels, minCodeSize) {
  out.byte(minCodeSize);
  const clear = 1 << minCodeSize;
  const eoi = clear + 1;
  let next = eoi + 1;
  let size = minCodeSize + 1;
  let table = new Map();

  const block = [];
  let cur = 0;
  let shift = 0;
  const emit = (code) => {
    cur |= code << shift;
    shift += size;
    while (shift >= 8) {
      block.push(cur & 0xff);
      cur >>>= 8;
      shift -= 8;
      if (block.length === 255) {
        out.byte(255);
        out.bytes(block);
        block.length = 0;
      }
    }
  };

  emit(clear);
  let prefix = pixels[0];
  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    const key = (prefix << 8) | k;
    const code = table.get(key);
    if (code !== undefined) {
      prefix = code;
      continue;
    }
    emit(prefix);
    if (next === 4096) {
      emit(clear);
      next = eoi + 1;
      size = minCodeSize + 1;
      table = new Map();
    } else {
      if (next >= 1 << size) size++;
      table.set(key, next++);
    }
    prefix = k;
  }
  emit(prefix);
  emit(eoi);
  if (shift > 0) block.push(cur & 0xff);
  for (let i = 0; i < block.length; i += 255) {
    const part = block.slice(i, i + 255);
    out.byte(part.length);
    out.bytes(part);
  }
  out.byte(0);
}

/**
 * @param width, height  the canvas size
 * @param palette  up to 255 [r, g, b] colors (one more slot is kept for transparency)
 * @param frames   [{ pixels: Uint8Array of palette indices, ms }]
 * @returns Uint8Array, the GIF file
 */
export function encodeGif({ width, height, palette, frames }) {
  if (palette.length > 255) throw new Error('palette too large');
  const clear = palette.length; // the transparent index
  let bits = 1;
  while (1 << bits < palette.length + 1) bits++;
  const table = 1 << bits;

  const out = new Bytes();
  out.str('GIF89a');
  out.word(width);
  out.word(height);
  out.byte(0x80 | ((bits - 1) << 4) | (bits - 1));
  out.byte(0);
  out.byte(0);
  for (let i = 0; i < table; i++) out.bytes(palette[i] ?? [0, 0, 0]);
  // loop forever
  out.byte(0x21);
  out.byte(0xff);
  out.byte(11);
  out.str('NETSCAPE2.0');
  out.bytes([3, 1, 0, 0, 0]);

  // fold frames that change nothing into the one before, and keep timing in
  // centiseconds without drift
  const kept = [];
  let prev = null;
  let clock = 0;
  for (const f of frames) {
    let rect = null;
    if (prev) {
      let [x0, y0, x1, y1] = [width, height, -1, -1];
      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          if (f.pixels[i] !== prev[i]) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            y1 = y;
          }
        }
      }
      if (x1 < 0) {
        kept[kept.length - 1].end += f.ms;
        clock += f.ms;
        continue;
      }
      rect = [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
    }
    kept.push({ pixels: f.pixels, prev, rect, start: clock, end: clock + f.ms });
    clock += f.ms;
    prev = f.pixels;
  }

  for (const f of kept) {
    const delay = Math.max(2, Math.round(f.end / 10) - Math.round(f.start / 10));
    const [x, y, w, h] = f.rect ?? [0, 0, width, height];
    out.bytes([0x21, 0xf9, 4, (1 << 2) | (f.rect ? 1 : 0)]);
    out.word(delay);
    out.byte(f.rect ? clear : 0);
    out.byte(0);
    out.byte(0x2c);
    out.word(x);
    out.word(y);
    out.word(w);
    out.word(h);
    out.byte(0);
    const sub = new Uint8Array(w * h);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = (y + yy) * width + x + xx;
        sub[yy * w + xx] = f.rect && f.pixels[i] === f.prev[i] ? clear : f.pixels[i];
      }
    }
    lzw(out, sub, Math.max(2, bits));
  }
  out.byte(0x3b);
  return out.done();
}
