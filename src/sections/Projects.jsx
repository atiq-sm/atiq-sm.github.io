import { motion } from 'framer-motion';
import { site } from '../data/site.js';
import RepoMeta from '../components/RepoMeta.jsx';

const EASE = [0.22, 1, 0.36, 1];

const grid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const card = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Projects() {
  const [featured, ...rest] = site.projects;

  return (
    <section id="projects" className="section projects-section">
      <div className="section-head">
        <span className="section-head-index">03</span>
        <span className="section-head-label">selected work</span>
        <span className="section-head-rule" aria-hidden="true" />
        <span className="section-head-note">{site.projects.length} projects</span>
      </div>

      {featured && (
        <motion.article
          className="project-feature"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="project-feature-copy">
            <p className="project-feature-tag">featured</p>
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
              <p className="label label-accent">outcome</p>
              <p className="project-feature-panel-text">
                Medical simulation delivered in a live clinical context — tuned
                for responsiveness, clarity, and believable spatial feedback.
              </p>
            </div>
            <div className="project-feature-links">
              <a
                className="button"
                href={featured.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                repository ↗
              </a>
              {featured.liveHref && (
                <a
                  className="button button-ghost"
                  href={featured.liveHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  live ↗
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
        viewport={{ once: true, amount: 0.1 }}
      >
        {rest.map((project, i) => (
          <motion.article
            key={project.title}
            variants={card}
            className="project-card"
          >
            <div className="project-card-head">
              <span className="project-index">
                {String(i + 1).padStart(2, '0')}
              </span>
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
            <div className="project-card-foot">
              <a
                className="project-card-link-out"
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                repository ↗
              </a>
              {project.liveHref && (
                <a
                  className="project-card-link-out"
                  href={project.liveHref}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  live ↗
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
