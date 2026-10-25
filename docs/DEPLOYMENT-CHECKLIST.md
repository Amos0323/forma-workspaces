# Deployment checklist — preparation only

**NO deployment, publication, repository creation or push is authorised by this document.** Checkboxes remain open until evidence and explicit approval exist.

## Acceptance gates

- [ ] Run the iPhone Safari/VoiceOver and Windows NVDA guides against the exact candidate; attach evidence, resolve failures and retest.
- [ ] Complete the outstanding Android Chrome/TalkBack check or have the release owner explicitly document a narrower supported-device scope and its risk.
- [ ] Review real-device rendering, thermal behaviour and export destinations. Do not substitute emulation or SwiftShader numbers.
- [ ] Review axe incomplete findings, image/canvas contrast, zoom/reflow, focus visibility and touch-target exceptions manually.
- [ ] Confirm final regression/build/audit results are fresh for the candidate and no unresolved material defects remain.
- [ ] Select a repository code licence if publishing as open source; retain applicable image/dependency terms and credits. No licence has been invented or applied.

## Approved target configuration (not executed)

- [ ] Obtain the exact approved HTTPS origin and hosting target from the owner. Do not set SITE_URL to a guessed or placeholder public domain.
- [ ] For an indexable release, set server-side build-time SITE_URL to that origin and ALLOW_INDEXING to true; for preview keep indexing disabled. Never place secrets in NEXT_PUBLIC variables.
- [ ] Rebuild for that target. Root-only origin validation rejects HTTP, credentials, paths, queries and fragments. Do not reuse the localhost preview build as an indexed release.
- [ ] Verify all 17 canonical/OG URLs and absolute image URLs, the sitemap's 17 unique pages, robots intent and metadata robots values. Unset origin currently yields no canonical URLs, an empty sitemap and disallowed/noindex pages. Configured origin with indexing disabled can still generate a sitemap, but remains disallowed/noindex.
- [ ] Review title/description uniqueness, en-ZA, alt descriptions, legacy redirects, 404s and CreativeWork schema. Preserve fictional studio/project/furniture disclosures, no verified premises or fabricated contact details.
- [ ] Verify hosting serves the app headers: nosniff, DENY framing, strict-origin-when-cross-origin, denied camera/microphone/geolocation and the limited CSP. Review TLS/HSTS and a deployment-specific script policy; these are not verified on local HTTP.
- [ ] Confirm PNG/download/print workflows still work under final headers. Review popup/download failures and static fallback.
- [ ] Confirm no backend enquiry submission, telemetry, personal-data persistence or new permissions were introduced unintentionally. No real email delivery is part of this release.

## Repository package review (not executed)

- [ ] Review README, feature/architecture summary, case study, test scope, screenshots and ASSETS.md.
- [ ] Inspect the exact staged diff and file list; exclude node_modules, .next, environment files, secrets, private device evidence and local network details. Existing .gitignore is not a substitute for reviewing files.
- [ ] Confirm screenshot provenance and that no image implies real commissions. Preserve stock-source links; review any remaining asset-rights questions before distribution.
- [ ] Record candidate build ID/source snapshot, dependency lockfile and reviewer sign-off. Do not commit or push solely because this checklist exists.

## Approval and post-approval verification

- [ ] Request explicit approval for the concrete target, revision and publication scope only after the package is reviewable.
- [ ] Only after approval, execute the separately agreed deployment/push steps and retain rollback instructions for the chosen host.
- [ ] Verify actual HTTPS routes, cache behaviour, security headers, crawlers/social previews, images, exports and physical-device access on the approved target. Roll back for material defects.

Current decision remains GO for local review / NO-GO for public launch. Passing automated tests or completing a draft checklist does not change that decision automatically.
