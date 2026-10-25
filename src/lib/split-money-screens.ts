import home from "@/assets/split-money/split-money-home.jpg";
import homeDark from "@/assets/split-money/split-money-home-dark.jpg";
import trip from "@/assets/split-money/split-money-trip.jpg";
import expense from "@/assets/split-money/split-money-expense.jpg";
import type { SplitMoneyScreenId } from "./split-money";

// Screenshot assets keyed by screen id, shared by the Split Money page and its structured data.
export const splitMoneyScreenImages: Record<SplitMoneyScreenId, string> = {
  home,
  trip,
  expense,
  "home-dark": homeDark,
};

// Phone captures are 780×1688; dimensions keep layout stable before images load.
export const splitMoneyScreenSizes: Record<
  SplitMoneyScreenId,
  { width: number; height: number }
> = {
  home: { width: 780, height: 1688 },
  trip: { width: 780, height: 1688 },
  expense: { width: 780, height: 1688 },
  "home-dark": { width: 780, height: 1688 },
};
