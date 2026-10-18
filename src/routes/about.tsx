import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  profilePageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import {
  Page,
  PageIntro,
  AboutContent,
  AboutPortrait,
} from "@/components/portfolio/content";
import { Collaboration } from "@/components/portfolio/work";
export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(pageSeo["/about"].title, pageSeo["/about"].description, "/about", {
      fullTitle: true,
      type: "profile",
      jsonLd: [
        profilePageJsonLd("/about", "About Rudresh Oza"),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ],
    }),
  component: About,
});
function About() {
  return (
    <>
      <Page>
        <PageIntro
          eyebrow="The person behind the code"
          title="Engineering with a Product Mindset."
          description="Thoughtful architecture, practical AI, and ownership from the first idea to production."
          aside={<AboutPortrait />}
        />
        <AboutContent />
        <section className="border-t border-border pb-16 pt-10">
          <p className="eyebrow">Engineering philosophy</p>
          <h2 className="section-heading">Simplicity. Scale. Impact.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              [
                "Architecture Before Complexity",
                "Choose the right level of abstraction and design for maintainability.",
              ],
              [
                "Performance as a Feature",
                "Build responsive applications with efficient APIs, data access, and rendering.",
              ],
              [
                "Intelligent Systems, Practical Outcomes",
                "Integrate AI when it solves a meaningful business problem.",
              ],
              [
                "Ownership from Start to Production",
                "Care about quality, testing, observability, deployment, and iteration.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Page>
      <Collaboration />
    </>
  );
}
