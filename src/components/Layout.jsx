import TopBar from './TopBar.jsx';
import Band from './Band.jsx';
import Footer from './Footer.jsx';

export default function Layout({ page, children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <TopBar page={page} />
      <main id="main">
        {children}
        <Band />
      </main>
      <Footer />
    </>
  );
}
