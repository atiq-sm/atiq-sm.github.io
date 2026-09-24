import { SOFT, SOLID, between, mix, out } from './kit.js';

// Cosmic Knockout, playable: percentage-based knockback on a small physics
// simulation. Each hit adds damage and launches the target along a longer
// arc, its past flights left as dotted trails, until one sends it off the
// stage and the round resets. Left alone, the attacker plays by itself; the
// pointer takes it over, and a tap dashes in and strikes, away from the side
// the tap was on.

const G = 2.4; // gravity, in frame heights per second squared
const STEP = 1 / 120; // fixed physics step, so a replay always lands the same
const GROUND = 0.66; // the platform's top, as a fraction of the height
const LEFT = 0.1; // its ends, as fractions of the width
const RIGHT = 0.78;
const REACH = 0.08;
const IDLE = 2.5; // seconds without input before the attacker plays itself
const DASH = 1.8; // dash speed, in frame widths per second
const within = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function fresh() {
  return {
    tx: 0.42, ty: GROUND, vx: 0, vy: 0, air: false, damage: 0,
    ax: 0.2, dash: null, cool: 0.9, swing: -1,
    trails: [], trail: null, ko: -1, respawn: -1,
    clock: 0, idle: IDLE, flash: -1,
  };
}

// launch the target away from `dir`, harder the more damage it has taken
function hit(st, dir) {
  st.damage += 11 + Math.round(st.damage * 0.12);
  const d = st.damage;
  st.vx = dir * (0.12 + 0.0065 * d);
  st.vy = -(0.55 + 0.012 * d);
  st.air = true;
  st.trail = [[st.tx, st.ty]];
  st.swing = st.clock;
  st.flash = st.clock;
}

function step(st) {
  st.clock += STEP;
  st.idle += STEP;
  st.cool -= STEP;
  const size = 0.045; // the fighters, as a fraction of the width

  // knocked out: a pause, then the target drops back in fresh
  if (st.ko >= 0) {
    if (st.clock - st.ko > 1.1) {
      Object.assign(st, { tx: 0.42, ty: -0.1, vx: 0, vy: 0, air: true, damage: 0, trails: [], trail: null, ko: -1 });
    }
    return;
  }

  // the attacker: dashing to its mark, or walking beside the target
  if (st.dash) {
    const to = st.tx - st.dash.dir * (size + 0.012);
    st.ax += within(to - st.ax, -DASH * STEP, DASH * STEP);
    if (Math.abs(st.ax - to) < 0.005) {
      if (!st.air || st.ty > GROUND - 0.25) hit(st, st.dash.dir);
      st.dash = null;
      st.cool = 0.5;
    }
  } else if (st.idle > IDLE) {
    // playing by itself: strike toward the middle of the stage, so the
    // target stays on it until one hit is hard enough to send it off
    const dir = st.tx < (LEFT + RIGHT) / 2 ? 1 : -1;
    const to = st.tx - dir * (size + 0.012);
    st.ax += within((to - st.ax) * 6, -0.35, 0.35) * STEP;
    if (!st.air && st.cool <= 0 && Math.abs(st.ax - to) < 0.015) {
      hit(st, dir);
      st.cool = 1.1;
    }
  }
  st.ax = within(st.ax, LEFT, RIGHT);

  // the target: flies, falls, lands on the platform or falls past it
  if (st.air) {
    st.vy += G * STEP;
    st.tx += st.vx * STEP;
    st.ty += st.vy * STEP;
    st.trail?.push([st.tx, st.ty]);
    const over = st.tx > LEFT && st.tx < RIGHT;
    if (over && st.vy > 0 && st.ty >= GROUND && st.ty - st.vy * STEP <= GROUND + 0.001) {
      st.ty = GROUND;
      st.air = false;
      st.vx = 0;
      st.vy = 0;
      if (st.trail) st.trails = [...st.trails.slice(-4), st.trail];
      st.trail = null;
    }
    if (st.tx < -0.05 || st.tx > 1.05 || st.ty > 1.15) {
      if (st.trail) st.trails = [...st.trails.slice(-4), st.trail];
      st.trail = null;
      st.ko = st.clock;
    }
  }
}

export default {
  label:
    'Illustration: a platform fighter. Each hit launches the opponent along a longer arc as its damage grows, until one sends it off the stage.',
  labels: [
    ['damage', 4, 82],
    ['knockback', 56, 6],
  ],
  hint: 'tap to strike',
  still: 7.4,
  init: fresh,
  draw(k, t, io) {
    const { w, h, u, s } = k;
    const st = io.state;
    k.clear();

    // input: the pointer steers the attacker; a tap dashes in and strikes
    if (io.inside) {
      st.idle = 0;
      if (!st.dash) st.ax += ((io.x / w - st.ax) * Math.min(1, io.dt * 8));
    }
    for (const tap of io.taps) {
      st.idle = 0;
      if (st.ko < 0 && !st.dash) st.dash = { dir: tap.x / w < st.tx ? 1 : -1 };
    }
    // the simulation runs on its own clock, in fixed steps, up to now
    while (st.clock < t) step(st);

    const size = Math.round(s * 0.9);
    const ground = Math.round(h * GROUND);
    const X = (x) => x * w;
    const Y = (y) => y * h - size / 2;

    // the stage: a platform with a dithered underside
    k.fill(X(LEFT), ground, X(RIGHT) - X(LEFT), u * 2);
    k.fill(X(LEFT) + s, ground + u * 2, X(RIGHT) - X(LEFT) - 2 * s, s * 0.7, SOFT);

    // trails: earlier flights as fine dots, the current one bolder
    const dots = (trail, bold) => {
      let run = 0;
      for (let i = 1; i < trail.length; i++) {
        run += Math.hypot((trail[i][0] - trail[i - 1][0]) * w, (trail[i][1] - trail[i - 1][1]) * h);
        if (run < u * (bold ? 4 : 5)) continue;
        run = 0;
        const [x, y] = trail[i];
        if (bold && Math.hypot((x - st.tx) * w, (y - st.ty) * h) < size) continue;
        k.item(X(x), Y(y), false, bold ? u * 1.5 : u);
      }
    };
    st.trails.forEach((tr) => dots(tr, false));
    if (st.trail) dots(st.trail, true);

    // the attacker, leaning into a swing
    const swing = between(st.clock - st.swing, 0, 0.15) < 1 && st.swing >= 0;
    k.item(X(st.ax), Y(GROUND), false, size);
    if (swing) {
      const dir = Math.sign(st.tx - st.ax) || 1;
      k.fill(X(st.ax) + dir * size * 0.5, Y(GROUND) - u, dir * size * 0.6, u * 2);
    }

    // the target: hollow, with sparks at the moment it is hit
    if (st.ko < 0) {
      k.item(X(st.tx), Y(st.ty), true, size);
      const since = st.clock - st.flash;
      if (st.flash >= 0 && since < 0.2) {
        const p = out(since / 0.2);
        for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          k.item(X(st.tx) + px * s * mix(0.4, 0.9, p), Y(st.ty) + py * s * mix(0.4, 0.9, p), false, u * 2);
        }
      }
    } else if (st.clock - st.ko < 0.4) {
      // knocked out: a blast line at the edge it left by
      const x = st.tx < 0.5 ? 0 : w - u * 3;
      k.fill(x, 0, u * 3, h, (st.clock - st.ko) % 0.2 < 0.1 ? SOLID : SOFT);
    }

    // the damage: a meter that fills a block per 20%, and the percentage
    const block = (w * 0.34) / 5;
    const shown = st.ko >= 0 ? 0 : st.damage;
    const full = Math.min(5, Math.floor(shown / 20));
    for (let i = 0; i < 5; i++) {
      const x = w * 0.04 + i * block;
      if (i < full) k.fill(x, h * 0.9, block - u * 2, u * 3);
      else k.frame(x, h * 0.9, block - u * 2, u * 3);
    }
    k.text(`${shown}%`, w * 0.04 + 5 * block + u * 3, Math.round(h * 0.9 + u * 1.5 - 3.5 * k.dot));
  },
};
