import { expect, test } from "@playwright/test";
test("illustrated showroom supports keyboard viewpoints and reset without WebGL", async ({ page }) => {
  await page.goto("/experience");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A workplace");
  // Accessible names include the editorial index.
  const button = page.locator(".showroom-views button").last();
  await button.focus(); await button.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".showroom-description")).toContainText("Olive upholstery");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(page.locator(".showroom-views button").first()).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("WebGL unavailable keeps the illustrated experience usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/experience");
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  await expect(page.getByRole("status")).toContainText("3D is unavailable");
  await expect(page.getByRole("img", { name: /Illustrated plan/ })).toBeVisible();
});
test("3D camera presets, keyboard bounds, reset and static exit work", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/experience");
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(canvas).toHaveAttribute("data-view", "Overview");
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("Missing viewer bounds");
  const dragStart = await canvas.getAttribute("data-camera-position");
  const x = bounds.x + bounds.width * .55, y = bounds.y + bounds.height * .6;
  if (isMobile) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 55, y: y + 20 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + 70, y + 20, { steps: 5 }); await page.mouse.up();
  }
  await expect.poll(() => canvas.getAttribute("data-camera-position")).not.toBe(dragStart);
  for (const name of ["Reception", "Workstations", "Meeting Room", "Lounge"]) {
    await page.locator(".showroom-views button").filter({ hasText: name }).click();
    await expect(canvas).toHaveAttribute("data-view", name);
  }
  await canvas.focus(); await canvas.press("ArrowDown");
  await canvas.press("+");
  expect(Number(await canvas.getAttribute("data-camera-y"))).toBeGreaterThan(3.2);
  const position = await canvas.getAttribute("data-camera-position");
  await canvas.press("ArrowLeft");
  await expect.poll(() => canvas.getAttribute("data-camera-position")).not.toBe(position);
  await canvas.press("Home");
  await expect(page.locator(".showroom-views button").first()).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(canvas).toHaveAttribute("data-view", "Overview");
  await page.getByRole("button", { name: "Use illustrated view" }).click();
  await expect(canvas).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("reduced motion changes camera immediately and renderer settles when idle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experience");
  await expect(page.locator(".showroom")).toHaveAttribute("data-motion", "reduced");
  await page.getByRole("button", { name: "Enter 3D showroom" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-view", "Overview", { timeout: 30000 });
  const overview = await canvas.getAttribute("data-camera-position");
  await page.locator(".showroom-views button").last().click();
  await expect(canvas).toHaveAttribute("data-view", "Lounge");
  await expect.poll(() => canvas.getAttribute("data-camera-position")).not.toBe(overview);
  await page.waitForTimeout(500);
  const count = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(500);
  expect(await canvas.getAttribute("data-frames")).toBe(count);
});
