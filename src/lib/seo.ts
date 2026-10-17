// Browser-safe and asset-free so vite.config.ts can import it to generate sitemap.xml.
import { profile, projects, experience, type Project } from './portfolio';
import { featuredAreas, skills } from './skills';
import { certifications, sortCertifications } from './certifications';
import { courses, coursePath, type Course } from './training';

export const site = {
 url: 'https://rudresh98.github.io',
 name: 'Rudresh Oza',
 titleSuffix: 'Rudresh Oza — Cloud & GenAI',
 description: 'Rudresh Oza is a Forward Deployed Engineer (FDE) in Jaipur, India building full-stack apps, Azure and AWS cloud platforms, and Generative AI agent systems.',
 locale: 'en_US',
 // Google Search Console HTML-tag token for the https://rudresh98.github.io/ URL-prefix property.
 googleSiteVerification: 'z7GuwcmWSdVMNpiep72s-ULyfDYwrv4nQ3cQdHLqnBQ',
 image: { path: '/og-image.png', width: 1200, height: 630, alt: 'Rudresh Oza — Forward Deployed Engineer (FDE), Cloud & GenAI' },
};

// GitHub Pages serves prerendered routes as folder/index.html and 301-redirects /about to /about/,
// so the trailing-slash form is the URL that actually returns 200.
export function canonicalPath(path: string) { return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`; }
export function absoluteUrl(path: string) { return /^https?:\/\//.test(path) ? path : `${site.url}${path.startsWith('/') ? '' : '/'}${path}`; }
export function canonicalUrl(path: string) { return absoluteUrl(canonicalPath(path)); }

export const sitePages: { path: string; priority: number; changefreq: 'monthly' | 'yearly' }[] = [
 { path: '/', priority: 1, changefreq: 'monthly' },
 { path: '/about', priority: 0.8, changefreq: 'yearly' },
 { path: '/expertise', priority: 0.8, changefreq: 'monthly' },
 { path: '/experience', priority: 0.8, changefreq: 'monthly' },
 { path: '/projects', priority: 0.9, changefreq: 'monthly' },
 ...projects.map(project => ({ path: `/projects/${project.id}`, priority: 0.7, changefreq: 'yearly' as const })),
 { path: '/certifications', priority: 0.7, changefreq: 'monthly' },
 { path: '/training', priority: 0.7, changefreq: 'monthly' },
 ...courses.map(course => ({ path: coursePath(course.id), priority: 0.6, changefreq: 'yearly' as const })),
 { path: '/contact', priority: 0.6, changefreq: 'yearly' },
];

export function sitemapXml() {
 const urls = sitePages.map(page => `  <url>\n    <loc>${canonicalUrl(page.path)}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`);
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

type Meta = Record<string, unknown>;
type HeadOptions = { type?: 'website' | 'profile' | 'article'; fullTitle?: boolean; noindex?: boolean; jsonLd?: object[] };

export function pageHead(title: string, description: string, path: string, options: HeadOptions = {}) {
 const full = options.fullTitle ? title : `${title} | ${site.titleSuffix}`;
 const url = canonicalUrl(path);
 const meta: Meta[] = [
  { title: full },
  { name: 'description', content: description },
  { property: 'og:title', content: full },
  { property: 'og:description', content: description },
  { property: 'og:url', content: url },
  { property: 'og:type', content: options.type ?? 'website' },
  { name: 'twitter:title', content: full },
  { name: 'twitter:description', content: description },
 ];
 if (options.type === 'profile') meta.push({ property: 'profile:first_name', content: 'Rudresh' }, { property: 'profile:last_name', content: 'Oza' });
 if (options.noindex) meta.push({ name: 'robots', content: 'noindex, follow' });
 for (const data of options.jsonLd ?? []) meta.push({ 'script:ld+json': data });
 return { meta, links: options.noindex ? [] : [{ rel: 'canonical', href: url }] };
}

// Shared defaults for every page; route-level pageHead entries override these by name/property.
export function defaultMeta(): Meta[] {
 const image = absoluteUrl(site.image.path);
 return [
  { title: `${site.name} | Forward Deployed Engineer (FDE) — Cloud & GenAI` },
  { name: 'description', content: site.description },
  { name: 'author', content: profile.name },
  { name: 'google-site-verification', content: site.googleSiteVerification },
  { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
  // Head meta is de-duplicated by name, so only one theme-color can be emitted.
  { name: 'theme-color', content: '#fafaf8' },
  { property: 'og:site_name', content: site.name },
  { property: 'og:locale', content: site.locale },
  { property: 'og:type', content: 'website' },
  { property: 'og:image', content: image },
  { property: 'og:image:width', content: String(site.image.width) },
  { property: 'og:image:height', content: String(site.image.height) },
  { property: 'og:image:alt', content: site.image.alt },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:image', content: image },
  { name: 'twitter:image:alt', content: site.image.alt },
 ];
}

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function siteJsonLd(portraitUrl?: string) {
 const current = experience[0];
 return {
  '@context': 'https://schema.org',
  '@graph': [
   { '@type': 'WebSite', '@id': websiteId, url: canonicalUrl('/'), name: site.name, description: site.description, inLanguage: 'en', publisher: { '@id': personId } },
   {
    '@type': 'Person', '@id': personId, name: profile.name, url: canonicalUrl('/'), jobTitle: profile.role, description: site.description,
    ...(portraitUrl ? { image: absoluteUrl(portraitUrl) } : {}),
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Jaipur', addressRegion: 'Rajasthan', addressCountry: 'IN' },
    sameAs: [profile.linkedin, profile.github],
    ...(current ? { worksFor: { '@type': 'Organization', name: current.company } } : {}),
    knowsAbout: [...featuredAreas.map(area => area.title), ...skills.map(skill => skill.name)],
   },
  ],
 };
}

export function profilePageJsonLd(path: string, name: string) {
 return { '@context': 'https://schema.org', '@type': 'ProfilePage', url: canonicalUrl(path), name, isPartOf: { '@id': websiteId }, mainEntity: { '@id': personId } };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
 return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: canonicalUrl(item.path) })) };
}

export function projectListJsonLd() {
 return {
  '@context': 'https://schema.org', '@type': 'CollectionPage', url: canonicalUrl('/projects'), name: 'Selected Projects', isPartOf: { '@id': websiteId },
  mainEntity: { '@type': 'ItemList', itemListElement: projects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, name: project.title, url: canonicalUrl(`/projects/${project.id}`) })) },
 };
}

export function projectJsonLd(project: Project) {
 return {
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${canonicalUrl(`/projects/${project.id}`)}#case-study`,
  name: project.title, headline: project.title, description: project.description, url: canonicalUrl(`/projects/${project.id}`),
  genre: project.category, keywords: project.tags.join(', '), inLanguage: 'en', image: absoluteUrl(site.image.path),
  author: { '@id': personId }, creator: { '@id': personId }, isPartOf: { '@id': websiteId },
  ...(project.links?.length ? { sameAs: project.links.map(link => link.url) } : {}),
 };
}

export function certificationListJsonLd() {
 return {
  '@context': 'https://schema.org', '@type': 'CollectionPage', url: canonicalUrl('/certifications'), name: 'Certifications', isPartOf: { '@id': websiteId },
  mainEntity: {
   '@type': 'ItemList',
   itemListElement: sortCertifications(certifications).map((cert, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: { '@type': 'EducationalOccupationalCredential', name: cert.name, credentialCategory: 'certification', recognizedBy: { '@type': 'Organization', name: cert.issuer }, dateCreated: cert.issued, ...(cert.expires ? { expires: cert.expires } : {}), ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}) },
   })),
  },
 };
}

export function courseListJsonLd() {
 return {
  '@context': 'https://schema.org', '@type': 'CollectionPage', url: canonicalUrl('/training'), name: 'Training & Courses', isPartOf: { '@id': websiteId },
  mainEntity: {
   '@type': 'ItemList',
   itemListElement: courses.map((course, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: courseJsonLd(course),
   })),
  },
 };
}

export function courseJsonLd(course: Course) {
 const url = canonicalUrl(coursePath(course.id));
 return { '@context': 'https://schema.org', '@type': 'Course', '@id': `${url}#course`, name: course.title, description: course.summary, url, teaches: course.tools, inLanguage: 'en', provider: { '@id': personId }, isPartOf: { '@id': websiteId } };
}
