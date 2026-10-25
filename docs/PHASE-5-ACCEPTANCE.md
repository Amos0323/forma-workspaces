# Phase 5 — Final acceptance

Date: **25 October 2026**. Scope: acceptance preparation and local regression verification only. **No application feature changes, deployment, publication or GitHub push.**

## Decision

**GO for local review. NO-GO for public launch.** Automated verification is only one part of acceptance. There is no supplied physical iPhone/Android or NVDA/VoiceOver evidence, no approved production domain/hosting verification, and no repository code-licensing decision. This report does not designate the project production-ready.

## Reviewed baseline and outstanding gates

Reviewed [Phase 4 readiness](PHASE-4-READINESS.md), [README](../README.md), [Phase 3C testing/limitations](PHASE-3C.md), browser configs, readiness/unit tests, metadata/origin/crawler code, security headers and [asset provenance](ASSETS.md).

| Gate | Current evidence | Disposition |
| --- | --- | --- |
| Physical iPhone Safari, touch, native downloads/printing and VoiceOver | None supplied or executed | NOT RUN; guide ready |
| Windows NVDA on Firefox/Chrome | None supplied or executed | NOT RUN; guide ready |
| Physical Android Chrome/TalkBack | None supplied or executed | Outstanding Phase 4 gate; separate run or explicit support-scope decision |
| Real-device rendering/thermal behaviour | Phase 4 software-rendered samples only | Hardware acceptance outstanding; historical slowdown attribution remains inconclusive |
| Public origin and hosting checks | Local preview configuration verified; no approved origin | Public canonical/social/TLS/hosting checks blocked on approved target |
| Licensing | Stock-source records present; no repository-wide code licence | Owner decision needed before open-source release |
| Publication permission | Not granted; explicitly prohibited for this phase | No release action permitted |

## Fresh automated results

Candidate: production build `TxK2hwW5puQMuGR0nRolr`, Node 24.18.0, npm 11.16.0, Windows. [Candidate record](acceptance/candidate.json) contains the lockfile and [78-file source/test/asset/configuration manifest](acceptance/source-manifest.json) hashes. The source is an uncommitted local workspace, not an immutable release tag. Record an approved source revision before a later public release.

| Check | Phase 5 result | Evidence |
| --- | --- | --- |
| ESLint | PASS | [Log](acceptance/lint.txt) |
| Strict TypeScript | PASS | [Log](acceptance/typecheck.txt) |
| Production build | PASS, 22 prerendered entries | [Log](acceptance/build.txt) |
| Vitest | PASS, 18 tests / seven files | [Log](acceptance/unit.txt) |
| Chromium desktop/mobile | PASS on full rerun: 67 passed, three existing skips; initial intermittent failure retained below | [Final log](acceptance/chromium-final.txt), [initial log](acceptance/chromium.txt) |
| Firefox desktop | PASS, 17 tests | [Log](acceptance/cross-browser.txt) |
| WebKit desktop/mobile emulation | PASS, 17 desktop + 17 mobile tests | [Log](acceptance/cross-browser.txt) |
| npm dependency audit | PASS, zero reported vulnerabilities across all categories | [Registry response](acceptance/dependency-audit.json) |
| Runtime preview configuration | PASS on local production server | [HTTP evidence](acceptance/release-configuration.json) |

Initial Chromium run: 66 passed, three skipped and one mobile homepage-image polling timeout. The failure trace records HTTP 200 for the captured image requests; this does not prove image decoding completed. Three unchanged isolated reruns passed ([retest log](acceptance/chromium-image-retest.txt)); the subsequent full rerun passed all 67 applicable cases with three existing skips. No timeout was increased, test suppressed or application code changed. The intermittent cause remains unproven. Original log and local failure trace are retained; review/redact local paths and trace contents before any future repository publication.

Browser suites run sequentially. Firefox requires an unsandboxed execution context on this Windows host, as established in Phase 4; this is not a new application permission or deployed behaviour. Chromium runs all existing browser suites; the other engines run configurator, design-studies and readiness suites. They are not equivalent full-suite coverage. Existing device-inapplicable skips remain intentional. Node's Three.js CommonJS deprecation warning and colour-environment warnings are test-harness notices, not evidence of browser failure.

The registry audit is a dated advisory snapshot, not proof of absence of security defects. No dependencies were upgraded or added. Phase 5 does not rerun the software-renderer benchmark because renderer/application code is unchanged and device acceptance is the missing evidence. [Phase 4 measurements](phase4-performance.json) remain historical, not newly measured hardware results.

## Accessibility findings and device evidence

Phase 4 recorded zero axe violations across 34 page scans plus two states, and no overflow/observed CLS in those scenarios. Those full-route captures are **historical Phase 4 evidence**. Phase 5 reruns the targeted readiness axe regressions in the browser suites; it does not silently relabel the earlier scan as a new full audit.

Keyboard alternatives, named material/furniture controls, static plan, local demo form protection and context-loss behaviour are covered by automated regression. Actual spoken announcements, rotor/browse order, real touch accuracy, forced-colour details, image/canvas contrast and native print/download UX remain manual. Axe incomplete results and raster PDF accessibility remain limitations. No full WCAG 2.2 AA claim is made.

Physical-device evidence count: **0**. Manual screen-reader sessions: **0**. There are no device model/OS/VoiceOver/NVDA results to report. Test instructions and empty evidence rows are not passes.

Prepared:

- [iPhone Safari and VoiceOver guide](IPHONE-SAFARI-ACCEPTANCE.md): trusted LAN setup, navigation/touch, camera, finishes, comparison, PNG/PDF, motion, recovery and performance observations.
- [Windows NVDA guide](NVDA-ACCEPTANCE.md): landmarks/headings, filtering/map, forms, static configuration, comparison, keyboard/modal focus and export summary.
- [Evidence template](ACCEPTANCE-EVIDENCE.md): exact build/device/settings, scenario status, actual announcements, files, defects and retest/sign-off.

The guides reference Apple's and NV Access's official instructions checked on the audit date. Settings/gestures depend on the installed version; testers must record it. No firewall change, NVDA installation, device connection or physical test was performed by this phase.

## Release configuration review

No root `.env*` file or configured SITE_URL/ALLOW_INDEXING was found in this project/session; no production URL was added. Unit tests use a reserved example origin only inside temporary environment stubs. They do not configure a real deployment.

| Mode | Canonical / OG absolute URLs | Sitemap | Crawler intent |
| --- | --- | --- | --- |
| Current unset origin | Omitted | Empty valid urlset | Disallow /; noindex, nofollow |
| Approved HTTPS origin, indexing off | Derived from origin | 17 unique public routes | Disallow /; noindex, nofollow |
| Approved HTTPS origin, ALLOW_INDEXING=true | Derived from origin | 17 unique public routes | Allow /; index/follow |

Current runtime checks returned 200 for home/projects/contact/robots/sitemap, confirmed absent canonicals, noindex/nofollow and an empty sitemap. Code/unit review verifies the configured-origin branch, URL validation and unique route list. That branch has not been tested on a public domain. SITE_URL must be a root HTTPS origin without credentials, path, query or fragment and is evaluated for the build. Indexing is separate explicit opt-in. Robots restrictions are not access control.

Local responses include nosniff, DENY framing, strict-origin-when-cross-origin referrer handling, camera/microphone/geolocation denial and CSP `object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'`. X-Powered-By is disabled. The CSP does not provide a full script policy. TLS/HSTS, host header behaviour, CDN/cache rules and public-domain social previews remain unverified until an approved target exists.

CreativeWork schema, en-ZA metadata and fictional disclosures remain. No operating-company credentials, exact office address, fabricated clients, awards or real contact details were introduced. Contact remains a local preview; no backend, accounts or personal-data persistence were added.

## Assets and portfolio package

ASSETS.md records six locally stored Unsplash source URLs, an AI-generated fictional hero and original SVG/procedural scene work. The current [Unsplash licence](https://unsplash.com/license), checked 25 October 2026, permits commercial/noncommercial use and restricts unmodified image sales and competing image collections. Existing source records were reviewed; this is not independent proof of every contributor's rights or an asset-by-asset legal clearance. Do not add invented photographer names. Preserve provenance and review any unresolved rights questions before distribution.

No repository-wide code licence exists. This phase does not assign one or describe the project as MIT/open source. npm's private flag prevents accidental package publication; it does not decide repository licensing.

The local release package contains:

| Deliverable | Location |
| --- | --- |
| GitHub-oriented overview, features, architecture, setup, tests and limitations | [README](../README.md) |
| Current screenshot selection, pixel dimensions, provenance and file hashes | [Inventory](SCREENSHOT-INVENTORY.md), [JSON](acceptance/screenshots.json) |
| Narrative portfolio case study, explicitly draft and fictional | [Case study](PORTFOLIO-CASE-STUDY.md) |
| Future deployment/repository checks with approval gates | [Checklist](DEPLOYMENT-CHECKLIST.md) |
| Manual device/screen-reader procedures and evidence forms | Guides above |
| Fresh command logs, audit and build identity | [Acceptance evidence folder](acceptance/) |

Screenshots are reused Phase 4 Chromium captures and actual PNG exports, not new iPhone screenshots. No repository was created, no commit/tag/push made and no public package uploaded. README screenshots and documentation links resolve locally and are relative for eventual GitHub rendering.

## Remaining risks and final acceptance path

Test reliability: the initial mobile image-readiness timeout is not reproducible in the three isolated reruns or subsequent full run, but its cause is not established. Monitor this case during physical-device and later cold-start verification; do not describe it as a fixed application defect.

1. Execute both manual guides against the same candidate; collect evidence, fix/retest material failures. Complete Android acceptance or record a deliberate supported-device scope with the owner.
2. Record real-device performance and native export observations. Do not promise a frame rate based on SwiftShader; existing DPR limits may show aliasing on high-density screens.
3. Resolve code-licensing and any asset-rights questions; choose a genuine approved HTTPS origin and review hosting/security policy.
4. Bind acceptance evidence to the exact approved source revision/build. If application code changes, rerun affected regressions and relevant manual cases; preserve prior failures.
5. Review the finished package and request explicit approval for a concrete publication target. Only then may deployment/push be separately authorised, followed by actual public-target checks.

Until that evidence exists, the final decision remains **GO for local review / NO-GO for public launch**. Preparation and automated execution are complete. Physical and manual acceptance remains outstanding and must not be inferred from these results.
