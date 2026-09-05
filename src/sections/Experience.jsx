import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function Experience() {
  if (!site.experience?.length) return null;

  return (
    <Reveal as="section" id="experience" className="section section-experience">
      <div className="section-head">
        <span className="section-head-index">02</span>
        <span className="section-head-label">Experience</span>
        <span className="section-head-rule" aria-hidden="true" />
      </div>

      <h2 className="section-title">Work that ships in the real world.</h2>
      <p className="section-dek">
        Research, engineering, and product work across spatial computing,
        healthcare AI, and data systems.
      </p>

      <ol className="experience-list" style={{ marginTop: '2.2rem' }}>
        {site.experience.map((job, i) => (
          <li key={`${job.company}-${i}`} className="experience-item">
            <div className="experience-meta">
              <span className="experience-period">{job.period}</span>
              {job.location && (
                <span className="experience-location">{job.location}</span>
              )}
            </div>
            <div className="experience-body">
              <p className="experience-index">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="experience-role">{job.role}</h3>
              <p className="experience-company">{job.company}</p>
              {job.bullets?.length > 0 && (
                <ul className="experience-bullets">
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
