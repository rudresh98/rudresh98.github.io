import {
  BellRing,
  DatabaseBackup,
  FolderOpen,
  Layers,
  Palette,
  Share2,
  type LucideIcon,
} from "lucide-react";
import type { SnugboxFeatureIcon } from "./snugbox";

// Decorative, monochrome symbols keyed by Snugbox feature; feature titles remain the accessible labels.
export const snugboxFeatureIcons: Record<SnugboxFeatureIcon, LucideIcon> = {
  share: Share2,
  collections: FolderOpen,
  focus: Layers,
  themes: Palette,
  reminders: BellRing,
  backup: DatabaseBackup,
};
