import { describe, expect, it } from "vitest";
import { routePath, routeStopX } from "@/lib/route-path";

describe("Experience route geometry", () => {
  it("starts at the top centre and turns once per stop, alternating sides", () => {
    const { d, turns } = routePath(5);
    expect(d.startsWith("M 600 -60 C 600 140, 220 160, 220 320")).toBe(true);
    expect(turns.map((t) => t.x)).toEqual([220, 980, 220, 980, 220]);
    expect(turns.map((t) => t.y)).toEqual([320, 720, 1120, 1520, 1920]);
    expect(d.match(/ S /g)).toHaveLength(5); // four turns after the first, plus the finish
  });
  it("finishes back at the centre below the last stop", () => {
    expect(routePath(5).d.endsWith("S 600 2100, 600 2190")).toBe(true);
    expect(2190).toBeLessThan(routePath(5).viewBoxHeight);
  });
  it("grows the canvas 400 units per stop and puts each stop opposite its card", () => {
    expect(routePath(5).viewBoxHeight - routePath(4).viewBoxHeight).toBe(400);
    expect(routeStopX(0)).toBe(220); // card 0 sits on the right, so the road passes on the left
    expect(routeStopX(1)).toBe(980);
    expect(routePath(0).turns).toHaveLength(1);
  });
});
