import { describe, expect, it } from "vitest";

import {
  fanPositions,
  shareTargets,
  shareUrl,
  type ShareTarget,
  type ShareTargetId,
} from "@/lib/share";
import { shareIcons } from "@/lib/share-icons";

const byId = Object.fromEntries(shareTargets.map((t) => [t.id, t])) as Record<
  ShareTargetId,
  ShareTarget
>;

describe("Share targets", () => {
  it("share the homepage canonical URL through each app's official link", () => {
    expect(shareUrl).toBe("https://rudresh98.github.io/");
    expect(shareTargets.map((t) => t.id)).toEqual([
      "whatsapp",
      "instagram",
      "linkedin",
      "telegram",
      "snapchat",
      "sms",
    ]);
    const encoded = encodeURIComponent(shareUrl);
    for (const target of shareTargets.filter((t) => !t.copyFirst))
      expect(target.href).toContain(encoded);
    expect(byId.whatsapp.href).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(byId.telegram.href).toMatch(/^https:\/\/t\.me\/share\/url\?url=/);
    expect(byId.linkedin.href).toMatch(
      /^https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?url=/,
    );
    expect(byId.snapchat.href).toMatch(
      /^https:\/\/www\.snapchat\.com\/share\?link=/,
    );
    expect(byId.sms.href).toMatch(/^sms:\?&body=/);
    expect(byId.sms.external).toBe(false);
  });

  it("copy the link for Instagram, which has no share URL", () => {
    expect(byId.instagram.copyFirst).toBe(true);
    expect(byId.instagram.href).toBe("https://www.instagram.com/direct/inbox/");
    expect(shareTargets.filter((t) => t.copyFirst)).toHaveLength(1);
  });

  it("each have a glyph", () => {
    for (const target of shareTargets) {
      expect(shareIcons[target.id].path).not.toBe("");
      expect(shareIcons[target.id].viewBox).toMatch(/^[\d. ]+$/);
    }
  });
});

describe("Share fan positions", () => {
  it("run from straight up to straight left with room between bubbles", () => {
    const points = fanPositions(6, 168);
    expect(points[0]).toEqual({ x: 0, y: -168 });
    expect(points.at(-1)).toEqual({ x: -168, y: 0 });
    for (const point of points) {
      expect(point.x).toBeLessThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(0);
    }
    const gaps = points.slice(1).map((point, i) => {
      const previous = points[i];
      return previous
        ? Math.hypot(point.x - previous.x, point.y - previous.y)
        : 0;
    });
    // 44px bubbles plus a visible gap.
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(48);
  });
});
