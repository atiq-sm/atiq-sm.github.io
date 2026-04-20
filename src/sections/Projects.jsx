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

export default function Projects() {
  return (
    <section id="projects" className="section">
      <p className="section-title">Projects</p>
      <motion.div
        className="projects-grid"
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {site.projects.map((project) => (
          <motion.article
            key={project.title}
            variants={card}
            className="project-card"
          >
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
            {project.liveHref && (
              <a
                className="project-card-live"
                href={project.liveHref}
                target="_blank"
                rel="noreferrer noopener"
              >
                Live site ↗
              </a>
            )}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
