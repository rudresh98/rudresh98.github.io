export const clientCountries = [
 { code: 'US', name: 'United States', latitude: 37, longitude: -95 },
 { code: 'UK', name: 'United Kingdom', latitude: 55, longitude: -2 },
 { code: 'AU', name: 'Australia', latitude: -25, longitude: 133 },
 { code: 'DE', name: 'Germany', latitude: 51, longitude: 10 },
 { code: 'CH', name: 'Switzerland', latitude: 46, longitude: 8 },
 { code: 'SE', name: 'Sweden', latitude: 60, longitude: 18 },
 { code: 'CN', name: 'China', latitude: 35, longitude: 104 },
] as const;
export type ClientCountry = typeof clientCountries[number];
// Coordinates identify representative country locations, never client addresses.
export function countryPosition(latitude: number, longitude: number, radius = 1): [number, number, number] {
 const lat = latitude * Math.PI / 180;
 const lon = longitude * Math.PI / 180;
 return [radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lon)];
}