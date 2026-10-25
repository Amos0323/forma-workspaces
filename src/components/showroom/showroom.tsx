"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { views, type ViewName } from "./config";
import { defaultInterior, interiorReducer, lightingPresets, type FurnitureId } from "./interior-config";
import { ConfiguratorPanel, PaletteBoard, SelectionInfo } from "./configurator-panel";
const Scene = dynamic(() => import("./showroom-canvas"), { ssr: false });
function subscribeMotion(notify: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
function subscribeCompact(notify: () => void) {
  const query = window.matchMedia("(max-width: 800px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}
function compactSnapshot() { return window.matchMedia("(max-width: 800px)").matches; }
function motionSnapshot() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
state = { failed: false };
static getDerivedStateFromError() { return { failed: true }; }
componentDidCatch() { this.props.onError(); }
render() { return this.state.failed ? null : this.props.children; }
}
export function Showroom() {
const root = useRef<HTMLElement>(null);
const commits = useRef(0);
useEffect(() => { if (root.current) root.current.dataset.reactCommits = String(++commits.current); });
const [config, dispatch] = useReducer(interiorReducer, undefined, defaultInterior);
const captureView = useRef<(() => string | null) | null>(null);
const registerCapture = useCallback((capture: (() => string | null) | null) => { captureView.current = capture; }, []);
const selectFurniture = useCallback((value: FurnitureId | null) => dispatch({ type: "select", value }), []);
const [configuring, setConfiguring] = useState(false);
const configTrigger = useRef<HTMLButtonElement>(null);
const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, () => false);
const wasConfiguring = useRef(false);
useEffect(() => {
  if (wasConfiguring.current && !configuring) configTrigger.current?.focus();
  wasConfiguring.current = configuring;
}, [configuring]);
function closeConfigurator() { setConfiguring(false); }
const [active, setActive] = useState(false);
const [ready, setReady] = useState(false);
const [failed, setFailed] = useState(false);
const [view, setView] = useState<ViewName>("Overview");
const [revision, setRevision] = useState(0);
const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true);
function enter() {
const probe = document.createElement("canvas");
const context = probe.getContext("webgl2");
if (!context) { setFailed(true); return; }
context.getExtension("WEBGL_lose_context")?.loseContext();
setFailed(false); setReady(false); setActive(true);
}
function fallback() { setActive(false); setReady(false); }
return <section ref={root} className="showroom" style={{ backgroundColor: lightingPresets[config.lighting].background }} aria-labelledby="showroom-title" data-motion={reduced ? "reduced" : "smooth"}>
<div className="showroom-heading"><p className="micro">FORMA / SPATIAL STUDIES / 01</p><h1 id="showroom-title">A workplace,<br/><em>in perspective.</em></h1><p>Cape Town-inspired. Entirely conceptual.</p></div>
<div className="showroom-stage" aria-label="Architectural workplace viewer">
{!active && <div className="showroom-plan"><Image src="/images/concepts/showroom.svg" alt="Illustrated plan: meeting room upper left, workstations upper right, reception lower left and lounge lower right." width={1000} height={700}/><span className="micro">ILLUSTRATED PLAN / NOT TO SCALE</span><PaletteBoard config={config}/></div>}
{active && <SceneBoundary onError={() => { setFailed(true); fallback(); }}><Scene config={config} registerCapture={registerCapture} onSelect={selectFurniture} view={view} revision={revision} reduced={reduced} onReset={() => { setView("Overview"); setRevision(n => n + 1); }} onReady={() => setReady(true)} onFailure={() => { setFailed(true); fallback(); }}/></SceneBoundary>}
{active && !ready && <div className="showroom-loading" role="status">Composing space & light…</div>}
</div>
<aside className="showroom-panel" aria-label="Showroom controls" data-configuring={configuring && !compact}>
<div hidden={configuring && !compact} aria-hidden={configuring && compact ? true : undefined}>
<h2 className="sr-only">Explore the workplace</h2>
<p className="micro">EXPLORE THE SPACE</p>
{config.selectedFurniture && <SelectionInfo config={config} onClear={() => dispatch({ type: "select", value: null })}/>}<div className="showroom-views">{(Object.keys(views) as ViewName[]).map((name, i) => <button key={name} aria-pressed={view === name} onClick={() => { setView(name); setRevision(n => n + 1); }}><span>0{i + 1}</span>{name}</button>)}</div>
<p className="showroom-description" aria-live="polite">{views[view].description}</p>
<div className="showroom-actions"><button onClick={active ? fallback : enter}>{active ? "Use illustrated view" : "Enter 3D showroom"}<span aria-hidden="true">↗</span></button><button onClick={() => { setView("Overview"); setRevision(n => n + 1); }}>Reset view ↺</button></div>
<p className="showroom-instructions">{active ? "Drag to orbit · Pinch or scroll to zoom. Focus the scene: arrow keys orbit, + / − zoom, Home resets." : "Choose a space to read its design intent, or enter the interactive 3D cutaway."}</p>
{failed && <p role="status">3D is unavailable on this device. The illustrated view and all space descriptions remain available.</p>}
<button ref={configTrigger} className="config-open" type="button" aria-expanded={configuring} aria-haspopup={compact ? "dialog" : undefined} onClick={() => setConfiguring(true)}>Customise interior <span aria-hidden="true">↗</span></button>
</div>
<ConfiguratorPanel config={config} dispatch={dispatch} open={configuring} compact={compact} onClose={closeConfigurator} capture={() => active && ready ? captureView.current?.() ?? null : null}/>
</aside>
<div className="showroom-caption"><span className="micro">THOUGHTFUL SPACES. BETTER WAYS OF WORKING.</span><span>Fictional design study · No physical premises</span></div>
</section>;
}
