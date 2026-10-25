// Browser-safe and asset-free: every app page, the SEO module, sitemap, llms.txt, and share read from here.
// Each app keeps its copy in its own module; screenshots and icons are imported by presentation, keyed by id.
import type { SocialImage } from "./seo";
import { snugbox } from "./snugbox";
import { splitMoney } from "./split-money";

export type AppPath = "/snugbox" | "/split-money";

export type AppShowcase<
  FeatureIcon extends string = string,
  ScreenId extends string = string,
> = {
  name: string;
  path: AppPath;
  tagline: string;
  description: string;
  platform: "Android";
  category: string;
  // schema.org SoftwareApplication category, e.g. UtilitiesApplication.
  applicationCategory: string;
  // Unset until the APK is published; the download stays a disabled "coming soon" button until then.
  // An external URL (a file host) opens in a new tab; a same-site path downloads directly.
  apkUrl?: string;
  // Named in the button's new-tab notice and the note beneath it.
  apkHost?: string;
  // Shown beside the button so visitors know the download size; update it with each release.
  apkSize?: string;
  // A link-preview card in public/. Only an app with its own card shares its page instead of the homepage.
  shareImage?: SocialImage;
  // The intro figure fans two screens together; the front one also fronts the Projects band.
  hero: { label: string; back: ScreenId; front: ScreenId };
  headings: {
    features: string;
    steps: string;
    screens: { title: string; description: string };
    build?: string;
    // The closing call to action's two lines; the second is set in the primary color.
    cta: [string, string];
  };
  features: { title: string; body: string; icon: FeatureIcon }[];
  steps: { title: string; body: string }[];
  screens: {
    id: ScreenId;
    title: string;
    caption: string;
    alt: string;
  }[];
  // How the app is built, for an optional "Under the hood" section.
  build?: { title: string; body: string }[];
};

export const apps: AppShowcase[] = [snugbox, splitMoney];
