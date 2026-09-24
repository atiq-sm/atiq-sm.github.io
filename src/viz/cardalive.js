import { SOLID, between, clamp, mix, out, rnd } from './kit.js';

// CardAlive: a mixed-reality card battler. The headset locks onto a card on
// the table and scans it; a slime is summoned onto it, facing a goblin already
// standing on its own card, and the two trade turns until the goblin falls.
// Then the slime sinks back into its card, the goblin is summoned again, and
// the loop starts over from an empty card. The view follows the pointer as a
// headset would, near things shifting more than far ones; a monster under the
// pointer is bracketed, and a tap on it makes it jump.

const SLIME = [
  '....#####....',
  '..#########..',
  '.###########.',
  '###..###..###',
  '###..###..###',
  '#############',
  '#############',
  '.###########.',
];
const GOBLIN = [
  '.#.......#.',
  '.##.....##.',
  '..#######..',
  '.#########.',
  '.##..#..##.',
  '.#########.',
  '..#######..',
  '...#####...',
  '.#########.',
  '#.#######.#',
  '..##...##..',
  '..##...##..',
];

const SCAN = [0, 1.3];
const SPAWN = [1.3, 2.3];
const TURNS = 2.4; // the first turn
const TURN = 1.8; // seconds per turn
const HIT = 0.75; // into a turn, when the blow lands
const KO = TURNS + 3 * TURN; // the slime's second hit finishes the goblin
const RESET = KO + 1; // the goblin scatters, then both return to their cards
const LOOP = RESET + 1;
const HP = 4; // blocks per health bar; each hit takes two

// A sprite standing with its bottom edge centered on (cx, bottom). `rows` is
// how many rows show, counted from the bottom (a summon builds it upward);
// hollow draws only the outline, the flash of a monster taking a hit.
function sprite(k, map, cx, bottom, cell, { rows = map.length, hollow = false } = {}) {
  const x0 = cx - (map[0].length * cell) / 2;
  const y0 = bottom - map.length * cell;
  const on = (r, c) => map[r]?.[c] === '#';
  for (let r = map.length - rows; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (!on(r, c)) continue;
      if (hollow && on(r - 1, c) && on(r + 1, c) && on(r, c - 1) && on(r, c + 1)) continue;
      k.fill(x0 + c * cell, y0 + r * cell, cell, cell);
    }
  }
}

export default {
  label:
    'Illustration: a headset scans a card on a table and summons a slime onto it; the slime and a goblin on the other card take turns attacking, their health bars draining, until the goblin falls.',
  labels: [
    ['scan', 30, 8, 'center'],
    ['turn-based', 70, 8, 'center'],
  ],
  hint: 'tap a monster',
  still: TURNS + 2 * TURN + HIT + 0.1,
  init: () => ({ look: 0, hops: { slime: -9, goblin: -9 }, bursts: [] }),
  draw(k, t, io) {
    const { c, w, h, u, s } = k;
    const st = io.state;
    const clock = t;
    k.clear();
    t %= LOOP;
    const cell = Math.max(2, Math.round(h / 40));

    // where the head is turned: toward the pointer, or drifting a little
    const aim = io.inside ? (io.x / w - 0.5) * 2 : Math.sin(clock * 0.4) * 0.25;
    st.look += (aim - st.look) * Math.min(1, io.dt * 4);
    const shift = (depth) => Math.round(-st.look * w * (0.015 + 0.05 * depth));

    // the tabletop in perspective, a faint dither between its two edges
    const far = Math.round(h * 0.5);
    const near = Math.round(h * 0.9);
    const [fx, nx] = [shift(0), shift(1)];
    c.fillStyle = k.gray(40);
    c.beginPath();
    c.moveTo(w * 0.16 + fx, far);
    c.lineTo(w * 0.84 + fx, far);
    c.lineTo(w * 0.97 + nx, near);
    c.lineTo(w * 0.03 + nx, near);
    c.closePath();
    c.fill();
    k.fill(w * 0.16 + fx, far, w * 0.68, u);
    k.fill(w * 0.03 + nx, near, w * 0.94, u);

    // everything on the cards sits at their depth, and moves with it
    const dx = shift((h * 0.72 - far) / (near - far));
    c.save();
    c.translate(dx, 0);

    // the two cards, flat on the table, each with its scannable code
    const cw = Math.round(w * 0.2);
    const ch = Math.round(h * 0.12);
    const cy = Math.round(h * 0.72);
    const slimeX = Math.round(w * 0.3);
    const goblinX = Math.round(w * 0.7);
    const card = (cx, seed) => {
      k.fill(cx - cw / 2, cy - ch / 2, cw, ch, 0);
      k.frame(cx - cw / 2, cy - ch / 2, cw, ch);
      const q = Math.max(u, Math.floor((ch - 4 * u) / 3));
      const cols = Math.floor((cw - 4 * u) / q);
      for (let i = 0; i < cols * 3; i++) {
        if (rnd(i + seed) < 0.5) continue;
        k.fill(cx - (cols * q) / 2 + (i % cols) * q, cy - (3 * q) / 2 + Math.floor(i / cols) * q, q, q);
      }
    };
    card(slimeX, 11);
    card(goblinX, 53);
    // monsters stand at the back of their cards, clear of the code
    const bottom = cy - ch / 2 + cell;

    // a tap on a monster makes it jump, and the pointer over one brackets it
    const bounds = (name) => {
      const map = name === 'slime' ? SLIME : GOBLIN;
      const x = name === 'slime' ? slimeX : goblinX;
      return [x - (map[0].length * cell) / 2, bottom - map.length * cell, map[0].length * cell, map.length * cell];
    };
    const under = (px, py) =>
      ['slime', 'goblin'].find((name) => {
        const [x, y, bw, bh] = bounds(name);
        return px - dx >= x - cell * 2 && px - dx <= x + bw + cell * 2 && py >= y - cell * 3 && py <= y + bh + cell;
      });
    for (const tap of io.taps) {
      const name = under(tap.x, tap.y);
      if (name) st.hops[name] = clock;
      st.bursts = [...st.bursts.filter((b) => clock - b.t < 0.4), { x: tap.x, y: tap.y, t: clock }];
    }
    const hop = (name) => {
      const p = (clock - st.hops[name]) / 0.45;
      return p >= 0 && p < 1 ? Math.round(Math.sin(p * Math.PI) * cell * 6) : 0;
    };

    // where the fight stands: which turn, how far into it, and what has landed
    const turn = t >= TURNS && t < KO ? Math.floor((t - TURNS) / TURN) : -1;
    const q = turn >= 0 ? t - TURNS - turn * TURN : 0;
    const landed = (i) => t >= TURNS + i * TURN + HIT;
    const goblinHp = HP - 2 * [0, 2].filter(landed).length;
    const slimeHp = HP - 2 * [1].filter(landed).length;
    const slimeUp = t >= SPAWN[0];
    const fallen = t >= KO && t < RESET;
    const struck = turn >= 0 && q >= HIT && q < HIT + 0.35 ? (turn % 2 ? 'slime' : 'goblin') : null;
    const shake = struck && Math.floor(t * 30) % 2 ? cell : 0;

    // 1. scan: brackets close in on the empty card, then a line sweeps across it
    if (t < SCAN[1]) {
      const m = mix(s, u * 2, out(between(t, 0, 0.6)));
      const arm = Math.round(s * 0.5);
      const [l, r, top, bot] = [slimeX - cw / 2 - m, slimeX + cw / 2 + m, cy - ch / 2 - m, cy + ch / 2 + m];
      for (const [x, y, dx, dy] of [[l, top, 1, 1], [r, top, -1, 1], [r, bot, -1, -1], [l, bot, 1, -1]]) {
        k.fill(dx > 0 ? x : x - arm, dy > 0 ? y : y - u, arm, u);
        k.fill(dx > 0 ? x : x - u, dy > 0 ? y : y - arm, u, arm);
      }
      const sweep = between(t, 0.5, 1.2);
      if (sweep > 0 && sweep < 1) k.fill(mix(l, r, sweep), top, u, bot - top);
    }

    // 2. summon: a ring of dots turns around the card as the monster builds upward
    const summon = (cx, p, spin) => {
      if (p <= 0 || p >= 1) return;
      const rx = cw * mix(0.4, 0.75, out(p));
      const ry = ch * mix(0.4, 0.9, out(p));
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + spin;
        k.item(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, false, u * 1.5);
      }
      for (let i = 0; i < 6; i++) {
        const rise = clamp(p * 1.4 - rnd(i + 3) * 0.4);
        if (rise > 0 && rise < 1) k.item(cx + (rnd(i) - 0.5) * cw, bottom - rise * h * 0.3, false, u * 1.5);
      }
    };
    const spawn = between(t, SPAWN[0], SPAWN[1]);
    summon(slimeX, spawn, t * 2);
    const respawn = between(t, RESET, LOOP);
    summon(goblinX, respawn, -t * 2);

    // the slime: summoned, fighting, then sinking back into its card
    if (slimeUp) {
      const rows =
        t < SPAWN[1] ? Math.ceil(out(spawn) * SLIME.length) : t >= RESET ? Math.round((1 - respawn) * SLIME.length) : SLIME.length;
      sprite(k, SLIME, slimeX + (struck === 'slime' ? shake : 0), bottom - hop('slime'), cell, { rows, hollow: struck === 'slime' });
    }

    // the goblin: lunges on its turns, scatters when it falls, is summoned again
    const lunge = turn % 2 === 1 ? out(between(q, 0.3, 0.6)) * (1 - out(between(q, 0.85, 1.25))) : 0;
    const gx = goblinX - lunge * (goblinX - slimeX - SLIME[0].length * cell) + (struck === 'goblin' ? shake : 0);
    if (fallen) {
      // knocked out: its pixels fly apart and fall, thinning as they go
      const p = between(t, KO, RESET);
      const x0 = goblinX - (GOBLIN[0].length * cell) / 2;
      const y0 = bottom - GOBLIN.length * cell;
      GOBLIN.forEach((row, r) =>
        [...row].forEach((px, col) => {
          const i = r * 16 + col;
          if (px !== '#' || rnd(i) < p) return;
          const dx = (rnd(i + 7) - 0.5) * w * 0.3 * p;
          const dy = -rnd(i + 5) * h * 0.2 * p + h * 0.5 * p * p;
          k.fill(x0 + col * cell + dx, y0 + r * cell + dy, cell, cell);
        }),
      );
    } else {
      const rows = t >= RESET ? Math.ceil(out(respawn) * GOBLIN.length) : GOBLIN.length;
      sprite(k, GOBLIN, gx, bottom - hop('goblin'), cell, { rows, hollow: struck === 'goblin' });
    }

    // the slime's move: a blade of water flies across and bursts on the goblin
    if (turn % 2 === 0) {
      const p = between(q, 0.3, HIT);
      const y = bottom - SLIME.length * cell * 0.6;
      const from = slimeX + (SLIME[0].length * cell) / 2;
      const to = goblinX - (GOBLIN[0].length * cell) / 2;
      if (p > 0 && p < 1) {
        const x = mix(from, to, p);
        const lift = Math.sin(p * Math.PI) * h * 0.06;
        k.fill(x - cell, y - lift - cell * 1.5, cell * 2, cell * 3);
        for (let i = 1; i <= 3; i++) k.item(x - i * cell * 2.5, y - Math.sin(clamp(p - i * 0.06) * Math.PI) * h * 0.06, false, u * 1.5);
      }
    }

    // a burst of four sparks around whoever was just hit
    if (struck) {
      const p = out(between(q, HIT, HIT + 0.3));
      const [x, rows] = struck === 'slime' ? [slimeX, SLIME.length] : [goblinX, GOBLIN.length];
      const y = bottom - (rows * cell) / 2;
      const r = (rows * cell) / 2 + p * s;
      for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) k.item(x + dx * r, y + dy * r * 0.8, false, u * 2);
    }

    // health bars over each monster, and a marker over whoever is acting
    const bar = (cx, rows, hp, acting, lift) => {
      const bw = cell * 3;
      const y = bottom - lift - rows * cell - cell * 3;
      const x0 = cx - (HP * (bw + u) - u) / 2;
      for (let i = 0; i < HP; i++) {
        if (i < hp) k.fill(x0 + i * (bw + u), y, bw, cell);
        else k.frame(x0 + i * (bw + u), y, bw, cell);
      }
      if (acting) for (let i = 0; i < 3; i++) k.fill(cx - cell * (1.5 - i / 2), y - cell * (4 - i), cell * (3 - i), cell, SOLID);
    };
    if (slimeUp && t >= SPAWN[1] && t < RESET) bar(slimeX, SLIME.length, slimeHp, turn % 2 === 0 && q < HIT + 0.5, hop('slime'));
    if (!fallen && respawn < 1 && (t < KO || respawn > 0.6)) {
      bar(goblinX, GOBLIN.length, t >= RESET ? HP : goblinHp, turn % 2 === 1 && q < HIT + 0.5, hop('goblin'));
    }
    c.restore();

    // brackets lock onto the monster under the pointer
    const target = io.inside ? under(io.x, io.y) : null;
    if (target) {
      const [x0, y0, bw, bh] = bounds(target);
      const pad = cell * 2;
      const [l, r, top, bot] = [x0 + dx - pad, x0 + dx + bw + pad, y0 - hop(target) - pad, y0 - hop(target) + bh + pad];
      const arm = Math.round(s * 0.4);
      for (const [x, y, sx, sy] of [[l, top, 1, 1], [r, top, -1, 1], [r, bot, -1, -1], [l, bot, 1, -1]]) {
        k.fill(sx > 0 ? x : x - arm, sy > 0 ? y : y - u, arm, u);
        k.fill(sx > 0 ? x : x - u, sy > 0 ? y : y - arm, u, arm);
      }
    }

    // a ring of sparks wherever a tap lands
    for (const b of st.bursts) {
      const p = (clock - b.t) / 0.4;
      if (p < 0 || p >= 1) continue;
      const r = mix(s * 0.2, s * 1.1, out(p));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        k.item(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r * 0.8, false, u * (p < 0.5 ? 2 : 1.5));
      }
    }
  },
};
