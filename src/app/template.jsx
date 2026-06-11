"use client";

import { motion } from "framer-motion";

// Re-mounts on every navigation → gives each route a clean enter animation.
export default function Template({ children }) {
  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
