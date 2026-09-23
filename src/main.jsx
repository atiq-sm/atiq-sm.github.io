import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App page={document.body.dataset.page} />
  </StrictMode>
);

// Built pages arrive pre-rendered (scripts/prerender.mjs). In dev the root holds
// only the <!--app--> placeholder, a comment rather than an element.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
