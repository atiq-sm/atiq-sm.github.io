import { site } from '../data/site.js';

export default function Projects() {
  return (
    <section id="projects" className="section">
      <p className="section-title">Projects</p>
      <div className="projects-grid">
        {site.projects.map((project) => (
          <a
            key={project.title}
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
          </a>
        ))}
      </div>
    </section>
  );
}
