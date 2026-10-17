import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExperienceRoute } from '@/components/portfolio/experience-route';
import { experience } from '@/lib/portfolio';


describe('Experience route', () => {
  it('renders every role as a card in order, alternating sides', () => {
    const { container } = render(<ExperienceRoute />);
    const cards = screen.getAllByRole('article');
    expect(cards.map(card => within(card).getByRole('heading', { level: 2 }).textContent)).toEqual(experience.map(job => job.role));
    cards.forEach((card, i) => {
      const job = experience[i]!;
      expect(card).toHaveTextContent(job.company);
      expect(card).toHaveTextContent(job.date);
      for (const item of job.items) expect(within(card).getByText(item)).toBeInTheDocument();
    });
    const sides = [...container.querySelectorAll('.exp-waypoint')].map(el => (el.className.match(/exp-waypoint--(left|right)/) ?? [])[1]);
    expect(sides).toEqual(experience.map((_, i) => (i % 2 === 0 ? 'right' : 'left')));
  });

  it('marks only the first role as current', () => {
    render(<ExperienceRoute />);
    expect(screen.getAllByText('Current role')).toHaveLength(1);
    expect(within(screen.getAllByRole('article')[0]!).getByText('Current role')).toBeInTheDocument();
  });

  it('keeps the road and the car decorative', () => {
    const { container } = render(<ExperienceRoute />);
    expect(container.querySelector('.exp-road')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.exp-car')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Every role, one journey.' })).toBeInTheDocument();
  });
});
