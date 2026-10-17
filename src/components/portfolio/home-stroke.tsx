import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "motion/react";
import {
  LINE_PATH_D,
  LINE_PATH_HEIGHT,
  LINE_PATH_WIDTH,
  LinePath,
} from "@/components/ui/skiper-ui/skiper19";
import { stretchPath, strokeFractionAbove } from "@/lib/stroke-path";

// Skiper19's curl sits above PIVOT and its sweep ends at END (viewBox units).
const PIVOT = 520;
const END = 2668.89;

// Decorative Skiper19 stroke behind the whole Home page: the curl keeps its shape in the hero, the sweep
// stretches to the bottom of the page, and scrolling draws it down to the end.
export function HomeStroke() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Page height in viewBox units; starts at the original size for the server render.
  const [target, setTarget] = useState(END);
  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    const measure = () => {
      const width = layer.querySelector("svg")?.getBoundingClientRect().width;
      if (width)
        setTarget(Math.round((layer.clientHeight * LINE_PATH_WIDTH) / width));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);
  const d = useMemo(
    () => stretchPath(LINE_PATH_D, PIVOT, END, target),
    [target],
  );
  // The curl is in view on load, so start with it drawn and let scrolling draw the sweep.
  const start = useMemo(() => strokeFractionAbove(d, PIVOT), [d]);

  return (
    <div ref={ref} className="home-stroke" aria-hidden="true">
      <LinePath
        className="home-stroke-path"
        scrollYProgress={scrollYProgress}
        d={d}
        height={target > END ? target : LINE_PATH_HEIGHT}
        range={[start, 1]}
        reduced={!!reduced}
      />
    </div>
  );
}
