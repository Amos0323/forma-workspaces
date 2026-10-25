import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { articles } from "@/data/articles";
import { publicOrigin } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicOrigin();
  if (!origin) return [];
  return ["/", "/projects", "/studio", "/services", "/experience", "/journal", "/contact", ...projects.map(p => `/projects/${p.slug}`), ...articles.map(a => `/journal/${a.slug}`)].map(path => ({ url: origin + path }));
}
