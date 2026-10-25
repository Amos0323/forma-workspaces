# Phase 3C — Design studies

Completed and verified on 25 October 2026. Local portfolio demonstration only; not deployed or published.

## Implementation plan

1. Record the existing Phase 3B production benchmark before editing the scene.
2. Extend the typed reducer with a copied configuration restore operation. Keep two temporary A/B snapshots in React state; compare named finishes, lighting, themes and furniture without requiring WebGL.
3. Add an on-demand design-board generator. Export a high-resolution PNG with the current rendered view when available and an explicitly labelled illustrated reference otherwise. Offer a browser print / Save as PDF layout without adding a PDF dependency.
4. Preserve the existing demand-rendered scene, shared resources, cached shadows, camera controls and lazy boundary. Review presentation and refine only where justified by visual inspection.
5. Add unit and browser regressions for snapshots, restoration, export, responsive controls and keyboard access. Run all existing checks and attempt Chromium, WebKit and Firefox.
6. Record final measurements, screenshots, accessibility findings and physical-device verification steps here. No deployment or publishing.

## Audit

The existing scene uses three shared geometries, reused materials, instanced repeated boxes, cached directional shadows and a demand frame loop. The configurator already provides native modal focus containment on mobile, a static palette board, reduced-motion camera changes and context-loss recovery. Exports and comparisons will remain independent of the lazy-loaded Three.js bundle.

## Implemented features

- Client-side 1600 × 2000 PNG board: FORMA branding, fixed concept project title, theme/customised status, four named material swatches, lighting, all four concept furniture finish schedules, selected-piece indication, South African creation date and fictional-design disclaimer.
- Current-view capture renders and reads the WebGL canvas in the same task. No `preserveDrawingBuffer`, extra renderer, continuous loop or screenshot service is introduced. A context failure falls back to the original illustrated plan, clearly distinguished from the configured palette.
- Print-ready A4 board in a new tab, with a keyboard-operable Print / Save as PDF action and a readable HTML configuration summary. PDF delivery uses the browser's print destination; it is not a direct PDF download. No new dependency was installed.
- Two independent temporary React-state snapshots. Save replaces the chosen slot; comparison lists same/different themes, all four material groups, lighting, selected furniture and each concept piece's finishes. Restore copies the snapshot without changing either saved design. Reset configuration intentionally leaves snapshots available. Leaving or refreshing clears the studies.
- Side-by-side comparison remains within the existing mobile bottom sheet. A Compare & export shortcut moves keyboard focus to the studies heading. Existing native modal containment, Escape dismissal and trigger focus restoration remain.
- Selection now uses twelve clean bounding-box edges instead of triangulated wireframe faces. One cached outline geometry is created from the shared box, uploaded only when selected and disposed with the scene. Evening lighting is less orange, with a slightly stronger ambient fill; no extra lights, assets or post-processing.
- Captions and focus rings have stronger contrast against every lighting background.

## Changed files

| File | Purpose |
| --- | --- |
| `src/components/showroom/design-studies.tsx` | Comparison, save/restore, export controls and feedback |
| `src/components/showroom/design-board.ts` | Board data, Canvas 2D PNG generation and print-tab layout |
| `src/components/showroom/interior-config.ts` | Snapshot copy/restore and evening-light refinement |
| `src/components/showroom/configurator-panel.tsx` | Temporary snapshot ownership, shortcut and tools integration |
| `src/components/showroom/showroom.tsx` | Capture registration, preserved static fallback |
| `src/components/showroom/showroom-canvas.tsx` | On-demand capture bridge |
| `src/components/showroom/office.tsx` | Reusable edge selection outline and disposal |
| `src/app/globals.css` | Responsive comparison/export styling and contrast |
| `tests/design-board.test.ts` | Snapshot isolation, actual export values and local date |
| `tests/e2e/design-studies.spec.ts` | Downloads, PDF print layout, comparison, restore, keyboard, motion and context-loss regression |
| `playwright.cross-browser.config.ts` | New suite plus mobile WebKit |
| `scripts/verify-design-studies.mjs` | Visual, layout, lazy-loading and console verification |
| `scripts/check-firefox.mjs` | Bounded isolated Firefox launch diagnosis |
| `docs/phase3c-*.json`, `docs/design/phase3c-*` | Measurements and visual evidence |
| `README.md`, `docs/PHASE-3C.md` | Current usage and delivery documentation |

The existing benchmark script is reused unchanged with new output filenames. Existing tests are preserved. No backend, persistence, model assets or dependencies were added.

## Accessibility findings

Configuration values and comparison differences are text, independent of canvas rendering or colour perception. Named buttons retain keyboard activation, pressed states and visible focus. Export/snapshot feedback is polite live text; loading disables repeated export requests. Mobile uses the existing native modal, with touch targets at least 44px for new actions. Motion preferences continue to disable camera interpolation; new controls introduce no animation.

Measured contrast ratios (see `phase3c-contrast.json`): caption 5.28:1 on evening, 9.10:1 daylight, 8.75:1 presentation; panel secondary text 6.20:1; evening focus ring 4.72:1; board body 13.40:1. These are targeted colour checks, not a claim of a complete WCAG conformance audit.

Firefox's persisted dynamic button state initially left Compare enabled after a refresh despite empty snapshots. The tools form now uses `autocomplete="off"`, so browser-restored control state cannot disagree with temporary React state. Reference: [MDN disabled attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled).

The print tab contains a semantic text summary for screen readers. The printed board itself is raster artwork, so PNG and resulting PDF do not provide selectable/tagged text. Native screen-reader and physical-device testing remain manual checks; automated accessible-name and focus assertions are not substitutes.

## Performance measurements

The unchanged three-second alternating-key orbit benchmark ran against production before edits and after verification, without another browser test running. Both samples used Chromium's ANGLE/SwiftShader software renderer, DPR 1 and the same viewport/drawing-buffer sizes. The scene starts unselected. Values are approximate; frame intervals are requestAnimationFrame intervals during active orbit, not isolated GPU execution timings.

| Metric | Fresh Phase 3B desktop | Phase 3C desktop | Fresh Phase 3B small | Phase 3C small |
| --- | ---: | ---: | ---: | ---: |
| Viewport | 1440 × 900 | 1440 × 900 | 800 × 600 | 800 × 600 |
| Drawing buffer | 1060 × 570 | 1060 × 570 | 800 × 340 | 800 × 340 |
| Active FPS | 25.1 | 19.9 | 46.3 | 38.2 |
| Median frame interval | 33.4ms | 50.0ms | 16.7ms | 33.2ms |
| p95 frame interval | 50.0ms | 66.7ms | 33.4ms | 33.4ms |
| Steady draw calls | 144 | 144 | 144 | 144 |
| Rendered triangles | 6,964 | 6,964 | 6,964 | 6,964 |
| Renderer geometries / textures | 3 / 3 | 3 / 3 | 3 / 3 | 3 / 3 |
| Approximate JS heap | 12.7MB | 12.7MB | 12.7MB | 15.2MB |
| Settled idle frames in 1 second | 0 | 0 | 0 | 0 |

Sources: [fresh baseline](phase3c-baseline.json), [final sample](phase3c-performance.json). The historical Phase 3B report recorded 14.3 desktop FPS and 26.4 small-viewport FPS on this host. The fresh and final samples demonstrate substantial timing variability; **Phase 3C does not claim an FPS improvement**. The final sample is slower than the fresh baseline. Stable draw counts, triangles, resolution and desktop heap show that no extra steady rendering pass was introduced, but do not prove equivalent real-device performance.

The existing optimisations remain: lazy Three.js loading, instanced repeated details, shared geometry/materials, a capped DPR, one cached shadow map and zero idle frames. Selection adds one draw call and one tiny cached edge geometry (four geometry resources after selection); no triangulated highlight faces are rendered. Export adds one explicit render/read only on request, followed by temporary 2D canvas work. GPU memory in bytes is unavailable; reported heap is a coarse JavaScript estimate, not total browser or GPU allocation. Physical-device profiling remains the next performance priority.

## Browser compatibility and verification

Firefox's sandboxed launch timed out after 15 seconds before visiting the app. The same isolated script succeeded outside the sandbox in 7.9 seconds using Firefox 157.0. This supports an execution-environment cause for the previous launch failure, without identifying its exact OS-level mechanism. The application then passed its nine Firefox checks after fixing reload control state.

The final cross-browser run was sequential: 9 Firefox desktop, 9 WebKit desktop and 9 WebKit mobile-emulation tests passed. An earlier concurrent test invocation collided in Playwright's shared artifact directory; that harness failure was eliminated by running the suite sequentially. Mobile WebKit emulation is not physical Safari testing. Native OS print dialogs were not automated: tests verify the print action, print document and Chromium-generated single-page PDF.

| Final check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed, strict TypeScript |
| `npm run build` | Passed, all 20 prerendered pages retained |
| `npm test` | 15 passed across 6 files |
| `npx playwright test` | 51 passed, 3 existing device-specific skips |
| Cross-browser suite | 27 passed: Firefox desktop 9, WebKit desktop 9, WebKit mobile 9 |
| PNG | Valid downloaded 1600 × 2000 image, static and live-view paths verified |
| PDF | Chromium generated one A4 page; all three engines verified the print-tab action and content |
| Responsive audit | 320, 390, 768, 1024 and 1440px; no page or comparison overflow; close targets 44 × 44px and visible |
| Console / runtime audit | No errors captured in desktop/mobile visual verification |
| Lazy loading | No Three.js renderer chunk requested on Projects or before entering 3D |
| Accessibility regressions | Keyboard shortcut/focus, modal containment/return, restore, reduced motion, static fallback and context-loss export passed |

New regression coverage includes immutable snapshots, actual exported material/furniture values, South African date rollover, replacing/restoring A/B designs, reload clearing, mobile columns, real PNG downloads, single-page Chromium PDF output, keyboard print activation, resource identity preservation, idle rendering after export, and WebGL-loss fallback export. Existing suites were not removed or weakened. The test runner emits an existing Three.js CommonJS deprecation warning from test imports; the application uses ES modules and the browser audit captured no console errors.

## Screenshots

- [Desktop comparison](design/phase3c-desktop-palette-comparison.png)
- [Mobile comparison](design/phase3c-mobile-palette-comparison.png)
- [Desktop showroom](design/phase3c-desktop-showroom.png)
- [Mobile showroom](design/phase3c-mobile-showroom.png)
- [Exported design board](design/phase3c-desktop-board.png)
- [Mobile export controls](design/phase3c-mobile-export.png)

The original comparison overview and a second palette-focused crop are retained for both viewports. The board screenshots are actual downloaded PNGs, not mockups. Browser evidence is in [phase3c-browser-verification.json](phase3c-browser-verification.json).

## Manual physical-device verification

1. Run `npm run build` then `npm start` on the development machine. On a trusted local network, open the machine's local-network address at port 3000 on the phone; do not deploy. Test Safari on an iPhone and Chrome on an Android device in portrait and landscape.
2. Open `/experience`, use the illustrated view, then enter 3D. Test drag, pinch, each viewpoint and Reset view. Ensure fingers can still scroll outside the canvas and the navigation remains reachable.
3. Open Customise interior; select each theme, a separate material, all lighting presets and each furniture item. Inspect geometry, shadows and selection edges. Close the sheet, reopen it and rotate the device.
4. Save A, change theme/lighting/furniture, save B, compare and restore both. Check the two-column finish rows at 320–390px, enlarged text and landscape. Refresh and verify both slots are empty.
5. Download PNG in illustrated and 3D modes, open the saved image and check the palette, date, lighting and disclaimer. Open the print board, choose Print / Save as PDF (or the platform's share-to-PDF flow), disable browser headers/footers, and check a single A4 page. Some mobile browsers may offer only share or print destinations.
6. With an external keyboard, Tab through controls, activate the shortcut, compare, restore and export. Escape must dismiss the sheet and return focus. With VoiceOver/TalkBack, verify names, selected states, comparison A/B labels and feedback without entering 3D.
7. Enable OS Reduce Motion and repeat viewpoint/restoration controls. Use browser developer tools to simulate WebGL context loss; confirm the illustrated palette, snapshots and export remain usable, then retry entry.
8. Profile 30 seconds of orbiting and 10 seconds idle on real hardware. Record browser/device, viewport, DPR, thermal state, FPS and memory. Do not compare those results directly with these short SwiftShader samples.

## Remaining limitations and next steps

- The room remains a stylised procedural cutaway; colours are indicative, not calibrated manufacturer samples. Fixed illustrated-plan colours are explicitly labelled as spatial reference.
- PNG uses the current viewport resolution for the 3D inset; the surrounding board is 1600 × 2000. It does not create an expensive high-resolution offscreen 3D render.
- Browser print destination availability and native download UX vary. PDF output is image-based; a future accessible vector/text PDF would require a separately reviewed implementation.
- Snapshots are page-local and intentionally disappear on reload/navigation. No room editing, furniture placement or multi-user sharing was introduced.
- Next: physical-device performance and assistive-technology checks; then consider a text-accessible vector export and optional user-requested local-file configuration import/export. Review asset licensing and budgets before adding texture detail. No deployment or publication occurred.
