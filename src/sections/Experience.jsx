import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function Experience() {
  if (!site.experience?.length) return null;

  return (
    <Reveal as="section" id="experience" className="section section-story">
      <div className="section-intro">
        <p className="section-kicker">Experience</p>
        <h2 className="section-heading">Work that ships in the real world.</h2>
        <p className="section-dek">
          Research, engineering, and product work across spatial computing,
          healthcare AI, and data systems.
        </p>
      </div>
      <ol className="experience-list">
        {site.experience.map((job, i) => (
          <li key={`${job.company}-${i}`} className="experience-item">
            <div className="experience-rail" aria-hidden="true">
              <span className="experience-dot" />
            </div>
            <div className="experience-meta">
              <span className="experience-period">{job.period}</span>
              {job.location && (
                <span className="experience-location">{job.location}</span>
              )}
            </div>
            <div className="experience-body">
              <p className="experience-index">0{i + 1}</p>
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
