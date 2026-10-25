import { expect, test } from "@playwright/test";
test("category filtering preserves focus and restores the collection", async ({
  page,
}) => {
  await page.goto("/projects");
  const filters = page.getByRole("group", {
    name: "Filter projects by category",
  });
  await expect(page.locator(".filtered-grid .project")).toHaveCount(6);
  const technology = filters.getByRole("button", {
    name: "Technology workplace",
    exact: true,
  });
  await technology.focus();
  await technology.press("Enter");
  await expect(technology).toBeFocused();
  await expect(technology).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".filtered-grid .project")).toHaveCount(1);
  await expect(page.locator(".filtered-grid")).toContainText(
    "The Century City Hub",
  );
  await expect(page.getByRole("status")).toHaveText(
    "1 concept / Technology workplace",
  );
  await filters.getByRole("button", { name: "All spaces" }).click();
  await expect(page.locator(".filtered-grid .project")).toHaveCount(6);
});
test("map location selection, keyboard markers and project previews work", async ({
  page,
}) => {
  await page.goto("/projects");
  await page
    .getByRole("group", { name: "Choose a project location" })
    .getByRole("button", { name: "Stellenbosch" })
    .click();
  await expect(page.locator(".map-preview h3")).toHaveText(
    "The Stellenbosch Workspace",
  );
  const marker = page.getByRole("button", {
    name: "Select Claremont — 6",
    exact: true,
  });
  await marker.focus();
  await marker.press("Enter");
  await expect(page.locator(".map-preview h3")).toHaveText(
    "The Claremont Studio",
  );
  await page.getByRole("button", { name: "Reset overview" }).click();
  await expect(page.locator(".map-preview h3")).toHaveText(
    "The Claremont Studio",
  );
  await page.getByRole("link", { name: "Explore this concept" }).click();
  await expect(page).toHaveURL("/projects/the-claremont-studio");
});
test("comparison supports keyboard, endpoints and pointer drag", async ({
  page,
  isMobile,
}) => {
  await page.goto("/projects/the-foreshore-offices");
  const slider = page.getByRole("slider", {
    name: "Before and after comparison",
  });
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("51");
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await slider.press("End");
  await expect(slider).toHaveValue("100");
  await page.getByRole("button", { name: "Show after", exact: true }).click();
  await expect(slider).toHaveValue("0");
  await page.getByRole("button", { name: "Show before", exact: true }).click();
  await expect(slider).toHaveValue("100");
  // The endpoint buttons sit below a tall desktop image; bring the handle back
  // into view before sending viewport-relative pointer coordinates.
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  if (!box) throw new Error("Missing slider bounds");
  if (isMobile) {
    const session = await page.context().newCDPSession(page);
    const y = box.y + box.height / 2;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width - 10, y }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + box.width * 0.3, y }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  } else {
    await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, {
      steps: 8,
    });
    await page.mouse.up();
  }
  await expect
    .poll(async () => Number(await slider.inputValue()))
    .toBeLessThan(80);
  await expect(page.locator(".comparison figcaption")).toContainText(
    "not a real before-and-after",
  );
});
test("journal articles, contents anchors and next article links work", async ({
  page,
}) => {
  await page.goto("/journal");
  await expect(page.locator(".journal-grid>article")).toHaveCount(4);
  await page
    .getByRole("link", {
      name: "Read The Future of Workplace Design in Cape Town",
      exact: true,
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Future of Workplace Design in Cape Town",
  );
  await page
    .getByRole("navigation", { name: "Article contents" })
    .getByRole("link")
    .nth(1)
    .click();
  await expect(page).toHaveURL(/#section-1$/);
  await page.getByRole("link", { name: "Read the next note" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Designing Offices for Hybrid Work",
  );
  for (const slug of [
    "natural-materials-south-african-interiors",
    "creating-collaborative-workspaces",
  ]) {
    expect((await page.goto(`/journal/${slug}`))?.status()).toBe(200);
    await expect(page.locator(".article-body section")).toHaveCount(3);
  }
  await page.goto("/journal/not-an-article");
  await expect(
    page.getByRole("heading", { name: "A little off plan." }),
  ).toBeVisible();
});
test("Phase 2 pages respect reduced motion, load images and have no overflow or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/projects",
    "/studio",
    "/services",
    "/journal",
    "/projects/the-stellenbosch-workspace",
    "/journal/designing-offices-hybrid-work",
  ]) {
    await page.goto(route);
    expect(
      await page
        .locator(".route-entry")
        .evaluate((e) => getComputedStyle(e).animationName),
    ).toBe("none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (i: HTMLImageElement) => i.complete && i.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
