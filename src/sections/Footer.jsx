import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
