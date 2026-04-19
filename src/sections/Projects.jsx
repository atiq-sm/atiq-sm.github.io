import { motion } from 'framer-motion';
import { site } from '../data/site.js';

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
          <motion.a
            key={project.title}
            variants={card}
            className="project-card"
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.tags?.length > 0 && (
              <ul className="tag-list">
                {project.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
