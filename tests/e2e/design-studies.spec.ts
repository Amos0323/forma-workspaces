import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.setTimeout(60000);
test.beforeEach(async ({ page }) => {
  await page.goto("/experience");
  await page.getByRole("button", { name: "Customise interior" }).click();
});

test("A/B snapshots compare and restore independently with keyboard controls", async ({ page, isMobile }) => {
  const shortcut = page.getByRole("link", { name: "Compare & export" });
  await shortcut.focus(); await shortcut.press("Enter");
  await expect(page.getByRole("heading", { name: "Your design studies." })).toBeFocused();
  await expect(page.getByRole("button", { name: "Compare designs" })).toBeDisabled();
  await page.getByRole("button", { name: "Save Design A" }).click();
  await page.getByRole("button", { name: "Urban Executive" }).click();
  await page.getByRole("button", { name: "Gather sofa", exact: true }).click();
  await page.getByRole("button", { name: "Save Design B" }).click();
  const compare = page.getByRole("button", { name: "Compare designs" });
  await compare.focus(); await compare.press("Enter");
  const region = page.getByRole("region", { name: "Design comparison", exact: true });
  await expect(region).toContainText("Warm timber");
  await expect(region).toContainText("Dark walnut");
  await expect(region).toContainText("Warm Evening");
  await expect(region).toContainText("Gather sofa finishes");
  await expect(region).toContainText("Different");
  expect(await region.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
  const restoreA = page.getByRole("button", { name: "Restore Design A" });
  await restoreA.focus(); await restoreA.press("Enter");
  await expect(page.getByRole("button", { name: "Cape Contemporary", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Light oak", exact: true }).click();
  await expect(region).toContainText("Warm timber");
  await page.getByRole("button", { name: "Restore Design B" }).click();
  await expect(page.getByRole("button", { name: "Gather sofa", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Dark walnut", exact: true })).toHaveAttribute("aria-pressed", "true");
  if (isMobile) {
    const bounds = await restoreA.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(await page.getByRole("dialog").evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  }
  await page.getByRole("button", { name: "Close configurator" }).press("Escape");
  await expect(page.getByRole("button", { name: "Customise interior" })).toBeFocused();
  await page.getByRole("button", { name: "Customise interior" }).click();
  await expect(page.getByRole("button", { name: "Save Design B" })).toContainText("Urban Executive");
  await page.reload();
  await page.getByRole("button", { name: "Customise interior" }).click();
  await expect(page.getByRole("button", { name: "Compare designs" })).toBeDisabled();
});

test("PNG export contains a high-resolution board without requiring WebGL", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "Coastal Minimal" }).click();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe("forma-workspaces-design-board.png");
  const path = testInfo.outputPath("design-board.png");
  await download.saveAs(path);
  const bytes = await readFile(path);
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");
  expect(bytes.readUInt32BE(16)).toBe(1600);
  expect(bytes.readUInt32BE(20)).toBe(2000);
  expect(bytes.length).toBeGreaterThan(30000);
  await expect(page.locator(".study-feedback")).toContainText("illustrated reference");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("print board exposes configuration and a browser PDF action", async ({ page, browserName }, testInfo) => {
  await page.getByRole("button", { name: "Urban Executive" }).click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  const popup = await popupPromise;
  await expect(popup.locator("body")).toHaveAttribute("data-board-ready", "true");
  await expect(popup.getByRole("heading", { name: "Design configuration" })).toBeVisible();
  await expect(popup.locator(".details")).toContainText("Dark walnut");
  await expect(popup.locator(".details")).toContainText("Fictional studio");
  await expect(popup.getByRole("button", { name: "Print / Save as PDF" })).toBeFocused();
  await popup.evaluate(() => { window.print = () => { document.body.dataset.printRequested = "true"; }; });
  await popup.getByRole("button").press("Enter");
  await expect(popup.locator("body")).toHaveAttribute("data-print-requested", "true");
  if (browserName === "chromium") {
    const pdf = await popup.pdf({ path: testInfo.outputPath("design-board.pdf"), preferCSSPageSize: true, printBackground: true });
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(30000);
    expect(pdf.toString("latin1").match(/\/Type \/Page\b/g)).toHaveLength(1);
  }
  await popup.close();
});

test("reduced-motion 3D capture and restoration keep resources stable and settle idle", async ({ page }) => {
  await page.getByRole("button", { name: "Close configurator" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-materials", /timber/, { timeout: 30000 });
  const resources = await canvas.getAttribute("data-resource-ids");
  await page.getByRole("button", { name: "Customise interior" }).click();
  await page.getByRole("button", { name: "Save Design A" }).click();
  await page.getByRole("button", { name: "Coastal Minimal" }).click();
  await page.getByRole("button", { name: "Save Design B" }).click();
  await page.getByRole("button", { name: "Compare designs" }).click();
  await page.getByRole("button", { name: "Restore Design A" }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#ae8156/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  await download;
  await expect(page.locator(".study-feedback")).toContainText("current 3D view");
  await expect(canvas).toHaveAttribute("data-resource-ids", resources!);
  await page.waitForTimeout(700);
  const frames = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(700);
  expect(await canvas.getAttribute("data-frames")).toBe(frames);
});

test("context loss preserves snapshots and permits an illustrated export", async ({ page }) => {
  await page.getByRole("button", { name: "Urban Executive" }).click();
  await page.getByRole("button", { name: "Save Design A" }).click();
  await page.getByRole("button", { name: "Close configurator" }).click();
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-materials", /timber/, { timeout: 30000 });
  await page.locator("canvas").evaluate(canvas => (canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext());
  await expect(page.getByRole("status")).toContainText("3D is unavailable");
  await page.getByRole("button", { name: "Customise interior" }).click();
  await expect(page.getByRole("button", { name: "Save Design A" })).toContainText("Urban Executive");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  await downloaded;
  await expect(page.locator(".study-feedback")).toContainText("illustrated reference");
});
