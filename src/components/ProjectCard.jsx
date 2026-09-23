import RepoMeta from './RepoMeta.jsx';
import ProjectViz from './ProjectViz.jsx';
import { parseGithubRepo } from '../hooks/useGithubRepo.js';
import { projectSlug } from '../lib/format.js';

// "Repository" only when the link is a repo (a few still point at the
// profile until their URLs are confirmed), and "Live" (or `liveLabel`) when
// there is one.
export function ProjectLinks({ project }) {
  const isRepo = Boolean(parseGithubRepo(project.href)) || !/github\.com/i.test(project.href ?? '');
  if (!isRepo && !project.liveHref) return null;
  return (
    <p className="row">
      {isRepo && project.href && (
        <a className="btn" href={project.href} target="_blank" rel="noreferrer noopener">
          Repository ↗
        </a>
      )}
      {project.liveHref && (
        <a className="btn" href={project.liveHref} target="_blank" rel="noreferrer noopener">
          {project.liveLabel ?? 'Live'} ↗
        </a>
      )}
    </p>
  );
}

// A project as a card. On the homepage (default) it is a featured teaser that
// links to its entry on /work/; with `full` it is that entry, with the whole
// write-up, its number and category, and its links.
export default function ProjectCard({ project, index, full = false, hidden = false }) {
  const slug = projectSlug(project);

  if (full) {
    return (
      <article className="project entry" id={slug} hidden={hidden || undefined}>
        <p className="label">
          <span className="num">{String(index).padStart(2, '0')}</span> {project.category}
        </p>
        <h3>{project.title}</h3>
        <p className="description">{project.description}</p>
        {project.tags?.length > 0 && <p className="stack">{project.tags.join(' · ')}</p>}
        <RepoMeta href={project.href} />
        <ProjectLinks project={project} />
      </article>
    );
  }

  return (
    <article className="project">
      {project.viz && <ProjectViz name={project.viz} />}
      <h3>
        <a href={`/work/#${slug}`}>
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
