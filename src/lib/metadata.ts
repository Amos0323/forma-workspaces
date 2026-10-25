import type { Metadata } from "next";
import { publicOrigin } from "./site";

/** No invented public domain, address or LocalBusiness verification claims. */
export function pageMetadata(title: string, description: string, path?: string): Metadata {
  const origin = publicOrigin();
  return {
    title,
    description,
    ...(origin && path ? { alternates: { canonical: origin + path } } : {}),
    openGraph: {
      title: `${title} | FORMA WORKSPACES`,
      description,
      siteName: "FORMA WORKSPACES — Fictional studio portfolio",
      locale: "en_ZA",
      type: "website",
      ...(origin && path ? { url: origin + path, images: [{ url: origin + "/images/hero.jpg", alt: "Imagined workplace — fictional FORMA portfolio" }] } : {}),
    },
  };
}

export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "FORMA WORKSPACES — Cape Town workplace design portfolio",
  description:
    "A portfolio demonstration of a fictional South African commercial interior design studio. All projects are conceptual; no operating business or physical office is represented.",
  inLanguage: "en-ZA",
  about:
    "Commercial interior design and workplace transformation in Cape Town, Western Cape, South Africa",
};
