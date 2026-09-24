import { SOFT, SOLID, between, mix, out } from './kit.js';

// NPC Dialogue Engine: a player's line becomes a reply the game can trust. The
// line is classified, lore is retrieved, the model drafts a reply, and a
// validator checks it; every other exchange the draft fails and loops back
// through repair first. The reply is spoken, and of the two effects it
// proposes, one is kept and the other struck out. A tap starts a new exchange
// at once, and the pointer over a stage names it.

const T = 5.6; // seconds per exchange
const REPAIR = 1.2; // extra time on an exchange that is repaired

export default {
  label:
    "Illustration: a player's line passes through intent, lore retrieval, generation and validation; a failed draft loops back through repair, and of the reply's two proposed game effects, one is kept and one rejected.",
  labels: [
    ['lore', 42, 8, 'center'],
    ['validate', 70, 68, 'center'],
    ['effects', 85, 8, 'center'],
  ],
  hint: 'tap to talk',
  still: T + 3.3,
  init: () => ({ shift: 0 }),
  draw(k, t, io) {
    const { w, h, u, s } = k;
    const mem = io.state;
    k.clear();
    // a tap: the next exchange starts now
    if (io.taps.length) mem.shift = t - (Math.floor((t - mem.shift) / T) + 1) * T;
    const n = Math.floor((t - mem.shift) / T);
    const q = (t - mem.shift) % T;
    const repaired = n % 2 === 1;
    const d = repaired ? REPAIR : 0;
    const y = Math.round(h * 0.5);
    const [xp, xi, xl, xg, xv, xr] = [0.1, 0.26, 0.42, 0.56, 0.7, 0.88].map((f) => Math.round(w * f));
    const st = Math.round(s * 1.3);

    // the wire between the stations, dashed
    for (let x = xp; x < xr; x += u * 3) k.fill(x, y - u / 2, u, u);

    // a speech bubble: a frame, a tail, and lines of text that write in
    const bubble = (cx, fillP, tailLeft) => {
      const bw = s * 2.2;
      const bh = s * 1.6;
      const x0 = cx - bw / 2;
      const y0 = y - bh / 2;
      k.fill(x0, y0, bw, bh, 0);
      k.frame(x0, y0, bw, bh);
      k.fill(tailLeft ? x0 + u * 2 : x0 + bw - u * 4, y0 + bh, u * 2, u * 2);
      for (let i = 0; i < 3; i++) {
        const p = between(fillP, i / 3, (i + 1) / 3);
        const lw = (bw - u * 6) * (i === 2 ? 0.55 : 1) * p;
        if (lw > 0) k.fill(x0 + u * 3, y0 + u * 3 + i * u * 3.2, lw, u * 1.4);
      }
    };
    bubble(xp, between(q, 0, 0.5), true);

    // intent: a station that lights as it classifies
    k.station(xi, y, st, st, q > 0.8 && q < 1.05);

    // lore: a station under a column of five entries; two are retrieved
    k.station(xl, y, st, st, q > 1.3 && q < 1.6);
    const e = Math.round(s * 0.45);
    for (let i = 0; i < 5; i++) {
      const hit = (i === 1 || i === 3 + (n % 2)) && q > 1.3 + i * 0.05 && q < 2.9 + d;
      k.item(xl, y - st / 2 - u * 3 - e / 2 - i * (e + u * 1.5), !hit, e, hit ? SOLID : SOFT);
    }

    // generate: a frame that fills while the model drafts (and redrafts)
    const gen = Math.max(between(q, 1.85, 2.5), repaired ? between(q, 3.35, 3.7) : 0);
    k.frame(xg - st / 2, y - st / 2, st, st);
    const drafting = (q > 1.85 && q < 2.5) || (repaired && q > 3.35 && q < 3.7);
    if (drafting) k.fill(xg - st / 2, y - st / 2, st * gen, st, SOFT);

    // validate: hollow while it waits, lit when a draft passes, crossed when one fails
    const failed = repaired && q > 2.75 && q < 3.05;
    const passed = q > 2.75 + d && q < 2.95 + d;
    k.station(xv, y, st, st, passed);
    if (failed) {
      for (let i = 0; i < st; i += u) {
        k.fill(xv - st / 2 + i, y - st / 2 + i, u, u);
        k.fill(xv + st / 2 - u - i, y - st / 2 + i, u, u);
      }
    }

    // repair: a loop back under the wire, drawn only while it is used
    const loopY = y + st * 1.1;
    if (repaired && q > 3.0 && q < 3.4) {
      k.line(xv, y + st / 2, xv, loopY);
      k.line(xg, loopY, xv, loopY);
      k.line(xg, y + st / 2, xg, loopY);
    }

    // the reply, and the two game effects it proposes under the effects label
    const arrive = 3.2 + d;
    bubble(xr, between(q, arrive, arrive + 0.6), false);
    const fx = [xr - s * 0.6, xr + s * 0.6];
    const fy = Math.round(h * 0.2);
    fx.forEach((x, i) => {
      if (q < arrive + 0.3 + i * 0.2) return;
      const struck = i === 1 && q > arrive + 0.9;
      k.item(x, fy, struck, Math.round(s * 0.7), struck ? SOFT : SOLID);
      if (struck) {
        const m = Math.round(s * 0.7);
        for (let j = 0; j < m; j += u) {
          k.fill(x - m / 2 + j, fy - m / 2 + j, u, u);
          k.fill(x + m / 2 - u - j, fy - m / 2 + j, u, u);
        }
      }
    });

    // the line itself hops from station to station
    const hops = [
      [0.5, 0.8, xp, xi, y],
      [1.05, 1.3, xi, xl, y],
      [1.6, 1.85, xl, xg, y],
      [2.5, 2.75, xg, xv, y],
      [2.95 + d, 3.2 + d, xv, xr, y],
    ];
    for (const [a, b, from, to, yy] of hops) {
      if (q >= a && q < b) k.item(mix(from, to, out((q - a) / (b - a))), yy, false, u * 3);
    }
    // on a repaired exchange it rides the loop back to generate
    if (repaired && q >= 3.05 && q < 3.35) {
      const p = out(between(q, 3.05, 3.35));
      const x = p < 0.25 ? xv : p > 0.75 ? xg : mix(xv, xg, (p - 0.25) / 0.5);
      const yy = p < 0.25 ? mix(y, loopY, p / 0.25) : p > 0.75 ? mix(loopY, y, (p - 0.75) / 0.25) : loopY;
      k.item(x, yy, false, u * 3);
    }
    if (repaired && q >= 3.7 && q < 3.95) k.item(mix(xg, xv, out((q - 3.7) / 0.25)), y, false, u * 3);


    // the pointer over a stage names it (lore and validate carry labels already)
    if (io.inside) {
      const names = [
        [xp, 'player', s * 0.8, 1],
        [xi, 'intent', st / 2, 1],
        [xg, 'draft', st / 2, -1],
        [xr, 'reply', s * 0.8, 1],
      ];
      for (const [x, name, half, below] of names) {
        if (Math.abs(io.x - x) > Math.max(half, st * 0.8) || Math.abs(io.y - y) > s * 1.2) continue;
        const gap = u * 3;
        const ty = below > 0 ? y + half + gap : y - half - gap - 7 * k.dot;
        k.text(name, x, Math.round(ty), k.dot, 'center');
      }
    }
  },
};
