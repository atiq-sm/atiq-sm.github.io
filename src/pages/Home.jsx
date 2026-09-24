import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import Section from '../components/Section.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Timeline from '../components/Timeline.jsx';

// The overview: everything longer lives on /work/ and /about/.
export default function Home() {
  const featured = site.projects.filter((p) => p.tier === 'flagship');
  const roles = site.experience.filter((job) => job.kind === 'work');

  return (
    <>
      <Hero
        title="Mixed reality that works in real rooms."
        lede={site.intro.lede}
        fine={site.intro.fine}
        actions={
          <>
            <a className="btn solid" href="/work/">See the work</a>
            <a className="btn" href="/about/">About me</a>
          </>
        }
      >
        <Stats items={site.stats} />
      </Hero>

      <Section
        title="Selected work."
        aside={
          <>
            <p className="lead">
              Two mixed-reality products, an agent pipeline, and the systems
              work underneath: a kernel and a physics engine from scratch.
            </p>
            <a className="btn" href="/work/">All work →</a>
          </>
        }
      >
        <div className="featured">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        <p className="fine">Illustrations; the case studies have real footage.</p>
      </Section>

      <Section
        title="Experience."
        aside={
          <>
            <p className="lead">
              From data engineering at Capgemini to mixed reality at the Roux
              Institute, and now CardAlive.
            </p>
            <a className="btn" href="/about/#experience">Full history →</a>
          </>
        }
      >
        <Timeline items={roles} />
      </Section>
    </>
  );
}
