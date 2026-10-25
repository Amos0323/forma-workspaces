import { describe, expect, it } from "vitest";
import { boardDetails, boardDisclaimer } from "../src/components/showroom/design-board";
import { copyInterior, defaultInterior, interiorReducer } from "../src/components/showroom/interior-config";

describe("design studies", () => {
  it("copies and restores snapshots without aliasing saved materials", () => {
    const original = defaultInterior();
    const saved = copyInterior(original);
    const restored = interiorReducer(interiorReducer(original, { type: "theme", value: "urban" }), { type: "restore", value: saved });
    expect(restored).toEqual(original);
    expect(restored.materials).not.toBe(saved.materials);
    restored.materials.timber = "walnut";
    expect(saved.materials.timber).toBe("honey");
  });
  it("exports actual customised finishes and the selected conceptual furniture", () => {
    const config = interiorReducer(defaultInterior(), { type: "material", group: "timber", value: "walnut" });
    config.selectedFurniture = "reception";
    const details = boardDetails(config, new Date("2026-10-24T23:30:00Z"));
    expect(details.date).toBe("25 October 2026");
    expect(details.theme).toContain("Customised");
    expect(details.materials[0].name).toBe("Dark walnut");
    expect(details.furniture[0]).toMatchObject({ selected: true, finishes: "Dark walnut / Graphite metal" });
    expect(details.furniture).toHaveLength(4);
    expect(boardDisclaimer).toContain("Fictional studio");
  });
});
