import { site } from '../data/site.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import ThemeToggle from './ThemeToggle.jsx';

const SECTIONS = ['about', 'experience', 'projects', 'contact'];

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
            <span className="nav-brand-name">{site.name}</span>
            <span className="nav-brand-subtitle">XR developer · CS researcher</span>
          </span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li>
              <a {...linkProps('about')}>About</a>
            </li>
            <li>
              <a {...linkProps('experience')}>Experience</a>
            </li>
            <li>
              <a {...linkProps('projects')}>Projects</a>
            </li>
            <li>
              <a {...linkProps('contact')}>Contact</a>
            </li>
            <li className="nav-theme-item">
              <ThemeToggle />
            </li>
            <li className="cmdk-trigger-hint" aria-hidden="true">
              <span>Command menu</span>
              <kbd>⌘</kbd><kbd>K</kbd>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
