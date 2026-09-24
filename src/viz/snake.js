import { SOLID } from './kit.js';

// Bare-Metal Snake: the built-in AI playing on a framebuffer grid, live. It
// takes the shortest path to the food (breadth-first search, treating its own
// tail as free) and grows until it reaches 28, then the game resets. Food
// lands at seeded places, unless the pointer is over the grid: then the food
// follows it, and the snake chases the cursor.

const COLS = 24;
const ROWS = 14;
const MAX = 28;
const STEP = 0.11; // seconds per move

const same = (a, b) => a[0] === b[0] && a[1] === b[1];
const start = () => [[6, 7], [5, 7], [4, 7]];

function rand(st) {
  st.seed = (st.seed * 1103515245 + 12345) % 2147483648;
  return st.seed / 2147483648;
}

function place(st) {
  let f;
  do f = [Math.floor(rand(st) * COLS), Math.floor(rand(st) * ROWS)];
  while (st.body.some((b) => same(b, f)));
  return f;
}

// the first move of the shortest path to the food, or null if there is none
function towardFood(body, food) {
  const [hx, hy] = body[0];
  const blocked = new Set(body.slice(0, -1).map(([x, y]) => y * COLS + x));
  const from = new Map([[hy * COLS + hx, -1]]);
  const queue = [body[0]];
  while (queue.length) {
    const cur = queue.shift();
    if (same(cur, food)) {
      let key = cur[1] * COLS + cur[0];
      while (from.get(key) !== hy * COLS + hx) key = from.get(key);
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
}

// no path: any free neighbor will do, to wait for one
function anyMove(body) {
  const blocked = new Set(body.slice(0, -1).map(([x, y]) => y * COLS + x));
  const [hx, hy] = body[0];
  for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
    const nx = hx + dx;
    const ny = hy + dy;
    if (nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !blocked.has(ny * COLS + nx)) return [nx, ny];
  }
  return null;
}

function step(st) {
  if (st.over >= 0) {
    if (st.clock - st.over > 1.3) Object.assign(st, { body: start(), food: null, over: -1 });
    return;
  }
  st.food ??= place(st);
  const head = towardFood(st.body, st.food) ?? anyMove(st.body);
  if (!head) {
    st.over = st.clock;
    return;
  }
  st.body = [head, ...st.body];
  if (same(head, st.food)) {
    st.food = null;
    if (st.body.length >= MAX) st.over = st.clock;
  } else {
    st.body.pop();
  }
}

export default {
  label: 'Illustration: Snake on a bare framebuffer grid, played by its built-in AI, which chases the food and grows.',
  labels: [['ai mode', 4, 4]],
  hint: 'move to feed',
  still: 16,
  init: () => ({ body: start(), food: null, seed: 7, clock: 0, over: -1 }),
  draw(k, t, io) {
    const { w, h, u } = k;
    const st = io.state;
    k.clear();

    const cell = Math.floor(Math.min((w * 0.9) / COLS, (h * 0.76) / ROWS));
    const gx = Math.round((w - cell * COLS) / 2);
    const gy = Math.round(h * 0.17);

    // the pointer over the grid, or a tap on it, puts the food under it
    const cellAt = (x, y) => {
      const c = [Math.floor((x - gx) / cell), Math.floor((y - gy) / cell)];
      return c[0] >= 0 && c[1] >= 0 && c[0] < COLS && c[1] < ROWS ? c : null;
    };
    const aims = [...io.taps.map((p) => cellAt(p.x, p.y)), io.inside ? cellAt(io.x, io.y) : null];
    for (const c of aims) {
      if (c && st.over < 0 && !st.body.some((b) => same(b, c))) st.food = c;
    }

    while (st.clock + STEP <= t) {
      st.clock += STEP;
      step(st);
    }

    // the framebuffer: a hairline edge and one pixel at every cell's center
    // (solid, because a dithered speck this small would come out uneven)
    const [ex, ey, ew, eh] = [gx - u * 2, gy - u * 2, cell * COLS + u * 4, cell * ROWS + u * 4];
    k.fill(ex, ey, ew, 1);
    k.fill(ex, ey + eh - 1, ew, 1);
    k.fill(ex, ey, 1, eh);
    k.fill(ex + ew - 1, ey, 1, eh);
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) k.fill(gx + x * cell + Math.floor(cell / 2), gy + y * cell + Math.floor(cell / 2), 1, 1);

    // the snake, blinking when a game ends; its head carries a notch facing forward
    const blink = st.over >= 0 && Math.floor((t - st.over) / 0.15) % 2 === 1;
    if (!blink) {
      for (const [x, y] of st.body) k.fill(gx + x * cell + u / 2, gy + y * cell + u / 2, cell - u, cell - u, SOLID);
      const [hx, hy] = st.body[0];
      const [nx, ny] = st.body[1] ?? [hx - 1, hy];
      const [dx, dy] = [hx - nx, hy - ny];
      const mx = gx + hx * cell + cell / 2 + (dx * cell) / 4;
      const my = gy + hy * cell + cell / 2 + (dy * cell) / 4;
      k.fill(mx - u / 2, my - u / 2, u, u, 0);
    }
    if (st.food && st.over < 0 && Math.floor(t / 0.12) % 6 < 5) {
      const [fx, fy] = st.food;
      k.frame(gx + fx * cell + u / 2, gy + fy * cell + u / 2, cell - u, cell - u);
    }

    // its length, over the grid's right corner
    k.text(`${st.body.length}/${MAX}`, ex + ew, Math.max(u, gy - u * 3 - 7 * k.dot), k.dot, 'right');
  },
};
