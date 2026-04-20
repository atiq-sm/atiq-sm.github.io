import { useRef } from 'react';
import { useThemeCtx } from '../contexts/ThemeContext.js';

const LABELS = {
  light: 'Light theme — click for dark',
  dark: 'Dark theme — click for system',
  system: 'System theme — click for light',
};

function Icon({ mode }) {
  if (mode === 'light') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
        <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M12 3v2" />
          <path d="M12 19v2" />
          <path d="M3 12h2" />
          <path d="M19 12h2" />
          <path d="M5.6 5.6l1.4 1.4" />
          <path d="M17 17l1.4 1.4" />
          <path d="M5.6 18.4l1.4-1.4" />
          <path d="M17 7l1.4-1.4" />
        </g>
      </svg>
    );
  }
  if (mode === 'dark') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 4a8 8 0 0 1 0 16V4Z" fill="currentColor" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { mode, cycleWithTransition } = useThemeCtx();
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={() => cycleWithTransition(ref.current)}
      aria-label={LABELS[mode]}
      title={LABELS[mode]}
    >
      <Icon mode={mode} />
    </button>
  );
}
