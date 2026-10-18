import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotionConfig } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Flame, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { achievements } from "@/lib/portfolio";
import {
  courseCategories,
  courseEnquiryHref,
  courses,
  filterCourses,
  getNextCourse,
  trainingFormats,
  type Course,
} from "@/lib/training";
import { courseIcons, formatIcons } from "@/lib/training-icons";
import { Counter, Reveal } from "./motion";

export function TrainingStats() {
  const stats = [
    {
      value: achievements.studentsTrained,
      suffix: "+",
      label: "Students trained",
    },
    {
      value: achievements.trainingYears,
      suffix: "",
      label: "Years of training",
    },
    { value: courses.length, suffix: "", label: "Core courses" },
    { value: trainingFormats.length, suffix: "", label: "Delivery formats" },
  ];
  return (
    <Reveal className="training-stats">
      <ul aria-label="Training highlights">
        {stats.map((s) => (
          <li key={s.label}>
            <strong>
              <Counter value={s.value} suffix={s.suffix} />
            </strong>
            <span className="training-stat-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function TrendingPill() {
  return (
    <span className="course-trending">
      <Flame aria-hidden="true" />
      Trending
    </span>
  );
}

function CourseCard({ course }: { course: Course }) {
  const Icon = courseIcons[course.id];
  return (
    <Reveal className="course-card-reveal">
      <article
        id={course.id}
        className="course-card"
        aria-labelledby={`${course.id}-title`}
      >
        <div className="course-top">
          <span className="course-icon" aria-hidden="true">
            {Icon && <Icon />}
          </span>
          {course.trending && <TrendingPill />}
        </div>
        <p className="course-meta">
          <span>{course.category}</span>
          <span>
            {course.hours} hours · {course.modules.length} modules
          </span>
        </p>
        <h3 id={`${course.id}-title`} className="course-title">
          <Link to="/training/$courseId" params={{ courseId: course.id }}>
            {course.title}
          </Link>
        </h3>
        <p className="course-tagline">{course.tagline}</p>
        <p className="course-summary">{course.summary}</p>
        <div className="project-tags" aria-label={`${course.title} tools`}>
          {course.tools.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="course-card-links">
          <Link
            to="/training/$courseId"
            params={{ courseId: course.id }}
            className="course-view"
            aria-label={`View full course: ${course.title}`}
          >
            View full course <ArrowRight aria-hidden="true" />
          </Link>
          <a
            href={courseEnquiryHref(course)}
            className="course-enquire"
            aria-label={`Enquire about ${course.title} by email`}
          >
            Enquire <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export function CourseCards() {
  const [category, setCategory] =
    useState<(typeof courseCategories)[number]>("All");
  const reduced = useReducedMotionConfig();
  const shown = filterCourses(category);
  return (
    <section className="section" aria-labelledby="courses-heading">
      <Reveal>
        <p className="eyebrow">Courses</p>
        <h2 id="courses-heading" className="section-heading">
          Courses across the stack.
          <br />
          <span className="text-muted-foreground">
            Built from production work.
          </span>
        </h2>
        <p className="section-description">
          Modules draw on the same stack I use in client work, so learners
          practice the patterns real teams rely on.
        </p>
      </Reveal>
      <div
        className="project-filters course-filters"
        aria-label="Course categories"
      >
        {courseCategories.map((c) => (
          <Button
            key={c}
            variant="ghost"
            className="category-filter"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c}
            {category === c && (
              <motion.span
                layoutId="course-filter-underline"
                className="filter-underline"
                transition={{ duration: reduced ? 0 : 0.25 }}
              />
            )}
          </Button>
        ))}
      </div>
      <div className="sr-only" role="status">
        {shown.length} {shown.length === 1 ? "course" : "courses"}
        {category !== "All" && ` in ${category}`}
      </div>
      <motion.div layout={!reduced} className="course-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => (
            <motion.div
              layout={!reduced}
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className="course-card-motion"
              key={c.id}
            >
              <CourseCard course={c} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export function TrainingFormats() {
  return (
    <section
      className="section training-formats"
      aria-labelledby="formats-heading"
    >
      <Reveal>
        <p className="eyebrow">How I teach</p>
        <h2 id="formats-heading" className="section-heading">
          Flexible formats for
          <br />
          <span className="text-muted-foreground">
            teams, campuses, and individuals.
          </span>
        </h2>
      </Reveal>
      <ul className="format-grid">
        {trainingFormats.map((f, i) => {
          const Icon = formatIcons[f.id];
          return (
            <li key={f.id}>
              <Reveal delay={i * 0.06} className="format-card">
                <span className="course-icon" aria-hidden="true">
                  {Icon && <Icon />}
                </span>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function TrainingCta() {
  return (
    <section className="collaboration-band">
      <Reveal className="container-shell collaboration-inner">
        <div>
          <p className="eyebrow">Training enquiries</p>
          <h2>
            Bring this training
            <br />
            to your team or campus.
          </h2>
          <p>
            Share your audience, goals, and preferred format, and I'll suggest
            the right course structure.
          </p>
        </div>
        <div className="collaboration-actions">
          <Button asChild className="h-12 px-6 shadow-none">
            <Link to="/contact">
              Discuss Training <ArrowRight />
            </Link>
          </Button>
          <a
            href={courseEnquiryHref()}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            <Mail className="mr-1.5 inline" size={14} aria-hidden="true" />
            Email a training enquiry
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function CourseDetail({ course }: { course: Course }) {
  const index = courses.findIndex((c) => c.id === course.id);
  const next = getNextCourse(course.id);
  return (
    <article className="project-detail course-detail">
      <Reveal className="project-detail-intro">
        <Button asChild variant="link" className="mb-8 px-0">
          <Link to="/training">
            <ArrowLeft />
            Back to training
          </Link>
        </Button>
        <div className="course-detail-eyebrow">
          <p className="eyebrow">
            {course.category} · Course {String(index + 1).padStart(2, "0")} ·{" "}
            {course.hours} hours · {course.modules.length} modules
          </p>
          {course.trending && <TrendingPill />}
        </div>
        <h1>{course.title}</h1>
        <p className="course-tagline course-detail-tagline">{course.tagline}</p>
        <p className="section-description">{course.summary}</p>
        <div className="project-tags" aria-label={`${course.title} tools`}>
          {course.tools.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </Reveal>
      <Reveal className="course-facts">
        <dl>
          <div>
            <dt>Who it's for</dt>
            <dd>{course.audience}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{course.hours} hours</dd>
          </div>
          <div>
            <dt>Modules</dt>
            <dd>
              {course.modules.length} modules, ending in a capstone project
            </dd>
          </div>
          <div>
            <dt>Formats</dt>
            <dd>{trainingFormats.map((f) => f.title).join(" · ")}</dd>
          </div>
        </dl>
      </Reveal>
      <section
        className="project-detail-body"
        aria-labelledby="syllabus-heading"
      >
        <Reveal>
          <p className="eyebrow">Syllabus</p>
          <h2 id="syllabus-heading" className="course-syllabus-heading">
            What the course covers
          </h2>
        </Reveal>
        {course.modules.map((m, i) => (
          <Reveal key={m.title} className="case-study-section">
            <span className="case-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="course-detail-module">{m.title}</h3>
              <ul>
                {m.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>
      <Reveal className="course-detail-enquiry">
        <div>
          <h2>Interested in this course?</h2>
          <p>
            Share your audience, goals, and preferred format, and I'll tailor
            the structure.
          </p>
        </div>
        <div className="course-detail-actions">
          <Button asChild className="h-11 px-5 shadow-none">
            <a href={courseEnquiryHref(course)}>
              <Mail />
              Enquire by email
            </a>
          </Button>
          <Button asChild variant="link" className="px-0">
            <Link to="/contact">
              Discuss on Contact <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </Reveal>
      <nav className="project-detail-navigation" aria-label="Course navigation">
        <Button asChild variant="outline">
          <Link to="/training">
            <ArrowLeft />
            All courses
          </Link>
        </Button>
        {next && next.id !== course.id && (
          <Button asChild variant="link" className="next-project">
            <Link to="/training/$courseId" params={{ courseId: next.id }}>
              <span>
                <small>Next course</small>
                {next.title}
              </span>
              <ArrowRight />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
