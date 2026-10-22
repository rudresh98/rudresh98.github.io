import {
  FolderOpen,
  Layers,
  Pin,
  Share2,
  StickyNote,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { StowlyFeatureIcon } from "./stowly";

// Decorative, monochrome symbols keyed by Stowly feature; feature titles remain the accessible labels.
export const stowlyFeatureIcons: Record<StowlyFeatureIcon, LucideIcon> = {
  share: Share2,
  collections: FolderOpen,
  focus: Layers,
  note: StickyNote,
  pin: Pin,
  actions: Zap,
};
