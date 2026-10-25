import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { projects, getProject } from "../src/data/projects";
describe("project routes and content integrity", () => {
  it("provides six distinct routable projects with complete metadata and local imagery", () => {
    expect(projects).toHaveLength(6);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(6);
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(getProject(project.slug)).toBe(project);
      expect(project.description.length).toBeGreaterThan(60);
      expect(project.alt.length).toBeGreaterThan(20);
      expect(project.location).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.location).toContain("South Africa");
      expect(project.status).toContain("Conceptual work");
      expect(project.concept.length).toBeGreaterThan(15);
      expect(project.materials.length).toBeGreaterThan(20);
      expect(project.areaSqm).toBeGreaterThan(0);
      expect(project.workstations).toBeGreaterThan(0);
      expect(project.year).toMatch(/^\d{4}$/);
      expect(existsSync(`public${project.image}`)).toBe(true);
    }
  });
  it("does not resolve unknown or inherited object keys as projects", () => {
    expect(getProject("unknown")).toBeUndefined();
    expect(getProject("constructor")).toBeUndefined();
  });
});
