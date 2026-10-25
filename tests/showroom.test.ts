import { describe, expect, it } from "vitest";
import { cameraLimits, renderQuality, views } from "../src/components/showroom/config";
describe("architectural camera safety", () => {
  it("keeps the lowest possible camera above the 3.2 metre walls", () => {
    expect(.6 + cameraLimits.minDistance * Math.cos(cameraLimits.maxPolarAngle)).toBeGreaterThan(3.2);
  });
  it("provides five valid bounded viewpoints", () => {
    expect(Object.keys(views)).toHaveLength(5);
    Object.values(views).forEach(view => {
      expect(view.distance).toBeGreaterThanOrEqual(cameraLimits.minDistance);
      expect(view.distance * 1.3).toBeLessThanOrEqual(cameraLimits.maxDistance);
      expect(view.target[1]).toBe(.6);
    });
  });
  it("limits mobile pixel density and shadow allocation", () => {
    expect(renderQuality(true)).toEqual({ dpr: 1, shadowSize: 512 });
    expect(renderQuality(false).dpr).toBeLessThanOrEqual(1.5);
  });
});
