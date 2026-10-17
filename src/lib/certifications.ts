// Browser-safe and asset-free so seo.ts (and through it vite.config.ts) can import it.
export type Certification = {
  id: string;
  name: string;
  issuer: string;
  group?: string; // filter label when the issuer is a sub-brand, e.g. Anthropic Education under Anthropic
  issued: string; // YYYY-MM
  expires?: string; // YYYY-MM; omitted when the credential does not expire
  credentialId?: string;
  verifyUrl?: string;
  skills: string[];
};
export type CertificationStatus = "active" | "expired";

// Verified certifications supplied by Rudresh, each checked against its issuer's public credential
// record on 2026-10-18. Names, issuers, and dates are kept exactly as issued; never add, infer, or
// reword an entry without his source. Skills are the issuer's badge tags where it publishes them.
export const certifications: Certification[] = [
  {
    id: "claude-developer-foundations",
    name: "Claude Certified Developer - Foundations",
    issuer: "Anthropic",
    issued: "2026-10",
    expires: "2027-10",
    verifyUrl:
      "https://www.credly.com/badges/1ae249a6-4a76-4b8a-aa88-cb89b0ca1f1b",
    skills: [
      "Claude API integration",
      "Agent development",
      "MCP Server Development",
      "Prompt Engineering",
    ],
  },
  {
    id: "databricks-data-engineer-professional",
    name: "Databricks Certified Data Engineer Professional",
    issuer: "Databricks Academy",
    group: "Databricks",
    issued: "2026-09",
    expires: "2028-09",
    verifyUrl:
      "https://credentials.databricks.com/fcc6d453-cf3d-4f5d-8dfd-d88fa46ce62b",
    skills: ["Databricks", "Data Engineering"],
  },
  {
    id: "databricks-data-engineer-associate",
    name: "Databricks Certified Data Engineer Associate",
    issuer: "Databricks Academy",
    group: "Databricks",
    issued: "2026-07",
    expires: "2028-07",
    verifyUrl:
      "https://credentials.databricks.com/ef61f98f-ad49-48a1-90c7-1b8247bc13a2",
    skills: ["Databricks", "Data Engineering"],
  },
  {
    id: "claude-101",
    name: "Claude 101",
    issuer: "Anthropic Education",
    group: "Anthropic",
    issued: "2026-07",
    verifyUrl: "https://verify.skilljar.com/c/uwdfbwd773oi",
    skills: ["Claude"],
  },
  {
    id: "azure-fundamentals",
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    issued: "2021-02",
    verifyUrl:
      "https://www.credly.com/badges/c98f054b-3cda-455e-b26b-6a6afb2ff137",
    skills: ["Azure", "Cloud Services", "Cloud Security", "Cloud Networking"],
  },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// Fixed month names rather than Intl so prerendered and hydrated text always match.
export function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}
const currentMonth = (now: Date) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
// A credential stays active through its expiry month.
export function certificationStatus(
  cert: Certification,
  now = new Date(),
): CertificationStatus {
  return cert.expires && cert.expires < currentMonth(now)
    ? "expired"
    : "active";
}
export function certificationGroup(cert: Certification) {
  return cert.group ?? cert.issuer;
}
export function sortCertifications(list: Certification[]) {
  return [...list].sort((a, b) => b.issued.localeCompare(a.issued));
}
export function certificationIssuers(list: Certification[] = certifications) {
  return ["All", ...new Set(sortCertifications(list).map(certificationGroup))];
}
export function filterCertifications(
  issuer: string,
  list: Certification[] = certifications,
) {
  return sortCertifications(list).filter(
    (cert) => issuer === "All" || certificationGroup(cert) === issuer,
  );
}
