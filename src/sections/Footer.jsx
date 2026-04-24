import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-signoff">Built to feel calm, precise, and unmistakably personal.</p>
        <p className="footer-meta">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
