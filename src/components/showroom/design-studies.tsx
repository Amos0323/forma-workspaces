"use client";
import { useRef, useState, type Dispatch } from "react";
import { copyInterior, finishes, furniture, lightingPresets, materialGroups, themes, type InteriorAction, type InteriorConfig, type MaterialGroup } from "./interior-config";

export type DesignPair = { A: InteriorConfig | null; B: InteriorConfig | null };
type Props = { config: InteriorConfig; dispatch: Dispatch<InteriorAction>; designs: DesignPair; onSave: (slot: keyof DesignPair, config: InteriorConfig) => void; capture: () => string | null };

export function DesignStudies({ config, dispatch, designs, onSave, capture }: Props) {
  const [comparing, setComparing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const exporting = useRef(false);
  async function exportBoard(format: "png" | "print") {
    if (exporting.current) return;
    // Open synchronously in the user gesture so popup blockers can make a clear decision.
    const target = format === "print" ? window.open("", "_blank") : null;
    if (format === "print" && !target) { setMessage("Allow a new tab for the print board, or choose Download PNG."); return; }
    if (target) { target.opener = null; target.document.title = "Preparing FORMA design board"; target.document.body.textContent = "Preparing your design board…"; }
    exporting.current = true; setBusy(true); setMessage("Composing your design board…");
    const snapshot = copyInterior(config);
    let visual: string | null = null;
    try { visual = capture(); } catch { /* A lost context still permits an illustrated board. */ }
    try {
      const { createDesignBoard, downloadBoard, printBoard } = await import("./design-board");
      const board = await createDesignBoard(snapshot, visual);
      if (target) {
        if (target.closed) throw new Error("The print tab was closed. Open it again to continue.");
        printBoard(target, board);
        setMessage("Print board opened in a new tab. Choose Print / Save as PDF there.");
      } else {
        await downloadBoard(board.canvas);
        setMessage(`PNG ready. ${board.rendered ? "Includes the current 3D view." : "Includes an illustrated reference and your configured palette."}`);
      }
    } catch (error) {
      target?.close();
      setMessage(error instanceof Error ? error.message : "The board could not be generated. Please try again.");
    } finally { exporting.current = false; setBusy(false); }
  }
  const pairReady = Boolean(designs.A && designs.B);
  const rows: { label: string; values: string[]; colours?: string[] }[] = designs.A && designs.B ? [
    { label: "Theme", values: [themes[designs.A.theme].name, themes[designs.B.theme].name] },
    ...(Object.keys(materialGroups) as MaterialGroup[]).map(group => ({ label: materialGroups[group].name, values: [designs.A!, designs.B!].map(d => finishes[d.materials[group]].name), colours: [designs.A!, designs.B!].map(d => finishes[d.materials[group]].colour) })),
    { label: "Lighting", values: [lightingPresets[designs.A.lighting].name, lightingPresets[designs.B.lighting].name] },
    { label: "Selected piece", values: [designs.A, designs.B].map(d => d.selectedFurniture ? furniture[d.selectedFurniture].name : "None selected") },
    ...Object.values(furniture).map(item => ({ label: `${item.name} finishes`, values: [designs.A!, designs.B!].map(d => item.groups.map(g => finishes[d.materials[g]].name).join(" / ")) })),
  ] : [];
  // Firefox restores dynamic button states on reload unless their form opts out.
  return <form autoComplete="off" onSubmit={event => event.preventDefault()}><section className="design-studies" aria-labelledby="studies-title">
    <p className="micro">04 / KEEP A PERSPECTIVE</p><h3 id="studies-title" tabIndex={-1}>Your design studies.</h3>
    <p>Hold two ideas alongside each other. Saved designs stay in this page until you leave or refresh.</p>
    <div className="study-actions">{(["A", "B"] as const).map(slot => <button type="button" key={slot} onClick={() => { onSave(slot, copyInterior(config)); setMessage(`Design ${slot} ${designs[slot] ? "replaced" : "saved"}.`); }}>Save Design {slot}<span>{designs[slot] ? themes[designs[slot].theme].name + " · Replace" : "Empty study"}</span></button>)}</div>
    <button type="button" className="study-wide" disabled={!pairReady} aria-expanded={comparing && pairReady} aria-controls="design-comparison" onClick={() => setComparing(!comparing)}>{comparing ? "Close comparison" : "Compare designs"}</button>
    {!pairReady && <p className="study-hint">Save both A and B to compare.</p>}
    {comparing && pairReady && <div id="design-comparison" className="design-comparison" role="region" aria-label="Design comparison">
      <div className="comparison-head"><strong>Design A</strong><strong>Design B</strong></div>
      {rows.map(row => <div className="comparison-row" key={row.label}>
        <h4>{row.label}<span>{row.values[0] === row.values[1] ? "Same" : "Different"}</span></h4>
        <div>{row.values.map((value, i) => <p key={i}>{row.colours && <i aria-hidden="true" style={{ backgroundColor: row.colours[i] }}/>}<span className="sr-only">Design {i === 0 ? "A" : "B"}: </span>{value}</p>)}</div>
      </div>)}
      <div className="study-actions">{(["A", "B"] as const).map(slot => <button key={slot} type="button" onClick={() => { dispatch({ type: "restore", value: designs[slot]! }); setMessage(`Design ${slot} restored. Saved designs are unchanged.`); }}>Restore Design {slot}</button>)}</div>
    </div>}
    <div className="board-export"><p className="micro">05 / TAKE THE IDEA WITH YOU</p><h3>A board to build on.</h3><p>Your palette, lighting and concept furniture in a considered design board. Enter 3D first to include your current view.</p>
      <button className="study-wide" type="button" disabled={busy} onClick={() => void exportBoard("png")}>Download PNG <span aria-hidden="true">↓</span></button>
      <button className="study-wide" type="button" disabled={busy} onClick={() => void exportBoard("print")}>Print / Save as PDF <span aria-hidden="true">↗</span><span className="sr-only"> (opens a new tab)</span></button>
      <p className="study-hint">1600 × 2000 px PNG. PDF uses your browser’s print destination. No personal details are included.</p>
    </div>
    <p className="study-feedback" aria-live="polite" aria-atomic="true">{message}</p>
  </section></form>;
}
