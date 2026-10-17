import {
  BrainCircuit,
  Building2,
  CloudCog,
  Database,
  GraduationCap,
  Layers,
  MonitorPlay,
  Rocket,
  Server,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

// Decorative, monochrome symbols keyed by course and format id; titles remain the accessible labels.
export const courseIcons: Record<string, LucideIcon> = {
  "full-stack": Layers,
  backend: Server,
  database: Database,
  infra: CloudCog,
  databricks: Warehouse,
  genai: BrainCircuit,
  fde: Rocket,
};
export const formatIcons: Record<string, LucideIcon> = {
  corporate: Building2,
  college: GraduationCap,
  institute: MonitorPlay,
  mentoring: Users,
};
