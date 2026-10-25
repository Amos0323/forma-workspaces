import { chromium, devices } from "@playwright/test";
import { readdir, readFile, writeFile } from "node:fs/promises";
const chunks = [];
for (const file of await readdir(".next/static/chunks")) {
  if (file.endsWith(".js") && (await readFile(".next/static/chunks/" + file, "utf8")).includes("WebGLRenderer")) chunks.push(file);
}
const browser = await chromium.launch();
const result = {};
try {
  for (const [name, options] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["mobile", devices["iPhone 13"]]]) {
    const page = await browser.newPage(options);
    const errors = [], requests = [];
    page.on("request", request => requests.push(request.url()));
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("http://localhost:3000/projects");
    await page.goto("http://localhost:3000/experience");
    const before3D = requests.filter(url => chunks.some(file => url.includes(file)));
    await page.getByRole("button", { name: "Enter 3D showroom" }).click();
    await page.locator("canvas[data-materials]").waitFor();
    await page.getByRole("button", { name: "Customise interior" }).click();
    await page.getByRole("button", { name: "Save Design A" }).click();
    await page.getByRole("button", { name: "Urban Executive" }).click();
    await page.getByRole("button", { name: "Gather sofa", exact: true }).click();
    await page.getByRole("button", { name: "Save Design B" }).click();
    await page.getByRole("button", { name: "Compare designs" }).click();
    await page.locator(".comparison-head").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `docs/design/phase3c-${name}-comparison.png` });
    await page.evaluate(() => {
      const container = document.querySelector("dialog[open]") || document.querySelector(".showroom-panel");
      const heading = document.querySelector(".comparison-head");
      const sticky = container.querySelector(".config-heading");
      container.scrollTop += heading.getBoundingClientRect().top - sticky.getBoundingClientRect().bottom - 18;
    });
    await page.screenshot({ path: `docs/design/phase3c-${name}-palette-comparison.png` });
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PNG" }).click();
    await (await dl).saveAs(`docs/design/phase3c-${name}-board.png`);
    await page.screenshot({ path: `docs/design/phase3c-${name}-export.png` });
    await page.getByRole("button", { name: "Close configurator" }).click();
    await page.waitForTimeout(700);
    await page.locator(".showroom").screenshot({ path: `docs/design/phase3c-${name}-showroom.png` });
    result[name] = { before3D, errors, selectedMetrics: await page.locator("canvas").evaluate(c => ({ ...c.dataset })) };
    await page.close();
  }
  const page = await browser.newPage();
  result.layouts = {};
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000/experience");
    await page.getByRole("button", { name: "Customise interior" }).click();
    await page.getByRole("button", { name: "Save Design A" }).click();
    await page.getByRole("button", { name: "Coastal Minimal" }).click();
    await page.getByRole("button", { name: "Save Design B" }).click();
    await page.getByRole("button", { name: "Compare designs" }).click();
    result.layouts[width] = await page.evaluate(() => {
      const region = document.querySelector(".design-comparison");
      const close = document.querySelector('button[aria-label="Close configurator"]');
      const rect = close.getBoundingClientRect();
      return { noPageOverflow: document.documentElement.scrollWidth <= innerWidth, noComparisonOverflow: region.scrollWidth <= region.clientWidth, closeVisible: rect.top >= 0 && rect.bottom <= innerHeight, closeTarget: [rect.width, rect.height] };
    });
  }
  await page.close();
} finally { await browser.close(); }
await writeFile("docs/phase3c-browser-verification.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
