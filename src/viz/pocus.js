import { between, clamp, rnd } from './kit.js';
import { RAMP } from './font.js';

// MR POCUS, in ASCII: a shaded heart beats three times, dissolves glyph by
// glyph into a pair of lungs that breathe twice, and dissolves back; a trace
// along the bottom turns from an ECG into a breathing curve with them. The
// pointer tilts the organ and brightens it under a probe spot, and a tap
// switches to the other organ.

const BEAT = 0.95; // seconds per heartbeat
const BREATH = 2.6; // seconds per breath
const HEART = 3 * BEAT;
const LUNG = 2 * BREATH;
const MORPH = 0.9;
const TO_LUNG = HEART; // when each dissolve begins
const TO_HEART = HEART + MORPH + LUNG;
const LOOP = TO_HEART + MORPH;
const WINDOW = 3; // seconds of trace across the frame

// how far toward the lungs the loop is at time te
function lungness(te) {
  const q = ((te % LOOP) + LOOP) % LOOP;
  if (q < TO_LUNG) return 0;
  if (q < TO_LUNG + MORPH) return between(q, TO_LUNG, TO_LUNG + MORPH);
  if (q < TO_HEART) return 1;
  return 1 - between(q, TO_HEART, LOOP);
}

// a smooth bump centered at c in a looping phase
const bump = (p, c, width) => {
  const d = ((p - c + 1.5) % 1) - 0.5;
  return Math.exp(-((d / width) ** 2));
};
const pulse = (p) => bump(p, 0.1, 0.07) + 0.55 * bump(p, 0.32, 0.06); // lub, dub
const breath = (p) => (p < 0.4 ? Math.sin((p / 0.4) * (Math.PI / 2)) ** 2 : Math.cos(((p - 0.4) / 0.6) * (Math.PI / 2)) ** 2);
const ecg = (p) =>
  0.14 * bump(p, 0.9, 0.03) - 0.12 * bump(p, 0.0, 0.01) + bump(p, 0.02, 0.012) - 0.28 * bump(p, 0.045, 0.01) + 0.24 * bump(p, 0.25, 0.05);

// The organs as height fields over (x, y), y up, about a unit in size: 0
// outside, rising to about 1 at their fullest.
function heart(x, y, beat) {
  const s = 1 + 0.07 * pulse(beat);
  x /= s;
  y = y / s + 0.12;
  const f = (x * x + y * y - 1) ** 3 - x * x * y ** 3;
  return f < 0 ? (-f) ** (1 / 6) : 0; // near the middle, a hemisphere
}

function lungs(x, y, b) {
  x /= 1.12 * (1 + 0.06 * b);
  y /= 1.12;
  y = (y + 0.1 * b) / (1 + 0.1 * b); // the diaphragm drops on the way in
  const side = x < 0 ? -1 : 1;
  const o = (x - side * 0.52) * side; // outward from each lung's middle
  const rx = 0.42 * (0.55 + 0.45 * clamp((1 - y) / 1.2)); // narrow at the apex
  const e = ((o + 0.02) / rx) ** 2 + ((y + 0.05) / 1.02) ** 2;
  const floor = -0.8 + 0.25 * clamp((0.1 - o) / 0.5); // domed higher toward the middle
  if (e >= 1 || y <= floor) return 0;
  if (side > 0 && (o + 0.3) ** 2 + (y + 0.45) ** 2 < 0.05) return 0; // the heart's notch
  return Math.sqrt(1 - e) * clamp((y - floor) / 0.15);
}

// The airways over the lungs: trachea, bronchi and a few branches, drawn as
// line characters.
const AIRWAYS = [
  [0, 1.28, 0, 0.45],
  [0, 0.45, -0.42, 0.05],
  [0, 0.45, 0.42, 0.05],
  [-0.42, 0.05, -0.56, -0.42],
  [0.42, 0.05, 0.56, -0.42],
  [-0.42, 0.05, -0.7, 0.32],
  [0.42, 0.05, 0.7, 0.32],
].map(([x0, y0, x1, y1]) => {
  const vertical = Math.abs(x1 - x0) < Math.abs(y1 - y0) * 0.4;
  return { x0, y0, x1, y1, ch: vertical ? '|' : (x1 - x0) * (y1 - y0) > 0 ? '/' : '\\' };
});

function airway(x, y, b, reach) {
  x /= 1.12 * (1 + 0.06 * b);
  y /= 1.12;
  y = (y + 0.1 * b) / (1 + 0.1 * b);
  for (const a of AIRWAYS) {
    const dx = a.x1 - a.x0;
    const dy = a.y1 - a.y0;
    const p = clamp(((x - a.x0) * dx + (y - a.y0) * dy) / (dx * dx + dy * dy));
    if (Math.hypot(x - a.x0 - p * dx, y - a.y0 - p * dy) < reach) return a.ch;
  }
  return null;
}

export default {
  label:
    'Illustration: an ASCII heart beats three times, then dissolves into a pair of breathing lungs and back, over a trace that turns from an ECG into a breathing curve. These are the organs MR POCUS trains learners to scan.',
  labels: [],
  hint: 'tap to switch',
  still: 0.1,
  init: () => ({ shift: 0, yaw: 0, trace: null, acc: 0, last: null }),
  draw(k, t, io) {
    const { w, h, u } = k;
    const st = io.state;
    const g = k.dot;

    // a tap skips ahead to the next dissolve, toward the other organ
    const now = () => t + st.shift;
    if (io.taps.length) {
      const q = ((now() % LOOP) + LOOP) % LOOP;
      if (q < TO_LUNG) st.shift += TO_LUNG - q;
      else if (q >= TO_LUNG + MORPH && q < TO_HEART) st.shift += TO_HEART - q;
    }
    const te = now();
    const m = lungness(te);
    const beat = (te % BEAT) / BEAT;
    const b = breath((te % BREATH) / BREATH);

    // tilt toward the pointer, or sway a little on its own
    const aim = io.inside ? (io.x / w - 0.5) * 1.3 : Math.sin(t * 0.6) * 0.25;
    st.yaw += (aim - st.yaw) * Math.min(1, io.dt * 5);
    const yaw = st.yaw;
    const squash = Math.max(0.72, Math.cos(yaw));
    const roll = -yaw * 0.25;
    const [cr, sr] = [Math.cos(roll), Math.sin(roll)];
    let [lx, ly, lz] = [-0.45 + yaw * 0.9, 0.6, 0.7];
    const ll = Math.hypot(lx, ly, lz);
    [lx, ly, lz] = [lx / ll, ly / ll, lz / ll];

    const cx = w / 2;
    const cy = h * 0.48;
    const R = Math.min(w * 0.19, h * 0.3);
    const probe = Math.min(w, h) * 0.22;

    // brightness of one organ at a point: a little for being inside, the rest
    // from how its surface faces the light
    const shade = (field, x, y) => {
      const v = field(x, y);
      if (v <= 0) return 0;
      const e = 0.04;
      const nx = -(field(x + e, y) - field(x - e, y)) / (2 * e);
      const ny = -(field(x, y + e) - field(x, y - e)) / (2 * e);
      const n = Math.hypot(nx * 0.6, ny * 0.6, 1);
      const lit = clamp((nx * 0.6 * lx + ny * 0.6 * ly + lz) / n);
      return 0.12 + 0.88 * clamp(0.3 * v + 0.8 * lit ** 2);
    };
    const heartAt = (x, y) => heart(x, y, beat);
    const lungsAt = (x, y) => lungs(x, y, b);

    const grid = k.ascii((px, py, col, row) => {
      if (py < h * 0.1 || py > h * 0.8) return 0; // the readouts and the trace
      // into the organ's own frame: centered, tilted, turned
      const dx = (px - cx) / R;
      const dy = -(py - cy) / R;
      const x = (dx * cr - dy * sr) / squash;
      const y = dx * sr + dy * cr;
      const r = rnd(col * 12.9898 + row * 78.233);
      const lung = r < m;
      const near = io.inside ? clamp(1 - Math.hypot(px - io.x, py - io.y) / probe) : 0;

      // along the dissolve's edge, a cell of either organ flickers through random glyphs
      if (m > 0 && m < 1 && Math.abs(r - m) < 0.08 && (heart(x, y, beat) > 0 || lungs(x, y, b) > 0)) {
        return RAMP[1 + Math.floor(rnd(col + row * 97 + Math.floor(te * 24)) * (RAMP.length - 1))];
      }
      if (lung) {
        const ch = airway(x, y, b, (3.3 * g) / R); // about half a cell either side
        if (ch) return ch;
      }
      const v = lung ? shade(lungsAt, x, y) : shade(heartAt, x, y);
      if (v) return Math.min(1, v + near * 0.35);
      // the background: sparse speckle, denser under the probe
      const speck = rnd(col * 73 + row * 151 + Math.floor(te * 2));
      return speck > 0.985 - near * 0.12 ? '.' : 0;
    }, g);

    // readouts: the organ, and its rate
    const pad = 4 * g;
    const heartSide = m < 0.5;
    k.text(heartSide ? 'heart' : 'lungs', pad + g, pad);
    const n = Math.floor(te / (heartSide ? BEAT : BREATH));
    const rate = heartSide ? `hr ${62 + Math.floor(rnd(n) * 7)}` : `rr ${14 + Math.floor(rnd(n + 3) * 3)}`;
    k.text(rate, w - pad - g, pad, g, 'right');

    // the trace: a strip of samples that scrolls left, recorded as it plays so
    // a tap never makes it jump; on the first frame, drawn from its history
    const step = Math.max(u, grid.cw / 2);
    const cols = Math.ceil(w / step);
    const signal = (tt) => {
      const mm = lungness(tt);
      return (1 - mm) * ecg((tt % BEAT) / BEAT) + mm * (breath((tt % BREATH) / BREATH) * 0.8);
    };
    if (!st.trace) {
      st.trace = Array.from({ length: cols }, (_, i) => signal(te - ((cols - 1 - i) * WINDOW) / cols));
    } else {
      st.acc += (io.dt * cols) / WINDOW;
      while (st.acc >= 1) {
        st.acc -= 1;
        st.trace.push(signal(te));
      }
      if (st.trace.length > cols) st.trace.splice(0, st.trace.length - cols);
    }
    const base = h * 0.93;
    const amp = h * 0.1;
    let prev = null;
    st.trace.forEach((v, i) => {
      const x = w - (st.trace.length - i) * step;
      const y = Math.round(base - v * amp);
      if (prev !== null) k.fill(x, Math.min(prev, y), u, Math.abs(y - prev) + u);
      else k.fill(x, y, u, u);
      prev = y;
    });
    if (prev !== null) k.fill(w - step - u, prev - u, u * 3, u * 3);

    // the probe spot: a ring of dots around the pointer
    if (io.inside) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + t;
        k.fill(io.x + Math.cos(a) * probe * 0.5 - u / 2, io.y + Math.sin(a) * probe * 0.5 - u / 2, u, u);
      }
    }
  },
};
