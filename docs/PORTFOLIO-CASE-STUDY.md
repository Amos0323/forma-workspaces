# Portfolio case study — editorial draft

**Draft for review, not published.** FORMA WORKSPACES is a fictional commercial interior design studio imagined in Cape Town. This is a software-development case study, not a client commission or operating-business success story.

## The brief

Build an architectural website whose editorial presentation and interactive depth belong together. The challenge was to combine cinematic storytelling with accessible browsing, then extend the same visual identity into a lightweight workplace configurator without making the whole site download a 3D engine.

## What was built

The portfolio includes six Western Cape concept workplaces, category filtering, an approximate project map, narrative case studies, conceptual before/after plans, six services and four original articles. A locally rendered office cutaway adds five viewpoints, three themes, twelve material finishes, three lighting presets and four selectable fictional furniture pieces. Visitors can compare two temporary designs and export a branded PNG or use browser printing for PDF.

## Design and engineering decisions

Warm ivory, charcoal and olive, editorial type and generous spacing establish a restrained Cape Town-inspired identity. Imagery is explicitly illustrative; no photographs are presented as completed FORMA commissions.

Next.js prerenders content pages. React islands manage interaction; GSAP handles scroll storytelling and Motion handles component interactions. Three.js/React Three Fiber load only when the visitor enters the showroom, and export code loads on demand. Shared geometry/materials, instanced details, cached shadows and demand rendering avoid continuous idle work. Configuration and snapshots stay in local component state; no account, backend or persistence is required.

The static plan and named palette are first-class alternatives. Keyboard-operable controls expose configuration without requiring canvas interaction. Reduced-motion preferences remove camera interpolation. Context failure preserves useful configuration information and illustrated export. The contact form is explicitly a local preview and cannot fall back to native transmission before hydration.

## Verification and honest results

See the dated [acceptance report](PHASE-5-ACCEPTANCE.md) for current rerun results and [Phase 4](PHASE-4-READINESS.md) for the recorded performance investigation. Automated browser checks cover configuration, snapshots, export, context loss, navigation and accessibility regressions. The historical software-renderer slowdown was investigated using repeated conditions; host variability prevented a reliable causal claim. Zero idle frames and stable scene complexity are supported observations, not a promise of real-device frame rates.

Physical iPhone/Android and NVDA/VoiceOver acceptance evidence is still outstanding. Automated axe results do not establish full WCAG compliance. The PDF artwork is raster and does not provide tagged document text. This project has not been deployed or published in this phase.

## Portfolio presentation

Lead with the [desktop showroom](design/phase4/desktop-3d.png), show the [A/B interaction](design/phase4/desktop-comparison.png), then the [exported board](design/phase4/desktop-board.png). Pair these with the [editorial homepage](design/phase4/1440-home.png) and a [mobile comparison](design/phase4/mobile-comparison.png). These are desktop-browser captures, not physical-device test evidence. Use the [screenshot inventory](SCREENSHOT-INVENTORY.md) for dimensions and provenance.

Suggested summary: “An editorial architecture portfolio with an opt-in 3D workplace configurator, temporary design comparison and client-side design-board export. Built with Next.js, React, TypeScript and Three.js, with keyboard alternatives and a useful static fallback.”

Do not add real clients, conversion improvements, awards, real-device performance claims or accessibility certification without evidence. The next step is recorded device/assistive-technology acceptance, followed by an explicitly approved release decision.
