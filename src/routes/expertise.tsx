import { createFileRoute } from "@tanstack/react-router";
import { pageHead, pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import { Page } from "@/components/portfolio/content";
import { SkillsHub } from "@/components/portfolio/skills";
import { Collaboration } from "@/components/portfolio/work";
export const Route = createFileRoute("/expertise")({
  head: () =>
    pageHead(
      pageSeo["/expertise"].title,
      pageSeo["/expertise"].description,
      "/expertise",
      {
        fullTitle: true,
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Expertise", path: "/expertise" },
          ]),
        ],
      },
    ),
  component: Expertise,
});
function Expertise() {
  return (
    <>
      <Page>
        <SkillsHub />
      </Page>
      <Collaboration />
    </>
  );
}
