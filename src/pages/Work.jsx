import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import CaseStudy from '../components/CaseStudy.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { parseGithubRepo } from '../hooks/useGithubRepo.js';
import { projectSlug } from '../lib/format.js';

// The work in three tiers, each in data order: the flagships at full width,
// then the other full entries, then the archive as one line each.
export default function Work() {
  const tier = (name) => site.projects.filter((p) => p.tier === name);

  return (
    <>
      <Hero
        compact
        title="Selected work."
        lede="Two mixed-reality products, an agent pipeline, a kernel and a physics engine written from scratch, and the experiments around them."
      />
      {tier('flagship').map((project) => (
        <CaseStudy key={project.title} project={project} />
      ))}
      <Section title="More work.">
        <div className="entries">
          {tier('more').map((project) => (
            <ProjectCard key={project.title} project={project} full />
          ))}
        </div>
      </Section>
      <Section
        title="Archive."
        aside={<p className="lead">Earlier and smaller projects, from coursework to challenges.</p>}
      >
        <ul className="archive">
          {tier('archive').map((project) => (
            <li key={project.title} id={projectSlug(project)}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {parseGithubRepo(project.href) && (
                <a href={project.href} target="_blank" rel="noreferrer noopener">
                  Repository ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
