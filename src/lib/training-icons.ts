import { BrainCircuit, Building2, GraduationCap, Layers, MonitorPlay, Users, type LucideIcon } from 'lucide-react';

// Decorative, monochrome symbols keyed by course and format id; titles remain the accessible labels.
export const courseIcons: Record<string, LucideIcon> = {
 'full-stack': Layers,
 'genai': BrainCircuit,
};
export const formatIcons: Record<string, LucideIcon> = {
 'corporate': Building2,
 'college': GraduationCap,
 'institute': MonitorPlay,
 'mentoring': Users,
};
