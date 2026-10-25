import {
  HandCoins,
  Luggage,
  Palette,
  Percent,
  Scale,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { SplitMoneyFeatureIcon } from "./split-money";

// Decorative, monochrome symbols keyed by Split Money feature; feature titles remain the accessible labels.
export const splitMoneyFeatureIcons: Record<SplitMoneyFeatureIcon, LucideIcon> =
  {
    trips: Luggage,
    split: Percent,
    balances: Scale,
    settle: HandCoins,
    invite: UserPlus,
    themes: Palette,
  };
