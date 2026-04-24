import { motion } from 'framer-motion';
import { site } from '../data/site.js';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function Hero() {
  const [firstName, ...rest] = site.name.split(' ');
  const lastName = rest.join(' ');

  return (
    <motion.section
      id="home"
      className="hero section section-hero"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-grid">
        <div className="hero-copy">
          <motion.p variants={item} className="eyebrow">
            Mixed reality systems, computer vision, and product-minded research
          </motion.p>
          <motion.h1 variants={item} className="hero-title">
            <span>{firstName}</span>
            {lastName && <span>{lastName}</span>}
          </motion.h1>
          <motion.p variants={item} className="hero-lede">
            {site.tagline}
          </motion.p>
          <motion.div variants={item} className="hero-actions">
            <a className="button" href="#projects">
              Selected work
            </a>
            <a className="button button-ghost" href="#contact">
              Let&apos;s talk
            </a>
          </motion.div>
        </div>
        <motion.aside variants={item} className="hero-panel">
          <div className="hero-panel-block">
            <p className="hero-panel-label">Currently</p>
            <p className="hero-panel-text">{site.now?.text}</p>
          </div>
          <div className="hero-panel-block hero-panel-block-divider">
            <p className="hero-panel-label">Focus</p>
            <ul className="hero-list">
              <li>Clinical XR training systems</li>
              <li>Real-time rendering + 6DOF tracking</li>
              <li>Interfaces that feel deliberate</li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
