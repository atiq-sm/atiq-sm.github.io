import { motion } from 'framer-motion';
import { site } from '../data/site.js';
import RepoMeta from '../components/RepoMeta.jsx';

const EASE = [0.22, 1, 0.36, 1];

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function handleSpotlightMove(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--sx', `${e.clientX - r.left}px`);
  el.style.setProperty('--sy', `${e.clientY - r.top}px`);
}

function handleSpotlightLeave(e) {
  e.currentTarget.style.setProperty('--sx', '-999px');
  e.currentTarget.style.setProperty('--sy', '-999px');
}

export default function Projects() {
  const [featured, ...rest] = site.projects;

  return (
    <section id="projects" className="section projects-section">
      <div className="section-header">
        <p className="section-title">Selected Work</p>
        <p className="section-intro">
          Systems work across mixed reality, machine learning, and tools built to
          operate under real constraints.
        </p>
      </div>
      {featured && (
        <motion.article
          className="project-feature"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="project-feature-copy">
            <p className="project-kicker">Featured project</p>
            <h3 className="project-feature-title">
              <a
                className="project-card-link"
                href={featured.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {featured.title}
              </a>
            </h3>
            <p className="project-feature-description">{featured.description}</p>
            <RepoMeta href={featured.href} />
            {featured.tags?.length > 0 && (
              <ul className="tag-list">
                {featured.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="project-feature-side">
            <div className="project-feature-panel">
              <p className="project-feature-panel-label">Outcome</p>
              <p className="project-feature-panel-text">
                Medical simulation delivered in a live clinical context with a
                focus on responsiveness, clarity, and believable spatial feedback.
              </p>
            </div>
            <div className="project-feature-links">
              <a
                className="button"
                href={featured.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                View repository
              </a>
              {featured.liveHref && (
                <a
                  className="button button-ghost"
                  href={featured.liveHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Live site
                </a>
              )}
            </div>
          </div>
        </motion.article>
      )}
      <motion.div
        className="projects-grid"
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        {rest.map((project) => (
          <motion.article
            key={project.title}
            variants={card}
            className="project-card"
            onMouseMove={handleSpotlightMove}
            onMouseLeave={handleSpotlightLeave}
          >
            <div className="project-card-head">
              <p className="project-kicker">Project</p>
              <h3>
                <a
                  className="project-card-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {project.title}
                </a>
              </h3>
            </div>
            <p>{project.description}</p>
            <RepoMeta href={project.href} />
            {project.tags?.length > 0 && (
              <ul className="tag-list">
                {project.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <div className="project-card-links">
              <a
                className="project-card-live"
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                Repository ↗
              </a>
              {project.liveHref && (
                <a
                  className="project-card-live"
                  href={project.liveHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Live ↗
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
