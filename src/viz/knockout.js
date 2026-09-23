import { SOFT, SOLID, between, mix, out } from './kit.js';

// Cosmic Knockout: percentage-based knockback. Each hit launches the target
// along a longer arc as its damage meter fills; earlier arcs stay as soft
// trails, and the fifth hit sends it off the stage before the round resets.

const HIT = 1.8; // seconds per hit
const HITS = 5;

// The arc for hit i as a function of progress p in [0, 1], relative to launch.
function arc(k, i, p) {
  const last = i === HITS - 1;
  const dist = last ? k.w * 0.75 : k.w * (0.08 + 0.07 * i);
  const peak = last ? k.h * 0.7 : k.h * (0.14 + 0.08 * i);
  return [dist * p, -4 * peak * p * (1 - p) - (last ? k.h * 0.5 * p * p : 0)];
}

export default {
  label:
    'Illustration: a platform fighter. Each hit launches the opponent along a longer arc as its damage grows, until the fifth sends it off the stage.',
  labels: [
    ['damage', 4, 82],
    ['knockback', 56, 6],
  ],
  still: HIT * 4 + 0.95,
  draw(k, t) {
    const { w, h, u, s } = k;
    k.clear();
    const n = Math.floor(t / HIT) % HITS;
    const q = t % HIT;
    const ground = Math.round(h * 0.66);
    const left = w * 0.1;
    const right = w * 0.78;
    const size = Math.round(s * 0.9);
    const bx = w * 0.42;
    const by = ground - size / 2;

    // the stage: a platform with a dithered underside
    k.fill(left, ground, right - left, u * 2);
    k.fill(left + s, ground + u * 2, right - left - 2 * s, s * 0.7, SOFT);

    // trails: earlier hits as fine dots, the current one bolder up to where it
    // is now; a dot every few pixels of path, never on top of the fighter.
    // Small shapes stay solid: dithered, a 3px dot turns into noise.
    const flight = between(q, 0.4, 1.4);
    const [nowX, nowY] = arc(k, n, flight);
    for (let i = 0; i <= n; i++) {
      const upto = i < n ? 1 : flight;
      let [px, py] = arc(k, i, 0);
      let run = 0;
      for (let p = 0; p <= upto; p += 1 / 400) {
        const [dx, dy] = arc(k, i, p);
        run += Math.hypot(dx - px, dy - py);
        [px, py] = [dx, dy];
        if (run < u * (i < n ? 5 : 4)) continue;
        run = 0;
        if (i === n && Math.hypot(dx - nowX, dy - nowY) < size) continue;
        k.item(bx + dx, by + dy, false, i < n ? u : u * 1.5);
      }
    }

    // the attacker dashes in, holds, then walks back
    const ax0 = left + s * 1.2;
    const ax = q < 0.3 ? mix(ax0, bx - size * 1.2, out(q / 0.3)) : q < 1.4 ? bx - size * 1.2 : mix(bx - size * 1.2, ax0, out((q - 1.4) / 0.4));
    k.item(ax, by, false, size);

    // the target: struck, launched, then back at its mark
    if (q < 0.3) k.item(bx, by, true, size);
    else if (q < 0.4) {
      k.item(bx, by, false, size);
      for (const [px, py] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) k.item(bx - size * 0.6 + px * s * 0.5, by + py * s * 0.5, false, u * 2);
    } else if (q < 1.4) {
      k.item(bx + nowX, by + nowY, true, size);
    } else if (n === HITS - 1) {
      // knocked out: a blast line at the edge, then the round resets
      k.fill(w - u * 3, 0, u * 3, h, between(q, 1.4, 1.8) < 0.5 ? SOLID : SOFT);
    } else {
      const [dx] = arc(k, n, 1);
      k.item(mix(bx + dx, bx, out((q - 1.4) / 0.4)), by, true, size);
    }

    // the damage meter fills a block per hit
    const block = (w * 0.34) / HITS;
    for (let i = 0; i < HITS; i++) {
      const x = w * 0.04 + i * block;
      if (i < n || (i === n && q >= 0.3)) k.fill(x, h * 0.9, block - u * 2, u * 3);
      else k.frame(x, h * 0.9, block - u * 2, u * 3);
    }
  },
};
