# Phase 4 — Portfolio release readiness

Audit date: **25 October 2026**. This is a fictional Cape Town studio and software portfolio demonstration. No deployment, publication or GitHub push was performed.

## Executive summary and recommendation

**GO for local portfolio review. NO-GO for public launch until the release gates below are completed and publication is explicitly approved.** Core functionality is preserved. This phase adds targeted accessibility/privacy fixes, defensible crawler configuration, security headers and repeatable audit tooling; no major product features were added.

The historical 25.1 → 19.9 FPS decline cannot be attributed conclusively from two short, unmatched historical samples. Repeated controlled-condition measurements do not establish React rerenders, comparison state or export as a sustained rendering bottleneck. Software-renderer variability remains substantial. No real-device speedup or resolved historical regression is claimed.

## Severity-led findings and changes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | A demo form could fall back to native submission before hydration or without JavaScript | Disabled fieldset until hydration; visible pre-hydration explanation; CSP form-action none. Native and hydrated behaviour covered by tests. |
| Medium | Small muted text and static palette captions could fail contrast | Darkened muted/secondary colours; placed palette information on a stable ivory background across lighting presets. |
| Medium | Accessible names did not consistently include visible labels; heading levels skipped | Corrected brand spacing, scroll cue, map marker and article link labels; added meaningful visually hidden section headings. |
| Medium | Mobile menu left background content exposed to assistive navigation | Main/footer become inert while open, with previous inert state restored on close. Existing focus trapping and Escape behaviour retained. |
| Medium | No approved-origin canonical/sitemap policy or explicit preview crawler exclusion | Added validated optional SITE_URL, canonical/OG URLs, sitemap and opt-in indexing. Default build remains noindex/disallowed. |
| Medium | Response headers lacked explicit browser restrictions | Added nosniff, anti-framing, referrer, permissions and limited CSP headers. |
| Medium | Performance claims relied on historical single-run data | Added repeated fixed-pose benchmark, commit counters, main-thread/heap/layout observations and preserved raw measurements. |
| Low | README mixed historical and current verification claims | Replaced with a portfolio-oriented installation, architecture, testing, limitations and credits guide. |

No geometry, material fidelity, shadow quality or rendering resolution was reduced to improve a synthetic score. The Node test harness emits a Three.js CommonJS deprecation notice; no corresponding browser runtime error was observed. Original tests remain; the exact map-marker name assertion was updated to reflect its corrected accessible label. Vitest now resolves the same source alias as the application.

## Verification results

Final suite results are recorded below after the final fixes. The initial regression run correctly exposed an evening-theme caption and missing no-JavaScript explanatory text; both were fixed rather than suppressing assertions.

- ESLint: passed.
- Strict TypeScript: passed.
- Vitest: 18 tests passed across seven files.
- Production build: passed; 22 prerendered entries including metadata routes and error infrastructure.
- Chromium desktop/mobile: **67 passed, three existing device-inapplicable cases skipped** (70 scheduled).
- Firefox desktop: **17 passed**. WebKit desktop: **17 passed**. WebKit mobile emulation: **17 passed** (51 combined).
- All-route axe audit: **34 page scans plus two interactive states, zero violations**. Zero console/page errors, horizontal overflow or observed CLS in the final scan sessions.

The extended cross-browser suite covers configurator, export/comparison and readiness regressions, rather than claiming every Chromium case is run in every engine. Existing Chromium coverage includes legacy redirects, all project data, journal navigation, project map/filtering, camera bounds, touch/keyboard comparison, form validation, loading/fallback, context loss and reduced-motion idle rendering.

## Performance findings

Source: [final repeated measurements](phase4-performance.json), [initial repeated measurements](phase4-performance-initial.json), [sampling script](../scripts/audit-performance.mjs). Samples were taken before the final static caption/no-JavaScript explanation fixes; those do not alter the renderer. All samples are retained, including outliers.

Protocol: production build, Chromium 156.0.8078.4 / ANGLE SwiftShader, 1440 × 900 viewport, DPR 1, 1060 × 570 drawing buffer, reduced motion, 700 ms warmup, forced GC before each four-second sample. Opposing arrow keys return the camera to the same pose each frame. Three rounds rotate the four conditions. No other browser suite/build ran alongside measurement. Machine power/thermal state and unrelated host activity were not controlled.

| Condition | FPS samples | Median FPS | Median frame interval | Median p95 interval | Median script time per sample |
| --- | --- | --- | --- | --- | --- |
| Controls closed | 35.2 / 21.0 / 23.1 | 23.1 | 49.9 ms | 66.7 ms | 172.3 ms |
| Controls open | 25.4 / 22.6 / 24.1 | 24.1 | 33.4 ms | 66.6 ms | 172.6 ms |
| Comparison open | 21.1 / 22.7 / 21.8 | 21.8 | 50.0 ms | 66.7 ms | 176.2 ms |
| Warm evening | 20.2 / 20.6 / 20.0 | 20.2 | 50.0 ms | 66.7 ms | 165.8 ms |

Frame intervals are rAF observations; FPS uses rendered-frame counters, so they are not exact reciprocals. Every sample retained **144 draw calls, 6,964 triangles, three geometries and three renderer textures**, with **zero settled idle frames**. Both instrumented Showroom and CameraRig components recorded zero commits during the camera loop. This does not instrument every component in the tree.

The initial repeated batch had condition medians of 19.1 / 16.5 / 21.1 / 22.4 FPS. The later batch added only a commit diagnostic before measuring. Changed ordering of fast/slow conditions between batches prevents a reliable conclusion that the panel or lighting caused the reported historical regression. Historical Phase 3B/3C single-run FPS is not an equivalent baseline; no percentage improvement is claimed.

During measured loops, layout time and layout counts were zero; script execution was about 0.17 seconds within roughly four seconds of main-thread task time. Long tasks were observed on this software renderer. Rendering/driver work is the leading inference, not a GPU-profiler-proven attribution. Comparison/export are event-driven: theme and lighting actions recorded roughly 3.9–4.1 ms script execution and one Showroom commit; saving/comparing snapshots recorded 1.3–1.6 ms and zero Showroom commits. PNG export recorded 147.5 ms script / 252.4 ms total task time. Export is a one-off cost, not recurring idle work; action wall times include automation and 200 ms settling.

Median forced-GC JavaScript heap was approximately 8.8–9.2 MB by condition. This is neither GPU memory nor total browser/process memory and is not directly comparable to previous coarse performance.memory samples. No memory-leak soak test was performed.

## Accessibility and responsive findings

Automated scans use WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice axe tags. The final all-route follow-up returned zero violations, zero console/page errors and zero observed CLS in those scan sessions. Additional regression coverage exercises a different theme and selected furniture, which revealed and now verifies the corrected caption contrast.

Desktop and mobile full-page screenshots of nine major page types were visually reviewed: homepage, projects, a case study, studio, services, showroom fallback, journal, article and contact. Typography, image cropping, spacing, palette and footer remained coherent. All 17 routes were checked for overflow at 320, 390, 768, 1024 and 1440 px; no overflow was observed. Existing tests also include broader laptop/desktop sizing. Reduced-motion screenshots do not certify every animation frame.

Axe still identifies some contrast/ARIA and modal label cases as incomplete/manual review. Images and the 3D canvas cannot be certified for contrast by these scans. No full WCAG 2.2 AA conformance claim is made. Static information and keyboard alternatives remain available without the canvas. Menu and mobile configurator focus management, Escape, restore controls, live selection feedback, native validation and context-loss fallback are covered by browser tests. Physical touch accuracy, screen-reader announcements and all target-size exceptions require human review.

## SEO and truthful presentation

All 17 routes have unique titles and descriptions, one H1 and no missing image alt attributes. They provide localised Open Graph text and en-ZA content. CreativeWork JSON-LD identifies the fictional portfolio; there is no LocalBusiness schema, fabricated address, rating or verified-office claim. Images are illustrative and project locations approximate.

With no approved domain, the current build deliberately has no canonical/absolute OG image URL, an empty sitemap, robots Disallow / and noindex/nofollow. Unit tests validate 17 unique absolute sitemap entries and matching canonical/OG URLs when an HTTPS origin is configured. SITE_URL alone does not opt into indexing; ALLOW_INDEXING=true is also required. Public-domain metadata must be checked end-to-end after an approved deployment target exists. A robots rule is not an access-control mechanism.

## Security review

The registry-backed npm audit on 25 October 2026 reported **zero vulnerabilities across all dependency categories**; raw output: [dependency audit](phase4-audit-before.json). The first sandboxed request failed to reach the registry and is not treated as evidence of security. No forced downgrades or broad dependency upgrades were applied. axe-core is the sole added direct development dependency. Audit results are point-in-time, not a security guarantee.

Source review found no application environment-secret files, backend credentials, persistence or enquiry network calls. Server-only origin/indexing configuration contains no secrets. The only application HTML injection is static JSON-LD with less-than escaping; print content uses existing controlled configuration data. No unsafe external target-blank links were found in audited pages. Export uses local image data and a print window with its opener cleared. The demo form retains native limits/validation and does not store or transmit input.

Headers restrict framing, MIME sniffing, object embedding, base URLs, form actions and camera/microphone/geolocation permissions. **The CSP is intentionally partial**: script-src/default-src nonces and a full deployment-specific policy are not implemented. Static Next bootstrapping and print/export require review before tightening it. TLS/HSTS and hosting-level controls cannot be verified on localhost. This is a code/dependency review, not penetration testing.

## Browser and device coverage

Chromium uses desktop and emulated iPhone-sized viewports. Firefox uses desktop; WebKit uses desktop and iPhone emulation. The earlier Firefox sandbox launch timeout is an environment restriction: execution outside that sandbox is required on this host. Browser-specific final results are recorded above. No claim about physical Safari/iOS/Android follows from Playwright emulation.

### Required manual verification before launch

1. On a physical iPhone/Safari and Android/Chrome, open all main routes in portrait/landscape; check browser bars, safe areas, 320-equivalent reflow, menu scrolling, focus and 200% text zoom.
2. Enter the showroom; orbit, pinch, reset and switch viewpoints. Confirm no accidental page trapping, excessive heat or visible sustained stutter. Record device/OS/browser, FPS if available and renderer resolution.
3. Open the configurator, change every theme/material/lighting preset, select/clear furniture, save A/B, compare and restore. Verify the bottom sheet, close action and controls remain reachable with the on-screen keyboard and large text.
4. Download PNG and print/save PDF; inspect the actual file, title, palette, disclaimer and restored configuration. Test denied downloads/popups and WebGL disabled/context loss.
5. With NVDA/Firefox and VoiceOver/Safari, test landmarks/headings, skip link, menu/modal focus, announcement of selections, form errors, snapshot differences and export status. Confirm focus returns after closing panels.
6. Check image-overlaid text, all material/lighting states and focus indicators visually; audit target sizes and spacing, forced colours and 400% zoom. Repeat with reduced motion enabled.
7. After approved domain setup, verify HTTPS headers, canonical and OG images, all sitemap URLs, robots/indexing intention, redirects and a fresh dependency audit.

## Changed files and evidence

- Shell/content accessibility: src/app/globals.css; src/app/page.tsx; src/app/journal/page.tsx; src/components/header.tsx, contact-form.tsx, project-gallery.tsx, cape-project-map.tsx.
- Metadata: src/lib/site.ts (new), src/lib/metadata.ts; src/app/layout.tsx; page metadata calls for projects, project details, studio, services, experience, journal, articles and contact; new src/app/robots.ts and sitemap.ts.
- Diagnostics: src/components/showroom/showroom.tsx and showroom-canvas.tsx; new scripts/audit-performance.mjs, audit-accessibility.mjs, audit-routes.mjs and capture-readiness.mjs.
- Security/tooling: next.config.ts; package.json/package-lock.json; vitest.config.mts; playwright.cross-browser.config.ts.
- Tests: new tests/readiness.test.ts and tests/e2e/readiness.spec.ts; accessible marker expectation in tests/e2e/phase-two.spec.ts.
- Documentation: README.md, this report, phase4-accessibility-before/after.json, phase4-performance*.json, dependency audit and screenshots.

Screenshots: [desktop homepage](design/phase4/1440-home.png), [mobile homepage](design/phase4/390-home.png), [desktop showroom](design/phase4/1440-experience.png), [mobile showroom](design/phase4/390-experience.png), [desktop overview](design/phase4/contact-sheet-1440.png). All nine page types at both widths are in docs/design/phase4/. Additional reviewed captures: [3D desktop](design/phase4/desktop-3d.png), [3D mobile](design/phase4/mobile-3d.png), [desktop comparison](design/phase4/desktop-comparison.png), [mobile comparison](design/phase4/mobile-comparison.png), and [exported PNG](design/phase4/desktop-board.png). The capture flow recorded no browser errors: [visual evidence](phase4-visual-verification.json).

## Release gates and next steps

- **Approval gate:** no deployment, publication or push without explicit user approval.
- **Configuration gate:** choose an approved public origin and intended indexing policy, rebuild and verify public metadata/headers.
- **Verification gate:** physical-device and manual assistive-technology checks above remain outstanding; record and resolve material issues before claiming release readiness for those users.
- **Licensing decision:** no repository-wide code licence exists. Select one before presenting the repository as open source; preserve image provenance and asset terms.
- **Performance limitation:** no hardware baseline or conclusive historical regression attribution. Profile a real target device before deciding on rendering changes.

No backend, authentication, payments, complex room editing or new product feature is recommended as a prerequisite. Keep the existing demo scope, complete the manual gates and then request publication approval for a concrete reviewed release.
