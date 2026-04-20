import { MotionConfig } from 'framer-motion';
import { ThemeContext } from './contexts/ThemeContext.js';
import { useTheme } from './hooks/useTheme.js';
import Nav from './components/Nav.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Experience from './sections/Experience.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  const theme = useTheme();
  return (
    <ThemeContext.Provider value={theme}>
      <MotionConfig reducedMotion="user">
        <a href="#main" className="skip-link">Skip to content</a>
        <div id="top" />
        <Nav />
        <CommandPalette />
        <main id="main" className="container">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </ThemeContext.Provider>
  );
}
