export type ViewName = "Overview" | "Reception" | "Workstations" | "Meeting Room" | "Lounge";
export const views: Record<ViewName, { target: [number, number, number]; distance: number; description: string }> = {
Overview: { target: [0, .6, 0], distance: 24, description: "One considered workplace. Four ways to connect, focus and belong." },
Reception: { target: [-4, .6, 2.5], distance: 12, description: "A warm timber welcome, grounded by sandstone and greenery." },
Workstations: { target: [3, .6, -2], distance: 13, description: "Shared benches pair clear sightlines with generous space for focused work." },
"Meeting Room": { target: [-4, .6, -2.4], distance: 12, description: "Transparent partitions bring openness to a quieter place for conversation." },
Lounge: { target: [3, .6, 2.5], distance: 12, description: "Olive upholstery, a tactile rug and a low communal table invite informal collaboration." },
};
export const cameraLimits = { minDistance: 9, maxDistance: 38, minPolarAngle: .25, maxPolarAngle: 1.02 };
// A native-resolution buffer avoids supersampling a fill-bound architectural scene.
export function renderQuality(compact: boolean) { return { dpr: 1, shadowSize: compact ? 512 : 1024 }; }
