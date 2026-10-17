// Geometry for the Experience "route": a serpentine road that turns once per stop, alternating
// sides so each stop sits opposite its card. Pure and browser-safe so it can be tested directly.
export const ROUTE_WIDTH = 1200;
const LEFT = 220;
const RIGHT = 980;
const CENTER = 600;
const FIRST_TURN = 320;
const STEP = 400;

export function routeStopX(index: number) { return index % 2 === 0 ? LEFT : RIGHT; }

export function routePath(stops: number) {
  const count = Math.max(1, Math.floor(stops));
  const turns = Array.from({ length: count }, (_, i) => ({ x: routeStopX(i), y: FIRST_TURN + STEP * i }));
  const [first, ...rest] = turns;
  const last = turns[turns.length - 1]!;
  const d = [
    `M ${CENTER} -60 C ${CENTER} 140, ${first!.x} ${first!.y - 160}, ${first!.x} ${first!.y}`,
    ...rest.map(turn => `S ${turn.x} ${turn.y - 200}, ${turn.x} ${turn.y}`),
    // Finish inside the canvas so the car parks within the section instead of crossing into the next one.
    `S ${CENTER} ${last.y + 180}, ${CENTER} ${last.y + 270}`,
  ].join(' ');
  return { d, viewBoxHeight: last.y + 320, turns };
}
