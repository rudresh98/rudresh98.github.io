import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotionConfig,
  useScroll,
  useSpring,
} from "motion/react";
import { experience } from "@/lib/portfolio";
import { experienceIcons } from "@/lib/experience-icons";
import { ROUTE_WIDTH, routePath } from "@/lib/route-path";

// Decorative side-view Mustang-style fastback facing right (long hood leading), so a 0° heading
// means driving right along the road.
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
        d="M6 38 L6 31 C6 27 6 24 5 21.5 L14 21.5 L44 10.6 C45.5 10 47 9.6 49 9.6 L62 9.6 C64 9.6 65.5 10.4 67 12 L76 21 L87 21.4 C89 20.2 95 20.2 97 21.7 L108 23 C112 23.4 115 25 116 27.5 L117 30 L116.5 38.5 C116.5 40.8 115 42 112.5 42 L104.5 42 A10.5 10.5 0 0 0 83.5 42 L38.5 42 A10.5 10.5 0 0 0 17.5 42 L9 42 C7 42 6 40.5 6 38 Z"
        className="exp-car-body"
      />
      <path
        d="M56 12.4 L64 12.4 C65 12.4 65.8 12.9 66.5 13.6 L73 20.3 L56 20.3 Z M53 12 L53 20.3 L33 20.3 L46.5 13 C48.4 12.2 50.5 12 53 12 Z M41 33 L50 29.5 L50 34 Z"
        className="exp-car-glass"
      />
      <path d="M54.5 22.5 V35.5 M18 27 L108 25.8" className="exp-car-line" />
      <rect
        x="40"
        y="36.4"
        width="42"
        height="1.8"
        className="exp-car-stripe"
      />
      <rect x="40" y="39" width="42" height="1.1" className="exp-car-stripe" />
      <path
        d="M115.6 29.4 L117 30 L116.7 35.5 L115 35.5 Z"
        className="exp-car-grille"
      />
      <ellipse
        cx="114.3"
        cy="27.6"
        rx="2.2"
        ry="1.8"
        className="exp-car-headlight"
      />
      {[24.4, 26.6, 28.8].map((y) => (
        <rect
          key={y}
          x="5.2"
          y={y}
          width="3"
          height="1.5"
          rx="0.6"
          className="exp-car-taillight"
        />
      ))}
      {[28, 94].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="43" r="8.5" className="exp-car-tyre" />
          <circle cx={cx} cy="43" r="5.2" className="exp-car-hub" />
          <circle cx={cx} cy="43" r="1.8" className="exp-car-tyre" />
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
  const reduced = useReducedMotionConfig();
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
