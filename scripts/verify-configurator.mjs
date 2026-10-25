import { chromium, devices } from "@playwright/test";
import { readdir, readFile, writeFile } from "node:fs/promises";

const graphicsChunks = [];
for (const file of await readdir(".next/static/chunks")) {
  if (file.endsWith(".js") && (await readFile(".next/static/chunks/" + file, "utf8")).includes("WebGLRenderer")) graphicsChunks.push(file);
}
const browser = await chromium.launch();
const result = {};
try {
  for (const [name, options] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["mobile", { ...devices["iPhone 13"] }]]) {
    const page = await browser.newPage(options);
    const requests = [], errors = [];
    page.on("request", request => requests.push(request.url()));
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("http://localhost:3000/projects");
    await page.waitForTimeout(300);
    const graphicsOnProjects = requests.filter(url => graphicsChunks.some(file => url.includes(file)));
    await page.goto("http://localhost:3000/experience");
    await page.waitForTimeout(300);
    const graphicsBeforeEntry = requests.filter(url => graphicsChunks.some(file => url.includes(file)));
    await page.locator(".showroom").screenshot({ path: "docs/design/phase3b-" + name + "-static.png" });
    await page.getByRole("button", { name: "Enter 3D showroom" }).click();
    await page.locator("canvas[data-materials]").waitFor();
    const identities = await page.locator("canvas").getAttribute("data-resource-ids");
    const themes = {};
    for (const [id, label] of [["cape", "Cape Contemporary"], ["coastal", "Coastal Minimal"], ["urban", "Urban Executive"]]) {
      await page.getByRole("button", { name: "Customise interior" }).click();
      await page.getByRole("button", { name: label }).click();
      if (id === "coastal") await page.screenshot({ path: "docs/design/phase3b-" + name + "-controls.png" });
      await page.getByRole("button", { name: "Close configurator" }).click();
      await page.waitForTimeout(600);
      await page.locator(".showroom").screenshot({ path: "docs/design/phase3b-" + name + "-" + id + ".png" });
      themes[id] = await page.locator("canvas").evaluate(canvas => ({ ...canvas.dataset }));
    }
    await page.getByRole("button", { name: "Customise interior" }).click();
    await page.getByRole("button", { name: "Gather sofa", exact: true }).click();
    await page.getByRole("button", { name: "Close configurator" }).click();
    await page.locator(".showroom").screenshot({ path: "docs/design/phase3b-" + name + "-selection.png" });
    result[name] = { graphicsChunks, graphicsOnProjects, graphicsBeforeEntry,
      graphicsAfterEntry: requests.filter(url => graphicsChunks.some(file => url.includes(file))),
      sharedGeometryPreserved: Object.values(themes).every(theme => theme.resourceIds === identities), themes, errors };
    await page.close();
  }
  const page = await browser.newPage();
  result.layoutWidths = {};
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000/experience");
    await page.getByRole("button", { name: "Customise interior" }).click();
    result.layoutWidths[width] = await page.evaluate(() => ({ noOverflow: document.documentElement.scrollWidth <= innerWidth,
      closeButtonVisible: !![...document.querySelectorAll('button[aria-label="Close configurator"]')].find(button => {
        const rect = button.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight && rect.width >= 44 && rect.height >= 44;
      }) }));
    await page.getByRole("button", { name: "Close configurator" }).click();
  }
  await page.close();
} finally { await browser.close(); }
await writeFile("docs/phase3b-browser-verification.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
