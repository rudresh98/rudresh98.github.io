import { useState, type MouseEvent, type PointerEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotionConfig } from "motion/react";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import resume from "@/assets/rudresh-oza-resume.pdf";
import {
  categories,
  filterProjects,
  projectCategories,
  projects,
  projectsInTier,
  profile,
  type Category,
  type Project,
} from "@/lib/portfolio";
import { projectVisuals } from "@/lib/portfolio-visuals";
import { Architecture } from "./visuals";
import { Reveal } from "./motion";
export { Architecture } from "./visuals";

const categoryLabel: Partial<Record<Category, string>> = {
  GenAI: "Generative AI",
  Cloud: "Cloud & Engineering",
};
const liveCount = projects.filter((p) => p.links?.length).length;
const visibleTags = 4;
const projectCount = (n: number) => `${n} ${n === 1 ? "project" : "projects"}`;
const namedClients = new Intl.ListFormat("en-US").format(
  [...new Set(projects.flatMap((p) => (p.client ? [p.client] : [])))].slice(
    0,
    3,
  ),
);

// Decorative spotlight: CSS reads the pointer position, so moving the mouse never re-renders the card.
function trackSpotlight(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
}

function ProjectCard({
  project: p,
  wide,
  flagship,
  heading: CardHeading,
  onOpen,
}: {
  project: Project;
  wide: boolean;
  flagship: boolean;
  heading: "h2" | "h3";
  onOpen: (e: MouseEvent<HTMLElement>, projectId: string) => void;
}) {
  const reduced = useReducedMotionConfig();
  const tags = p.tags.slice(0, visibleTags);
  const hiddenTags = p.tags.length - tags.length;
  const visual = projectVisuals[p.id];
  const impact = visual?.impact;
  // A flagship names the request flow its diagram draws, so each lead card shows its own system.
  const steps = flagship && visual?.type === "system" ? visual.steps : [];
  return (
    <motion.article
      layout={reduced ? false : "position"}
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
      className="project-card"
      data-wide={wide || undefined}
      data-flagship={flagship || undefined}
      onPointerMove={trackSpotlight}
      onClick={(e) => onOpen(e, p.id)}
    >
      <Reveal className="project-card-inner">
        <div className="project-media">
          <Architecture project={p} />
        </div>
        <div className="project-body">
          <div className="project-meta">
            <span className="project-categories">
              {projectCategories(p).map((c) => (
                <span key={c}>{categoryLabel[c] ?? c}</span>
              ))}
            </span>
          </div>
          <CardHeading className="project-title">{p.title}</CardHeading>
          {p.client && (
            <p className="project-client">
              Client · <strong>{p.client}</strong>
            </p>
          )}
          <p className="project-summary">{p.description}</p>
          {steps.length > 0 && (
            <ol
              className="project-flow"
              aria-label={`${visual?.title ?? p.title}: request flow`}
            >
              {steps.map((step) => (
                <li key={step.id}>{step.label}</li>
              ))}
            </ol>
          )}
          {impact && (
            <dl className="card-impact">
              {impact.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="project-tags">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
            {hiddenTags > 0 && (
              <span className="project-tags-more">
                +{hiddenTags}
                <span className="sr-only"> more technologies</span>
              </span>
            )}
          </div>
          <div className="project-card-links">
            <Link
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              className="case-study-link"
              aria-label={`Explore case study: ${p.title}`}
            >
              Explore case study <ArrowRight aria-hidden="true" />
            </Link>
            {p.links?.[0] && (
              <a
                href={p.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-live-link"
                aria-label={`${p.links[0].label} for ${p.title} (opens in a new tab)`}
              >
                Live <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </motion.article>
  );
}

export function ProjectGrid({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState<Category>("All");
  const reduced = useReducedMotionConfig();
  const navigate = useNavigate();
  const shown = preview
    ? projectsInTier(projects, "flagship")
    : filterProjects(category);
  const flagships = projectsInTier(shown, "flagship");
  const standard = projectsInTier(shown, undefined);
  const briefs = projectsInTier(shown, "brief");
  const Heading = preview ? "h2" : "h1";
  const CardHeading = preview ? "h3" : "h2";
  // Pointer users can click anywhere on a card; keyboard and assistive tech keep the real case-study link.
  const openCaseStudy = (e: MouseEvent<HTMLElement>, projectId: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    void navigate({ to: "/projects/$projectId", params: { projectId } });
  };
  return (
    <>
      <Reveal className="gallery-heading">
        <div>
          <Heading className="section-heading">
            {preview ? "Selected work" : "Projects"}
          </Heading>
          <p className="section-description">
            {preview
              ? `Three of ${projects.length} projects, each with its architecture and the request flow it runs`
              : `${projects.length} projects, with clients including ${namedClients}`}
          </p>
        </div>
        {preview ? (
          <Button asChild variant="link" className="gallery-all-link">
            <Link to="/projects">
              View all projects ({projects.length}) <ArrowUpRight />
            </Link>
          </Button>
        ) : (
          <dl className="gallery-stats">
            <div>
              <dt>Case studies</dt>
              <dd>{projects.length}</dd>
            </div>
            <div>
              <dt>Live products</dt>
              <dd>{liveCount}</dd>
            </div>
          </dl>
        )}
      </Reveal>
      {!preview && (
        <div
          className="project-filters"
          role="group"
          aria-label="Project categories"
        >
          {categories.map((c) => (
            <Button
              key={c}
              variant="ghost"
              className="category-filter"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
            >
              {category === c && (
                <motion.span
                  layoutId="filter-indicator"
                  className="filter-indicator"
                  transition={{
                    duration: reduced ? 0 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              )}
              {c}
              <span className="filter-count" aria-hidden="true">
                {filterProjects(c).length}
              </span>
              <span className="sr-only">
                , {projectCount(filterProjects(c).length)}
              </span>
            </Button>
          ))}
        </div>
      )}
      <div className="sr-only" role="status">
        {projectCount(shown.length)}
        {!preview && ` in ${category}`}
      </div>
      {flagships.length > 0 && (
        <div className="project-grid project-grid-flagship">
          {flagships.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              wide
              flagship
              heading={CardHeading}
              onOpen={openCaseStudy}
            />
          ))}
        </div>
      )}
      {standard.length > 0 && (
        <motion.div
          layout={reduced ? false : "position"}
          className="project-grid"
        >
          <AnimatePresence mode="popLayout">
            {standard.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                // An odd count widens the last card so no row is left with one.
                wide={standard.length % 2 === 1 && i === standard.length - 1}
                flagship={false}
                heading={CardHeading}
                onOpen={openCaseStudy}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {briefs.length > 0 && (
        <section className="project-briefs" aria-labelledby="briefs-heading">
          <h2 id="briefs-heading" className="project-briefs-heading">
            Company websites
          </h2>
          <ul>
            {briefs.map((p) => (
              <li key={p.id} className="project-brief">
                <div>
                  <h3 className="project-brief-title">{p.title}</h3>
                  <p className="project-brief-summary">{p.description}</p>
                </div>
                <div className="project-brief-links">
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: p.id }}
                    className="case-study-link"
                    aria-label={`Explore case study: ${p.title}`}
                  >
                    Case study <ArrowRight aria-hidden="true" />
                  </Link>
                  {p.links?.[0] && (
                    <a
                      href={p.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-live-link"
                      aria-label={`${p.links[0].label} for ${p.title} (opens in a new tab)`}
                    >
                      Live <ArrowUpRight aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {shown.length === 0 && (
        <div className="project-empty">
          <p>No projects in this category yet.</p>
          <Button variant="outline" onClick={() => setCategory("All")}>
            Show all projects
          </Button>
        </div>
      )}
    </>
  );
}

export function Collaboration() {
  return (
    <section
      className="collaboration-band"
      aria-labelledby="collaboration-heading"
    >
      <Reveal className="container-shell collaboration-inner">
        <div>
          <h2 id="collaboration-heading">{profile.availability}</h2>
          <p>
            Based in {profile.location}, on {profile.timezone}, with clients in
            eight countries. Send a role, a project brief, or a question.
          </p>
        </div>
        <div className="collaboration-actions">
          <Button
            asChild
            className="h-12 w-full justify-between px-6 shadow-none"
          >
            <Link to="/contact">
              Contact me <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full justify-between px-5 shadow-none"
          >
            <a href={resume} download="Rudresh-Oza-Resume.pdf">
              Download resume <ArrowDown />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full justify-between px-5 shadow-none"
          >
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect on LinkedIn <ArrowUpRight />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
