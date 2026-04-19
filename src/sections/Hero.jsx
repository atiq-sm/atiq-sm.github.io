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
  return (
    <motion.section
      className="hero"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={item}>{site.name}</motion.h1>
      <motion.p variants={item}>{site.tagline}</motion.p>
      <motion.a variants={item} className="button" href="#projects">
        See my work
      </motion.a>
    </motion.section>
  );
}
