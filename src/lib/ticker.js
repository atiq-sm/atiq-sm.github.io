// One requestAnimationFrame loop for every illustration on the page, at most
// 30 frames a second. It runs only while one of them is on screen and the tab
// is visible, and hands each a clamped time step, so a scene resumes where it
// paused instead of jumping ahead.

const FRAME_MS = 1000 / 30;
const MAX_STEP = 0.1;
const subscribers = new Set();
let raf = 0;
let last = 0;
let listening = false;

function loop(now) {
  raf = 0;
  if (document.hidden) return;
  const visible = [...subscribers].filter((s) => s.visible);
  if (!visible.length) return;
  if (now - last >= FRAME_MS - 1) {
    const step = last ? Math.min(MAX_STEP, (now - last) / 1000) : 0;
    last = now;
    for (const s of visible) s.tick(step);
  }
  raf = requestAnimationFrame(loop);
}

// Start the loop if it is idle; call after a subscriber becomes visible.
export function wake() {
  if (raf || document.hidden) return;
  last = 0;
  raf = requestAnimationFrame(loop);
}

// `subscriber` is { visible: boolean, tick(stepSeconds) }. Returns unsubscribe.
export function subscribe(subscriber) {
  if (!listening) {
    document.addEventListener('visibilitychange', wake);
    listening = true;
  }
  subscribers.add(subscriber);
  wake();
  return () => subscribers.delete(subscriber);
}
