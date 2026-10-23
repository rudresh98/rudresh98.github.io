import saveLink from "@/assets/stowly/stowly-save-link.png";
import homeDark from "@/assets/stowly/stowly-home-dark.png";
import homeLight from "@/assets/stowly/stowly-home-light.png";
import savedItem from "@/assets/stowly/stowly-saved-item.png";
import type { StowlyScreenId } from "./stowly";

// Screenshot assets keyed by screen id, shared by the Stowly page and its structured data.
export const stowlyScreenImages: Record<StowlyScreenId, string> = {
  "save-link": saveLink,
  "home-dark": homeDark,
  "home-light": homeLight,
  "saved-item": savedItem,
};

// Every screenshot is a 780×1688 phone capture; dimensions keep layout stable before the image loads.
export const stowlyScreenSize = { width: 780, height: 1688 };
