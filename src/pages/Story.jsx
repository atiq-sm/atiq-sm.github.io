import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import RepoMeta from '../components/RepoMeta.jsx';
import LikertChart from '../components/LikertChart.jsx';
import { Figure, Video } from '../components/Media.jsx';
import { ProjectLinks } from '../components/ProjectCard.jsx';
import { projectHref, projectSlug } from '../lib/format.js';

// A flagship's own page at /work/<slug>/: the pitch, real footage, the facts,
// then the story in sections, the results, and who made it.
export default function Story({ project }) {
  const { story } = project;
  const next = site.projects.find((p) => projectSlug(p) === story.next);

  return (
    <>
      <Hero compact title={project.headline} lede={story.pitch} />

      <section className="block story-lead">
        <p className="label">Case study: {story.title}</p>
        {story.video ? <Video {...story.video} /> : <Figure {...story.figure} eager />}
        <dl className="facts">
          {story.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {story.sections.map((section) => (
        <Section key={section.title} title={`${section.title}.`} className="prose story">
          <div className="story-body">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.steps?.length > 0 && (
              <ol className="steps">
                {section.steps.map(([name, text]) => (
                  <li key={name}>
                    <b>{name}</b> {text}
                  </li>
                ))}
              </ol>
            )}
          </div>
          {section.figures?.length > 0 && (
            <div className="shots">
              {section.figures.map((figure) => (
                <Figure key={figure.src} {...figure} />
              ))}
            </div>
          )}
        </Section>
      ))}

      {story.results && (
        <Section
          title={`${story.results.title}.`}
          aside={<p className="lead">{story.results.lede}</p>}
        >
          <dl className="results">
            {story.results.items.map(([value, label]) => (
              <div key={value}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {story.results.chart && <LikertChart {...story.results.chart} />}
        </Section>
      )}

      <Section
        title={story.credits ? 'Credits.' : 'Links.'}
        className="prose"
        aside={
          <>
            <RepoMeta href={project.href} />
            <ProjectLinks project={project} />
            {story.evidence
              .filter((link) => link.href !== project.liveHref)
              .map((link) => (
                <p key={link.href} className="row">
                  <a className="btn" href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label} ↗
                  </a>
                </p>
              ))}
          </>
        }
      >
        {story.credits && <p>{story.credits}</p>}
        {project.tags?.length > 0 && <p className="stack">{project.tags.join(' · ')}</p>}
        <p className="row story-next">
          {next && (
            <a className="btn solid" href={projectHref(next)}>
              Next: {next.story?.title ?? next.title} →
            </a>
          )}
          <a className="btn" href="/work/">All work →</a>
        </p>
      </Section>
    </>
  );
}
