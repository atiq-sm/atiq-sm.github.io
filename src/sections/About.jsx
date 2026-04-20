import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

function formatUpdated(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function About() {
  const nowUpdated = site.now?.updatedAt && formatUpdated(site.now.updatedAt);

  return (
    <Reveal as="section" className="section">
      <div id="about">
        <p className="section-title">About</p>
        <div className="about-grid">
          <div className="about-body">
            <p>{site.about}</p>
          </div>
          {site.now?.text && (
            <aside className="now-card" aria-label="What I'm working on now">
              <p className="now-label">
                Now
                {nowUpdated && (
                  <>
                    {' '}
                    <span className="now-updated">· {nowUpdated}</span>
                  </>
                )}
              </p>
              <p className="now-text">{site.now.text}</p>
            </aside>
          )}
        </div>
      </div>
    </Reveal>
  );
}
