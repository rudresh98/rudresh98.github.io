"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

// Island button with magnetic hover + nested "button-in-button" trailing icon.
export default function MagneticButton({
  href,
  children,
  variant = "primary", // "primary" | "ghost"
  Icon = ArrowUpRight,
  download,
  target,
  rel,
  className = "",
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18 });
  const y = useSpring(my, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.25);
    my.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-3 rounded-full font-display font-semibold text-[0.95rem] pl-6 pr-2 py-2 transition-colors duration-300 active:scale-[0.97]";
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas hover:bg-accent hover:text-accent-contrast"
      : "border border-hairline-strong text-ink hover:border-accent-line hover:text-accent";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      target={target}
      rel={rel}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`${base} ${styles} ${className}`}
    >
      <span>{children}</span>
      <span
        className={`grid size-8 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 ${
          variant === "primary"
            ? "bg-canvas/15 text-current"
            : "bg-accent-tint text-accent"
        }`}
      >
        <Icon size={16} weight="bold" />
      </span>
    </motion.a>
  );
}
