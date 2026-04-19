import { MotionConfig } from 'framer-motion';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="container">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
