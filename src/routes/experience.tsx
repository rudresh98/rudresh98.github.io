import { createFileRoute } from "@tanstack/react-router";
import { pageHead, pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import { achievements, profile } from "@/lib/portfolio";
import {
  Page,
  PageIntro,
  ExperienceContent,
} from "@/components/portfolio/content";
export const Route = createFileRoute("/experience")({
  head: () =>
    pageHead(
      pageSeo["/experience"].title,
      pageSeo["/experience"].description,
      "/experience",
      {
        fullTitle: true,
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Experience", path: "/experience" },
          ]),
        ],
      },
    ),
  component: Experience,
});
function Experience() {
  return (
    <Page>
      <PageIntro
        eyebrow="Career"
        title="Experience Building and Evolving Software."
        description={`${profile.experience} years of engineering ownership and ${achievements.studentsTrained.toLocaleString("en-US")}+ students trained—from customer-facing web experiences to cloud platforms and intelligent agents.`}
      />
      <ExperienceContent />
    </Page>
  );
}
