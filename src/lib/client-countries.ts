export const clientCountries = [
  { code: "US", name: "United States", latitude: 37, longitude: -95 },
  { code: "UK", name: "United Kingdom", latitude: 55, longitude: -2 },
  { code: "AU", name: "Australia", latitude: -25, longitude: 133 },
  { code: "DE", name: "Germany", latitude: 51, longitude: 10 },
  { code: "CH", name: "Switzerland", latitude: 46, longitude: 8 },
  { code: "SE", name: "Sweden", latitude: 60, longitude: 18 },
  { code: "CN", name: "China", latitude: 35, longitude: 104 },
  { code: "IN-JDH", name: "Jodhpur, India", latitude: 26.24, longitude: 73.02 },
  {
    code: "IN-AMD",
    name: "Ahmedabad, India",
    latitude: 23.02,
    longitude: 72.57,
  },
  { code: "IN-JAI", name: "Jaipur, India", latitude: 26.91, longitude: 75.79 },
  { code: "IN-BOM", name: "Mumbai, India", latitude: 19.08, longitude: 72.88 },
  { code: "IN-GGN", name: "Gurgaon, India", latitude: 28.46, longitude: 77.03 },
  { code: "IN-DEL", name: "Delhi, India", latitude: 28.61, longitude: 77.21 },
  {
    code: "IN-BLR",
    name: "Bangalore, India",
    latitude: 12.97,
    longitude: 77.59,
  },
  {
    code: "IN-HYD",
    name: "Hyderabad, India",
    latitude: 17.39,
    longitude: 78.49,
  },
  { code: "IN-IDR", name: "Indore, India", latitude: 22.72, longitude: 75.86 },
] as const;
export type ClientCountry = (typeof clientCountries)[number];
// Coordinates identify representative country or city locations, never client addresses.
export function countryPosition(
  latitude: number,
  longitude: number,
  radius = 1,
): [number, number, number] {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  return [
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
  ];
}
