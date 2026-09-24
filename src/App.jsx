import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import About from './pages/About.jsx';
import Story from './pages/Story.jsx';
import NotFound from './pages/NotFound.jsx';
import { site } from './data/site.js';
import { projectSlug } from './lib/format.js';

// Each project with a story has a page, keyed by its slug (work/<slug>/index.html).
const STORIES = Object.fromEntries(
  site.projects
    .filter((project) => project.story)
    .map((project) => [projectSlug(project), () => <Story project={project} />]),
);

// One entry for every HTML file: each sets <body data-page> to a key here.
export const PAGES = { home: Home, work: Work, about: About, notfound: NotFound, ...STORIES };

export default function App({ page }) {
  const Page = PAGES[page] ?? NotFound;
  // a story page sits under Work in the top bar
  return (
    <Layout page={page in STORIES ? 'work' : page}>
      <Page />
    </Layout>
  );
}
