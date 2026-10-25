import type { MetadataRoute } from "next";
import { indexingEnabled, publicOrigin } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${publicOrigin()}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
