import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';
const ORDER = ['light', 'dark', 'system'];

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

function persist(mode) {
  try {
    if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch {}
}

export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
}

function nextMode(m) {
  return ORDER[(ORDER.indexOf(m) + 1) % ORDER.length];
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useTheme() {
  const [mode, setMode] = useState(readStored);

  useEffect(() => {
    applyTheme(mode);
    persist(mode);
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((m) => nextMode(m));
  }, []);

  // cycleWithTransition: circular reveal from button origin if View
  // Transitions are supported and motion is okay; falls back to cycle().
  const cycleWithTransition = useCallback(
    (originEl) => {
      const next = nextMode(mode);

      if (!document.startViewTransition || prefersReducedMotion()) {
        setMode(next);
        return;
      }

      if (originEl) {
        const r = originEl.getBoundingClientRect();
        document.documentElement.style.setProperty(
          '--vt-x',
          `${r.left + r.width / 2}px`,
        );
        document.documentElement.style.setProperty(
          '--vt-y',
          `${r.top + r.height / 2}px`,
        );
      }

      document.startViewTransition(() => {
        applyTheme(next);
        persist(next);
      });

      setMode(next);
    },
    [mode],
  );

  return { mode, setMode, cycle, cycleWithTransition };
}
