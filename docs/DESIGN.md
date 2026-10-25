# Phase 1 design system

## Phase 2 extension

The portfolio, map, case studies, Studio, Services and Journal extend the same ivory/charcoal/olive/sandstone system. Motion owns filter rearrangement and schematic map viewport transforms; GSAP owns scroll storytelling. The comparison uses a native range input over matched conceptual SVG plans. Route entry uses a brief CSS opacity fade and disables it for reduced motion. See [the Phase 2 delivery record](PHASE-2.md) for verification, files and screenshots.

## South African repositioning

The established visual and animation system is retained. Copy now locates the fictional studio in Cape Town and the six design studies in the Western Cape. A warm sandstone location panel (`#e9e3d6`), natural timber and indigenous-planting concepts bring a restrained local influence without stereotypical motifs. The hero adds the supplied South African description and a visible portfolio disclosure. Its spacing adapts to the longer copy on mobile. Registered-trademark decoration was removed. The original concept board is historical art direction; the new copy intentionally supersedes its text.

Repositioning verification: inspected the updated 1440×900 desktop hero, 390×844 mobile hero and mobile contact panel. The requested headline and description are preserved, with responsive line breaks. Long project names use a fluid mobile heading size. The sandstone colour is exposed as `--sandstone`. No animation logic or motion-library ownership changed.

## Direction

Architectural editorial: warm ivory, charcoal, olive, bronze, large imagery, asymmetric project pacing, restrained linework and generous space. Reference: `design/concept.png`. This is a design direction board rather than a pixel-exact full-page wireframe. The implementation expands its compressed sections into a responsive page, with interactive service disclosures and a circular magnetic CTA.

## Tokens

| Token | Value |
| --- | --- |
| Paper | #f3f1e9 |
| Ink | #242720 |
| Olive | #555c42 |
| Bronze | #937351 |
| Muted | #77786e |
| Divider | #d2d1c6 |
| Page gutter | clamp(24px, 4.7vw, 88px) |
| Section heading | clamp(38px, 5.2vw, 82px) |
| Small label | 10px / 0.16em tracking |

Tokens live in `src/app/globals.css` and are exposed through Tailwind's theme. Semantic classes handle the editorial layouts and responsive variants. Reusable components own the header, footer, project grid, magnetic links, contact preview and animation lifecycle.

## Motion ownership

- GSAP: headline reveal, hero entrance, parent image parallax and section reveals. ScrollTrigger is cleaned up with the matchMedia context on route changes.
- Motion: magnetic anchor transforms only. Mouse-only; spring resets on pointer leave or blur.
- Lenis: scroll interpolation, synchronized through GSAP's ticker; destroyed on route changes.
- CSS: finite introduction, scroll cue, image hover and disclosure icon. Separate DOM wrappers prevent competing transforms.
- Reduced motion: no Lenis, no GSAP animation, no magnetic movement, no intro overlay, no CSS animation/transition. Content stays visible.
- Without JavaScript: all server-rendered content, desktop navigation, project links and native service disclosures remain usable.

## Visual verification

Compared the concept and Playwright Chromium screenshots using image inspection at desktop 1440×900 and mobile 390×844. Checked hero hierarchy, architectural image crop, warm palette, asymmetric gallery rhythm, service linework, olive philosophy band and oversized closing typography. Exact requested headline is preserved; a tagline, scroll indicator and Journal navigation are intentional additions from the project brief. The stock project photography differs from the generated direction board and is explicitly marked illustrative.

The implementation follows the reference's visual language, not its compressed board proportions. No claim of pixel-exact fidelity is made. Header contrast and gallery image selection were corrected after review.
