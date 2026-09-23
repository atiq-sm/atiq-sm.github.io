import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// One entry for every HTML file: each sets <body data-page> to a key here.
export const PAGES = { home: Home, work: Work, about: About, notfound: NotFound };

export default function App({ page }) {
  const Page = PAGES[page] ?? NotFound;
  return (
    <Layout page={page}>
      <Page />
    </Layout>
  );
}
