import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExperienceRoute } from '@/components/portfolio/experience-route';

// Motion reads the reduced-motion preference once per module graph, so this lives in its own file.
const original = window.matchMedia;
window.matchMedia = ((query: string) => ({ ...original(query), matches: query.includes('prefers-reduced-motion') })) as typeof window.matchMedia;

describe('Experience route with reduced motion', () => {
  it('parks the car, shows it immediately, and skips scroll-driven movement', () => {
    const { container } = render(<ExperienceRoute />);
    const car = container.querySelector('.exp-car');
    expect(car).toHaveClass('is-parked');
    expect(car).toHaveStyle({ opacity: '1' });
  });
});
