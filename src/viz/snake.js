import { SOLID } from './kit.js';

// Bare-Metal Snake: the built-in AI playing on a framebuffer grid. The game
// is simulated once, deterministically (breadth-first search to the food,
// seeded food placement), and replayed; it resets when the snake reaches 28.

const COLS = 24;
const ROWS = 14;
const MAX = 28;
const STEP = 0.11; // seconds per move

let frames = null;

function simulate() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  let body = [[6, 7], [5, 7], [4, 7]];
  const place = () => {
    let f;
    do f = [Math.floor(rand() * COLS), Math.floor(rand() * ROWS)];
    while (body.some((b) => same(b, f)));
    return f;
  };
  let food = place();
  const out = [];

  // first move of the shortest path to the food, treating the tail as free
  const next = () => {
    const blocked = new Set(body.slice(0, -1).map(([x, y]) => y * COLS + x));
    const from = new Map([[body[0][1] * COLS + body[0][0], -1]]);
    const queue = [body[0]];
    while (queue.length) {
      const cur = queue.shift();
      if (same(cur, food)) {
        let key = cur[1] * COLS + cur[0];
        while (from.get(key) !== body[0][1] * COLS + body[0][0]) key = from.get(key);
        return [key % COLS, Math.floor(key / COLS)];
      }
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nx = cur[0] + dx;
        const ny = cur[1] + dy;
        const key = ny * COLS + nx;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || blocked.has(key) || from.has(key)) continue;
        from.set(key, cur[1] * COLS + cur[0]);
        queue.push([nx, ny]);
      }
    }
    return null;
  };

  while (body.length < MAX && out.length < 4000) {
    const head = next();
    if (!head) break;
    body = [head, ...body];
    if (same(head, food)) food = place();
    else body.pop();
    out.push({ body, food });
  }
  return out;
}

export default {
  label: 'Illustration: Snake on a bare framebuffer grid, played by its built-in AI, which chases the food and grows.',
  labels: [['ai mode', 4, 4]],
  still: 16,
  draw(k, t) {
    const { w, h, u } = k;
    k.clear();
    frames ??= simulate();
    const i = Math.floor(t / STEP) % (frames.length + 12); // a short pause on the full snake
    const frame = frames[Math.min(i, frames.length - 1)];
    const done = i >= frames.length;

    const cell = Math.floor(Math.min((w * 0.9) / COLS, (h * 0.76) / ROWS));
    const gx = Math.round((w - cell * COLS) / 2);
    const gy = Math.round(h * 0.17);

    // the framebuffer: a hairline edge and one pixel at every cell's center
    // (solid, because a dithered speck this small would come out uneven)
    const [ex, ey, ew, eh] = [gx - u * 2, gy - u * 2, cell * COLS + u * 4, cell * ROWS + u * 4];
    k.fill(ex, ey, ew, 1);
    k.fill(ex, ey + eh - 1, ew, 1);
    k.fill(ex, ey, 1, eh);
    k.fill(ex + ew - 1, ey, 1, eh);
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) k.fill(gx + x * cell + Math.floor(cell / 2), gy + y * cell + Math.floor(cell / 2), 1, 1);

    if (!done || i % 4 < 2) {
      for (const [x, y] of frame.body) k.fill(gx + x * cell + u / 2, gy + y * cell + u / 2, cell - u, cell - u, SOLID);
    }
    const [fx, fy] = frame.food;
    if (!done && i % 6 < 4) k.frame(gx + fx * cell + u / 2, gy + fy * cell + u / 2, cell - u, cell - u);
  },
};
