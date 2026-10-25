# iPhone Safari acceptance guide

**Status: NOT RUN on a physical device.** Playwright iPhone emulation is not iPhone evidence. Use this guide on the exact candidate build and attach results using [the evidence template](ACCEPTANCE-EVIDENCE.md).

## Local-network setup (no deployment)

1. Use a trusted private Wi-Fi network shared by the Windows computer and iPhone. Keep the computer awake. Do not create a public tunnel, router port-forward or hosting deployment.
2. In the project directory run `npm run build`. If a local server is already using port 3000, stop that server in its own terminal first. Start the production server with `npm start -- --hostname 0.0.0.0 --port 3000`.
3. In another PowerShell terminal run `ipconfig`. Find the IPv4 address for the active Wi-Fi/Ethernet adapter, not a VPN/virtual adapter. On the computer verify `http://localhost:3000` first.
4. In iPhone Safari enter `http://<computer-LAN-IPv4>:3000`, replacing the bracketed token with that actual address. The phone's localhost refers to the phone, not the computer. This is a local HTTP test, not a production domain; leave SITE_URL and ALLOW_INDEXING unset.
5. If unreachable, verify the address and same-network connection. Guest Wi-Fi/client isolation or a managed firewall may prevent access. On a personally managed trusted network, allow only the required Node/port 3000 access on the Private profile if prompted. Do not disable the firewall or bypass corporate network policy; ask the network owner if restricted. No firewall settings were changed by this acceptance preparation.
6. Record reachability as BLOCKED if unavailable. After testing stop the server with Ctrl+C and remove any temporary rule you created. Do not put personal information in the demo form or public evidence.

Record iPhone model, iOS/Safari version, orientation, page zoom/text size, VoiceOver and Reduce Motion settings, battery/Low Power Mode, build ID from `.next/BUILD_ID`, date/time and tester alias. Redact LAN addresses from any evidence intended for publication.

## Functional checklist

Each row starts NOT RUN. Mark PASS only after completing it, with an evidence filename or detailed observations; retain FAIL/BLOCKED results.

| ID | Action | Acceptance expectation |
| --- | --- | --- |
| IP-01 | Visit Home, Projects, each of six projects, Studio, Services, Journal, all four articles, Contact and Experience. Use menu, footer, Back/Forward and article next links. | Correct content, no dead ends, working menu/close, clear fictional disclosures; no overlap or sideways page scrolling. |
| IP-02 | Rotate portrait/landscape, expand/collapse Safari bars, increase text/page zoom and scroll long pages. | Content and essential controls remain reachable; no clipped headings, covered close buttons or stuck scrolling. |
| IP-03 | Tap every category filter, then All projects; select each map location and follow its preview. | Selected filter/location is clear; correct projects appear without depending on hover; map does not claim precise addresses. |
| IP-04 | On a case study drag the before/after handle with one finger; try both endpoints and endpoint buttons. | Both labelled conceptual plans are reachable; pointer release ends dragging; page can scroll outside the control. |
| IP-05 | Open service disclosures; submit blank/invalid demo contact values, then synthetic valid values. | Errors are understandable; valid preview says nothing was sent/stored. Keyboard does not obstruct essential actions. |
| IP-06 | Open Experience in illustrated mode before entering 3D. | Plan, material names, viewpoints and configuration are useful independently of WebGL. |
| IP-07 | Enter 3D, drag to orbit, pinch in/out, choose Overview/Reception/Workstations/Meeting Room/Lounge, Reset view. | Coherent scene, bounded camera above floor, no wall traversal, no unintended page trapping. Navigation outside canvas remains usable. |
| IP-08 | Change Cape Contemporary, Coastal Minimal and Urban Executive; try every timber/flooring/upholstery/accent finish and each lighting preset. | Actual scene and named palette update; control states agree; no lost interaction after rotation. |
| IP-09 | Tap furniture and use named furniture buttons; clear selection. Reset configuration. | Name/description/finishes and highlight agree. Reset restores defaults; Reset view is a separate action. |
| IP-10 | Save A, change theme/lighting/furniture, save B, Compare, Restore A then B. Close/reopen sheet. | Both palettes and differences are readable; restoration matches saved values; sheet scroll and close work. Reset configuration retains saved slots; reload clears them. |
| IP-11 | Download PNG from illustrated and 3D modes; open each actual download in Files/preview. | 1600 × 2000 board has current theme, names, light, furniture, date and disclaimer; illustrated reference is labelled. No blank/cropped artwork. |
| IP-12 | Open Print / Save as PDF, read summary, invoke print and use an available PDF/share destination. | Actual output readable, preferably one A4 page. Record exact Safari/iOS steps and any unavailable destination or blocked popup; do not mark PDF passed just because its tab opened. Raster artwork is a known limitation. |
| IP-13 | Enable Reduce Motion in iPhone accessibility settings; repeat viewpoint and comparison restoration. | No cinematic camera interpolation; all controls and content still work. |
| IP-14 | Leave/return to Safari, rotate and use illustrated view again. If genuine WebGL failure occurs, record recovery. | Static configuration/export remain usable. If no failure is induced, mark physical context-loss scenario NOT RUN; automated coverage is separate. |

## VoiceOver pass

Enable Settings → Accessibility → VoiceOver. Swipe right/left to traverse, double-tap to activate; use the rotor's headings/links options to inspect structure. Gesture reference: [Apple VoiceOver gestures](https://support.apple.com/guide/iphone/use-voiceover-gestures-iph3e2e2281/ios) and [rotor guide](https://support.apple.com/en-gb/111796). Record the installed iOS version because settings vary.

- VO-01: Navigate each page's headings and links. Expect meaningful labels and reading order; decorative imagery must not overwhelm navigation.
- VO-02: Open the menu and configurator sheet. Expect expanded/selected states, a discoverable close control, no traversal into inert background, and restored focus after closing.
- VO-03: Filter projects and select map locations. Confirm the result can be discovered and understood without a visual map; record actual announcement text.
- VO-04: Use only the illustrated showroom and named controls to choose theme, materials, light and furniture. Expect comprehensible states and selection feedback without needing to manipulate the canvas.
- VO-05: Save, compare and restore A/B. Confirm each value is attributable to its design and differences are conveyed by text, not colour alone. Check feedback is neither silent nor excessively repeated.
- VO-06: Verify form labels/required/errors and preview message; inspect export tab's HTML summary. Do not treat an image-based PDF as a tagged accessible document.

## Performance observations

Run three comparable trials: fresh page, same Overview/default theme, 30 seconds orbit/pinch, then 10 seconds untouched. Record initial load delay, visible stutters/input lag, thermal/battery changes, blank frames and whether backgrounding recovers. Keep device settings and workload constant. Repeat once with comparison open. Record numeric FPS/frame time/memory only when an actual device profiler provides them; otherwise write NOT MEASURED, not an estimate. Windows alone does not provide Safari's macOS remote inspector. Do not compare subjective observations or device FPS directly with Phase 4 SwiftShader samples.

## Completion criteria

Attach screenshots/recordings, sample PNG/PDF, VoiceOver observations and issue IDs. Navigation, configuration, recovery, focus or export failures block acceptance until fixed/retested. Physical Android Chrome remains a separate outstanding Phase 4 gate; adapt this functional checklist and use TalkBack rather than claiming iPhone evidence covers Android.
