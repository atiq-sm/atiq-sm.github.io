import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  delay = 0,
  y = 14,
  duration = 0.7,
  className,
  as = 'div',
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
