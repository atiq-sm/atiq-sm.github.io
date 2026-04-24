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
      <div className="section-shell">
        <div className="section-heading">
          <p className="section-title">About</p>
          <h2 className="section-kicker">
            Research-led engineering with a bias toward real-time systems that
            have to hold up in the world.
          </h2>
        </div>

        <div className="about-layout">
          <div className="about-body">
            <p className="about-copy">{site.about}</p>
            <p className="about-caption">
              The through-line is deliberate software: technically rigorous
              under the hood, calm and useful on the surface.
            </p>
          </div>

          <aside className="about-sidebar">
            {site.now?.text && (
              <div className="editorial-card now-card" aria-label="What I'm working on now">
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
              </div>
            )}

            <div className="editorial-card about-note">
              <p className="about-note-label">Approach</p>
              <p className="about-note-text">
                I care most about work where systems thinking, interface craft,
                and measurable usefulness all matter at the same time.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Reveal>
  );
}
