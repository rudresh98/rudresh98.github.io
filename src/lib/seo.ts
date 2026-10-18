// Browser-safe and asset-free so vite.config.ts can import it to generate sitemap.xml.
import {
  achievements,
  profile,
  projects,
  experience,
  type Project,
} from "./portfolio";
import { featuredAreas, skills } from "./skills";
import { certifications, sortCertifications } from "./certifications";
import { courses, coursePath, trainingFormats, type Course } from "./training";

export const site = {
  url: "https://rudresh98.github.io",
  name: "Rudresh Oza",
  titleSuffix: "Rudresh Oza — Forward Deployed Engineer (FDE)",
  description:
    "Rudresh Oza is a Forward Deployed Engineer (FDE) in Jaipur, India building full-stack apps, Azure and AWS cloud platforms, and Generative AI agent systems.",
  locale: "en_US",
  // Google Search Console HTML-tag tokens for the https://rudresh98.github.io/ URL-prefix property;
  // each verified owner keeps its own token, so remove one only when that owner is dropped.
  googleSiteVerifications: [
    "z7GuwcmWSdVMNpiep72s-ULyfDYwrv4nQ3cQdHLqnBQ",
    "q-iQTVic2hMCEw7MJubIRgmtgNvWUBi4WEI3A8Yv38o",
  ],
  image: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Rudresh Oza — Forward Deployed Engineer (FDE), Cloud & GenAI",
  },
};

// GitHub Pages serves prerendered routes as folder/index.html and 301-redirects /about to /about/,
// so the trailing-slash form is the URL that actually returns 200.
export function canonicalPath(path: string) {
  return path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
}
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path)
    ? path
    : `${site.url}${path.startsWith("/") ? "" : "/"}${path}`;
}
export function canonicalUrl(path: string) {
  return absoluteUrl(canonicalPath(path));
}

// Search titles (≤60 chars) and descriptions (≤160 chars) per static page, written for training
// clients, project clients, and recruiters in remote/global and India searches.
export const pageSeo = {
  "/": {
    title: "Rudresh Oza — Forward Deployed Engineer & GenAI Developer",
    description:
      "Hire Rudresh Oza, a Forward Deployed Engineer in Jaipur, India building GenAI agents, full-stack apps, and AWS and Azure cloud platforms for remote teams.",
  },
  "/about": {
    title: "About Rudresh Oza — Full-Stack, Cloud & GenAI Engineer",
    description: `Meet Rudresh Oza, a product-minded Forward Deployed Engineer in Jaipur, India with ${profile.experience} years building web apps, cloud platforms, and AI-powered products.`,
  },
  "/expertise": {
    title: "Expertise: React, Node, Python, Cloud & GenAI | Rudresh Oza",
    description:
      "Rudresh Oza’s skills in React, Next.js, Node.js, Python and FastAPI, AWS and Azure, LangChain and LangGraph agents, RAG, and Databricks data engineering.",
  },
  "/experience": {
    title: "Experience — Forward Deployed Engineer | Rudresh Oza",
    description: `Rudresh Oza’s ${profile.experience} year career: Forward Deployed Engineer at Celebal Technologies, software engineer at HornBlower and RevDau, and a technical trainer.`,
  },
  "/projects": {
    title: "Projects & Case Studies — GenAI, Cloud, Web | Rudresh Oza",
    description:
      "Case studies by Rudresh Oza: AI agents for Pollstar, a supply chain digital twin, booking platforms, mobile apps with on-device ML, and Next.js websites.",
  },
  "/certifications": {
    title: "Certifications — Claude, Databricks, Azure | Rudresh Oza",
    description:
      "Verified credentials held by Rudresh Oza: Claude Certified Developer, Databricks Data Engineer Professional and Associate, and Microsoft Azure Fundamentals.",
  },
  "/training": {
    title: "GenAI, Full Stack & Databricks Training | Rudresh Oza",
    description:
      "Corporate training and online courses by Rudresh Oza in Jaipur, India: GenAI, full stack, backend, cloud, Databricks, and Forward Deployed Engineering.",
  },
  "/contact": {
    title: "Contact & Hire Rudresh Oza — Remote Developer, India",
    description:
      "Contact Rudresh Oza to hire a remote GenAI, full-stack, or cloud developer, book corporate training, or discuss Forward Deployed Engineer roles.",
  },
} as const;
export type SeoPath = keyof typeof pageSeo;

// Trim generated descriptions to the 160 characters search results show, at a word boundary.
export function metaDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:—-]+$/, "")}…`;
}
const fitTitle = (...candidates: string[]) =>
  candidates.find((title) => title.length <= 60) ??
  candidates[candidates.length - 1]!;
export function projectSeo(project: Project) {
  return {
    title: fitTitle(
      `${project.title} Case Study | Rudresh Oza`,
      `${project.title} | Rudresh Oza`,
    ),
    // The name leads so it survives trimming.
    description: metaDescription(
      `Rudresh Oza case study${project.client ? ` for ${project.client}` : ""}: ${project.description}`,
    ),
  };
}
export function courseSeo(course: Course) {
  return {
    title: fitTitle(
      `${course.title} Course & Training | Rudresh Oza`,
      `${course.title} Course | Rudresh Oza`,
      `${course.title} | Rudresh Oza`,
    ),
    description: metaDescription(
      `${course.hours}-hour, ${course.modules.length}-module course by Rudresh Oza, online or on-site: ${course.summary}`,
    ),
  };
}

export const sitePages: {
  path: string;
  priority: number;
  changefreq: "monthly" | "yearly";
}[] = [
  { path: "/", priority: 1, changefreq: "monthly" },
  { path: "/about", priority: 0.8, changefreq: "yearly" },
  { path: "/expertise", priority: 0.8, changefreq: "monthly" },
  { path: "/experience", priority: 0.8, changefreq: "monthly" },
  { path: "/projects", priority: 0.9, changefreq: "monthly" },
  ...projects.map((project) => ({
    path: `/projects/${project.id}`,
    priority: 0.7,
    changefreq: "yearly" as const,
  })),
  { path: "/certifications", priority: 0.7, changefreq: "monthly" },
  // Training is the primary selling page.
  { path: "/training", priority: 0.9, changefreq: "monthly" },
  ...courses.map((course) => ({
    path: coursePath(course.id),
    priority: 0.6,
    changefreq: "yearly" as const,
  })),
  { path: "/contact", priority: 0.6, changefreq: "yearly" },
];

// The date site content last changed. Bump it whenever pages, projects, courses, or credentials
// change, so sitemap lastmod stays truthful instead of moving with every deploy.
export const contentUpdated = "2026-10-18";

export function sitemapXml() {
  const urls = sitePages.map(
    (page) =>
      `  <url>\n    <loc>${canonicalUrl(page.path)}</loc>\n    <lastmod>${contentUpdated}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

type Meta = Record<string, unknown>;
type HeadOptions = {
  type?: "website" | "profile" | "article";
  fullTitle?: boolean;
  noindex?: boolean;
  jsonLd?: object[];
};

export function pageHead(
  title: string,
  description: string,
  path: string,
  options: HeadOptions = {},
) {
  const full = options.fullTitle ? title : `${title} | ${site.titleSuffix}`;
  const url = canonicalUrl(path);
  const meta: Meta[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: options.type ?? "website" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (options.type === "profile")
    meta.push(
      { property: "profile:first_name", content: "Rudresh" },
      { property: "profile:last_name", content: "Oza" },
    );
  if (options.noindex)
    meta.push({ name: "robots", content: "noindex, follow" });
  for (const data of options.jsonLd ?? [])
    meta.push({ "script:ld+json": data });
  return {
    meta,
    links: options.noindex ? [] : [{ rel: "canonical", href: url }],
  };
}

// Shared defaults for every page; route-level pageHead entries override these by name/property.
export function defaultMeta(): Meta[] {
  const image = absoluteUrl(site.image.path);
  return [
    { title: pageSeo["/"].title },
    { name: "description", content: site.description },
    { name: "author", content: profile.name },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1",
    },
    // Head meta is de-duplicated by name, so only one theme-color can be emitted.
    { name: "theme-color", content: "#fafaf8" },
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: site.locale },
    { property: "og:type", content: "website" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: String(site.image.width) },
    { property: "og:image:height", content: String(site.image.height) },
    { property: "og:image:alt", content: site.image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: site.image.alt },
  ];
}

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function siteJsonLd(portraitUrl?: string) {
  const current = experience[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Google's site-name system reads name and alternateName from the homepage WebSite node.
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: canonicalUrl("/"),
        name: site.name,
        alternateName: ["Rudresh Oza Portfolio", "rudresh98.github.io"],
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: canonicalUrl("/"),
        jobTitle: profile.role,
        description: site.description,
        ...(portraitUrl ? { image: absoluteUrl(portraitUrl) } : {}),
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jaipur",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
        sameAs: [profile.linkedin, profile.github],
        ...(current
          ? { worksFor: { "@type": "Organization", name: current.company } }
          : {}),
        knowsAbout: [
          ...featuredAreas.map((area) => area.title),
          ...skills.map((skill) => skill.name),
        ],
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Poornima Institute of Engineering & Technology",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jaipur",
            addressCountry: "IN",
          },
        },
        hasCredential: sortCertifications(certifications).map(credentialJsonLd),
        seeks: {
          "@type": "Demand",
          description:
            "Remote Forward Deployed Engineer, GenAI, and full-stack engineering roles with international teams.",
        },
      },
    ],
  };
}

export function profilePageJsonLd(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: canonicalUrl(path),
    name,
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": personId },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function projectListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: canonicalUrl("/projects"),
    name: "Selected Projects",
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: canonicalUrl(`/projects/${project.id}`),
      })),
    },
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalUrl(`/projects/${project.id}`)}#case-study`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: canonicalUrl(`/projects/${project.id}`),
    genre: project.category,
    keywords: project.tags.join(", "),
    inLanguage: "en",
    image: absoluteUrl(site.image.path),
    author: { "@id": personId },
    creator: { "@id": personId },
    isPartOf: { "@id": websiteId },
    ...(project.links?.length
      ? { sameAs: project.links.map((link) => link.url) }
      : {}),
  };
}

function credentialJsonLd(cert: (typeof certifications)[number]) {
  return {
    "@type": "EducationalOccupationalCredential",
    name: cert.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: cert.issuer },
    dateCreated: cert.issued,
    ...(cert.expires ? { expires: cert.expires } : {}),
    ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}),
  };
}

export function certificationListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: canonicalUrl("/certifications"),
    name: "Certifications",
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortCertifications(certifications).map(
        (cert, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: credentialJsonLd(cert),
        }),
      ),
    },
  };
}

export function courseListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: canonicalUrl("/training"),
    name: "Training & Courses",
    isPartOf: { "@id": websiteId },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: courses.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: courseJsonLd(course),
      })),
    },
  };
}

export function courseJsonLd(course: Course) {
  const url = canonicalUrl(coursePath(course.id));
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name: course.title,
    description: course.summary,
    url,
    teaches: course.tools,
    inLanguage: "en",
    provider: { "@id": personId },
    isPartOf: { "@id": websiteId },
    // Delivery modes come from the confirmed training formats and workload from the confirmed course hours;
    // no price or dates are stated.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Online", "Onsite"],
      courseWorkload: `PT${course.hours}H`,
      instructor: { "@id": personId },
    },
    offers: { "@type": "Offer", category: "Paid", url },
  };
}

// llms.txt: a plain-text site summary for AI answer engines, generated from the same data as the pages.
export function llmsTxt() {
  const line = (label: string, path: string, note: string) =>
    `- [${label}](${canonicalUrl(path)}): ${note}`;
  return [
    `# ${profile.name}`,
    "",
    `> ${site.description} Available for remote work worldwide and on-site in Jaipur, India.`,
    "",
    "## Training courses",
    ...courses.map((course) =>
      line(
        course.title,
        coursePath(course.id),
        `${course.hours} hours. ${course.summary}`,
      ),
    ),
    `Formats: ${trainingFormats.map((format) => format.title).join("; ")}. ${achievements.studentsTrained.toLocaleString("en-US")}+ students trained.`,
    "",
    "## Case studies",
    ...projects.map((project) =>
      line(project.title, `/projects/${project.id}`, project.description),
    ),
    "",
    "## Certifications",
    ...sortCertifications(certifications).map(
      (cert) =>
        `- ${cert.name} — ${cert.issuer}${cert.verifyUrl ? ` (${cert.verifyUrl})` : ""}`,
    ),
    "",
    "## Contact",
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    line("Contact page", "/contact", "Hire, training, and role enquiries"),
    "",
  ].join("\n");
}
