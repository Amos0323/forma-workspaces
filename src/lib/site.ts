/** Build-time, server-only public-origin configuration. No fabricated production URL. */
export function publicOrigin(value = process.env.SITE_URL): string | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must be an HTTPS origin without credentials, path, query or fragment.");
  }
  return url.origin;
}
export function indexingEnabled() {
  return Boolean(publicOrigin() && process.env.ALLOW_INDEXING === "true");
}
