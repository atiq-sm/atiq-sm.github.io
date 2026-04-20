import { MotionConfig } from 'framer-motion';
import Nav from './components/Nav.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>
      <div id="top" />
      <Nav />
      <main id="main" className="container">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
