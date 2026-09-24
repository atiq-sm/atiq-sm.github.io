import { useEffect, useRef } from 'react';
import { VIZ } from '../viz/index.js';
import { kit } from '../viz/kit.js';
import { Stage } from '../lib/dither.js';
import { subscribe, wake } from '../lib/ticker.js';

// Width over height of the two frames; matches .viz and .viz.large in styles.css.
const ASPECT = { card: 420 / 262, large: 16 / 9 };

// A project's dithered illustration. The frame and its labels are plain markup,
// so the pre-rendered page already has the box (a CSS dither fills it); the
// canvas is set up after hydration, animates only while it is on screen, and
// shows a single still frame to anyone who prefers reduced motion.
//
// While it animates, a scene can also be played with: it is handed the pointer
// (in scene pixels), the taps since its last frame, and a state object of its
// own, created by `scene.init()` for each frame on the page.
export default function ProjectViz({ name, large = false }) {
  const box = useRef(null);
  const canvas = useRef(null);
  const scene = VIZ[name];

  useEffect(() => {
    const el = box.current;
    if (!scene || !el) return undefined;

    // the two tones come from the stylesheet, the one place colors are set
    const root = getComputedStyle(document.documentElement);
    const tones = ['--ink', '--accent'].map((v) => root.getPropertyValue(v).trim());
    const stage = new Stage(canvas.current, tones);
    let t = scene.still;
    let size = '';
    const io = { x: 0, y: 0, inside: false, taps: [], dt: 0, state: scene.init?.() ?? {} };
    const paint = () => {
      if (!stage.w) return;
      scene.draw(kit(stage), t, io);
      io.dt = 0;
      io.taps.length = 0;
      stage.present();
    };

    // Watch the wrapper, not the canvas, and in device pixels where the browser
    // can say; re-lay out only when the size really changed (resizing clears it).
    const ro = new ResizeObserver(([entry]) => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = entry.contentRect.width * dpr;
      const cssH = entry.contentRect.height * dpr;
      // Trust the exact device size only when it agrees with CSS size x DPR:
      // emulated DPRs (devtools, test runners) report it in CSS pixels.
      const device = entry.devicePixelContentBoxSize?.[0];
      const exact = device && Math.abs(device.inlineSize - cssW) <= 1 && Math.abs(device.blockSize - cssH) <= 1;
      const dw = exact ? device.inlineSize : Math.round(cssW);
      const dh = exact ? device.blockSize : Math.round(cssH);
      if (!dw || !dh || `${dw}x${dh}` === size) return;
      size = `${dw}x${dh}`;
      stage.layout(dw, dh);
      paint();
    });
    try {
      ro.observe(el, { box: 'device-pixel-content-box' });
    } catch {
      ro.observe(el);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => ro.disconnect();
    }

    // the pointer, in scene pixels; a tap is a click, so scrolling past on a
    // phone never counts as one
    const at = (e) => {
      const rect = el.getBoundingClientRect();
      return [((e.clientX - rect.left) / rect.width) * stage.w, ((e.clientY - rect.top) / rect.height) * stage.h];
    };
    const move = (e) => {
      [io.x, io.y] = at(e);
      io.inside = true;
    };
    const leave = () => {
      io.inside = false;
    };
    const click = (e) => {
      const [x, y] = at(e);
      io.taps.push({ x, y });
      [io.x, io.y] = [x, y];
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('click', click);
    if (scene.hint) el.dataset.hint = scene.hint;

    const subscriber = {
      visible: false,
      tick(step) {
        t += step;
        io.dt = step;
        paint();
      },
    };
    const seen = new IntersectionObserver(([entry]) => {
      subscriber.visible = entry.isIntersecting;
      if (subscriber.visible) wake();
    });
    seen.observe(el);
    const unsubscribe = subscribe(subscriber);

    return () => {
      ro.disconnect();
      seen.disconnect();
      unsubscribe();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('click', click);
      delete el.dataset.hint;
    };
  }, [scene]);

  const className = large ? 'viz large' : 'viz';
  if (!scene) return <div className={className} aria-hidden="true" />;

  // A scene's labels are [text, x%, y%, 'center'?], or a function of the frame's aspect.
  const labels =
    typeof scene.labels === 'function' ? scene.labels(large ? ASPECT.large : ASPECT.card) : scene.labels;

  return (
    <div ref={box} className={className} role="img" aria-label={scene.label}>
      <canvas ref={canvas} />
      {labels.map(([text, x, y, align]) => (
        <span
          key={text}
          className={align === 'center' ? 'center' : undefined}
          style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
