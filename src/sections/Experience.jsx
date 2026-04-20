import Reveal from '../components/Reveal.jsx';
import { site } from '../data/site.js';

export default function Experience() {
  if (!site.experience?.length) return null;

  return (
    <Reveal as="section" className="section">
      <div id="experience">
        <p className="section-title">Experience</p>
        <ol className="experience-list">
          {site.experience.map((job, i) => (
            <li key={`${job.company}-${i}`} className="experience-item">
              <div className="experience-meta">
                <span className="experience-period">{job.period}</span>
                {job.location && (
                  <span className="experience-location">{job.location}</span>
                )}
              </div>
              <div className="experience-body">
                <h3 className="experience-role">
                  {job.role}
                  <span className="experience-sep"> · </span>
                  <span className="experience-company">{job.company}</span>
                </h3>
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
      </div>
    </Reveal>
  );
}
