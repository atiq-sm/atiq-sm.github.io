import Section from './Section.jsx';
import ProjectViz from './ProjectViz.jsx';
import RepoMeta from './RepoMeta.jsx';
import { ProjectLinks } from './ProjectCard.jsx';
import { projectSlug } from '../lib/format.js';

// A case study at full width: the illustration as a stage on eight
// columns, the facts as a feed on the other four.
export default function CaseStudy({ project, hidden = false }) {
  return (
    <Section
      id={projectSlug(project)}
      className="case"
      hidden={hidden || undefined}
      title={project.headline ?? project.title}
      aside={
        <>
          <p className="label">{project.title}</p>
          <p className="lead">{project.summary ?? project.description}</p>
          <RepoMeta href={project.href} />
          <ProjectLinks project={project} />
        </>
      }
    >
      <div className="stage g12">
        <ProjectViz name={project.viz} large />
        <dl className="feed">
          {project.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
