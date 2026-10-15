import { describe, expect, it } from 'vitest';
import { clientCountries, countryPosition } from '@/lib/client-countries';
describe('Confirmed client geography', () => {
 it('contains exactly the seven countries supplied by Rudresh', () => {
  expect(clientCountries.map(c => c.name)).toEqual(['United States', 'United Kingdom', 'Australia', 'Germany', 'Switzerland', 'Sweden', 'China']);
 });
 it('places representative country markers on the globe', () => {
  for (const c of clientCountries) {
   expect(Math.abs(c.latitude)).toBeLessThanOrEqual(90);
   expect(Math.abs(c.longitude)).toBeLessThanOrEqual(180);
   expect(Math.hypot(...countryPosition(c.latitude, c.longitude))).toBeCloseTo(1);
  }
  expect(countryPosition(0, 0)).toEqual([1, 0, -0]);
  expect(countryPosition(0, 90)[2]).toBeCloseTo(-1);
 });
});