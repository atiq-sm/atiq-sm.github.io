import { useEffect, useState } from 'react';
import { site } from '../data/site.js';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';
import CaseStudy from '../components/CaseStudy.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectFilter from '../components/ProjectFilter.jsx';

// Every project: those with case-study facts first and at full width, then
// the rest, all in data order. Filtering hides entries rather than removing them,
// so /work/#slug anchors always exist.
export default function Work() {
  const [category, setCategory] = useState('all');
  const { projects } = site;
  const studies = projects.filter((p) => p.facts?.length);
  const rest = projects.filter((p) => !studies.includes(p));

  const options = [{ key: 'all', label: 'All', count: projects.length }];
  for (const p of projects) {
    const option = options.find((o) => o.key === p.category);
    if (option) option.count += 1;
    else options.push({ key: p.category, label: p.category, count: 1 });
  }
  const isShown = (p) => category === 'all' || p.category === category;

  // A link to #slug while a filter hides that entry: show everything, then go there.
  useEffect(() => {
    const reveal = () => {
      let id = location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {} // a malformed hash is just an id that matches nothing
      const target = id ? document.getElementById(id) : null;
      if (!target?.closest('[hidden]')) return;
      setCategory('all');
      requestAnimationFrame(() => target.scrollIntoView());
    };
    addEventListener('hashchange', reveal);
    return () => removeEventListener('hashchange', reveal);
  }, []);

  return (
    <>
      <Hero
        compact
        title="Things I've built."
        lede={`Mixed reality, applied AI, games, systems and the web: ${projects.length} projects, most with their code a click away.`}
      />
      <ProjectFilter
        options={options}
        active={category}
        shown={projects.filter(isShown).length}
        onChange={setCategory}
      />
      {studies.map((project) => (
        <CaseStudy key={project.title} project={project} hidden={!isShown(project)} />
      ))}
      <Section className="entries-block" aria-label="All projects">
        <div className="entries">
          {rest.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={projects.indexOf(project) + 1}
              full
              hidden={!isShown(project)}
            />
          ))}
        </div>
      </Section>
    </>
  );
}
