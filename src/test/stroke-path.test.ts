import { describe, expect, it } from 'vitest';

import { LINE_PATH_D } from '@/components/ui/skiper-ui/skiper19';
import { stretchPath, strokeFractionAbove } from '@/lib/stroke-path';

const PATH = 'M0 0C10 10 20 20 30 40C40 100 50 200 60 300';
const lastY = (d: string) => Number(d.trim().split(/\s+/).at(-1));

describe('stretchPath', () => {
  it('keeps the part above the pivot and lands the end on the target', () => {
    const stretched = stretchPath(PATH, 40, 300, 560);
    expect(stretched.startsWith('M0 0C10 10 20 20 30 40C')).toBe(true);
    expect(lastY(stretched)).toBe(560);
  });

  it('never compresses a path into a shorter target', () => {
    expect(stretchPath(PATH, 40, 300, 200)).toBe(PATH);
  });

  it('runs Skiper19\'s stroke to the bottom of a tall page', () => {
    expect(lastY(stretchPath(LINE_PATH_D, 520, 2668.89, 9000))).toBeCloseTo(9000, 1);
  });
});

describe('strokeFractionAbove', () => {
  it('measures the share of the stroke drawn before it drops below the pivot', () => {
    const fraction = strokeFractionAbove(PATH, 40);
    expect(fraction).toBeGreaterThan(0);
    expect(fraction).toBeLessThan(0.25);
  });

  it('shrinks as the stroke is stretched, so the curl stays fully drawn at the top', () => {
    const original = strokeFractionAbove(LINE_PATH_D, 520);
    const stretched = strokeFractionAbove(stretchPath(LINE_PATH_D, 520, 2668.89, 9000), 520);
    expect(original).toBeGreaterThan(0);
    expect(stretched).toBeLessThan(original);
  });
});
