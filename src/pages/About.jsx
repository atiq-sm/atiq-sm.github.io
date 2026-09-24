import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import Timeline from '../components/Timeline.jsx';
import { formatDate } from '../lib/format.js';

export default function About() {
  const roles = site.experience.filter((job) => job.kind === 'work');
  const schools = site.experience.filter((job) => job.kind === 'education');
  const updated = formatDate(site.now?.updatedAt);
  const { email, github, linkedin } = site.links;

  return (
    <>
      <Hero title="Software that meets the physical world." />

      <Section className="prose">
        <div className="beats">
          {site.about.beats.map((beat) => (
            <p key={beat} className="big">{beat}</p>
          ))}
        </div>
        <p>{site.about.closing}</p>
      </Section>

      <Section
        id="now"
        className="prose"
        title="Now."
        aside={
          <>
            <p className="big">{site.now.text}</p>
            {updated && <time dateTime={site.now.updatedAt}>Updated {updated}</time>}
          </>
        }
      >
        <dl className="credits">
          <div>
            <dt>Focus</dt>
            <dd>{site.focus}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>{site.approach}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{site.location}</dd>
          </div>
          <div>
            <dt>Elsewhere</dt>
            <dd>
              <a href={github} target="_blank" rel="noreferrer noopener">GitHub</a>,{' '}
              <a href={linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>,{' '}
              <a href={`mailto:${email}`}>email</a>
            </dd>
          </div>
        </dl>
      </Section>

      <Section id="experience" title="Experience.">
        <Timeline items={roles} detailed />
      </Section>

      <Section id="education" title="Education.">
        <Timeline items={schools} detailed />
      </Section>
    </>
  );
}
