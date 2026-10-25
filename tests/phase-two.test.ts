import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projects } from "../src/data/projects";
import { getStory, projectStories } from "../src/data/project-stories";
import { articles, getArticle } from "../src/data/articles";
describe("Phase 2 content integrity", () => {
  it("provides a complete story, palette and valid gallery for every concept", () => {
    expect(projectStories).toHaveLength(projects.length);
    for (const project of projects) {
      const story = getStory(project.slug);
      expect(story.challenge.length).toBeGreaterThan(100);
      expect(story.approach.length).toBeGreaterThan(100);
      expect(story.palette).toHaveLength(3);
      for (const [, colour] of story.palette)
        expect(colour).toMatch(/^#[a-f0-9]{6}$/i);
      for (const image of story.gallery)
        expect(existsSync(`public${image}`)).toBe(true);
      expect(story.x).toBeGreaterThan(0);
      expect(story.x).toBeLessThan(800);
      expect(story.y).toBeGreaterThan(0);
      expect(story.y).toBeLessThan(440);
    }
    expect(getStory("missing")).toBeUndefined();
  });
  it("provides four original, routable articles with substantial content", () => {
    expect(articles).toHaveLength(4);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(4);
    for (const article of articles) {
      expect(getArticle(article.slug)).toBe(article);
      expect(article.sections).toHaveLength(3);
      expect(
        article.sections
          .flatMap((s) => s.paragraphs)
          .join(" ")
          .split(/\s+/).length,
      ).toBeGreaterThan(250);
      expect(existsSync(`public${article.image}`)).toBe(true);
    }
    expect(getArticle("constructor")).toBeUndefined();
  });
});
