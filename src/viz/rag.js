import { SOFT, SOLID, between, mix, out, rnd } from './kit.js';

// Voice RAG: one spoken question at a time. The waveform becomes a query,
// Whisper transcribes it, retrieval lights three of eight chunks and the
// reranker keeps two, the local model thinks, and an answer is spoken back.

const T = 4.2; // seconds per question

export default {
  label:
    'Illustration: a spoken question passes through speech-to-text, retrieval and reranking and a local language model, and comes back as speech.',
  labels: [
    ['whisper', 19, 72],
    ['retrieve', 42, 6],
    ['ollama', 64, 72],
  ],
  still: 2.2,
  draw(k, t) {
    const { w, h, u, s } = k;
    k.clear();
    const n = Math.floor(t / T);
    const q = t % T;
    const y = Math.round(h * 0.5);
    const [x0, x1, x2, x3, x4] = [0.1, 0.3, 0.52, 0.74, 0.9].map((f) => w * f);

    // the wire: a regular dash, since a dithered hairline breaks up unevenly
    for (let x = x0; x < x4; x += u * 3) k.fill(x, y - u / 2, u, u);

    // voice in and voice out: a few bars that move while someone speaks
    const wave = (x, active) => {
      for (let i = -3; i <= 3; i++) {
        const amp = active ? 0.3 + 0.7 * Math.abs(Math.sin(t * 9 + i * 1.3 + n)) : 0.08;
        const bh = Math.max(u, s * 1.6 * amp);
        k.fill(x + i * u * 2.5 - u * 0.75, y - bh / 2, u * 1.5, bh);
      }
    };
    wave(x0, q < 0.7);
    wave(x4, q > 3.55);

    // whisper and the model: stations that light while they work
    k.station(x1, y, s * 1.6, s * 1.6, q > 0.95 && q < 1.2);
    const thinking = between(q, 2.5, 3.3);
    k.frame(x3 - s * 0.9, y - s * 0.8, s * 1.8, s * 1.6);
    if (thinking > 0 && q < 3.3) k.fill(x3 - s * 0.9, y - s * 0.8, s * 1.8 * thinking, s * 1.6, SOFT);

    // retrieval: eight chunks; three are fetched, then the reranker drops one
    const cell = Math.round(s * 0.62);
    const picks = [];
    for (let j = 0; picks.length < 3; j++) {
      const c = Math.floor(rnd(n * 17 + j) * 8);
      if (!picks.includes(c)) picks.push(c);
    }
    for (let c = 0; c < 8; c++) {
      const cx = x2 + ((c % 4) - 1.5) * (cell + u * 2);
      const cy = y + (c < 4 ? -1 : 1) * (cell / 2 + u * 2);
      const order = picks.indexOf(c);
      const fetched = order >= 0 && q > 1.5 + order * 0.14;
      const kept = order >= 0 && order < 2 && q > 2.05;
      const dropped = fetched && !kept && q > 2.05;
      if ((kept || (fetched && !dropped)) && q < 3.3) k.item(cx, cy, false, cell, SOLID);
      else k.item(cx, cy, true, cell);
    }

    // the query itself hops from station to station
    const hops = [
      [0.7, 0.95, x0, x1],
      [1.2, 1.45, x1, x2],
      [2.25, 2.5, x2, x3],
      [3.3, 3.55, x3, x4],
    ];
    for (const [a, b, from, to] of hops) {
      if (q >= a && q < b) k.item(mix(from, to, out((q - a) / (b - a))), y, false, u * 3);
    }
  },
};
