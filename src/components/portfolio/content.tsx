import { type ReactNode } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/rudresh-oza.png";
import { Counter, Reveal } from "./motion";
import { ExperienceRoute } from "./experience-route";
import { achievements, profile, training } from "@/lib/portfolio";
export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  actions?: ReactNode;
}) {
  const copy = (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="section-description">{description}</p>
      {actions}
    </>
  );
  if (!aside) return <Reveal className="page-intro">{copy}</Reveal>;
  return (
    <Reveal className="page-intro page-intro-split">
      <div>{copy}</div>
      {aside}
    </Reveal>
  );
}
// Mirrors the Home hero's figure chrome; the frame crops the square upload to the illustration panel.
export function AboutPortrait() {
  return (
    <figure className="about-portrait">
      <div className="hero-map-head">
        <span>Fig. 01 — Portrait</span>
        <span className="hero-map-live">
          <i aria-hidden="true" />
          Illustrated
        </span>
      </div>
      <div className="about-portrait-stage">
        <span className="about-portrait-grid" aria-hidden="true" />
        <span className="about-portrait-axis" aria-hidden="true" />
        <div className="about-portrait-frame">
          <span className="about-portrait-marks" aria-hidden="true" />
          <div className="about-portrait-photo">
            <img
              src={portrait}
              alt="Illustrated portrait of Rudresh Oza"
              width={1024}
              height={1024}
              decoding="async"
            />
          </div>
        </div>
        <p className="about-portrait-hub">
          <strong>
            <i aria-hidden="true" />
            {profile.experience} years
          </strong>
          <span>Cloud &amp; GenAI</span>
        </p>
      </div>
      <figcaption className="about-portrait-caption">
        <strong>{profile.name}</strong>
        <span>{profile.role}</span>
        <span className="about-portrait-location">
          <MapPin size={11} aria-hidden="true" />
          {profile.location} · {profile.timezone}
        </span>
      </figcaption>
    </figure>
  );
}
export function Page({ children }: { children: ReactNode }) {
  return <main className="container-shell min-h-[65vh]">{children}</main>;
}
export const principles = [
  [
    "Scalable by Design",
    "Build maintainable systems that evolve with business requirements.",
  ],
  [
    "AI with Purpose",
    "Use language models and agentic workflows to solve practical problems.",
  ],
  [
    "Reliable in Production",
    "Prioritize observability, performance, and operational reliability.",
  ],
  [
    "Ownership Beyond Code",
    "Contribute across architecture, implementation, deployment, and improvement.",
  ],
];
export function AboutContent({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section grid gap-12 md:grid-cols-2">
      <div>
        <p className="eyebrow">About me</p>
        <h2 className="section-heading">
          An engineer's precision.
          <br />
          <span className="text-muted-foreground">A product mindset.</span>
        </h2>
        <div className="content-prose mt-6">
          <p>
            I'm Rudresh, a software engineer with 6+ years of experience
            building web applications, enterprise software, cloud-based
            platforms, and AI-powered solutions.
          </p>
          <p>
            My work spans the full engineering lifecycle—from designing
            interfaces and backend services to developing AI workflows and
            improving production reliability.
          </p>
          {!compact && (
            <p>
              I enjoy solving complex problems, creating maintainable
              architectures, and collaborating with distributed teams to deliver
              products that create real business value.
            </p>
          )}
        </div>
        {compact && (
          <Button asChild variant="link" className="mt-5 px-0">
            <Link to="/about">
              More about me <ArrowUpRight />
            </Link>
          </Button>
        )}
      </div>
      <div>
        {principles.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.06} className="principle flex gap-5">
            <span className="pt-1 text-[0.625rem] text-primary">0{i + 1}</span>
            <div>
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function ExperienceContent() {
  return (
    <>
      <ExperienceRoute />
      <TrainingContent />
      <div className="border-t border-border pb-14 pt-8">
        <p className="eyebrow">Education</p>
        <h2 className="mt-4 text-lg font-bold">
          Bachelor of Technology · Computer Science
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Poornima Institute of Engineering & Technology · Jaipur, India
        </p>
      </div>
    </>
  );
}
export function TrainingContent() {
  return (
    <Reveal className="border-t border-border pb-14 pt-8">
      <section
        aria-labelledby="training-heading"
        className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-[50px]"
      >
        <div>
          <p className="eyebrow">Training &amp; Mentoring</p>
          <p className="mt-5 text-4xl font-semibold tracking-tight tabular-nums">
            <Counter value={achievements.studentsTrained} suffix="+" />
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Students trained</p>
        </div>
        <div>
          <h2 id="training-heading" className="text-xl font-bold">
            {training.role}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{training.span}</p>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {training.summary}
          </p>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link to="/training">
              View training &amp; courses <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </Reveal>
  );
}
