'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Reference hero load animation: children reveal top-to-bottom with a
 * fade + 15px rise + blur-to-sharp, staggered.
 */
export default function HeroReveal({ index, children }: { index: number; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
}
