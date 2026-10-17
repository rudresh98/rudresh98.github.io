import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BadgeCheck } from 'lucide-react';

import { CertificationGrid } from '@/components/portfolio/certifications';
import { certificationIcon } from '@/lib/certification-icons';
import { certifications, certificationGroup, certificationIssuers, certificationStatus, filterCertifications, formatMonth, type Certification } from '@/lib/certifications';
import { certificationListJsonLd } from '@/lib/seo';

// Test-only fixtures exercising the renderer; they never reach the site.
const fixtures: Certification[] = [
 { id: 'fixture-a', name: 'Fixture Cloud Associate', issuer: 'Microsoft', issued: '2024-03', expires: '2025-03', credentialId: 'ABC-123', verifyUrl: 'https://example.com/a', skills: ['Azure'] },
 { id: 'fixture-b', name: 'Fixture AI Practitioner', issuer: 'AWS', issued: '2025-06', skills: ['Bedrock'] },
 { id: 'fixture-c', name: 'Fixture Data Engineer', issuer: 'Microsoft', issued: '2025-01', expires: '2099-01', skills: [] },
];
const month = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('Verified certifications data', () => {
 it('keeps unique ids, valid month dates, and https verification links', () => {
  expect(new Set(certifications.map(c => c.id)).size).toBe(certifications.length);
  for (const cert of certifications) {
   expect(cert.issued).toMatch(month);
   if (cert.expires) { expect(cert.expires).toMatch(month); expect(cert.expires > cert.issued).toBe(true); }
   if (cert.verifyUrl) expect(new URL(cert.verifyUrl).protocol).toBe('https:');
   expect(certificationIcon(certificationGroup(cert))).not.toBe(BadgeCheck);
  }
 });
 it('keeps the five confirmed credentials exactly as issued, newest first', () => {
  expect(filterCertifications('All').map(c => c.name)).toEqual([
   'Claude Certified Developer - Foundations',
   'Databricks Certified Data Engineer Professional',
   'Databricks Certified Data Engineer Associate',
   'Claude 101',
   'Microsoft Certified: Azure Fundamentals',
  ]);
  for (const cert of certifications) expect(['www.credly.com', 'credentials.databricks.com', 'verify.skilljar.com']).toContain(new URL(cert.verifyUrl!).host);
 });
 it('groups sub-brand issuers for filtering while keeping the exact issuer name', () => {
  expect(certificationIssuers()).toEqual(['All', 'Anthropic', 'Databricks', 'Microsoft']);
  const anthropic = filterCertifications('Anthropic');
  expect(anthropic.map(c => c.id)).toEqual(['claude-developer-foundations', 'claude-101']);
  expect(anthropic.map(c => c.issuer)).toEqual(['Anthropic', 'Anthropic Education']);
 });
 it('lists every certification in structured data', () => {
  expect(certificationListJsonLd().mainEntity.itemListElement).toHaveLength(certifications.length);
 });
});

describe('Certification helpers', () => {
 it('formats months without locale drift', () => {
  expect(formatMonth('2025-03')).toBe('Mar 2025');
  expect(formatMonth('2024-12')).toBe('Dec 2024');
 });
 it('stays active through the expiry month', () => {
  const cert = fixtures[0]!;
  expect(certificationStatus(cert, new Date(2025, 2, 31))).toBe('active');
  expect(certificationStatus(cert, new Date(2025, 3, 1))).toBe('expired');
  expect(certificationStatus(fixtures[1]!, new Date(2100, 0, 1))).toBe('active');
 });
 it('sorts newest first and filters by issuer', () => {
  expect(filterCertifications('All', fixtures).map(c => c.id)).toEqual(['fixture-b', 'fixture-c', 'fixture-a']);
  expect(filterCertifications('Microsoft', fixtures).map(c => c.id)).toEqual(['fixture-c', 'fixture-a']);
  expect(certificationIssuers(fixtures)).toEqual(['All', 'AWS', 'Microsoft']);
 });
 it('falls back to a generic badge for unmapped issuers', () => {
  expect(certificationIcon('Unknown Issuer')).toBe(BadgeCheck);
 });
});

describe('CertificationGrid', () => {
 it('shows an empty state instead of placeholder credentials', () => {
  render(<CertificationGrid items={[]} />);
  expect(screen.getByRole('heading', { name: 'Certifications coming soon' })).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
 });
 it('renders each credential with its details and verification link', () => {
  render(<CertificationGrid items={fixtures} />);
  const cards = screen.getAllByRole('article');
  expect(cards.map(c => within(c).getByRole('heading').textContent)).toEqual(['Fixture AI Practitioner', 'Fixture Data Engineer', 'Fixture Cloud Associate']);
  const first = cards[2]!;
  expect(first).toHaveTextContent('Issued Mar 2024');
  expect(first).toHaveTextContent('ABC-123');
  const verify = within(first).getByRole('link', { name: /Verify credential: Fixture Cloud Associate/ });
  expect(verify).toHaveAttribute('href', 'https://example.com/a');
  expect(verify).toHaveAttribute('target', '_blank');
  expect(verify).toHaveAttribute('rel', 'noopener noreferrer');
  expect(within(cards[0]!).queryByRole('link')).not.toBeInTheDocument();
 });
 it('filters by issuer and announces the count', () => {
  render(<CertificationGrid items={fixtures} />);
  const aws = screen.getByRole('button', { name: 'AWS' });
  fireEvent.click(aws);
  expect(aws).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('1 certification from AWS');
 });
});
