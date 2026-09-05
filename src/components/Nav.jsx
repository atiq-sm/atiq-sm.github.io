import { site } from '../data/site.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import ThemeToggle from './ThemeToggle.jsx';

const SECTIONS = ['about', 'experience', 'projects', 'contact'];

function brandName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export default function Nav() {
  const active = useActiveSection(SECTIONS);

  const linkProps = (id) => ({
    href: `#${id}`,
    className: active === id ? 'nav-link is-active' : 'nav-link',
    'aria-current': active === id ? 'location' : undefined,
  });

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#top" aria-label={`${site.name} home`}>
          <span className="nav-brand-mark" aria-hidden="true">A</span>
          <span className="nav-brand-copy">
            <span className="nav-brand-name">{brandName(site.name)}</span>
            <span className="nav-brand-subtitle">/ XR · CS</span>
          </span>
        </a>

        <div className="nav-cluster">
          <nav aria-label="Primary">
            <ul className="nav-links">
              <li><a {...linkProps('about')}>About</a></li>
              <li><a {...linkProps('experience')}>Experience</a></li>
              <li><a {...linkProps('projects')}>Projects</a></li>
              <li><a {...linkProps('contact')}>Contact</a></li>
            </ul>
          </nav>

          <span className="nav-divider" aria-hidden="true" />

          <button
            type="button"
            className="cmdk-trigger"
            onClick={() => window.dispatchEvent(new CustomEvent('cmdk:open'))}
            aria-label="Open command menu"
          >
            <span className="cmdk-trigger-label">Menu</span>
            <kbd>⌘K</kbd>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
