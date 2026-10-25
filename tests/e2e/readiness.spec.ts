import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

async function audit(page: Page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const engine = (window as unknown as { axe: typeof axe }).axe;
    const results = await engine.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
    return results.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
  });
}
test.setTimeout(60000);
for (const route of ["/", "/projects", "/experience", "/journal", "/contact"]) {
  test(`accessibility regression: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    expect(await audit(page)).toEqual([]);
  });
}
test("comparison and mobile navigation expose only the active controls", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experience");
  await page.getByRole("button", { name: "Customise interior" }).click();
  await page.getByRole("button", { name: "Save Design A" }).click();
  await page.getByRole("button", { name: "Urban Executive", exact: true }).click();
  await page.getByRole("button", { name: "Gather sofa", exact: true }).click();
  await page.getByRole("button", { name: "Save Design B" }).click();
  await page.getByRole("button", { name: "Compare designs" }).click();
  expect(await audit(page)).toEqual([]);
  await page.getByRole("button", { name: "Close configurator" }).click();
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.locator("main")).toHaveJSProperty("inert", true);
    expect(await audit(page)).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  }
});
test("demo form cannot transmit data before JavaScript is available", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/contact");
  await expect(page.getByLabel("Your name")).toBeDisabled();
  await expect(page.getByLabel("Email address")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Preview enquiry" })).toBeDisabled();
  await expect(page.getByText("Enable JavaScript to preview", { exact: false })).toBeVisible();
  await expect(page).toHaveURL("http://localhost:3000/contact");
  await context.close();
});
test("preview headers and crawler policy are defensive", async ({ request, page }) => {
  const response = await request.get("/contact");
  expect(response.headers()["content-security-policy"]).toContain("form-action 'none'");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["permissions-policy"]).toContain("geolocation=()");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  await page.goto("/projects");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
