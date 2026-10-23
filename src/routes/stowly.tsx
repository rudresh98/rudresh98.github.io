import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { stowly } from "@/lib/stowly";
import { stowlyScreenImages } from "@/lib/stowly-screens";
import { Page, PageIntro } from "@/components/portfolio/content";
import {
  StowlyCta,
  StowlyDownload,
  StowlyFeatures,
  StowlyPhones,
  StowlyScreens,
  StowlySteps,
} from "@/components/portfolio/stowly";
export const Route = createFileRoute("/stowly")({
  head: () =>
    pageHead(
      pageSeo["/stowly"].title,
      pageSeo["/stowly"].description,
      "/stowly",
      {
        fullTitle: true,
        image: stowly.shareImage,
        jsonLd: [
          softwareApplicationJsonLd(
            stowly.screens.map((screen) => stowlyScreenImages[screen.id]),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: stowly.name, path: "/stowly" },
          ]),
        ],
      },
    ),
  component: Stowly,
});
function Stowly() {
  return (
    <>
      <Page>
        <PageIntro
          eyebrow={`${stowly.platform} app · Personal project`}
          title={`${stowly.name}: ${stowly.tagline}`}
          description={stowly.description}
          aside={<StowlyPhones />}
          actions={
            <StowlyDownload
              apkUrl={stowly.apkUrl}
              className="stowly-intro-download"
            />
          }
        />
        <StowlyFeatures />
        <StowlyScreens />
        <StowlySteps />
      </Page>
      <StowlyCta />
    </>
  );
}
