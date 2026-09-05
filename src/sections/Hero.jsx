import { motion } from 'framer-motion';
import { site } from '../data/site.js';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const SPEC = [
  {
    key: 'Status',
    live: true,
    value: 'Shipping the next MR POCUS pathology module',
  },
  { key: 'Focus', value: 'Clinical XR · real-time rendering · 6DOF tracking' },
  { key: 'Location', value: 'Portland, ME' },
  { key: 'School', value: 'MS CS · Northeastern (4.0) · May 2026' },
];

export default function Hero() {
  const parts = site.name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

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
            Mixed reality · computer vision · applied research
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
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.aside variants={item} className="spec" aria-label="Profile summary">
          <div className="spec-head">
            <span className="spec-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Profile</span>
          </div>
          {SPEC.map((row) => (
            <div className="spec-row" key={row.key}>
              <span className="spec-key">{row.key}</span>
              <span className="spec-val">
                {row.live && <span className="live-dot" aria-hidden="true" />}
                {row.value}
              </span>
            </div>
          ))}
        </motion.aside>
      </div>
    </motion.section>
  );
}
