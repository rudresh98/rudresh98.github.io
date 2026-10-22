// Browser-safe and asset-free: the Stowly page, SEO module, sitemap, and llms.txt all read from here.
// Features describe only what the app really does, as shown in its screens; screenshots are imported by
// the presentation component, keyed by screen id.

export type StowlyFeatureIcon =
  "share" | "collections" | "focus" | "note" | "pin" | "actions";

export type StowlyScreenId =
  "save-link" | "home-dark" | "home-light" | "saved-item";

export type StowlyApp = {
  name: string;
  tagline: string;
  description: string;
  platform: "Android";
  category: string;
  // Unset until the APK is published; the download stays a disabled "coming soon" button until then.
  apkUrl?: string;
  features: { title: string; body: string; icon: StowlyFeatureIcon }[];
  steps: { title: string; body: string }[];
  screens: {
    id: StowlyScreenId;
    title: string;
    caption: string;
    alt: string;
  }[];
};

export const stowly: StowlyApp = {
  name: "Stowly",
  tagline: "Every link you save, in one calm place.",
  description:
    "Stowly is an Android app for saving links from any app into collections, with automatic previews, notes, and a Focus mode for working through what you saved.",
  platform: "Android",
  category: "Link saving & bookmarks",
  features: [
    {
      title: "Save from anywhere",
      body: "Share a link to Stowly or paste it in. It fetches the title and source for you, and you can tap the title to rename it.",
      icon: "share",
    },
    {
      title: "Collections that stay tidy",
      body: "File saves into collections like Recipes, Travel, or Reading, create new ones on the spot, or leave them in Unsorted for later.",
      icon: "collections",
    },
    {
      title: "Focus mode",
      body: "Swipe through new saves one at a time, and see at a glance how many saves you have never opened.",
      icon: "focus",
    },
    {
      title: "Notes, photos, and tags",
      body: "Add a note on why you saved something, attach a screenshot or photo, and tag saves so they are easy to find.",
      icon: "note",
    },
    {
      title: "Pinned and recent",
      body: "Pin the saves you keep coming back to, browse recent ones by newest, and search across everything.",
      icon: "pin",
    },
    {
      title: "Every action in reach",
      body: "Pin, move, share, copy the link, or delete from any save, then open it straight in YouTube, Instagram, or the browser.",
      icon: "actions",
    },
  ],
  steps: [
    {
      title: "Save",
      body: "Share or paste a link. Stowly grabs the preview so you never have to type a title.",
    },
    {
      title: "Sort",
      body: "Pick a collection, add a note or tag, and save. Unsure? Unsorted holds it for later.",
    },
    {
      title: "Revisit",
      body: "Focus mode walks you through new saves, and pinned saves stay one tap away.",
    },
  ],
  screens: [
    {
      id: "save-link",
      title: "Save a link",
      caption:
        "Paste or share a link, get the preview, add a note, and choose a collection.",
      alt: "Stowly's Save a link sheet with a YouTube link, its fetched preview, a note field, and collection chips for Unsorted, Recipes, Travel, and Reading.",
    },
    {
      id: "home-dark",
      title: "Your saves, dark",
      caption:
        "Focus mode, collection filters, pinned saves, and recent saves in the dark theme.",
      alt: "Stowly's home screen in dark theme showing 48 saves, a Focus mode card for 7 new saves, collection filters, pinned saves, and recent saves.",
    },
    {
      id: "home-light",
      title: "Your saves, light",
      caption: "The same home screen in the light theme.",
      alt: "Stowly's home screen in light theme with the Focus mode card, collection filters, pinned saves, and recent saves.",
    },
    {
      id: "saved-item",
      title: "A saved item",
      caption:
        "Collection, tags, your note, and quick actions, with one tap to open the original.",
      alt: "A saved YouTube recipe in Stowly marked never opened, with its collection, tags, a note, and pin, move, share, copy link, delete, and Open in YouTube actions.",
    },
  ],
};
