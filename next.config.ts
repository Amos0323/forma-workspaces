import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // Preserve prerendering and Next's inline bootstrap. A nonce policy needs a separately reviewed dynamic-rendering change.
      { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'" },
    ] }];
  },
  async redirects() {
    return [
      {
        source: "/projects/riverton-house",
        destination: "/projects/the-waterfront-studio",
        permanent: true,
      },
      {
        source: "/projects/carter-and-co",
        destination: "/projects/the-woodstock-collective",
        permanent: true,
      },
      {
        source: "/projects/the-commons",
        destination: "/projects/the-century-city-hub",
        permanent: true,
      },
      {
        source: "/projects/maple-and-finch",
        destination: "/projects/the-stellenbosch-workspace",
        permanent: true,
      },
      {
        source: "/projects/northpoint",
        destination: "/projects/the-foreshore-offices",
        permanent: true,
      },
      {
        source: "/projects/ellis-house",
        destination: "/projects/the-claremont-studio",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
