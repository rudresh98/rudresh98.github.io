// Geometry for the Home page's decorative scroll stroke. Works on paths made only of absolute
// M/C commands (like Skiper19's), so coordinates alternate x, y. Pure and browser-safe so it can be tested directly.
type Point = { x: number; y: number };

const NUMBER = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
const round = (value: number) => Math.round(value * 1000) / 1000;

function points(d: string): Point[] {
  const values = (d.match(NUMBER) ?? []).map(Number);
  const result: Point[] = [];
  for (let i = 0; i + 1 < values.length; i += 2) result.push({ x: values[i]!, y: values[i + 1]! });
  return result;
}

// Stretches everything below `pivot` so that `end` lands on `targetEnd`; the part above keeps its shape.
// Never compresses: a target shorter than `end` returns the path unchanged.
export function stretchPath(d: string, pivot: number, end: number, targetEnd: number) {
  const scale = Math.max(1, (targetEnd - pivot) / (end - pivot));
  if (scale === 1) return d;
  let index = 0;
  return d.replace(NUMBER, (value) => {
    const isY = index++ % 2 === 1;
    const n = Number(value);
    return isY && n > pivot ? String(round(pivot + (n - pivot) * scale)) : value;
  });
}

function cubicLength(p0: Point, p1: Point, p2: Point, p3: Point, steps = 24) {
  let length = 0;
  let previous = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, e = t * t * t;
    const point = { x: a * p0.x + b * p1.x + c * p2.x + e * p3.x, y: a * p0.y + b * p1.y + c * p2.y + e * p3.y };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return length;
}

// Share of the stroke's length drawn before it first ends a segment below `pivot`.
export function strokeFractionAbove(d: string, pivot: number) {
  const [start, ...rest] = points(d);
  if (!start) return 0;
  let cursor = start, total = 0, above = 0, open = true;
  for (let i = 0; i + 2 < rest.length; i += 3) {
    const [c1, c2, next] = [rest[i]!, rest[i + 1]!, rest[i + 2]!];
    const length = cubicLength(cursor, c1, c2, next);
    total += length;
    if (open && next.y <= pivot) above += length;
    else open = false;
    cursor = next;
  }
  return total ? above / total : 0;
}
