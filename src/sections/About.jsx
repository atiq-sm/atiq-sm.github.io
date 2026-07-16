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
    <Reveal as="section" id="about" className="section section-about">
      <div className="section-head">
        <span className="section-head-index">01</span>
        <span className="section-head-label">about</span>
        <span className="section-head-rule" aria-hidden="true" />
      </div>

      <div className="about-layout">
        <div className="about-body">
          <h2 className="section-title">
            Research-led engineering, biased toward real-time systems that have
            to hold up in the world.
          </h2>
          <p className="about-copy" style={{ marginTop: '1.4rem' }}>
            {site.about}
          </p>
          <p className="about-caption">
            The through-line is deliberate software: technically rigorous under
            the hood, calm and useful on the surface.
          </p>
        </div>

        <aside className="about-sidebar">
          {site.now?.text && (
            <div className="note-card" aria-label="What I'm working on now">
              <p className="note-card-label">
                <span>now</span>
                {nowUpdated && (
                  <span className="note-card-stamp">{nowUpdated}</span>
                )}
              </p>
              <p className="note-card-text">{site.now.text}</p>
            </div>
          )}

          <div className="note-card">
            <p className="note-card-label">
              <span>approach</span>
            </p>
            <p className="note-card-text">
              I care most about work where systems thinking, interface craft,
              and measurable usefulness all matter at the same time.
            </p>
          </div>
        </aside>
      </div>
    </Reveal>
  );
}
