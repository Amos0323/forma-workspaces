# Source-only release scope

The owner explicitly authorised public source publication after privacy sanitisation and asset review. This supersedes the GitHub-publication hold in historical phase reports; it does **not** authorise Vercel deployment while manual acceptance remains outstanding.

## Publication review

- A separate FORMA-only directory/repository is used. The original parent workspace and unrelated project staging are untouched.
- node_modules, .next, browser test output directories, debug logs, environment files, generated TypeScript files and ZIP traces are excluded.
- Private raw acceptance logs are replaced with explicit omission notices, preserving documentation links without publishing local account/employer paths. Historical test summaries remain; omitted logs must not be mistaken for publicly available raw evidence.
- Source photographs are the six Unsplash assets listed in ASSETS.md. The [Unsplash licence](https://unsplash.com/license), rechecked for this source release, grants copying/distribution/use, including commercial use; it excludes competing image collections and unmodified image sales. These assets accompany a fictional application rather than a stock-image product. Preserve the asset notices; no blanket code licence is applied to third-party imagery.
- The hero/concept artwork is recorded as generated for this project; SVG plans and procedural models are original project work. There are no external model packs or fonts. Screenshots show the fictional application. No specific unresolved asset-rights issue was identified from the available provenance and licence records; this is not independent legal certification of contributor ownership.
- No code licence has been selected. Public source visibility does not grant an MIT/open-source licence. Rights remain subject to applicable copyright and platform terms.

## Acceptance status

Physical iPhone/Android, VoiceOver and NVDA evidence remains outstanding. Automated tests do not establish full WCAG compliance or real-device performance. Vercel preview/production deployment and live portfolio integration are not part of this source-only upload. Canonicals remain unconfigured and indexing remains disabled. The initial mobile image-loading timeout and successful retests are retained in the historical acceptance summary.

The application source, tests and public assets are unchanged from the locally verified candidate; documentation is sanitised for publication. Source hashes in historical acceptance records describe the original local evidence, not a hash of the entire sanitised public repository.

## Fresh verification before initial push

Completed across 25–26 October 2026 against production build `09H8rySBMCtiHuzBkycBU`: ESLint, strict TypeScript, production build and 18 unit tests passed. Chromium passed 67 tests with three existing device-inapplicable skips. Firefox passed 17; WebKit desktop passed 17 and WebKit mobile emulation passed 17. The dependency audit reported zero vulnerabilities. The previously intermittent mobile image readiness case passed without retries in this run.

The tests ran against the original local workspace; 75 application/test/script/asset/configuration files in the isolated release copy were compared byte-for-byte with zero differences. Public documentation was checked for local link resolution and valid JSON after sanitisation. Staged text checks found no selected credential-pattern or private workspace-identifier matches. These bounded checks do not constitute a universal security or legal guarantee.
