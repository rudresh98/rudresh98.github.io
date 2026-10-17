// Browser-safe and asset-free so seo.ts (and through it vite.config.ts) can import it.
export type Certification = {
 id: string;
 name: string;
 issuer: string;
 issued: string; // YYYY-MM
 expires?: string; // YYYY-MM; omitted when the credential does not expire
 credentialId?: string;
 verifyUrl?: string;
 skills: string[];
};
export type CertificationStatus = 'active' | 'expired';

// Verified certifications supplied by Rudresh. Names, issuers, dates, and IDs are kept exactly
// as issued; never add, infer, or reword an entry without his source.
export const certifications: Certification[] = [];

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// Fixed month names rather than Intl so prerendered and hydrated text always match.
export function formatMonth(ym: string) { const [year, month] = ym.split('-'); return `${months[Number(month) - 1]} ${year}`; }
const currentMonth = (now: Date) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
// A credential stays active through its expiry month.
export function certificationStatus(cert: Certification, now = new Date()): CertificationStatus { return cert.expires && cert.expires < currentMonth(now) ? 'expired' : 'active'; }
export function sortCertifications(list: Certification[]) { return [...list].sort((a, b) => b.issued.localeCompare(a.issued)); }
export function certificationIssuers(list: Certification[] = certifications) { return ['All', ...new Set(sortCertifications(list).map(cert => cert.issuer))]; }
export function filterCertifications(issuer: string, list: Certification[] = certifications) { return sortCertifications(list).filter(cert => issuer === 'All' || cert.issuer === issuer); }
