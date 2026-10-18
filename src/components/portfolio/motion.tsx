import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotionConfig } from "motion/react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotionConfig();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { opacity: [0, 1], y: [16, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function Counter({
  value,
  suffix = "",
  format = "full",
}: {
  value: number;
  suffix?: string;
  format?: "full" | "compact";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotionConfig();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!visible || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1000, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, value]);
  const show = (n: number) =>
    format === "compact"
      ? new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(n)
      : n.toLocaleString("en-US");
  return (
    <span ref={ref}>
      <span className="sr-only">
        {value.toLocaleString("en-US")}
        {suffix}
      </span>
      <span aria-hidden="true">
        {show(display)}
        <span className="text-primary">{suffix}</span>
      </span>
    </span>
  );
}
