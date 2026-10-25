import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const results = {};
const browser = await chromium.launch();
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["small", { width: 800, height: 600 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://localhost:3000/experience");
    await page.getByRole("button", { name: "Enter 3D showroom" }).click();
    await page.locator("canvas").waitFor();
    await page.waitForTimeout(1500);
    const sample = await page.evaluate(async () => {
      const canvas = document.querySelector("canvas");
      let last = performance.now(), count = 0;
      const started = last, intervals = [];
      const first = Number(canvas.dataset.frames);
      await new Promise(resolve => {
        function frame(now) {
          intervals.push(now - last); last = now;
          canvas.dispatchEvent(new KeyboardEvent("keydown", { key: count++ % 2 ? "ArrowLeft" : "ArrowRight", bubbles: true }));
          if (now - started < 3000) requestAnimationFrame(frame); else resolve();
        }
        requestAnimationFrame(frame);
      });
      const elapsed = performance.now() - started;
      const gl = canvas.getContext("webgl2"), ext = gl.getExtension("WEBGL_debug_renderer_info");
      intervals.sort((a, b) => a-b);
      return { fps: (Number(canvas.dataset.frames) - first) / elapsed * 1000,
        medianFrameMs: intervals[Math.floor(intervals.length * .5)], p95FrameMs: intervals[Math.floor(intervals.length * .95)],
        buffer: [canvas.width, canvas.height], renderer: ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
        heapBytes: performance.memory?.usedJSHeapSize ?? null, metrics: { ...canvas.dataset } };
    });
    // Let damping finish before measuring genuinely idle work.
    for (let i = 0; i < 30; i++) {
      const first = await page.locator("canvas").getAttribute("data-frames");
      await page.waitForTimeout(500);
      if (await page.locator("canvas").getAttribute("data-frames") === first) break;
    }
    const first = Number(await page.locator("canvas").getAttribute("data-frames"));
    await page.waitForTimeout(1000);
    results[name] = { ...sample, idleFrames: Number(await page.locator("canvas").getAttribute("data-frames")) - first };
    await page.close();
  }
} finally { await browser.close(); }
const path = process.argv[2] || "docs/phase3b-performance.json";
await writeFile(path, JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
