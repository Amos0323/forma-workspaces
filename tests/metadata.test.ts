import { expect, it } from "vitest";
import { pageMetadata, portfolioSchema } from "../src/lib/metadata";

it("identifies the portfolio as creative work rather than a verified business", () => {
  expect(portfolioSchema["@type"]).toBe("CreativeWork");
  expect(portfolioSchema.inLanguage).toBe("en-ZA");
  expect(portfolioSchema.description).toContain("fictional");
  for (const property of [
    "address",
    "telephone",
    "email",
    "geo",
    "aggregateRating",
    "openingHours",
  ]) {
    expect(portfolioSchema).not.toHaveProperty(property);
  }
});
it("gives each page localised social metadata without inventing a public domain", () => {
  const metadata = pageMetadata(
    "Cape Town concept",
    "A fictional design portfolio.",
  );
  expect(metadata.openGraph).toMatchObject({
    locale: "en_ZA",
    title: "Cape Town concept | FORMA WORKSPACES",
    description: "A fictional design portfolio.",
  });
  expect(metadata).not.toHaveProperty("metadataBase");
  expect(metadata.openGraph).not.toHaveProperty("url");
});
