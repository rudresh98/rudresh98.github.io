import home from "@/assets/snugbox/snugbox-home.png";
import settings from "@/assets/snugbox/snugbox-settings.png";
import themes from "@/assets/snugbox/snugbox-themes.png";
import type { SnugboxScreenId } from "./snugbox";

// Screenshot assets keyed by screen id, shared by the Snugbox page and its structured data.
export const snugboxScreenImages: Record<SnugboxScreenId, string> = {
  home,
  settings,
  themes,
};

// Phone captures are 780×1688 and the theme sheet is wide; dimensions keep layout stable before images load.
export const snugboxScreenSizes: Record<
  SnugboxScreenId,
  { width: number; height: number }
> = {
  home: { width: 780, height: 1688 },
  settings: { width: 780, height: 1688 },
  themes: { width: 3200, height: 1520 },
};
