# Windows NVDA acceptance guide

**Status: NOT RUN with NVDA.** Automated accessible-name/focus tests do not verify spoken output. Use Firefox first, then Chrome, recording exact Windows, browser and NVDA versions, keyboard layout, tester alias and `.next/BUILD_ID`. Use the production localhost build. No installation or screen-reader interaction was performed by this preparation.

Use the installed NVDA Help → User Guide if commands differ. Reference: [NV Access user guide](https://download.nvaccess.org/documentation/userGuide.html). NVDA is the configured Insert/Caps Lock modifier. In browse mode, H moves through headings, D landmarks, B buttons, F form fields; Shift reverses direction. NVDA+F7 opens the elements list; NVDA+Space switches browse/focus mode. Tab/Shift+Tab inspect actual keyboard focus. Screen-reader browse position and DOM focus are distinct.

## Setup and evidence

Start `npm start` after a production build; open `http://localhost:3000`. Record speech using NVDA Speech Viewer or a consented screen recording, without personal data. Use synthetic input such as `Reviewer`, `reviewer@example.test` and a demo-only message. Use [the evidence template](ACCEPTANCE-EVIDENCE.md); all scenarios begin NOT RUN. Record actual utterances, key sequence, expected/actual behaviour, evidence and issue ID.

| ID | Steps | Acceptance expectation |
| --- | --- | --- |
| NV-01 | Tab from the browser chrome, activate Skip to content, traverse navigation/footer; repeat main routes and Back/Forward. | Visible focus; useful link names; skip link bypasses repeated header; no keyboard trap or unexpected focus loss. |
| NV-02 | Use heading/landmark navigation and elements list on every main page, a case study and article. | One meaningful H1 and coherent section hierarchy; article contents links reach corresponding sections. No misleading business claims. |
| NV-03 | On Projects tab to category buttons, activate each, then All projects. | Selected state is announced; focus remains usable; changed results can be found/read without visual inference. If no useful update is announced, record the usability impact instead of assuming success. |
| NV-04 | Select all six map location controls, inspect preview and open its project. | Names identify locations, selection and project details are readable; no dependency on SVG coordinates or pointer hover. |
| NV-05 | On a project operate the before/after control with keyboard and endpoint buttons. | Name/value/direction and before/after meaning are understandable. Both conceptual descriptions remain accessible. |
| NV-06 | Open/close service disclosures with Enter/Space. | Summary and expanded state are understandable; disclosed text is reached in logical order. |
| NV-07 | Contact: traverse fields, submit empty then invalid email/short message, correct using synthetic values. | Labels, required state and errors are conveyed; focus allows correction; final preview explicitly says nothing was sent or stored. |
| NV-08 | Experience: stay in illustrated mode, read plan description/palette and activate all viewpoint buttons. | Complete configuration information and meaningful navigation are available without WebGL. |
| NV-09 | Open configurator. Select three themes, each material group, three lighting presets, furniture and Clear selection. | Labels, pressed states and feedback reflect choices; no colour-only meaning; understandable material/selection descriptions. |
| NV-10 | Save A, change finishes/light/selection, save B, Compare, restore each and reset. | Saved state and feedback are perceivable; each comparison value belongs clearly to A or B; restoration works; reset does not silently destroy slots. Refresh clears temporary slots as documented. |
| NV-11 | Reach export actions with keyboard. Download PNG, open print summary, return to original tab. | Action/loading/error/status text is usable; HTML summary is navigable. Raster image/PDF is not mistaken for tagged text. |
| NV-12 | Narrow viewport below 800px, open menu and configurator separately. Tab/Shift+Tab, browse headings/links, Escape/close. | Focus stays in active modal context, background is excluded where appropriate and focus returns to trigger. Desktop nonmodal panel permits normal navigation. |
| NV-13 | Optional 3D: focus canvas, use documented arrows/+/−/Home in focus mode, then Tab out. | Instructions are meaningful and no trap occurs; viewpoint buttons remain the accessible alternative. Screen-reader interception must be distinguished from app failure and documented. |
| NV-14 | Repeat essential flows at 200% and 400% zoom, Windows contrast theme and reduced motion. | Focus remains visible/unobscured, text reflows, controls stay reachable, and motion is not required for understanding. |

## Failure recovery and sign-off

Use illustrated mode as the ordinary alternative. Browser automated tests simulate unavailable WebGL and context loss; do not claim manual NVDA recovery verified unless actually induced while NVDA is active. Record what is announced after failure and whether snapshots, palette and export remain accessible.

Record speech/keyboard results per browser; Firefox results do not certify Chrome. Treat traps, inaccessible controls, lost configuration context or unannounced essential errors as release blockers. Review axe's incomplete contrast/ARIA/modal checks manually. Do not claim complete WCAG 2.2 AA compliance from this checklist alone. File findings, fix and retest the same scenario/build; preserve the original failed evidence.
