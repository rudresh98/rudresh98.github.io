"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Scroll-driven vertical parallax. `speed` > 0 lags behind (moves up slower),
// negative leads. Distance is in px across the element's scroll travel.
export default function Parallax({
  children,
  speed = 60,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
