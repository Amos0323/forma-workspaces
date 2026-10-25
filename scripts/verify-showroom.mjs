import { chromium, devices } from "@playwright/test";
import { readdir, readFile, writeFile } from "node:fs/promises";
const chunkDir = ".next/static/chunks";
const graphicsChunks = [];
for (const name of await readdir(chunkDir)) {
  if (name.endsWith(".js") && (await readFile(chunkDir + "/" + name, "utf8")).includes("WebGLRenderer")) graphicsChunks.push(name);
}
const browser = await chromium.launch();
const results = {};
try {
  for (const [name, options] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["mobile", { ...devices["iPhone 13"] }]]) {
    const page = await browser.newPage(options);
    const errors = [];
    const requests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => requests.push(request.url()));
    await page.goto("http://localhost:3000/projects");
    await page.waitForTimeout(300);
    const graphicsOnProjects = requests.filter(url => graphicsChunks.some(chunk => url.includes(chunk)));
    await page.goto("http://localhost:3000/experience");
    await page.waitForTimeout(300);
    const graphicsBeforeEntry = requests.filter(url => graphicsChunks.some(chunk => url.includes(chunk)));
    await page.screenshot({ path: "docs/design/phase3a-" + name + "-static.png", fullPage: true });
    await page.getByRole("button", { name: "Enter 3D showroom" }).click();
    const canvas = page.locator("canvas");
    await canvas.waitFor({ timeout: 30000 });
    for (let attempt = 0; attempt < 24; attempt++) {
      const frame = await canvas.getAttribute("data-frames");
      await page.waitForTimeout(500);
      if (frame !== null && await canvas.getAttribute("data-frames") === frame) break;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "docs/design/phase3a-" + name + "-showroom.png", fullPage: true });
    // Full-page screenshots can resize the viewport and restart camera fitting.
    // Measure idle only after that resize transition has also settled.
    for (let attempt = 0; attempt < 30; attempt++) {
      const frame = await canvas.getAttribute("data-frames");
      await page.waitForTimeout(500);
      if (await canvas.getAttribute("data-frames") === frame) break;
    }
    const metrics = await canvas.evaluate(c => {
      const context = c.getContext("webgl2");
      const extension = context.getExtension("WEBGL_debug_renderer_info");
      return { ...c.dataset, width: c.width, height: c.height, renderer: extension ? context.getParameter(extension.UNMASKED_RENDERER_WEBGL) : "unavailable" };
    });
    const before = await canvas.getAttribute("data-frames");
    await page.waitForTimeout(1000);
    const idleFrames = Number(await canvas.getAttribute("data-frames")) - Number(before);
    const sample = await page.evaluate(async () => {
      const canvas = document.querySelector("canvas");
      const start = performance.now(), first = Number(canvas.dataset.frames);
      let samples = 0;
      await new Promise(resolve => {
        function tick() {
          canvas.dispatchEvent(new KeyboardEvent("keydown", { key: samples++ % 2 ? "ArrowLeft" : "ArrowRight", bubbles: true }));
          if (performance.now() - start < 2000) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      return { approximateActiveFps: +((Number(canvas.dataset.frames) - first) / ((performance.now() - start) / 1000)).toFixed(1) };
    });
    await page.locator(".showroom-views button").last().click();
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "docs/design/phase3a-" + name + "-lounge.png", fullPage: true });
    results[name] = { metrics, idleFrames, ...sample, graphicsChunks, graphicsOnProjects, graphicsBeforeEntry, graphicsAfterEntry: requests.filter(url => graphicsChunks.some(chunk => url.includes(chunk))), errors };
    await page.close();
  }
} finally { await browser.close(); }
await writeFile("docs/phase3a-metrics.json", JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
