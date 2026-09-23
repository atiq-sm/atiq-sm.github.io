import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import Section from '../components/Section.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Timeline from '../components/Timeline.jsx';

// The overview: everything longer lives on /work/ and /about/.
export default function Home() {
  const featured = site.projects.filter((p) => p.featured);
  const roles = site.experience.filter((job) => job.kind === 'work');

  return (
    <>
      <Hero
        title="Real-time systems that ship."
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
              From clinical mixed reality to a game that runs with no operating
              system at all.
            </p>
            <a className="btn" href="/work/">All {site.projects.length} projects →</a>
          </>
        }
      >
        <div className="featured">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        <p className="fine">The animations are illustrations, not recordings.</p>
      </Section>

      <Section
        title="Experience."
        aside={
          <>
            <p className="lead">
              Research, engineering, and product work across spatial computing,
              healthcare AI, and data systems.
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
