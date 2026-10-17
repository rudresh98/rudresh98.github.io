import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { experience } from "@/lib/portfolio";
import { experienceIcons } from "@/lib/experience-icons";
import { ROUTE_WIDTH, routePath } from "@/lib/route-path";

// Decorative side-view car facing right, so a 0° heading means driving right along the road.
function CarArt() {
  return (
    <svg
      viewBox="0 0 120 56"
      className="exp-car-art"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="62" cy="50" rx="50" ry="4" className="exp-car-shadow" />
      <path
        d="M8 36 C8 28 14 24 22 23 L38 21 L52 10 C55 8 59 7 63 7 L84 7 C89 7 93 9 96 12 L106 22 C112 23 116 27 116 33 L116 38 C116 41 114 43 111 43 L11 43 C9 43 8 41 8 38 Z"
        className="exp-car-body"
      />
      <path
        d="M44 21 L55 12 C57 11 59 10 62 10 L70 10 L70 21 Z M74 10 L84 10 C88 10 91 12 93 14 L101 21 L74 21 Z"
        className="exp-car-glass"
      />
      <path
        d="M72 23 L72 40 M40 30 L48 30 M76 30 L84 30"
        className="exp-car-line"
      />
      <ellipse cx="113" cy="31" rx="3" ry="2.4" className="exp-car-headlight" />
      <rect
        x="8"
        y="29"
        width="4"
        height="5"
        rx="1.5"
        className="exp-car-taillight"
      />
      {[30, 92].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="43" r="8.5" className="exp-car-tyre" />
          <circle cx={cx} cy="43" r="3.6" className="exp-car-hub" />
        </g>
      ))}
    </svg>
  );
}

// A scroll-linked road with a car that drives to each role, after the fleet-logistics "route" pattern.
export function ExperienceRoute() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const { d, viewBoxHeight } = routePath(experience.length);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 60%", "end 75%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const arrived = useInView(trackRef, {
    once: true,
    margin: "0px 0px -22% 0px",
  });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Position and heading come from the road itself (the motion-path "autoRotate" equivalent).
  const place = useCallback(
    (value: number) => {
      const car = carRef.current;
      if (!car) return;
      const t = Math.min(Math.max(value, 0), 1);
      if (compact) {
        const lane = laneRef.current;
        if (!lane) return;
        car.style.transform = `translate(${lane.offsetLeft + lane.offsetWidth / 2}px, ${lane.offsetTop + t * lane.offsetHeight}px) translate(-50%, -50%) rotate(90deg)`;
        return;
      }
      const path = pathRef.current,
        svg = path?.ownerSVGElement;
      if (!path || !svg || typeof path.getTotalLength !== "function") return;
      const length = path.getTotalLength();
      const at = t * length;
      const ahead = at + 2 <= length;
      const p = path.getPointAtLength(ahead ? at : at - 2),
        q = path.getPointAtLength(ahead ? at + 2 : at);
      const sx = svg.clientWidth / ROUTE_WIDTH,
        sy = svg.clientHeight / viewBoxHeight;
      const point = ahead ? p : q;
      const angle =
        (Math.atan2((q.y - p.y) * sy, (q.x - p.x) * sx) * 180) / Math.PI;
      // The road fills the track (inset: 0), which is also the car's positioning context.
      // Heading left would turn the side-view car upside down, so mirror it to keep the wheels on the road.
      const mirror = Math.abs(angle) > 90 ? " scaleY(-1)" : "";
      car.style.transform = `translate(${point.x * sx}px, ${point.y * sy}px) translate(-50%, -50%) rotate(${angle}deg)${mirror}`;
    },
    [compact, viewBoxHeight],
  );

  useMotionValueEvent(progress, "change", (value) => {
    if (!reduced) place(value);
  });
  useEffect(() => {
    const settle = () => place(reduced ? 1 : progress.get());
    settle();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(settle);
    observer.observe(track);
    return () => observer.disconnect();
  }, [place, progress, reduced]);

  return (
    <section
      ref={sectionRef}
      className="exp-route"
      aria-labelledby="exp-route-heading"
    >
      <div className="exp-route-head">
        <p className="eyebrow justify-center">( The Route )</p>
        <h2 id="exp-route-heading" className="section-heading">
          Every role, one journey.
        </h2>
      </div>
      <div ref={trackRef} className="exp-track">
        <svg
          className="exp-road"
          viewBox={`0 0 ${ROUTE_WIDTH} ${viewBoxHeight}`}
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path ref={pathRef} d={d} className="exp-road-base" />
          <motion.path
            d={d}
            className="exp-road-trail"
            style={{ pathLength: reduced ? 1 : progress }}
          />
        </svg>
        <div ref={laneRef} className="exp-lane" aria-hidden="true">
          <motion.span
            className="exp-lane-trail"
            style={{ scaleY: reduced ? 1 : progress }}
          />
        </div>
        <div
          ref={carRef}
          className={`exp-car${reduced ? " is-parked" : ""}`}
          style={{ opacity: arrived || reduced ? 1 : 0 }}
          aria-hidden="true"
        >
          <CarArt />
        </div>
        <ol className="exp-waypoints">
          {experience.map((job, i) => {
            const side = i % 2 === 0 ? "right" : "left";
            const Icon = experienceIcons[job.id];
            return (
              <motion.li
                key={job.id}
                className={`exp-waypoint exp-waypoint--${side}`}
                initial={false}
                whileInView={
                  reduced
                    ? {}
                    : { opacity: [0, 1], x: [side === "right" ? 70 : -70, 0] }
                }
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="exp-card" aria-labelledby={`exp-${job.id}`}>
                  <span className="exp-node" aria-hidden="true" />
                  <p className="exp-index">
                    {String(i + 1).padStart(2, "0")} / {job.date}
                  </p>
                  <span className="exp-icon" aria-hidden="true">
                    {Icon && <Icon />}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 id={`exp-${job.id}`} className="exp-role">
                      {job.role}
                    </h2>
                    {i === 0 && (
                      <span className="exp-current">Current role</span>
                    )}
                  </div>
                  <p className="exp-company">
                    {job.company} · {job.location}
                  </p>
                  <ul className="exp-items">
                    {job.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
