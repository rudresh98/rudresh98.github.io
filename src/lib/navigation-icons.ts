import {
  Accessibility,
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  House,
  Mail,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { PagePath } from "./navigation";

// Decorative, monochrome symbols keyed by page path; page labels remain the accessible names.
export const navigationIcons: Record<PagePath, LucideIcon> = {
  "/": House,
  "/about": UserRound,
  "/expertise": Sparkles,
  "/experience": BriefcaseBusiness,
  "/projects": FolderKanban,
  "/certifications": Award,
  "/training": GraduationCap,
  "/contact": Mail,
  "/accessibility": Accessibility,
};
