import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { CourseCards, CourseDetail, TrainingFormats } from '@/components/portfolio/training';
import { profile, training } from '@/lib/portfolio';
import { canonicalUrl, courseJsonLd, courseListJsonLd } from '@/lib/seo';
import { courseCategories, courseEnquiryHref, coursePath, courses, filterCourses, getCourse, getNextCourse, trainingFormats } from '@/lib/training';

// Sections contain router Links, so render them as the root of a memory router.
async function renderInRouter(node: ReactNode) {
 const router = createRouter({ routeTree: createRootRoute({ component: () => <>{node}</> }), history: createMemoryHistory({ initialEntries: ['/'] }) });
 await act(() => router.load());
 render(<RouterProvider router={router} />);
}
import { courseIcons, formatIcons } from '@/lib/training-icons';

describe('Training data', () => {
 it('keeps unique courses, each with modules, topics, tools, and an icon', () => {
  expect(courses.map(c => c.id)).toEqual(['full-stack', 'backend', 'database', 'infra', 'databricks', 'genai', 'fde']);
  for (const course of courses) {
   expect(course.modules.length).toBeGreaterThan(0);
   for (const module of course.modules) expect(module.topics.length).toBeGreaterThan(0);
   expect(course.tools.length).toBeGreaterThan(0);
   expect(courseIcons[course.id]).toBeTruthy();
   expect(getCourse(course.id)).toBe(course);
   expect(courseCategories).toContain(course.category);
  }
 });
 it('marks the infrastructure, Databricks, GenAI, and FDE courses as trending', () => {
  expect(courses.filter(c => c.trending).map(c => c.id)).toEqual(['infra', 'databricks', 'genai', 'fde']);
 });
 it('filters courses by category', () => {
  expect(filterCourses('All')).toHaveLength(courses.length);
  expect(filterCourses('Data').map(c => c.id)).toEqual(['database', 'databricks']);
  expect(filterCourses('Web & Backend').map(c => c.id)).toEqual(['full-stack', 'backend']);
  expect(filterCourses('Cloud & Infra').map(c => c.id)).toEqual(['infra']);
  expect(filterCourses('AI').map(c => c.id)).toEqual(['genai', 'fde']);
 });
 it('sources format titles from the confirmed training formats, each with an icon and description', () => {
  expect(trainingFormats.map(f => f.title)).toEqual(training.formats);
  for (const format of trainingFormats) { expect(formatIcons[format.id]).toBeTruthy(); expect(format.description).not.toBe(''); }
 });
 it('cycles to the next course and builds course paths', () => {
  expect(courses.map(c => getNextCourse(c.id)?.id)).toEqual(['backend', 'database', 'infra', 'databricks', 'genai', 'fde', 'full-stack']);
  expect(getNextCourse('missing')).toBeUndefined();
  expect(coursePath('fde')).toBe('/training/fde');
 });
 it('opens an email enquiry with an encoded subject', () => {
  expect(courseEnquiryHref(getCourse('genai'))).toBe(`mailto:${profile.email}?subject=${encodeURIComponent('Training enquiry: Generative AI & LLM Engineering')}`);
  expect(courseEnquiryHref()).toBe(`mailto:${profile.email}?subject=Training%20enquiry`);
 });
 it('describes every course in structured data with the site author as provider', () => {
  const items = courseListJsonLd().mainEntity.itemListElement;
  expect(items.map(i => i.item.name)).toEqual(courses.map(c => c.title));
  for (const i of items) expect(i.item).toMatchObject({ '@type': 'Course', provider: { '@id': 'https://rudresh98.github.io/#person' } });
  expect(courseJsonLd(getCourse('fde')!).url).toBe(canonicalUrl('/training/fde'));
 });
});

describe('Training page sections', () => {
 it('renders a compact card per course with course and enquiry links', async () => {
  await renderInRouter(<CourseCards />);
  const cards = await screen.findAllByRole('article');
  expect(cards.map(c => c.id)).toEqual(courses.map(c => c.id));
  for (const [i, card] of cards.entries()) {
   const course = courses[i]!;
   expect(within(card).getByRole('link', { name: course.title })).toHaveAttribute('href', `/training/${course.id}`);
   expect(within(card).getByRole('link', { name: `View full course: ${course.title}` })).toHaveAttribute('href', `/training/${course.id}`);
   expect(within(card).getByRole('link', { name: `Enquire about ${course.title} by email` })).toHaveAttribute('href', courseEnquiryHref(course));
   expect(within(card).queryByText('Trending') !== null).toBe(Boolean(course.trending));
   expect(within(card).queryByRole('button')).not.toBeInTheDocument();
  }
 });
 it('filters the course cards by category and announces the count', async () => {
  await renderInRouter(<CourseCards />);
  const data = await screen.findByRole('button', { name: 'Data' });
  fireEvent.click(data);
  expect(data).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('2 courses in Data');
  await waitFor(() => expect(screen.getAllByRole('article').map(c => c.id)).toEqual(['database', 'databricks']));
 });
 it('lists every delivery format', () => {
  render(<TrainingFormats />);
  for (const title of training.formats) expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
 });
 it('shows a course page with its full syllabus expanded and next-course navigation', async () => {
  const fde = getCourse('fde')!;
  await renderInRouter(<CourseDetail course={fde} />);
  expect(await screen.findByRole('heading', { level: 1, name: fde.title })).toBeInTheDocument();
  expect(screen.getByText('Trending')).toBeInTheDocument();
  for (const module of fde.modules) expect(screen.getByRole('heading', { level: 3, name: module.title })).toBeInTheDocument();
  for (const topic of fde.modules[0]!.topics) expect(screen.getByText(topic)).toBeVisible();
  expect(screen.getByRole('link', { name: /Enquire by email/ })).toHaveAttribute('href', courseEnquiryHref(fde));
  expect(screen.getByRole('link', { name: /Next course/ })).toHaveAttribute('href', '/training/full-stack');
  expect(screen.getByRole('link', { name: /All courses/ })).toHaveAttribute('href', '/training');
 });
});
