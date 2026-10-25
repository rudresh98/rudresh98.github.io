import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  projectListJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { Page } from "@/components/portfolio/content";
import { ProjectGrid, Collaboration } from "@/components/portfolio/work";
import { AppBand } from "@/components/portfolio/app-showcase";
import { snugbox } from "@/lib/snugbox";
import { snugboxScreenImages, snugboxScreenSizes } from "@/lib/snugbox-screens";
import { splitMoney } from "@/lib/split-money";
import {
  splitMoneyScreenImages,
  splitMoneyScreenSizes,
} from "@/lib/split-money-screens";

export const Route = createFileRoute("/projects/")({
  head: () =>
    pageHead(
      pageSeo["/projects"].title,
      pageSeo["/projects"].description,
      "/projects",
      {
        fullTitle: true,
        jsonLd: [
          projectListJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ],
      },
    ),
  component: Projects,
});
function Projects() {
  return (
    <>
      <Page>
        <section className="section">
          <ProjectGrid />
          <AppBand
            app={snugbox}
            images={snugboxScreenImages}
            sizes={snugboxScreenSizes}
          />
          <AppBand
            app={splitMoney}
            images={splitMoneyScreenImages}
            sizes={splitMoneyScreenSizes}
          />
        </section>
      </Page>
      <Collaboration />
    </>
  );
}
