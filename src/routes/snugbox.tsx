import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { snugbox } from "@/lib/snugbox";
import { snugboxScreenImages } from "@/lib/snugbox-screens";
import { Page, PageIntro } from "@/components/portfolio/content";
import {
  SnugboxCta,
  SnugboxDownload,
  SnugboxFeatures,
  SnugboxPhones,
  SnugboxScreens,
  SnugboxSteps,
} from "@/components/portfolio/snugbox";
export const Route = createFileRoute("/snugbox")({
  head: () =>
    pageHead(
      pageSeo["/snugbox"].title,
      pageSeo["/snugbox"].description,
      "/snugbox",
      {
        fullTitle: true,
        image: snugbox.shareImage,
        jsonLd: [
          softwareApplicationJsonLd(
            snugbox.screens.map((screen) => snugboxScreenImages[screen.id]),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: snugbox.name, path: "/snugbox" },
          ]),
        ],
      },
    ),
  component: Snugbox,
});
function Snugbox() {
  return (
    <>
      <Page>
        <PageIntro
          eyebrow={`${snugbox.platform} app · Personal project`}
          title={`${snugbox.name}: ${snugbox.tagline}`}
          description={snugbox.description}
          aside={<SnugboxPhones />}
          actions={
            <SnugboxDownload
              apkUrl={snugbox.apkUrl}
              className="snugbox-intro-download"
            />
          }
        />
        <SnugboxFeatures />
        <SnugboxScreens />
        <SnugboxSteps />
      </Page>
      <SnugboxCta />
    </>
  );
}
