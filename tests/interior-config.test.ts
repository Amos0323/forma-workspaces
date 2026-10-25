import { describe, expect, it } from "vitest";
import { defaultInterior, finishes, interiorReducer, isCustomised, materialGroups, themes } from "../src/components/showroom/interior-config";

describe("interior configuration", () => {
  it("applies a coordinated theme without mutating previous state", () => {
    const before = defaultInterior();
    const after = interiorReducer(before, { type: "theme", value: "urban" });
    expect(after.materials).toEqual(themes.urban.materials);
    expect(after.lighting).toBe("evening");
    expect(before).toEqual(defaultInterior());
    expect(isCustomised(after)).toBe(false);
  });
  it("changes only the requested material group", () => {
    const before = defaultInterior();
    const after = interiorReducer(before, { type: "material", group: "flooring", value: "limestone" });
    expect(after.materials).toEqual({ ...before.materials, flooring: "limestone" });
    expect(after.lighting).toBe(before.lighting);
    expect(isCustomised(after)).toBe(true);
  });
  it("keeps selection separate from finishes and resets all local configuration", () => {
    let config = interiorReducer(defaultInterior(), { type: "theme", value: "urban" });
    config = interiorReducer(config, { type: "select", value: "sofa" });
    expect(config.selectedFurniture).toBe("sofa");
    const cleared = interiorReducer(config, { type: "select", value: null });
    expect(cleared.materials).toBe(config.materials);
    expect(interiorReducer(config, { type: "reset" })).toEqual(defaultInterior());
  });
  it("offers valid finish groups and distinct lighting choices", () => {
    Object.values(materialGroups).forEach(group => group.options.forEach(id => {
      expect(finishes[id].colour).toMatch(/^#[0-9a-f]{6}$/i);
      expect(finishes[id].roughness).toBeGreaterThanOrEqual(0);
    }));
    const next = interiorReducer(defaultInterior(), { type: "lighting", value: "presentation" });
    expect(next.lighting).toBe("presentation");
    expect(isCustomised(next)).toBe(true);
  });
});
