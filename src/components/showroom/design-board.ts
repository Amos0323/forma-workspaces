import { finishes, furniture, isCustomised, lightingPresets, materialGroups, themes, type InteriorConfig, type MaterialGroup, type FurnitureId } from "./interior-config";

export const boardTitle = "Cape Town workplace";
export const boardDisclaimer = "Fictional studio · Conceptual design study · Not a commission or product specification.";
export function boardDetails(config: InteriorConfig, date = new Date()) {
  return {
    title: boardTitle,
    theme: themes[config.theme].name + (isCustomised(config) ? " / Customised" : ""),
    date: new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" }).format(date),
    materials: (Object.keys(materialGroups) as MaterialGroup[]).map(group => ({ group: materialGroups[group].name, ...finishes[config.materials[group]] })),
    lighting: lightingPresets[config.lighting].name,
    furniture: (Object.keys(furniture) as FurnitureId[]).map(id => ({ name: furniture[id].name, selected: id === config.selectedFurniture, finishes: furniture[id].groups.map(group => finishes[config.materials[group]].name).join(" / ") })),
  };
}

async function loadImage(source: string) {
  const image = new Image();
  image.src = source;
  await image.decode();
  return image;
}

/** Browser-only, loaded on export. No renderer, network asset or persistence dependency. */
export async function createDesignBoard(config: InteriorConfig, capture: string | null) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600; canvas.height = 2000;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image generation is unavailable in this browser.");
  const details = boardDetails(config);
  const text = (value: string, x: number, y: number, size = 25, colour = "#242720", serif = false) => {
    ctx.fillStyle = colour; ctx.font = `${size}px ${serif ? "Georgia" : "Arial"}`; ctx.fillText(value, x, y);
  };
  const line = (y: number) => { ctx.fillStyle = "#d2d1c6"; ctx.fillRect(80, y, 1440, 1); };
  ctx.fillStyle = "#f3f1e9"; ctx.fillRect(0, 0, 1600, 2000);
  text("FORMA", 80, 123, 64); text("W O R K S P A C E S", 82, 161, 19);
  text("SPATIAL STUDIES / 01", 1180, 112, 21);
  text(details.date, 1180, 150, 21);
  line(195);
  text(details.title, 80, 277, 68, "#242720", true);
  text("Thoughtful spaces. Better ways of working.", 83, 324, 26, "#555c42");

  const source = capture || "/images/concepts/showroom.svg";
  let image: HTMLImageElement;
  let rendered = Boolean(capture);
  try { image = await loadImage(source); }
  catch { image = await loadImage("/images/concepts/showroom.svg"); rendered = false; }
  ctx.fillStyle = lightingPresets[config.lighting].background; ctx.fillRect(80, 375, 1440, 670);
  const scale = Math.min(1440 / image.naturalWidth, 670 / image.naturalHeight);
  const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
  ctx.drawImage(image, 80 + (1440 - w) / 2, 375 + (670 - h) / 2, w, h);
  text(rendered ? "CURRENT 3D VIEW / CONCEPTUAL VISUALISATION" : "ILLUSTRATED SPATIAL REFERENCE / NOT TO SCALE / PALETTE BELOW IS CONFIGURED", 80, 1080, 18);
  text(details.theme, 80, 1155, 43, "#242720", true);
  text(`LIGHT / ${details.lighting}`, 80, 1203, 23, "#555c42");
  details.materials.forEach((material, index) => {
    const x = 80 + index * 365;
    ctx.fillStyle = material.colour; ctx.fillRect(x, 1250, 345, 175);
    text(material.group.toUpperCase(), x, 1460, 18, "#555c42");
    text(material.name, x, 1500, 27);
  });
  line(1540);
  text("FURNITURE / CONCEPT PIECES", 80, 1590, 20, "#555c42");
  details.furniture.forEach((item, i) => {
    const y = 1645 + i * 57;
    text(item.name + (item.selected ? " · Selected" : ""), 80, y, 26);
    text(item.finishes, 720, y, 24);
  });
  line(1860);
  text(boardDisclaimer, 80, 1910, 22);
  text("Screen colours are indicative. Review physical samples before specifying materials.", 80, 1947, 20, "#555c42");
  return { canvas, details, rendered };
}

export async function downloadBoard(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("PNG generation failed.")), "image/png"));
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "forma-workspaces-design-board.png";
  document.body.append(anchor); anchor.click(); anchor.remove();
  // Allow Safari to consume the download before releasing its source.
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function printBoard(target: Window, board: Awaited<ReturnType<typeof createDesignBoard>>) {
  const doc = target.document;
  doc.title = "FORMA WORKSPACES — Design board";
  doc.documentElement.lang = "en-ZA";
  const style = doc.createElement("style");
  style.textContent = "body{margin:0;background:#f3f1e9;color:#242720;font:16px Arial}main{max-width:800px;margin:auto}img{display:block;width:100%;height:auto}button{margin:20px;padding:16px 24px;border:1px solid #555c42;background:#242720;color:#fff;font:inherit;cursor:pointer}button:focus-visible{outline:3px solid #937351;outline-offset:4px}.details{padding:24px} @page{size:A4 portrait;margin:10mm} @media print{body{background:white}button,.details{display:none}main{width:190mm;max-width:none}img{width:190mm;height:auto;max-height:275mm;object-fit:contain}}";
  doc.head.append(style);
  doc.body.replaceChildren();
  const main = doc.createElement("main"), button = doc.createElement("button"), image = doc.createElement("img"), details = doc.createElement("section");
  button.textContent = "Print / Save as PDF"; button.onclick = () => target.print();
  image.src = board.canvas.toDataURL("image/png");
  image.alt = `${board.details.title}. ${board.details.theme}. ${board.details.lighting}. ${board.rendered ? "Current 3D view" : "Illustrated spatial reference"}. Full configuration listed below.`;
  details.className = "details";
  const heading = doc.createElement("h1"); heading.textContent = "Design configuration"; details.append(heading);
  [board.details.date, board.details.theme, ...board.details.materials.map(m => `${m.group}: ${m.name}`), `Lighting: ${board.details.lighting}`, ...board.details.furniture.map(f => `${f.name}${f.selected ? " (selected)" : ""}: ${f.finishes}`), boardDisclaimer, "Choose Save as PDF in your browser’s print destination. Turn off headers and footers to omit browser URLs."].forEach(value => { const p = doc.createElement("p"); p.textContent = value; details.append(p); });
  main.append(button, image, details); doc.body.append(main);
  doc.body.dataset.boardReady = "true";
  button.focus();
}
