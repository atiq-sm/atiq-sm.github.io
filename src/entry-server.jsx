import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App, { PAGES } from './App.jsx';

export { PAGES };

// Build-time only: scripts/prerender.mjs writes this markup into each built
// HTML file, and src/main.jsx hydrates it in the browser.
export function render(page) {
  return renderToString(
    <StrictMode>
      <App page={page} />
    </StrictMode>,
  );
}
