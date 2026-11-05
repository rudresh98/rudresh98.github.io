import {
  Code2,
  PenTool,
  RadioTower,
  Rocket,
  Ship,
  type LucideIcon,
} from "lucide-react";

// Decorative, monochrome symbols keyed by experience id; role and company remain the accessible text.
export const experienceIcons: Record<string, LucideIcon> = {
  "freelance-fde": Rocket,
  hornblower: Ship,
  revdau: RadioTower,
  "celebal-fullstack": Code2,
  "qualitech-freelance": PenTool,
};
