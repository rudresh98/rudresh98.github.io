import { createFileRoute } from "@tanstack/react-router";
import {
  pageHead,
  pageSeo,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { splitMoney } from "@/lib/split-money";
import { splitMoneyFeatureIcons } from "@/lib/split-money-icons";
import {
  splitMoneyScreenImages as images,
  splitMoneyScreenSizes as sizes,
} from "@/lib/split-money-screens";
import { Page, PageIntro } from "@/components/portfolio/content";
import {
  AppBuild,
  AppCta,
  AppDownload,
  AppFeatures,
  AppPhones,
  AppScreens,
  AppSteps,
} from "@/components/portfolio/app-showcase";
// No preview card of its own yet, so link previews keep the site card.
export const Route = createFileRoute("/split-money")({
  head: () =>
    pageHead(
      pageSeo["/split-money"].title,
      pageSeo["/split-money"].description,
      "/split-money",
      {
        fullTitle: true,
        jsonLd: [
          softwareApplicationJsonLd(
            splitMoney,
            splitMoney.screens.map((screen) => images[screen.id]),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: splitMoney.name, path: "/split-money" },
          ]),
        ],
      },
    ),
  component: SplitMoney,
});
function SplitMoney() {
  return (
    <>
      <Page>
        <PageIntro
          eyebrow={`${splitMoney.platform} app · Personal project`}
          title={`${splitMoney.name}: ${splitMoney.tagline}`}
          description={splitMoney.description}
          aside={<AppPhones app={splitMoney} images={images} sizes={sizes} />}
          actions={
            <AppDownload app={splitMoney} className="app-intro-download" />
          }
        />
        <AppFeatures app={splitMoney} icons={splitMoneyFeatureIcons} />
        <AppScreens app={splitMoney} images={images} sizes={sizes} />
        <AppSteps app={splitMoney} />
        <AppBuild app={splitMoney} />
      </Page>
      <AppCta app={splitMoney} />
    </>
  );
}
