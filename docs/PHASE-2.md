# Phase 2 — Interactive portfolio and immersive experiences

Completed for the fictional Cape Town studio. No deployment or publication was performed. No runtime dependency was added.

## Features

- Projects: seven accessible filter buttons (all spaces plus the six existing categories), live result count, Motion layout transitions, image hover/focus information, responsive editorial composition. Each current category contains one concept; clearing the filter restores all six.
- `CapeProjectMap`: local SVG regional diagram, six approximate concept settings, keyboard-operable markers, touch-friendly alternative selection buttons, selected-project image/link, restrained viewport movement and reset. No paid API, network tiles, precise address or geolocation is used. This is a schematic regional diagram, not a navigational or surveyed map.
- Six case studies: full-viewport photographic hero, introduction, challenge, approach, colour/material study, two-image reference gallery, comparison, metric fictional brief and next-project link. All images remain explicitly illustrative, not photographs of completed FORMA work.
- `BeforeAfterSlider`: reusable image props, native range input, mouse/touch dragging, arrow/Home/End keys, visible focus, labelled endpoints and full-before/full-after buttons. The supplied SVGs share the same room perimeter and illustrate alternate layouts. They are conceptual visualisations, not a real refurbishment or measured drawings of any project. The same generic planning study is intentionally reused with an explicit caption.
- Studio: editorial introduction, architectural panorama, Cape Town influences, three-part philosophy, four-stage process and contact/project calls to action.
- Services: six dedicated anchored sections with photography, scroll-revealed headings, native disclosures, related concepts and enquiry links.
- Journal: four original articles (each over 250 words), static routes, contents links, related reading, localised dates and metadata. Editorial is presented as a fictional studio perspective, not commissioned research or technical specifications.
- Route transitions: short CSS entry fade through App Router `template.tsx`. No delayed navigation or artificial exit screen. Next's existing navigation/focus handling remains in place; reduced motion removes the fade.

## Animation and rendering

GSAP still owns scroll reveals and homepage motion. Motion owns gallery layout and map viewport changes. Native inputs own comparison state; no smoothing fights the user's drag. A ResizeObserver refreshes ScrollTrigger after page height changes, including filtering and disclosures, and is cleaned up on route changes. Pages and article narratives remain server-rendered; interactive controls are small client components. Images use stable aspect ratios and Next Image sizing; only route hero imagery is prioritised.

## Files added

- `src/components/project-gallery.tsx`
- `src/components/cape-project-map.tsx`
- `src/components/before-after-slider.tsx`
- `src/data/project-stories.ts`
- `src/data/articles.ts`
- `src/app/journal/[slug]/page.tsx`
- `src/app/template.tsx`
- `public/images/concepts/before.svg`, `after.svg`
- `tests/phase-two.test.ts`
- `tests/e2e/phase-two.spec.ts`

## Files updated

- Projects index and detail route, Studio, Services and Journal index.
- `src/components/project-grid.tsx`: extracted reusable `ProjectCard` and enhanced hover/focus information.
- `src/components/animation-system.tsx`: layout-change refresh and cleanup.
- `src/app/globals.css`: Phase 2 layouts, controls, route fade and responsive/reduced-motion variants.
- README, design documentation, asset provenance and desktop/mobile preview screenshots.

Existing project data, Cape Town copy, legacy redirects, metadata helpers, contact demo and all prior test cases were preserved.

## Verification

- ESLint: passed.
- Strict TypeScript: passed.
- Production build: passed; 20 generated routes including four new article routes.
- Vitest: 6 tests passed across 3 files, including the previous 4 tests.
- Playwright Chromium: 25 passed, 3 device-inapplicable cases intentionally skipped. All previous 15 passing cases retained.
- New regressions: filter state/focus/reset, map selection and preview navigation, comparison keyboard/endpoints/mouse drag/mobile touch drag, article contents/next links/404, local images, reduced motion, overflow and console errors across Phase 2 routes.
- Visually inspected desktop at 1440×1000 and mobile at 390×844. Section screenshots also use taller capture surfaces to show the complete map and comparison. Inspected gallery composition, map hierarchy, case hero, material/diagram presentation, Studio/Services typography and mobile Journal/article layout.
- Fixed during verification: pointer test re-centres the tall comparison after endpoint-button clicks; SVG partition uses `fill="none"`; embedded diagram text removed to avoid mixed labels at the reveal boundary.

## Screenshot gallery

- [Desktop portfolio](design/phase2-desktop-portfolio.png)
- [Desktop project map](design/phase2-desktop-map.png)
- [Desktop case study](design/phase2-desktop-case-study.png)
- [Desktop Studio](design/phase2-desktop-studio.png)
- [Desktop Services](design/phase2-desktop-services.png)
- [Desktop Journal](design/phase2-desktop-journal.png)
- [Mobile portfolio](design/phase2-mobile-portfolio.png)
- [Mobile map](design/phase2-mobile-map.png)
- [Mobile case study](design/phase2-mobile-case-study.png)
- [Mobile comparison](design/phase2-mobile-comparison.png)
- [Mobile Journal](design/phase2-mobile-journal.png)
- [Mobile article](design/phase2-mobile-article.png)

## Remaining limitations and Phase 3

No real-device Safari/Firefox test or formal performance/accessibility audit has been completed. Browser tests use desktop Chromium and Chromium mobile emulation. The map is schematic, material swatches are colour studies, and reference photography is reused across conceptual narratives. There is no CMS or functioning enquiry backend. The existing 3D Experience route remains an honest future-phase preview.

Recommended Phase 3: a lazy-loaded React Three Fiber scene with compressed model assets and a static fallback; keyboard-accessible material/lighting exploration; measured performance and accessibility budgets; real-device Safari/Firefox validation; editorial/CMS integration if needed. Preserve the fictional-business disclosures, and obtain approval before any publishing or live contact delivery.
