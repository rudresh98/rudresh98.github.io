import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CourseCards, TrainingFormats } from '@/components/portfolio/training';
import { profile, training } from '@/lib/portfolio';
import { courseListJsonLd } from '@/lib/seo';
import { courseEnquiryHref, courses, getCourse, trainingFormats } from '@/lib/training';
import { courseIcons, formatIcons } from '@/lib/training-icons';

describe('Training data', () => {
 it('keeps unique courses, each with modules, topics, tools, and an icon', () => {
  expect(courses.map(c => c.id)).toEqual(['full-stack', 'genai']);
  for (const course of courses) {
   expect(course.modules.length).toBeGreaterThan(0);
   for (const module of course.modules) expect(module.topics.length).toBeGreaterThan(0);
   expect(course.tools.length).toBeGreaterThan(0);
   expect(courseIcons[course.id]).toBeTruthy();
   expect(getCourse(course.id)).toBe(course);
  }
 });
 it('sources format titles from the confirmed training formats, each with an icon and description', () => {
  expect(trainingFormats.map(f => f.title)).toEqual(training.formats);
  for (const format of trainingFormats) { expect(formatIcons[format.id]).toBeTruthy(); expect(format.description).not.toBe(''); }
 });
 it('opens an email enquiry with an encoded subject', () => {
  expect(courseEnquiryHref(courses[1])).toBe(`mailto:${profile.email}?subject=${encodeURIComponent('Training enquiry: Generative AI & LLM Engineering')}`);
  expect(courseEnquiryHref()).toBe(`mailto:${profile.email}?subject=Training%20enquiry`);
 });
 it('describes every course in structured data with the site author as provider', () => {
  const items = courseListJsonLd().mainEntity.itemListElement;
  expect(items.map(i => i.item.name)).toEqual(courses.map(c => c.title));
  for (const i of items) expect(i.item).toMatchObject({ '@type': 'Course', provider: { '@id': 'https://rudresh98.github.io/#person' } });
 });
});

describe('Training page sections', () => {
 it('renders each course with anchored cards, an expandable syllabus, and an enquiry link', () => {
  render(<CourseCards />);
  const cards = screen.getAllByRole('article');
  expect(cards.map(c => c.id)).toEqual(['full-stack', 'genai']);
  const fullStack = cards[0]!;
  expect(within(fullStack).getByRole('heading', { name: 'Full Stack Web Development' })).toBeInTheDocument();
  const trigger = within(fullStack).getByRole('button', { name: /Web foundations/ });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(within(fullStack).getByText('Modern JavaScript and TypeScript')).toBeInTheDocument();
  expect(within(fullStack).getByRole('link', { name: 'Enquire about Full Stack Web Development by email' })).toHaveAttribute('href', courseEnquiryHref(courses[0]));
 });
 it('lists every delivery format', () => {
  render(<TrainingFormats />);
  for (const title of training.formats) expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
 });
});
