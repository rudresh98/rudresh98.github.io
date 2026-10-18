// Browser-safe and asset-free: every target is a plain link, so the launcher works in prerendered HTML.
import { canonicalUrl, site } from "./seo";

// The launcher always shares the homepage, whatever page the visitor is on.
export const shareUrl = canonicalUrl("/");
export const shareText = site.titleSuffix;

export type ShareTargetId =
  "whatsapp" | "instagram" | "linkedin" | "telegram" | "snapchat" | "sms";

export interface ShareTarget {
  id: ShareTargetId;
  label: string;
  href: string;
  // Opens in a new tab; the sms: scheme hands off to the messaging app in place.
  external: boolean;
  // Instagram has no link-share URL, so the link is copied before its inbox opens.
  copyFirst?: boolean;
}

const message = encodeURIComponent(`${shareText} ${shareUrl}`);
const url = encodeURIComponent(shareUrl);

// Official share links: phones route these https URLs straight into the installed app.
export const shareTargets: readonly ShareTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/?text=${message}`,
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/direct/inbox/",
    external: true,
    copyFirst: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    external: true,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: `https://t.me/share/url?url=${url}&text=${encodeURIComponent(shareText)}`,
    external: true,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    href: `https://www.snapchat.com/share?link=${url}`,
    external: true,
  },
  {
    id: "sms",
    label: "Messages",
    // `?&body=` is the form both iOS and Android accept.
    href: `sms:?&body=${message}`,
    external: false,
  },
];

// Corner variant of folder-preview's circular fan: endpoints-inclusive, from straight up to
// straight left, so a bottom-right launcher never pushes a bubble off-screen.
export function fanPositions(
  count: number,
  radius: number,
  from = Math.PI / 2,
  to = Math.PI,
) {
  return Array.from({ length: count }, (_, i) => {
    const angle = count > 1 ? from + ((to - from) * i) / (count - 1) : from;
    // `+ 0` folds -0 into 0 for the axis-aligned ends.
    return {
      x: Math.round(radius * Math.cos(angle)) + 0,
      y: Math.round(-radius * Math.sin(angle)) + 0,
    };
  });
}
