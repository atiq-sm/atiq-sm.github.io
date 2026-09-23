import { site } from '../data/site.js';

const NAV = [
  { page: 'work', href: '/work/', label: 'Work' },
  { page: 'about', href: '/about/', label: 'About' },
];

function brandName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

// The same pixel "A" as the favicon, drawn on the lime tile.
function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect className="mark-tile" width="32" height="32" />
      <path className="mark-glyph" d="M11 6h10v5H11zM6 11h5v15H6zM21 11h5v15h-5zM11 17h10v4H11z" />
    </svg>
  );
}

// One bar, identical on every page. The current page comes from the `page`
// prop, never from `location`, so the pre-rendered markup is the same.
export default function TopBar({ page }) {
  return (
    <header className="bar-top">
      <a className="brand" href="/">
        <Mark />
        <span>{brandName(site.name)}</span>
      </a>
      <nav aria-label="Primary">
        {NAV.map((item) => (
          <a
            key={item.page}
            href={item.href}
            aria-current={page === item.page ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
      {site.status && (
        <a className="tag" href={site.status.href}>
          <i className="dot live" aria-hidden="true" />
          {site.status.label}
        </a>
      )}
      <a className="btn" href={site.links.github} target="_blank" rel="noreferrer noopener">
        GitHub
      </a>
      <a className="btn solid" href="#contact">
        Get in touch
      </a>
    </header>
  );
}
