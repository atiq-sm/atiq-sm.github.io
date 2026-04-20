import { site } from '../data/site.js';
import { useActiveSection } from '../hooks/useActiveSection.js';
import ThemeToggle from './ThemeToggle.jsx';

const SECTIONS = ['about', 'experience', 'projects', 'contact'];

export default function Nav() {
  const active = useActiveSection(SECTIONS);

  const linkProps = (id) => ({
    href: `#${id}`,
    className: active === id ? 'is-active' : undefined,
    'aria-current': active === id ? 'location' : undefined,
  });

  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#top">
          {site.name}
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
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
