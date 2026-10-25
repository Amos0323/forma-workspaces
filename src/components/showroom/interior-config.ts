export const finishes = {
  honey: { name: "Warm timber", colour: "#ae8156", roughness: .75, metalness: 0 },
  oak: { name: "Light oak", colour: "#cfb995", roughness: .8, metalness: 0 },
  walnut: { name: "Dark walnut", colour: "#59402f", roughness: .65, metalness: 0 },
  natural: { name: "Natural oak floor", colour: "#b99569", roughness: .85, metalness: 0 },
  limestone: { name: "Sandstone floor", colour: "#d2c9b5", roughness: .95, metalness: 0 },
  smoked: { name: "Smoked timber floor", colour: "#756653", roughness: .8, metalness: 0 },
  olive: { name: "Olive weave", colour: "#697052", roughness: 1, metalness: 0 },
  coastal: { name: "Coastal blue weave", colour: "#7d9a9d", roughness: 1, metalness: 0 },
  charcoal: { name: "Charcoal weave", colour: "#434743", roughness: 1, metalness: 0 },
  graphite: { name: "Graphite metal", colour: "#343a33", roughness: .55, metalness: .25 },
  chalk: { name: "Chalk powdercoat", colour: "#e5e1d6", roughness: .7, metalness: .1 },
  bronze: { name: "Brushed bronze", colour: "#a78658", roughness: .4, metalness: .65 },
} as const;
export type FinishId = keyof typeof finishes;
export const materialGroups = {
  timber: { name: "Timber", options: ["honey", "oak", "walnut"] },
  flooring: { name: "Flooring", options: ["natural", "limestone", "smoked"] },
  upholstery: { name: "Upholstery", options: ["olive", "coastal", "charcoal"] },
  accent: { name: "Accent finishes", options: ["graphite", "chalk", "bronze"] },
} as const;
export type MaterialGroup = keyof typeof materialGroups;
export type MaterialSelection = { [G in MaterialGroup]: typeof materialGroups[G]["options"][number] };
export const lightingPresets = {
  daylight: { name: "Daylight", description: "Clear, soft daylight for everyday work.", background: "#e7e3d8", ambient: .5, sky: "#fff5de", ground: "#919379", hemisphere: 1.1, sun: "#fff7e8", intensity: 2.7, exposure: 1.15 },
  evening: { name: "Warm Evening", description: "A warmer, quieter atmosphere after hours.", background: "#b9ad99", ambient: .45, sky: "#ffe9cd", ground: "#8a8070", hemisphere: .85, sun: "#ffe1bb", intensity: 2.1, exposure: 1.05 },
  presentation: { name: "Presentation", description: "Balanced neutral illumination for reviewing materials.", background: "#dce0dd", ambient: .8, sky: "#ffffff", ground: "#9a9d98", hemisphere: 1.4, sun: "#ffffff", intensity: 1.8, exposure: 1.2 },
} as const;
export type LightingId = keyof typeof lightingPresets;
export const themes = {
  cape: { name: "Cape Contemporary", description: "Warm timber. Sandstone neutrals. Olive calm.", materials: { timber: "honey", flooring: "natural", upholstery: "olive", accent: "graphite" }, lighting: "daylight", plaster: "#dcd6c6", stone: "#c9bda6", fabric: "#ded7c7", rug: "#aaa38d" },
  coastal: { name: "Coastal Minimal", description: "Light oak. Warm whites. A quieter coastal blue.", materials: { timber: "oak", flooring: "limestone", upholstery: "coastal", accent: "chalk" }, lighting: "daylight", plaster: "#eeeae0", stone: "#ded8c9", fabric: "#eeebe2", rug: "#bdc8c3" },
  urban: { name: "Urban Executive", description: "Dark walnut. Charcoal depth. Brushed bronze.", materials: { timber: "walnut", flooring: "smoked", upholstery: "charcoal", accent: "bronze" }, lighting: "evening", plaster: "#777971", stone: "#aaa08d", fabric: "#9d9b91", rug: "#64675e" },
} as const satisfies Record<string, { name: string; description: string; materials: MaterialSelection; lighting: LightingId; plaster: string; stone: string; fabric: string; rug: string }>;
export type ThemeId = keyof typeof themes;
export const furniture = {
  reception: { name: "Welcome desk", description: "A generous timber front and sandstone-inspired counter establish a calm arrival.", groups: ["timber", "accent"], position: [-4.3,.7,2.9], scale: [3.7,1.55,1.2] },
  meeting: { name: "Conversation table", description: "A shared surface for ideas, framed by the glazed meeting room.", groups: ["timber", "accent"], position: [-4.45,.5,-2.7], scale: [2.9,1.1,1.5] },
  workbench: { name: "Focus bench", description: "A paired workspace that balances connection with room to concentrate.", groups: ["timber", "accent"], position: [1.5,.55,-2.4], scale: [2.7,1.2,2.5] },
  sofa: { name: "Gather sofa", description: "An upholstered pause point for informal conversations and shared thinking.", groups: ["upholstery"], position: [3.2,.65,3.85], scale: [3.8,1.45,1.15] },
} as const;
export type FurnitureId = keyof typeof furniture;
export type InteriorConfig = { theme: ThemeId; materials: MaterialSelection; lighting: LightingId; selectedFurniture: FurnitureId | null };
export function defaultInterior(): InteriorConfig {
  return { theme: "cape", materials: { ...themes.cape.materials }, lighting: themes.cape.lighting, selectedFurniture: null };
}
type MaterialAction = { [G in MaterialGroup]: { type: "material"; group: G; value: MaterialSelection[G] } }[MaterialGroup];
export function copyInterior(config: InteriorConfig): InteriorConfig {
  return { ...config, materials: { ...config.materials } };
}
export type InteriorAction = MaterialAction | { type: "restore"; value: InteriorConfig } | { type: "theme"; value: ThemeId } | { type: "lighting"; value: LightingId } | { type: "select"; value: FurnitureId | null } | { type: "reset" };
export function interiorReducer(state: InteriorConfig, action: InteriorAction): InteriorConfig {
  switch (action.type) {
    case "restore": return copyInterior(action.value);
    case "theme": return { ...state, theme: action.value, materials: { ...themes[action.value].materials }, lighting: themes[action.value].lighting };
    case "material": return { ...state, materials: { ...state.materials, [action.group]: action.value } };
    case "lighting": return { ...state, lighting: action.value };
    case "select": return { ...state, selectedFurniture: action.value };
    case "reset": return defaultInterior();
  }
}
export function isCustomised(config: InteriorConfig) {
  const theme = themes[config.theme];
  return config.lighting !== theme.lighting || (Object.keys(materialGroups) as MaterialGroup[]).some(group => config.materials[group] !== theme.materials[group]);
}
