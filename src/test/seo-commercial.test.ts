import { describe, expect, it } from "vitest";
import { certifications } from "@/lib/certifications";
import { projects } from "@/lib/portfolio";
import {
  contentUpdated,
  courseJsonLd,
  courseSeo,
  llmsTxt,
  metaDescription,
  pageSeo,
  projectSeo,
  siteJsonLd,
  sitemapXml,
  sitePages,
} from "@/lib/seo";
import { courses } from "@/lib/training";

describe("Search titles and descriptions", () => {
  it("keeps every static page within search-result limits and unique", () => {
    const entries = Object.values(pageSeo);
    for (const { title, description } of entries) {
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeGreaterThanOrEqual(120);
      expect(description.length, description).toBeLessThanOrEqual(160);
    }
    expect(new Set(entries.map((e) => e.title)).size).toBe(entries.length);
    expect(new Set(entries.map((e) => e.description)).size).toBe(
      entries.length,
    );
  });
  it("covers every static page in the sitemap", () => {
    const dynamic = /^\/(projects|training)\/.+/;
    for (const page of sitePages.filter((p) => !dynamic.test(p.path)))
      expect(pageSeo).toHaveProperty([page.path]);
  });
  it("fits every case study and course title and description", () => {
    for (const seo of [
      ...projects.map(projectSeo),
      ...courses.map(courseSeo),
    ]) {
      expect(seo.title.length, seo.title).toBeLessThanOrEqual(60);
      expect(seo.description.length, seo.description).toBeLessThanOrEqual(160);
      expect(seo.description).toContain("Rudresh Oza");
    }
  });
  it("trims long text at a word boundary", () => {
    const trimmed = metaDescription("word ".repeat(60));
    expect(trimmed.length).toBeLessThanOrEqual(160);
    expect(trimmed.endsWith("…")).toBe(true);
    expect(metaDescription("Short and   tidy.")).toBe("Short and tidy.");
  });
});

describe("Commercial structured data", () => {
  const person = siteJsonLd()["@graph"].find(
    (node) => node["@type"] === "Person",
  ) as unknown as {
    hasCredential: unknown[];
    alumniOf: unknown;
    seeks: unknown;
    makesOffer?: unknown;
  };
  it("sells through courses rather than a separate services list", () => {
    expect(person.makesOffer).toBeUndefined();
  });
  it("adds verified credentials, education, and the roles sought", () => {
    expect(person.hasCredential).toHaveLength(certifications.length);
    expect(person.alumniOf).toMatchObject({
      name: "Poornima Institute of Engineering & Technology",
    });
    expect(person.seeks).toMatchObject({ "@type": "Demand" });
  });
  it("describes course delivery without invented prices", () => {
    for (const course of courses) {
      const data = courseJsonLd(course);
      expect(course.hours).toBeGreaterThan(0);
      expect(data.hasCourseInstance).toMatchObject({
        "@type": "CourseInstance",
        courseMode: ["Online", "Onsite"],
        courseWorkload: `PT${course.hours}H`,
      });
      expect(data.offers).not.toHaveProperty("price");
    }
  });
});

describe("Crawl files", () => {
  it("stamps every sitemap URL with the content date and ranks Training as the selling page", () => {
    const xml = sitemapXml();
    expect(contentUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(xml.match(/<lastmod>/g)).toHaveLength(sitePages.length);
    expect(xml).not.toContain("/services/");
    const training = sitePages.find((p) => p.path === "/training")!;
    for (const page of sitePages.filter((p) => p.path !== "/"))
      expect(page.priority).toBeLessThanOrEqual(training.priority);
  });
  it("summarizes courses, case studies, certifications, and contact in llms.txt", () => {
    const text = llmsTxt();
    expect(text.startsWith("# Rudresh Oza")).toBe(true);
    expect(text).not.toContain("## Services");
    for (const course of courses)
      expect(text).toContain(
        `https://rudresh98.github.io/training/${course.id}/`,
      );
    for (const project of projects) expect(text).toContain(project.title);
    expect(text).toContain("ozarudresh18@gmail.com");
  });
});
