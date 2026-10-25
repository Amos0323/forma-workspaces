# Phase 3A — Interactive workplace showroom

An original, fictional Cape Town-inspired office study. This is an elevated architectural cutaway, not a real premises, measured building survey or commissioned design.

## Features and architecture

Reception with sandstone counter and timber slats; shared workstations; glazed meeting room; olive collaboration lounge; indoor greenery and architectural lighting.

Five viewpoints, orbit, bounded zoom, damping, reset and keyboard controls. Arrow keys orbit, +/− zoom and Home returns to Overview. Panning is disabled. A 9 metre minimum distance and 1.02 radian maximum polar angle keep the lowest camera position above the 3.2 metre walls.

The illustrated plan loads first. Enter 3D explicitly to initialise the renderer. Exit disposes resources and restores the illustration. WebGL failure, renderer errors and context loss restore the alternative. Reduced motion uses immediate camera changes and disables damping; the preference subscription also responds to live changes.

Mobile caps DPR at 1 with a 512px shadow map. Desktop caps DPR at 1.5 with a 1024px map. Three.js and React Three Fiber live in a dynamic client chunk. Native OrbitControls avoids an unnecessary Drei dependency. Three shared geometries and eleven shared materials serve the entire office; repeated timber details are instanced. One directional light casts shadows. Rendering is requested only when controls or viewpoints change. There are no external models, textures, fonts, paid services or post-processing effects.

## Files and components

- src/app/experience/page.tsx — server page and localised metadata.
- src/components/showroom/showroom.tsx — controls, loading/error/static states, preference subscription and lazy import.
- src/components/showroom/showroom-canvas.tsx — demand-mode canvas, CameraRig, keyboard controls and lights.
- src/components/showroom/office.tsx — Office, Box, Cylinder, Chair, Plant and RepeatedBoxes; shared resources and disposal.
- src/components/showroom/config.ts — typed viewpoints, camera safety and rendering budgets.
- src/components/animation-system.tsx — bypasses Lenis on the showroom route to avoid competing wheel input.
- src/app/globals.css — responsive showroom styling and robust off-screen skip-link clipping.
- public/images/concepts/showroom.svg — original illustrated plan.
- tests/showroom.test.ts and tests/e2e/showroom.spec.ts — new unit/browser regression coverage.
- scripts/verify-showroom.mjs — repeatable screenshots, lazy-chunk checks and renderer measurements.
- package.json and package-lock.json — Three.js, R3F and Three.js type definitions.
- README.md, docs/ASSETS.md, this report, metrics JSON and screenshots — documentation.

Implementation references: [R3F demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance) and [Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html).

## Verification

ESLint, strict TypeScript, production build and nine unit tests pass. Playwright: 33 passed, three existing device-inapplicable cases skipped. Existing Phase 1/2 tests are preserved. The production build retains all 20 prerendered pages.

Screenshots: docs/design/phase3a-{desktop,mobile}-{static,showroom,lounge}.png. Diagnostics: docs/phase3a-metrics.json. To reproduce, run npm run build, npm start, then node scripts/verify-showroom.mjs in another terminal.

## Limitations and Phase 3B

This is a stylised geometric study, not a photorealistic render or first-person walkthrough. Glass uses inexpensive transparency, not physical refraction. The illustrated plan is not to scale. Camera limits keep users above the walls; they are not a general collision engine.

Chromium desktop and mobile emulation are covered. Real low-end phones, Safari and Firefox still need device testing. Renderer resource counts do not represent total GPU memory in bytes. Active frame-rate samples are specific to this environment, not a performance guarantee.

Phase 3B can introduce a small curated material configurator, retaining the static alternative. Test real devices and set transfer/draw-call budgets before adopting any licensed models or textures. Advanced furniture customisation, a backend and deployment remain outside this phase.

## Measured observations — 23 October 2026

The recorded overview uses 152 draw calls, 7,060 rendered triangles, three shared geometries and three renderer-tracked textures (internal targets included). Both desktop and mobile recorded zero new frames over a one-second settled idle sample. No graphics-engine chunk was requested on /projects or before opting into the showroom; it appeared after entry. No runtime exceptions were captured.

The headless browser reported ANGLE SwiftShader software rendering. A two-second active camera sample measured approximately 11.4 FPS at the desktop drawing-buffer size (1710×1125) and 60.3 FPS at the mobile size (390×340). Desktop software-renderer performance is a limitation; these numbers do not establish real GPU or phone performance. Real-device testing is recommended before any publication. Resource counts are reported rather than an unsupported GPU-memory byte estimate.

Final browser verification: the full suite passed 33 cases with three intentional skips; after the final mobile spacing and floor refinements, all eight showroom cases passed again. Desktop/mobile screenshots were regenerated and visually reviewed. No deployment or publication occurred.
