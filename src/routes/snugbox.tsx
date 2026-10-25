import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { snugbox } from "@/lib/snugbox";
import { snugboxFeatureIcons } from "@/lib/snugbox-icons";
import {
  snugboxScreenImages as images,
  snugboxScreenSizes as sizes,
} from "@/lib/snugbox-screens";
import { Page, PageIntro } from "@/components/portfolio/content";
import {
  AppCta,
  AppDownload,
  AppFeatures,
  AppPhones,
  AppScreens,
  AppSteps,
} from "@/components/portfolio/app-showcase";
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
            snugbox,
            snugbox.screens.map((screen) => images[screen.id]),
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
          aside={<AppPhones app={snugbox} images={images} sizes={sizes} />}
          actions={<AppDownload app={snugbox} className="app-intro-download" />}
        />
        <AppFeatures app={snugbox} icons={snugboxFeatureIcons} />
        <AppScreens app={snugbox} images={images} sizes={sizes} />
        <AppSteps app={snugbox} />
      </Page>
      <AppCta app={snugbox} />
    </>
  );
}
