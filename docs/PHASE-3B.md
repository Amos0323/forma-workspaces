# Phase 3B — Interactive interior configurator

FORMA remains a fictional Cape Town design studio. All furniture and finishes are generic concept studies, not real commercial products, commissions or a physical office.

## Implemented experience

- Cape Contemporary, Coastal Minimal and Urban Executive set coordinated timber, flooring, upholstery, metal accents, neutral architectural finishes and lighting.
- Twelve named material choices across four groups update the existing scene materials immediately. Timber and flooring have separate materials, including independently coloured floor joints. Upholstery choices apply to the lounge sofa; secondary chair fabric is coordinated by theme.
- Daylight, Warm Evening and Presentation change ambient/hemisphere/key-light colour and intensity, exposure and background. The light position is fixed, so cached shadows remain valid. No post-processing was introduced.
- Welcome desk, Conversation table, Focus bench and Gather sofa support mouse/touch picking and a wireframe selection highlight. Named buttons provide the keyboard alternative. Details describe the concept and its current customisable finish groups; clearing selection is explicit.
- The desktop panel has named swatches and pressed states. The mobile native dialog is a scrollable bottom sheet with a persistent close button, focus containment, Escape dismissal and restored trigger focus.
- The illustrated fallback retains configuration controls and shows a live, labelled palette board. The plan is explicitly a spatial reference; it does not pretend to render the configured materials.
- Reset configuration resets the theme, finishes, light and furniture selection. Camera reset remains independent. No backend, persistence, personal information or layout editing was added.

## Architecture and files

| File | Change |
| --- | --- |
| src/components/showroom/interior-config.ts | New typed finish/theme/light/furniture data, local reducer and customised-state helper |
| src/components/showroom/configurator-panel.tsx | New ConfiguratorPanel, PaletteBoard and SelectionInfo |
| src/components/showroom/showroom.tsx | Local reducer, responsive panel state, focus restoration and static/live integration |
| src/components/showroom/office.tsx | Existing scene retained; memoised geometry subtree, Appearance material bridge and selectable Furniture groups |
| src/components/showroom/showroom-canvas.tsx | Lighting component and cached shadow map; existing CameraRig preserved |
| src/components/showroom/config.ts | Native-resolution DPR budget |
| src/app/globals.css | Swatches, panel, bottom sheet and responsive stage/heading separation |
| src/app/experience/page.tsx | Configurator metadata |
| tests/interior-config.test.ts | Four new state-model tests |
| tests/e2e/configurator.spec.ts | Eight desktop/mobile cases for actual material updates, resource identity, picking, focus, reset and fallback |
| playwright.cross-browser.config.ts | Optional Firefox/WebKit configurator suite |
| scripts/benchmark-showroom.mjs | Repeatable before/after frame-interval, renderer and heap sampling |
| scripts/verify-configurator.mjs | Theme screenshots, layout checks, error capture and lazy-bundle verification |
| .gitignore | Cross-browser test artefacts excluded |
| README.md, docs/ASSETS.md, this report | Updated documentation |
| docs/phase3b-*.json, docs/design/phase3b-*.png | Recorded observations and screenshots |

No packages were added. Three shared geometries and fifteen shared materials are created once per mounted scene and disposed on unmount. Appearance changes mutate colour, roughness and metalness, then invalidate one demand-rendered frame. Theme changes do not rebuild the office or replace its geometry. Selection adds one highlight mesh using the shared box geometry. Diagnostic data attributes report actual material colours and geometry identities for browser assertions.

## Performance audit

The original Phase 3A report measured about 11.4 desktop FPS on SwiftShader. A fresh baseline using the new three-second benchmark measured 8.2 FPS, a 133.3ms median frame interval and a 150ms p95 interval. Results vary between runs and sampling methods.

The baseline drawing buffer was 1710×1125. A native DPR of 1 and cached shadows reduced it to 1140×750 before configurator interactions were added. That optimisation-only sample reached 15.3 FPS, 66.6ms median and 83.4ms p95.

The final layout reserves space above the canvas for editorial text and widens the panel, reducing the desktop drawing buffer further to 1060×570. This layout change contributes to the final measured improvement and must not be mistaken for a pure algorithmic speedup.

Steady camera frames use 144 draw calls and 6,964 rendered triangles, compared with 152 calls and 7,060 triangles before shadow caching. The first shadow-building frame can still report the baseline count. This reduction removes repeat shadow work; it does not simplify the office geometry. Three geometry resources and three renderer-tracked textures remain allocated. Selection adds one draw call.

See the JSON samples for final frame-time and approximate JavaScript heap measurements. Heap samples are coarse browser estimates, not GPU memory. Both baseline and optimised scenes stop rendering after camera damping settles. No claims about real phones or GPUs follow from these software-renderer observations.

Implementation references: [Three.js shadow-map autoUpdate and needsUpdate](https://threejs.org/docs/pages/WebGLRenderer) and [R3F demand rendering and invalidation](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## Accessibility and verification

Named controls, fieldsets/legends, visible focus, pressed states, non-colour selection indicators and polite selection announcements support keyboard and screen-reader use. Reduced-motion camera behaviour is preserved; material and light changes are immediate for everyone. Initial WebGL unavailability and mid-session context loss both preserve the static alternative and the current configuration.

Layouts were checked at 320, 390, 768, 1024 and 1440 pixels. No horizontal overflow occurred, and the close control stayed visible with a minimum 44px target. Geometry identities remained unchanged across all themes. No graphics-engine chunk was requested on Projects or before entering 3D. Screenshot verification captured no browser console errors or uncaught exceptions.

Firefox was attempted using the installed Playwright browser, but its headless launch timed out on this Windows host. Firefox application behaviour is therefore unverified. WebKit launched successfully and passed the configurator suite, including WebGL selection and recovery. This is not a claim of physical Safari/iPhone testing.

## Limitations and Phase 3C

Materials are procedural colour/roughness/metalness studies, not manufacturer samples or physically calibrated textures. The illustrated plan stays fixed while the adjacent palette board updates. The office is a stylised cutaway, not a photorealistic or collision-enabled walkthrough. Four designated furniture pieces are selectable; no furniture placement or room-layout editing is included.

Phase 3C should prioritise real-device performance and screen-reader testing, client-side design-board export, and an accessible comparison mode. Review licences and transfer/rendering budgets before introducing detailed model or texture assets. No deployment or publication occurred.

## Final recorded results

| Check | Result |
| --- | --- |
| ESLint | Passed |
| Strict TypeScript | Passed |
| Production build | Passed; 20 prerendered pages retained |
| Vitest | 13 passed |
| Chromium desktop/mobile | 41 passed; 3 existing device-inapplicable skips |
| WebKit desktop | 4 configurator tests passed |
| Firefox | Launch timed out; application unverified |
| Layouts | 320, 390, 768, 1024 and 1440px checked |
| Runtime/console errors in visual verification | None captured |
| New dependencies | None |

| Desktop measurement | Fresh Phase 3A baseline | Final Phase 3B sample |
| --- | ---: | ---: |
| Active FPS | 8.2 | 14.3 |
| Median frame interval | 133.3ms | 66.7ms |
| p95 frame interval | 150.0ms | 83.4ms |
| Drawing buffer | 1710×1125 | 1060×570 |
| Steady draw calls | 152 | 144 |
| Rendered triangles per active frame | 7,060 | 6,964 |
| Shared geometries / renderer textures | 3 / 3 | 3 / 3 |
| Approximate JavaScript heap | 14.3MB | 13.4MB |
| Frames in settled 1-second idle sample | 0 | 0 |

The smaller 800×600 viewport measured 26.7 FPS before and 26.4 FPS in the final sample, essentially unchanged in this short run. An intermediate optimisation-only run was faster; these variations reinforce that timing on this shared software-rendered host is approximate. The comparisons above use the saved baseline/final samples rather than selecting the fastest run. GPU memory in bytes was not available.

Screenshots in docs/design/ include phase3b-desktop-{cape,coastal,urban,controls,selection,static}.png and corresponding mobile captures. The final static view uses a larger illustrated plan for readability. Existing tests were preserved; an intermittent homepage disclosure failure during an earlier concurrent run passed in isolation and on the clean final full run.
