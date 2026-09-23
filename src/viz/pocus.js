// MR POCUS: an apical four-chamber view in an ultrasound sector. Speckled
// tissue fills the fan; the ventricles squeeze in systole and the atria just
// before it, their bright walls thickening as they contract; a beam sweeps.

const chambers = [
  // label, center (in units of the fan's depth), radii, and when it contracts
  { name: 'RV', x: -0.14, y: 0.45, rx: 0.1, ry: 0.19, phase: 0 },
  { name: 'LV', x: 0.14, y: 0.47, rx: 0.12, ry: 0.21, phase: 0 },
  { name: 'RA', x: -0.14, y: 0.8, rx: 0.1, ry: 0.085, phase: 0.72 },
  { name: 'LA', x: 0.15, y: 0.81, rx: 0.11, ry: 0.085, phase: 0.72 },
];
const BEAT = 0.9; // seconds per heartbeat
const APEX = 0.05; // the probe, as a fraction of the height
const DEPTH = 0.92; // the fan's depth, as a fraction of the height

export default {
  label:
    'Illustration: an ultrasound sector showing the four chambers of a beating heart, the view MR POCUS trains learners to find.',
  // The chambers are labelled as on an echo, centered in each; where that is
  // depends on the frame's shape, since the fan is sized by its height.
  labels: (aspect) => [
    ['probe', 55, 3],
    ...chambers.map((ch) => [ch.name, 50 + (ch.x * DEPTH * 100) / aspect, (APEX + ch.y * DEPTH) * 100, 'center']),
  ],
  still: 0.1,
  draw(k, t) {
    const { c, w, h, u } = k;
    k.clear();
    const ax = w / 2;
    const ay = Math.round(h * APEX);
    const depth = h * DEPTH;
    const spread = 0.7; // half-angle of the fan, in radians
    const q = (t % BEAT) / BEAT;

    c.save();
    c.beginPath();
    c.moveTo(ax, ay);
    c.arc(ax, ay, depth, Math.PI / 2 - spread, Math.PI / 2 + spread);
    c.closePath();
    c.clip();

    // tissue: a speckle field that drifts slightly, like a hand-held probe
    c.globalAlpha = 0.8;
    c.drawImage(k.stage.noise(7), Math.round(Math.sin(t * 0.7) * 3), Math.round(Math.cos(t * 0.5) * 2));
    c.globalAlpha = 1;

    // walls first, bright; then the blood inside them, which ultrasound shows black
    const squeeze = chambers.map(({ phase }) => {
      const p = (q - phase + 1) % 1;
      return p < 0.28 ? Math.sin((p / 0.28) * Math.PI) : 0;
    });
    for (const pass of [0, 1]) {
      chambers.forEach((ch, i) => {
        const sq = squeeze[i];
        const wall = depth * 0.026 * (1 + 0.8 * sq);
        const rx = depth * ch.rx * (1 - 0.18 * sq) + (pass ? 0 : wall);
        const ry = depth * ch.ry * (1 - 0.1 * sq) + (pass ? 0 : wall);
        c.fillStyle = k.gray(pass ? 0 : 165);
        c.beginPath();
        c.ellipse(ax + ch.x * depth, ay + ch.y * depth, rx, ry, 0, 0, Math.PI * 2);
        c.fill();
      });
    }

    // the beam, sweeping back and forth across the sector
    const a = Math.PI / 2 + spread * 0.94 * Math.sin(t * 1.3);
    c.strokeStyle = k.gray(120);
    c.lineWidth = u;
    c.beginPath();
    c.moveTo(ax, ay);
    c.lineTo(ax + Math.cos(a) * depth, ay + Math.sin(a) * depth);
    c.stroke();
    c.restore();

    // the probe, and depth ticks down the right edge of the fan
    k.fill(ax - u * 4, 0, u * 8, ay + u, 255);
    for (let i = 1; i <= 4; i++) {
      const d = (depth * i) / 5;
      const x = ax + Math.cos(Math.PI / 2 - spread) * d;
      const y = ay + Math.sin(Math.PI / 2 - spread) * d;
      k.fill(x + u * 2, y, u * 3, u, 255);
    }
  },
};
