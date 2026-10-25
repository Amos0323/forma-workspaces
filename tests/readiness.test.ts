import { afterEach, expect, it, vi } from "vitest";
import { publicOrigin } from "../src/lib/site";
import { pageMetadata } from "../src/lib/metadata";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
afterEach(() => vi.unstubAllEnvs());
it("keeps an unconfigured portfolio unindexed without invented canonical URLs", () => {
  vi.stubEnv("SITE_URL", ""); vi.stubEnv("ALLOW_INDEXING", "true");
  expect(sitemap()).toEqual([]);
  expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  expect(pageMetadata("Concept", "Fictional", "/projects").alternates).toBeUndefined();
});
it("generates canonical, social and sitemap URLs from the configured origin only", () => {
  vi.stubEnv("SITE_URL", "https://portfolio.example/"); vi.stubEnv("ALLOW_INDEXING", "true");
  expect(pageMetadata("Concept", "Fictional", "/projects").alternates?.canonical).toBe("https://portfolio.example/projects");
  expect(pageMetadata("Concept", "Fictional", "/projects").openGraph).toMatchObject({ url: "https://portfolio.example/projects" });
  expect(sitemap()).toHaveLength(17);
  expect(new Set(sitemap().map(entry => entry.url)).size).toBe(17);
  expect(sitemap().every(entry => entry.url.startsWith("https://portfolio.example/"))).toBe(true);
  expect(robots().sitemap).toBe("https://portfolio.example/sitemap.xml");
  vi.stubEnv("ALLOW_INDEXING", "false");
  expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
});
it("rejects unsafe or ambiguous origin configuration", () => {
  for (const value of ["http://portfolio.example", "https://name:password@portfolio.example", "https://portfolio.example/path", "https://portfolio.example/?tracking=1", "https://portfolio.example/#fragment", "invalid"]) expect(() => publicOrigin(value)).toThrow();
});
