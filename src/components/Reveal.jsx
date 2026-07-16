import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  delay = 0,
  y = 8,
  duration = 0.5,
  className,
  as = 'div',
  ...props
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
