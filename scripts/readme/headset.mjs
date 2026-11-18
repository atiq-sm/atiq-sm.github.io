// A Quest-style headset in ASCII, looking left and right over a turntable: a
// scene in the same form as src/viz/*, drawn with the site's kit and
// dot-matrix font. The
// headset is a signed distance field (a curved visor with three sensor pills
// on its face, and a strap around the back), ray-marched
// once per glyph cell and shaded by how its surface faces the light.

import { clamp } from '../../src/viz/kit.js';

export const LOOK = 8; // seconds to look left, right and back
const SWING = 0.9; // how far it turns each way, in radians

const len2 = (x, y) => Math.hypot(x, y);
const len3 = (x, y, z) => Math.hypot(x, y, z);

// a box with rounded edges, half-size (a, b, c), corner radius r
function roundBox(x, y, z, a, b, c, r) {
  const qx = Math.abs(x) - a + r;
  const qy = Math.abs(y) - b + r;
  const qz = Math.abs(z) - c + r;
  return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

// the visor's face curves back toward its edges
const bend = (x) => 0.16 * x * x;

function visor(x, y, z) {
  return roundBox(x, y, z + bend(x), 1.0, 0.48, 0.38, 0.24) * 0.9;
}

// a band around an ellipse in a plane, as a flat strap
function strap(u, v, w, ru, rv, half, thick) {
  const e = len2(u / ru, v / rv);
  const d = (e - 1) * Math.min(ru, rv);
  return Math.max(Math.abs(d) - thick, Math.abs(w) - half);
}

function headset(x, y, z) {
  const back = -0.95;
  // around the back of the head, from one side of the visor to the other
  const ring = Math.max(strap(x, z - back, y, 1.0, 0.78, 0.11, 0.035), z - (back + 0.62));
  return Math.min(visor(x, y, z), ring);
}

// is (x, y) on the face inside one of the three sensor pills?
function pill(x, y) {
  for (const cx of [-0.64, 0, 0.64]) {
    const dy = Math.max(0, Math.abs(y + 0.02) - 0.14);
    if (len2(x - cx, dy) < 0.075) return true;
  }
  return false;
}

export default {
  label: 'A mixed-reality headset drawn in ASCII, looking left and right over a turntable.',
  labels: [],
  still: 1.2,
  draw(k, t) {
    const { w, h } = k;
    const yaw = SWING * Math.sin((t / LOOK) * Math.PI * 2);
    const pitch = 0.3;
    const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
    const pivot = -0.7; // the turn is about the head's middle, not the visor's
    const R = Math.min(w / 2.6, h / 2.4); // pixels per unit
    const cx = w / 2;
    const cy0 = h * 0.47;

    // camera space to object space: undo the pitch, then the yaw
    const toObj = (x, y, z) => {
      const y1 = y * cp + z * sp;
      const z1 = -y * sp + z * cp;
      return [x * cy - z1 * sy, y1, x * sy + z1 * cy + pivot];
    };
    // the light, from the upper left and in front, carried into object space
    const [lx, ly, lz] = (() => {
      const [a, b, c] = toObj(-0.42, 0.38, 0.82);
      const [o1, o2, o3] = toObj(0, 0, 0);
      const l = len3(a - o1, b - o2, c - o3);
      return [(a - o1) / l, (b - o2) / l, (c - o3) / l];
    })();
    const [dx, dy, dz] = (() => {
      const [a, b, c] = toObj(0, 0, -1);
      const [o1, o2, o3] = toObj(0, 0, 0);
      return [a - o1, b - o2, c - o3];
    })();

    k.ascii((px, py) => {
      const X = (px - cx) / R;
      const Y = -(py - cy0) / R;
      let [ox, oy, oz] = toObj(X, Y, 3);
      let d = 0;
      let hit = false;
      for (let i = 0; i < 72 && d < 7; i++) {
        const s = headset(ox + dx * d, oy + dy * d, oz + dz * d);
        if (s < 0.003) {
          hit = true;
          break;
        }
        d += s * 0.9;
      }
      if (!hit) {
        // the turntable: a ring of dots on the floor, nearer half brighter
        const fy = (Y + 0.8) / 0.22;
        const e = len2(X / 1.2, fy);
        return Math.abs(e - 1) < 0.12 ? '.' : 0;
      }
      const [x, y, z] = [ox + dx * d, oy + dy * d, oz + dz * d];
      const ep = 0.004;
      let nx = headset(x + ep, y, z) - headset(x - ep, y, z);
      let ny = headset(x, y + ep, z) - headset(x, y - ep, z);
      let nz = headset(x, y, z + ep) - headset(x, y, z - ep);
      const nl = len3(nx, ny, nz) || 1;
      [nx, ny, nz] = [nx / nl, ny / nl, nz / nl];
      const lit = clamp(nx * lx + ny * ly + nz * lz);
      const rim = clamp(1 - Math.abs(nx * dx + ny * dy + nz * dz)) ** 3; // a little light at the silhouette
      let v = 0.1 + 0.9 * clamp(0.08 + 0.92 * lit ** 1.6 + 0.2 * rim);
      // the face: the sensor pills are holes in it; the strap sits a shade
      // darker than the shell
      if (nz > 0.5 && z > 0.1 && pill(x, y)) return 0;
      if (visor(x, y, z) > 0.02) v *= 0.7;
      return Math.max(0.12, Math.min(1, v));
    });

    // readouts, as on the site's illustrations
    const pad = 4 * k.dot;
    k.text('quest 3', pad + k.dot, pad);
    const deg = Math.round((yaw * 180) / Math.PI);
    k.text(`yaw ${deg < 0 ? '-' : '+'}${String(Math.abs(deg)).padStart(2, '0')}`, w - pad - k.dot, pad, k.dot, 'right');
  },
};
