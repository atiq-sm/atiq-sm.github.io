import RepoMeta from './RepoMeta.jsx';
import ProjectViz from './ProjectViz.jsx';
import { projectSlug } from '../lib/format.js';

// A featured project on the homepage: illustration, title linking to its entry
// on /work/, a one-line summary, the stack and live repo stats.
export default function ProjectCard({ project }) {
  return (
    <article className="project">
      {project.viz && <ProjectViz name={project.viz} />}
      <h3>
        <a href={`/work/#${projectSlug(project)}`}>
          {project.title}
          <span aria-hidden="true"> →</span>
        </a>
      </h3>
      <p className="summary">{project.summary ?? project.description}</p>
      {project.tags?.length > 0 && <p className="stack">{project.tags.join(' · ')}</p>}
      <RepoMeta href={project.href} />
    </article>
  );
}
