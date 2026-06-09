"use client";

import { motion } from "framer-motion";

// Scroll-entry reveal: gentle heavy fade-up with blur, once.
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 18,
  className = "",
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
