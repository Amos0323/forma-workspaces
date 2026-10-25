"use client";
import { useEffect, useRef, useState, type Dispatch } from "react";
import { DesignStudies, type DesignPair } from "./design-studies";
import { finishes, furniture, isCustomised, lightingPresets, materialGroups, themes, type InteriorAction, type InteriorConfig, type MaterialGroup, type ThemeId, type LightingId, type FurnitureId } from "./interior-config";

type Props = {
  config: InteriorConfig;
  dispatch: Dispatch<InteriorAction>;
  open: boolean;
  compact: boolean;
  onClose: () => void;
  capture: () => string | null;
};

export function SelectionInfo({ config, onClear }: { config: InteriorConfig; onClear: () => void }) {
  const selected = config.selectedFurniture && furniture[config.selectedFurniture];
  return <div className="furniture-info" aria-live="polite" aria-atomic="true">
    {selected ? <>
      <p className="micro">CONCEPT FURNITURE</p>
      <h3>{selected.name}</h3>
      <p>{selected.description}</p>
      <p className="furniture-finishes">{selected.groups.map(group => finishes[config.materials[group]].name).join(" · ")}</p>
      <button type="button" onClick={onClear}>Clear selection ×</button>
    </> : <p>Select a piece in the scene or use the furniture buttons below. All pieces are fictional design studies.</p>}
  </div>;
}

export function PaletteBoard({ config }: { config: InteriorConfig }) {
  return <div className="palette-board" aria-label="Selected design palette">
    <p>{themes[config.theme].name}{isCustomised(config) ? " · Customised" : ""}</p>
    <div>{(Object.keys(materialGroups) as MaterialGroup[]).map(group => {
      const finish = finishes[config.materials[group]];
      return <span key={group}><i style={{ backgroundColor: finish.colour }} aria-hidden="true"/>{finish.name}</span>;
    })}</div>
    <p>{lightingPresets[config.lighting].name} · {lightingPresets[config.lighting].description}</p>
    <small>Illustrated plan is a spatial reference. This material board reflects your selections.</small>
  </div>;
}

export function ConfiguratorPanel({ config, dispatch, open, compact, onClose, capture }: Props) {
  const [designs, setDesigns] = useState<DesignPair>({ A: null, B: null });
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (compact && open) dialog.current?.showModal();
    else dialog.current?.close();
    if (open && !compact) closeButton.current?.focus();
  }, [open, compact]);
  const contents = <>
    <div className="config-heading">
      <div><p className="micro">FORMA / MATERIAL STUDIES</p><h2 id="config-title">Make it yours.</h2></div>
      <button ref={closeButton} type="button" onClick={onClose} aria-label="Close configurator">×</button>
    </div>
    <p className="config-intro">A considered palette. Your perspective.<br/>Changes apply to the shared scene finishes.</p>
    <a className="study-jump" href="#studies-title">Compare & export <span aria-hidden="true">↓</span></a>
    <fieldset className="theme-options"><legend>01 / Design theme</legend>
      {(Object.keys(themes) as ThemeId[]).map(id => <button type="button" key={id} aria-pressed={config.theme === id} onClick={() => dispatch({ type: "theme", value: id })}>
        <span className="theme-colours" aria-hidden="true">{Object.values(themes[id].materials).map((finish, i) => <i key={i} style={{ backgroundColor: finishes[finish].colour }}/>)}</span>
        <span>{themes[id].name}</span><span aria-hidden="true">{config.theme === id ? "✓" : "↗"}</span>
      </button>)}
    </fieldset>
    <p className="config-summary" aria-live="polite">{themes[config.theme].description}{isCustomised(config) && " Customised palette."}</p>
    <div className="material-options">
      {(Object.keys(materialGroups) as MaterialGroup[]).map(group => <fieldset key={group}>
        <legend>{materialGroups[group].name} <span>{finishes[config.materials[group]].name}</span></legend>
        <div>{materialGroups[group].options.map(value => <button type="button" key={value} aria-label={finishes[value].name} aria-pressed={config.materials[group] === value}
          onClick={() => dispatch({ type: "material", group, value } as InteriorAction)}>
          <i style={{ backgroundColor: finishes[value].colour }} aria-hidden="true"/><span>{finishes[value].name}</span>
        </button>)}</div>
      </fieldset>)}
    </div>
    <fieldset className="lighting-options"><legend>02 / Light & atmosphere</legend>
      {(Object.keys(lightingPresets) as LightingId[]).map(id => <button type="button" key={id} aria-pressed={config.lighting === id} onClick={() => dispatch({ type: "lighting", value: id })}>{lightingPresets[id].name}</button>)}
    </fieldset>
    <fieldset className="furniture-options"><legend>03 / Explore the furniture</legend>
      {(Object.keys(furniture) as FurnitureId[]).map(id => <button type="button" key={id} aria-pressed={config.selectedFurniture === id} onClick={() => dispatch({ type: "select", value: id })}>{furniture[id].name}</button>)}
    </fieldset>
    <SelectionInfo config={config} onClear={() => dispatch({ type: "select", value: null })}/>
    <button type="button" className="config-reset" onClick={() => dispatch({ type: "reset" })}>Reset configuration ↺</button>
    <DesignStudies config={config} dispatch={dispatch} designs={designs} onSave={(slot, value) => setDesigns(previous => ({ ...previous, [slot]: value }))} capture={capture}/>
    <p className="config-footnote">Fictional concept pieces. Temporary studies stay in this page only; downloads stay on your device. No personal data.</p>
  </>;
  if (compact) return <dialog ref={dialog} className="config-sheet" aria-labelledby="config-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="configurator-content">{contents}</div>
  </dialog>;
  return <div className="configurator-content" hidden={!open} role="region" aria-labelledby="config-title" onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } }}>{contents}</div>;
}
