// Browser-safe and asset-free: the dock, mobile sheet, and command palette all read from here.
import { profile, projects } from "./portfolio";
import { courses, coursePath } from "./training";
import { certifications, sortCertifications } from "./certifications";
import { canonicalPath } from "./seo";

export const navigation = [
  {
    label: "Home",
    to: "/",
    primary: true,
    summary: "Forward Deployed Engineer · Cloud & GenAI",
  },
  {
    label: "About",
    to: "/about",
    primary: false,
    summary: "The engineer behind the work",
  },
  {
    label: "Expertise",
    to: "/expertise",
    primary: false,
    summary: "Skills across the stack",
  },
  {
    label: "Experience",
    to: "/experience",
    primary: false,
    summary: `${profile.experience} years of engineering roles`,
  },
  {
    label: "Projects",
    to: "/projects",
    primary: true,
    summary: "Case studies & live client work",
  },
  {
    label: "Certifications",
    to: "/certifications",
    primary: false,
    summary: "Verified credentials",
  },
  {
    label: "Training",
    to: "/training",
    primary: true,
    summary: "Courses I teach",
  },
  {
    label: "Contact",
    to: "/contact",
    primary: true,
    summary: "Start a conversation",
  },
] as const;
export type NavItem = (typeof navigation)[number];
export type NavPath = NavItem["to"];
// Live counts shown on dock previews, read from the same data the pages render.
export function navCount(path: string) {
  if (path === "/projects") return projects.length;
  if (path === "/training") return courses.length;
  if (path === "/certifications") return certifications.length;
  return undefined;
}
// Dock hover previews frame the real page with ?preview=1, which hides the dock and palette inside it.
// The trailing-slash path loads the prerendered page directly instead of through a GitHub Pages redirect.
export function previewHref(path: string) {
  return `${canonicalPath(path)}?preview=1`;
}
export function isPreviewSearch(search: unknown) {
  const value =
    typeof search === "object" && search !== null
      ? (search as Record<string, unknown>)["preview"]
      : undefined;
  return value === 1 || value === "1" || value === true;
}
// Home matches exactly; every other link stays active on nested routes such as /projects/$projectId.
export const activeOptions = (to: string) => ({ exact: to === "/" });

export type CommandGroup = "Pages" | "Projects" | "Courses" | "Certifications";
export type CommandEntry = {
  id: string;
  group: CommandGroup;
  label: string;
  meta?: string;
  keywords: string[];
  href: string;
  external?: boolean;
};

// Everything the ⌘K palette can jump to, built from the same data modules every page renders.
export function commandIndex(): CommandEntry[] {
  return [
    ...navigation.map((item) => ({
      id: `page:${item.to}`,
      group: "Pages" as const,
      label: item.label,
      keywords: [item.label],
      href: item.to,
    })),
    ...projects.map((project) => ({
      id: `project:${project.id}`,
      group: "Projects" as const,
      label: project.title,
      meta: project.client ?? project.category,
      keywords: [
        project.title,
        project.category,
        ...(project.client ? [project.client] : []),
        ...project.tags,
      ],
      href: `/projects/${project.id}`,
    })),
    ...courses.map((course) => ({
      id: `course:${course.id}`,
      group: "Courses" as const,
      label: course.title,
      meta: course.category,
      keywords: [course.title, course.category, ...course.tools],
      href: coursePath(course.id),
    })),
    ...sortCertifications(certifications)
      .filter((cert) => cert.verifyUrl)
      .map((cert) => ({
        id: `cert:${cert.id}`,
        group: "Certifications" as const,
        label: cert.name,
        meta: cert.issuer,
        keywords: [cert.name, cert.issuer, ...cert.skills],
        href: cert.verifyUrl!,
        external: true,
      })),
  ];
}
export const commandGroups: CommandGroup[] = [
  "Pages",
  "Projects",
  "Courses",
  "Certifications",
];
export const socialLinks = {
  linkedin: profile.linkedin,
  github: profile.github,
  email: profile.email,
};
