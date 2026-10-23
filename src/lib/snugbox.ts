// Browser-safe and asset-free: the Snugbox page, SEO module, sitemap, and llms.txt all read from here.
// Features describe only what the app really does, as shown in its screens; screenshots are imported by
// the presentation component, keyed by screen id.

export type SnugboxFeatureIcon =
  "share" | "collections" | "focus" | "themes" | "reminders" | "backup";

export type SnugboxScreenId = "home" | "settings" | "themes";

export type SnugboxApp = {
  name: string;
  tagline: string;
  description: string;
  platform: "Android";
  category: string;
  // Unset until the APK is published; the download stays a disabled "coming soon" button until then.
  // An external URL (a file host) opens in a new tab; a same-site path downloads directly.
  apkUrl?: string;
  // Named in the button's new-tab notice and the note beneath it.
  apkHost?: string;
  // Shown beside the button so visitors know the download size; update it with each release.
  apkSize?: string;
  // The /snugbox link-preview card in public/, so shared links show the app instead of the site card.
  shareImage: { path: string; width: number; height: number; alt: string };
  features: { title: string; body: string; icon: SnugboxFeatureIcon }[];
  steps: { title: string; body: string }[];
  screens: {
    id: SnugboxScreenId;
    title: string;
    caption: string;
    alt: string;
  }[];
};

export const snugbox: SnugboxApp = {
  name: "Snugbox",
  tagline: "Every link you save, in one calm place.",
  description:
    "Snugbox is an Android app for saving links from any app into collections, with automatic previews, a Focus mode for working through new saves, and five color themes.",
  platform: "Android",
  category: "Link saving & bookmarks",
  apkUrl:
    "https://drive.google.com/file/d/1zxuO-b3duL0mXdOSuzO7p7NBQyjglGyI/view?usp=sharing",
  apkHost: "Google Drive",
  apkSize: "66.4 MB",
  shareImage: {
    path: "/snugbox-og.jpg",
    width: 1200,
    height: 630,
    alt: "Snugbox's home and settings screens beside the tagline Every link you save, in one calm place.",
  },
  features: [
    {
      title: "Save from anywhere",
      body: "Share a link to Snugbox from any app, or add one with the + button. It fetches the title and source for you.",
      icon: "share",
    },
    {
      title: "Collections that stay tidy",
      body: "File saves into collections like Recipes, Travel, or Reading, filter by them from home, sort by newest, or search across everything.",
      icon: "collections",
    },
    {
      title: "Focus mode",
      body: "See at a glance how many saves are new, then swipe through them one at a time.",
      icon: "focus",
    },
    {
      title: "Five color themes",
      body: "Pick Slate, Harbor, Sage, Rosewater, or Dusk. Each has a light and a dark version, and appearance can follow your system.",
      icon: "themes",
    },
    {
      title: "Gentle reminders",
      body: "Turn on a nudge about new saves and choose how often it comes, like every three days.",
      icon: "reminders",
    },
    {
      title: "Backup and import",
      body: "Export a backup of your saves, or import the bookmarks you already have.",
      icon: "backup",
    },
  ],
  steps: [
    {
      title: "Save",
      body: "Share or paste a link. Snugbox grabs the preview so you never have to type a title.",
    },
    {
      title: "Sort",
      body: "Pick a collection, then filter your saves by it or search when you need something.",
    },
    {
      title: "Revisit",
      body: "Focus mode walks you through new saves, and a reminder nudges you when they pile up.",
    },
  ],
  screens: [
    {
      id: "home",
      title: "Your saves",
      caption:
        "Focus mode, collection filters, and recent saves, here in the Harbor theme.",
      alt: "Snugbox's home screen in the Harbor theme showing 128 saves with 7 new, a Focus mode card, filters for All, Recipes, Travel, and Reading, and recent saves from YouTube, Instagram, and the web.",
    },
    {
      id: "settings",
      title: "Settings",
      caption:
        "Pick a theme and appearance, set reminders, and back up your saves.",
      alt: "Snugbox's settings screen in the default Slate theme with theme cards for Slate, Harbor, and Sage, a System, Light, and Dark appearance switch, a reminder every 3 days about new saves, and Export backup and Import bookmarks.",
    },
    {
      id: "themes",
      title: "Five color themes",
      caption:
        "Harbor, Slate, Sage, Rosewater, and Dusk, each in light and dark. Slate is the default.",
      alt: "Snugbox's five color themes, Harbor, Slate, Sage, Rosewater, and Dusk, each showing the same collection chips and saved YouTube recipe in a light and a dark version.",
    },
  ],
};
