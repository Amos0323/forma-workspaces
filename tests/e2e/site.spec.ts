import { expect, test } from "@playwright/test";
test("Cape Town identity, metadata and conceptual service presentation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-ZA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "DESIGNED IN CAPE TOWN. MADE FOR THE WAY WE WORK.",
  );
  await expect(page.locator(".hero-description")).toContainText(
    "modern South African businesses",
  );
  await expect(page.locator(".hero-disclosure")).toContainText("Fictional");
  await expect(page).toHaveTitle(/Cape Town Office Interior Design/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_ZA",
  );
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(schema["@type"]).toBe("CreativeWork");
  await expect(page.locator("#services summary")).toHaveCount(6);
  await expect(page.locator(".project-status")).toHaveCount(6);
  await page.goto("/services");
  await expect(page.locator("summary")).toHaveCount(6);
  await expect(page.locator("summary").last()).toContainText(
    "Workplace Transformation",
  );
  await page.goto("/contact");
  await expect(page.locator(".location-section")).toContainText("Paarl");
  await expect(page.locator(".location-section")).toContainText(
    "No physical office is verified",
  );
  await expect(page.locator('a[href^="tel:"], a[href^="mailto:"]')).toHaveCount(
    0,
  );
});
test("all legacy project routes redirect to South African concepts", async ({
  page,
}) => {
  const routes = [
    ["riverton-house", "the-waterfront-studio", "The Waterfront Studio"],
    ["carter-and-co", "the-woodstock-collective", "The Woodstock Collective"],
    ["the-commons", "the-century-city-hub", "The Century City Hub"],
    [
      "maple-and-finch",
      "the-stellenbosch-workspace",
      "The Stellenbosch Workspace",
    ],
    ["northpoint", "the-foreshore-offices", "The Foreshore Offices"],
    ["ellis-house", "the-claremont-studio", "The Claremont Studio"],
  ];
  for (const [oldSlug, newSlug, title] of routes) {
    await page.goto(`/projects/${oldSlug}`);
    await expect(page).toHaveURL(`/projects/${newSlug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".detail-meta").first()).toContainText(
      "South Africa",
    );
    await expect(page.locator(".concept-brief")).toContainText("m²");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      `${title} — Conceptual Workplace | FORMA WORKSPACES`,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("small mobile, tablet and laptop widths do not overflow", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});
test("content and service disclosures work without JavaScript", async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#services summary").first().click();
  await expect(page.locator("#services details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page
    .getByRole("link", { name: "Explore The Waterfront Studio" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Waterfront Studio",
  );
  await context.close();
});
test("homepage images, navigation, services and project detail work without errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "DESIGNED IN",
  );
  await page.getByRole("link", { name: "Explore our work" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator(".project")).toHaveCount(6);
  await page.locator("#services summary").first().click();
  await expect(page.locator("#services details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator("#services summary").first().press("Enter");
  await expect(page.locator("#services details").first()).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .getByRole("link", { name: "Explore The Waterfront Studio" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Waterfront Studio",
  );
  await expect(
    page.getByText("FICTIONAL DESIGN STUDY", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".detail-image img")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".detail-image img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
test("responsive layout, reduced motion and all images remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".intro-screen")).toBeHidden();
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("mobile menu supports focus, Escape, and navigation", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu +" });
  await toggle.click();
  await expect(page.locator("#mobile-navigation a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL("/contact");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
});
test("contact validates and explains that no message was sent", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Your name").fill("Portfolio Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page
    .getByLabel("Tell us about your space")
    .fill("A collaborative studio with space to focus.");
  await page.getByRole("button", { name: "Preview enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "has not been sent or stored",
  );
});
test("route foundations and unknown project handling", async ({ page }) => {
  for (const route of [
    "/projects",
    "/studio",
    "/services",
    "/experience",
    "/journal",
    "/contact",
  ]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/projects/not-a-project");
  await expect(
    page.getByRole("heading", { name: "A little off plan." }),
  ).toBeVisible();
});
