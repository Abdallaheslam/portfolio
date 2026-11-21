import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 inset-x-0 z-50 h-[2px] bg-slate-200/30 dark:bg-white/[0.04]"
    >
      <motion.div
        style={{ scaleX: shouldReduceMotion ? scrollYProgress : smoothProgress }}
        className="h-full w-full origin-left bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 dark:from-blue-600 dark:via-blue-400 dark:to-sky-400"
      />
    </div>
  );
}
