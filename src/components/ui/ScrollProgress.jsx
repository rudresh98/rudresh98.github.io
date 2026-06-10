"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin glowing beam pinned to the top edge, scaling with page scroll.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-beam" style={{ scaleX }} aria-hidden />;
}
