import { describe, expect, it } from "vitest";
import { aboutFaqs, contactFaqs, trainingFaqs } from "@/lib/faq";
import { faqJsonLd, llmsTxt, projectSeo } from "@/lib/seo";
import { profile, projects } from "@/lib/portfolio";

const all = [...aboutFaqs, ...contactFaqs, ...trainingFaqs];

describe("FAQ content", () => {
  it("phrases every entry as a question with a snippet-length answer", () => {
    for (const faq of all) {
      expect(faq.question).toMatch(/\?$/);
      const words = faq.answer.split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(20);
      expect(words).toBeLessThanOrEqual(90);
    }
  });

  it("states the same experience figure as the profile", () => {
    const answer = aboutFaqs.find((faq) => faq.question.includes("experience"));
    expect(answer?.answer).toContain(`${profile.experience} years`);
  });

  it("mirrors the visible questions in FAQPage JSON-LD", () => {
    const ld = faqJsonLd("/contact", contactFaqs);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity.map((q) => q.name)).toEqual(
      contactFaqs.map((faq) => faq.question),
    );
    expect(ld.mainEntity[0]?.acceptedAnswer.text).toBe(contactFaqs[0]?.answer);
  });

  it("includes the FAQ in llms.txt", () => {
    expect(llmsTxt()).toContain("What is a Forward Deployed Engineer?");
  });
});

describe("case study search snippets", () => {
  it("keeps every title within 60 and description within 160 characters, untruncated", () => {
    for (const project of projects) {
      const seo = projectSeo(project);
      expect(seo.title.length).toBeLessThanOrEqual(60);
      expect(seo.description.length).toBeLessThanOrEqual(160);
      expect(seo.description.endsWith("…")).toBe(false);
    }
  });
});
