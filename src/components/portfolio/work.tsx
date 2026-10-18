import { useState, type MouseEvent, type PointerEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotionConfig } from "motion/react";
import { ArrowUpRight, ArrowRight, Cloud, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  categories,
  filterProjects,
  projectCategories,
  projects,
  profile,
  type Category,
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

// The first card leads the bento grid; an even count also widens the last card so no row is left with one.
const isWide = (i: number, count: number) =>
  i === 0 || (count % 2 === 0 && i === count - 1);

// Decorative spotlight: CSS reads the pointer position, so moving the mouse never re-renders the card.
function trackSpotlight(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
  e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
}

export function ProjectGrid({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState<Category>("All");
  const reduced = useReducedMotionConfig();
  const navigate = useNavigate();
  const shown = preview ? projects.slice(0, 4) : filterProjects(category);
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
          <p className="eyebrow">Selected work & engineering case studies</p>
          <Heading className="section-heading">
            Complex challenges.
            <br />
            <span className="text-muted-foreground">Thoughtful solutions.</span>
          </Heading>
          <p className="section-description">
            Real projects. Considered architecture. Measurable impact.
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
      <motion.div
        layout={reduced ? false : "position"}
        className="project-grid"
      >
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => {
            const wide = isWide(i, shown.length);
            const tags = wide ? p.tags : p.tags.slice(0, visibleTags);
            const hiddenTags = p.tags.length - tags.length;
            const impact = projectVisuals[p.id]?.impact;
            return (
              <motion.article
                layout={reduced ? false : "position"}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="project-card"
                data-wide={wide || undefined}
                key={p.id}
                onPointerMove={trackSpotlight}
                onClick={(e) => openCaseStudy(e, p.id)}
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
                      <span className="project-index">
                        {String(
                          projects.findIndex((x) => x.id === p.id) + 1,
                        ).padStart(2, "0")}
                      </span>
                    </div>
                    <CardHeading className="project-title">
                      {p.title}
                    </CardHeading>
                    {p.client && (
                      <p className="project-client">
                        Client · <strong>{p.client}</strong>
                      </p>
                    )}
                    <p className="project-summary">{p.description}</p>
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
          })}
        </AnimatePresence>
      </motion.div>
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

const focusAreas = [
  { label: "Full Stack Engineering", Icon: Code2 },
  { label: "Cloud & AI", Icon: Cloud },
  { label: "Intelligent Platforms", Icon: Sparkles },
];
export function Collaboration() {
  return (
    <section className="collaboration-band">
      <Reveal className="container-shell collaboration-inner">
        <div>
          <p className="collaboration-status">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability} · {profile.timezone}
          </p>
          <p className="eyebrow">Across borders. Beyond code.</p>
          <h2>
            Great engineering
            <br />
            <span className="text-primary">has no borders.</span>
          </h2>
          <p>
            I'm interested in collaborating with international teams to build
            scalable software, cloud platforms, and intelligent products.
          </p>
          <ul className="collaboration-focus" aria-label="Focus areas">
            {focusAreas.map(({ label, Icon }) => (
              <li key={label}>
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="collaboration-actions">
          <Button
            asChild
            className="h-12 w-full justify-between px-6 shadow-none"
          >
            <Link to="/contact">
              Discuss an Opportunity <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full justify-between px-5 shadow-none"
          >
            <Link to="/training">
              Explore training courses <ArrowUpRight />
            </Link>
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
