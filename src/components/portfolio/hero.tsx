import { useState, type CSSProperties } from "react";
import { createLink } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import portrait from "@/assets/rudresh-oza.png";
import resume from "@/assets/rudresh-oza-resume.pdf";
import { achievements, heroCredentials, profile } from "@/lib/portfolio";
import { heroSystem, type HeroPanel } from "@/lib/portfolio-visuals";
import { Counter } from "./motion";
import { SocialLinks } from "./shell";

// Router-aware LineHoverLink keeps type-safe navigation and preloading for the scribble CTA.
const ScribbleLink = createLink(LineHoverLink);

// Entrance motion lives in CSS so it runs from the first prerendered paint; Motion only drives interaction.
export function Hero() {
  return (
    <section className="hero-x" aria-labelledby="hero-title">
      <div className="hero-x-stage">
        <div className="hero-x-copy">
          <h1 id="hero-title" className="hero-x-title hero-x-fade">
            Forward Deployed Engineer{" "}
            <span className="hero-x-muted">
              building GenAI agents, apps and cloud platforms
            </span>
          </h1>
          <p className="hero-x-description hero-x-fade">
            I work inside client teams, from the first conversation to
            production: freelance AI supply chain solutions today, and before
            that transfer and split for Anchor&rsquo;s booking platform, used by{" "}
            {achievements.clients.toLocaleString("en-US")}+ clients
          </p>
          <div className="hero-x-actions hero-x-fade">
            <Button asChild className="hero-x-cta h-12 px-6 shadow-none">
              <ScribbleLink to="/projects" variant="scribble">
                Explore my work <ArrowUpRight />
              </ScribbleLink>
            </Button>
            <Button
              asChild
              variant="outline"
              className="hero-x-cta h-12 px-6 shadow-none"
            >
              <a href={resume} download="Rudresh-Oza-Resume.pdf">
                Download resume <ArrowDown />
              </a>
            </Button>
          </div>
          <div className="hero-x-status hero-x-fade">
            <img
              src={portrait}
              alt="Rudresh Oza"
              width={36}
              height={36}
              decoding="async"
            />
            <div className="hero-x-status-text">
              <p className="hero-x-available">
                <span className="hero-x-dot" aria-hidden="true" />
                {profile.availability}
              </p>
              <p className="hero-x-location">
                <MapPin size={12} aria-hidden="true" />
                {profile.location} · {profile.timezone}
              </p>
            </div>
            <SocialLinks />
          </div>
        </div>
        <HeroSystem />
      </div>
      <ul className="hero-x-strip" aria-label="Professional highlights">
        {heroCredentials.map((fact) => (
          <li className="hero-x-fact" key={fact.label}>
            <p className="hero-x-fact-context">{fact.context}</p>
            <p className="hero-x-fact-value">
              <Counter
                value={fact.value}
                suffix={fact.suffix}
                suffixClassName="text-muted-foreground"
                format={fact.format ?? "full"}
              />
            </p>
            <p className="hero-x-fact-label">{fact.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const icons = { code: Code2, cloud: Cloud, bot: Bot, activity: Activity };
const traceHeights = [45, 70, 52, 88, 64, 100];
const percent = (value: number, total: number) => `${(value / total) * 100}%`;
// Leave the panel horizontally, round one corner, then run vertically into the hub.
function edgePath({ anchor: a, hubAnchor: h }: HeroPanel) {
  const dx = Math.sign(h.x - a.x),
    dy = Math.sign(h.y - a.y),
    r = 10;
  return `M${a.x} ${a.y}H${h.x - dx * r}Q${h.x} ${a.y} ${h.x} ${a.y + dy * r}V${h.y}`;
}

function PanelDetail({ kind }: { kind: HeroPanel["detail"] }) {
  if (kind === "request")
    return (
      <span className="hero-detail" aria-hidden="true">
        <span className="hero-detail-bar">
          <i />
          <i />
          <i />
        </span>
        UI · API · DB
      </span>
    );
  if (kind === "queue")
    return (
      <span className="hero-detail" aria-hidden="true">
        <span className="hero-detail-queue">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        Async messaging
      </span>
    );
  if (kind === "steps")
    return (
      <span className="hero-detail" aria-hidden="true">
        Plan <ArrowUpRight size={9} /> Tool <ArrowUpRight size={9} /> Memory
      </span>
    );
  return (
    <span className="hero-detail" aria-hidden="true">
      <span className="hero-detail-trace">
        {traceHeights.map((height, i) => (
          <i key={i} style={{ height: `${height}%` }} />
        ))}
      </span>
      Traces
    </span>
  );
}

export function HeroSystem() {
  const { width, height, hub, panels } = heroSystem;
  const [activeId, setActiveId] = useState(panels[0].id);
  const active = panels.find((panel) => panel.id === activeId) ?? panels[0];
  const reduced = useReducedMotionConfig();
  const hubStyle = {
    "--x": percent(hub.x, width),
    "--y": percent(hub.y, height),
    "--w": percent(hub.width, width),
    "--h": percent(hub.height, height),
  } as CSSProperties;

  return (
    <figure
      className="hero-map"
      aria-labelledby="hero-map-title"
      aria-describedby="hero-map-note"
    >
      <div className="hero-map-head">
        <span id="hero-map-title">Fig. 01 — Engineering system</span>
        <span>Illustrative map</span>
      </div>
      <p id="hero-map-note" className="sr-only">
        Illustrative system map, not a production screenshot.
      </p>
      <div className="hero-map-canvas">
        <div className="hero-map-grid" aria-hidden="true" />
        <div className="hero-map-layer">
          <svg
            className="hero-map-edges"
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
          >
            <path
              className="hero-baseline"
              d={`M0 ${hub.y + hub.height / 2}H${width}`}
            />
            {panels.map((panel) => (
              <path
                key={panel.id}
                className={`hero-edge ${panel.id === activeId ? "is-active" : ""}`}
                pathLength={1}
                d={edgePath(panel)}
              />
            ))}
            {panels
              .flatMap((panel) => [panel.anchor, panel.hubAnchor])
              .map((point) => (
                <circle
                  key={`${point.x}-${point.y}`}
                  className="hero-port"
                  cx={point.x}
                  cy={point.y}
                  r={3}
                />
              ))}
          </svg>
          <div className="hero-hub" style={hubStyle}>
            <strong>
              <i aria-hidden="true" />
              {hub.label}
            </strong>
            <span>{hub.detail}</span>
          </div>
          {panels.map((panel, i) => {
            const Icon = icons[panel.icon];
            const slot = {
              "--x": percent(panel.x, width),
              "--y": percent(panel.y, height),
              "--w": percent(panel.width, width),
              "--i": i,
            } as CSSProperties;
            return (
              <div key={panel.id} className="hero-node-slot" style={slot}>
                <button
                  type="button"
                  className="hero-node"
                  aria-pressed={panel.id === activeId}
                  aria-controls="hero-inspector"
                  aria-label={`${panel.title}: ${panel.stack.join(", ")}`}
                  onMouseEnter={() => setActiveId(panel.id)}
                  onFocus={() => setActiveId(panel.id)}
                  onClick={() => setActiveId(panel.id)}
                >
                  <span className="hero-node-head">
                    <span className="hero-node-index">{panel.index}</span>
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <span className="hero-node-title">{panel.title}</span>
                  <span className="hero-node-stack">
                    {panel.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </span>
                  <PanelDetail kind={panel.detail} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="hero-inspector">
        <div
          id="hero-inspector"
          className="hero-inspector-text"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -4 }}
              transition={{
                duration: reduced ? 0 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <strong>
                {active.index} · {active.title}
              </strong>
              {active.description}
            </motion.p>
          </AnimatePresence>
        </div>
      </figcaption>
    </figure>
  );
}
