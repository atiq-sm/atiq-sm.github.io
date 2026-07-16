import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-signoff">
          Built with React + Vite. Type set in Inter &amp; JetBrains Mono.
        </p>
        <p className="footer-meta">
          © {new Date().getFullYear()} {site.name} ·{' '}
          <a className="footer-top" href="#top">
            back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
