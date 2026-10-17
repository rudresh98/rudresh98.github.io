import {
  BadgeCheck,
  BrainCircuit,
  Cloud,
  CloudCog,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

// Decorative, monochrome symbols keyed by issuer group; the issuer name remains the accessible label.
export const certificationIcons: Record<string, LucideIcon> = {
  Anthropic: Sparkles,
  Microsoft: Cloud,
  AWS: CloudCog,
  "Amazon Web Services": CloudCog,
  Google: Search,
  "Google Cloud": Search,
  Databricks: Warehouse,
  Snowflake: Warehouse,
  Oracle: Warehouse,
  Cisco: Network,
  CompTIA: ShieldCheck,
  IBM: BrainCircuit,
  "DeepLearning.AI": BrainCircuit,
};
export function certificationIcon(issuer: string): LucideIcon {
  return certificationIcons[issuer] ?? BadgeCheck;
}
