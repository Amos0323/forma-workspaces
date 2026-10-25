import { expect, test, type Page } from "@playwright/test";
import { PerspectiveCamera, Vector3 } from "three";
test.setTimeout(60000);
async function openConfiguration(page: Page) {
  await page.getByRole("button", { name: "Customise interior" }).click();
  await expect(page.getByRole("heading", { name: "Make it yours." })).toBeVisible();
}
async function enter(page: Page) {
  await page.goto("/experience");
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-materials", /timber/, { timeout: 30000 });
}
test("static configuration is keyboard accessible and reset restores defaults", async ({ page, isMobile }) => {
  await page.goto("/experience");
  const trigger = page.getByRole("button", { name: "Customise interior" });
  await trigger.focus(); await trigger.press("Enter");
  const urban = page.getByRole("button", { name: "Urban Executive" });
  await urban.focus(); await urban.press("Enter");
  await expect(urban).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Light oak", exact: true }).click();
  await page.getByRole("button", { name: "Gather sofa", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Gather sofa" })).toBeVisible();
  await page.getByRole("button", { name: "Reset configuration" }).click();
  await expect(page.getByRole("button", { name: "Cape Contemporary" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Warm timber", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Daylight", exact: true })).toHaveAttribute("aria-pressed", "true");
  if (isMobile) {
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Reset configuration" }).focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
    expect(await page.getByRole("dialog").evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  }
  await page.getByRole("button", { name: "Close configurator" }).press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByLabel("Selected design palette")).toContainText("Warm timber");
});
test("themes, individual finishes and lighting mutate the scene without replacing geometry", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await enter(page);
  const canvas = page.locator("canvas");
  const resources = await canvas.getAttribute("data-resource-ids");
  await openConfiguration(page);
  await page.getByRole("button", { name: "Urban Executive" }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#59402f/);
  await expect(canvas).toHaveAttribute("data-lighting", "evening");
  await page.getByRole("button", { name: "Coastal Minimal" }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#7d9a9d/);
  await page.getByRole("button", { name: "Cape Contemporary" }).click();
  const before = JSON.parse((await canvas.getAttribute("data-materials"))!);
  await page.getByRole("button", { name: "Sandstone floor", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#d2c9b5/);
  const after = JSON.parse((await canvas.getAttribute("data-materials"))!);
  expect(after.timber).toBe(before.timber);
  expect(after.upholstery).toBe(before.upholstery);
  await page.getByRole("button", { name: "Light oak", exact: true }).click();
  await page.getByRole("button", { name: "Coastal blue weave", exact: true }).click();
  await page.getByRole("button", { name: "Brushed bronze", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#a78658/);
  expect(JSON.parse((await canvas.getAttribute("data-materials"))!)).toEqual({
    timber: "#cfb995", flooring: "#d2c9b5", upholstery: "#7d9a9d", accent: "#a78658",
  });
  for (const [name, id] of [["Presentation", "presentation"], ["Warm Evening", "evening"], ["Daylight", "daylight"]]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(canvas).toHaveAttribute("data-lighting", id);
  }
  await page.getByRole("button", { name: "Reset configuration" }).click();
  await expect(canvas).toHaveAttribute("data-materials", /#b99569/);
  await expect(canvas).toHaveAttribute("data-resource-ids", resources!);
  expect(errors).toEqual([]);
});
test("furniture supports scene picking, accessible alternatives and clearing", async ({ page, isMobile }) => {
  await enter(page);
  const canvas = page.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("No canvas bounds");
  const position = (await canvas.getAttribute("data-camera-position"))!.split(",").map(Number);
  const camera = new PerspectiveCamera(40, bounds.width / bounds.height, .1, 100);
  camera.position.set(position[0], position[1], position[2]); camera.lookAt(0,.6,0); camera.updateMatrixWorld();
  const point = new Vector3(3.2,.75,3.8).project(camera);
  const x = bounds.x + (point.x + 1) * bounds.width / 2, y = bounds.y + (1 - point.y) * bounds.height / 2;
  if (isMobile) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
  await expect(canvas).toHaveAttribute("data-selected-furniture", "sofa");
  await expect(page.getByRole("heading", { name: "Gather sofa" })).toBeVisible();
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect(canvas).toHaveAttribute("data-selected-furniture", "");
  await openConfiguration(page);
  await page.getByRole("button", { name: "Welcome desk", exact: true }).focus();
  await page.getByRole("button", { name: "Welcome desk", exact: true }).press("Enter");
  await expect(canvas).toHaveAttribute("data-selected-furniture", "reception");
});
test("reduced motion, material updates and WebGL context loss remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enter(page);
  await openConfiguration(page);
  await page.getByRole("button", { name: "Coastal blue weave", exact: true }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-materials", /#7d9a9d/);
  await page.getByRole("button", { name: "Close configurator" }).click();
  await page.waitForTimeout(600);
  const frames = await page.locator("canvas").getAttribute("data-frames");
  await page.waitForTimeout(600);
  expect(await page.locator("canvas").getAttribute("data-frames")).toBe(frames);
  await page.locator("canvas").evaluate(canvas => {
    (canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("3D is unavailable");
  await expect(page.getByLabel("Selected design palette")).toContainText("Coastal blue weave");
  await openConfiguration(page);
  await page.getByRole("button", { name: "Urban Executive" }).click();
  await expect(page.getByRole("button", { name: "Dark walnut", exact: true })).toHaveAttribute("aria-pressed", "true");
});
