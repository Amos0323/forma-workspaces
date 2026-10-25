import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["configurator.spec.ts", "design-studies.spec.ts", "readiness.spec.ts"],
  workers: 1,
  outputDir: "test-results-cross-browser",
  use: { baseURL: "http://localhost:3000", viewport: { width: 1440, height: 900 }, trace: "retain-on-failure", launchOptions: { timeout: 15000 } },
  projects: [
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
    { name: "webkit-mobile", use: { ...devices["iPhone 13"], browserName: "webkit" } },
  ],
});
