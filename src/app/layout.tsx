import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimationSystem } from "@/components/animation-system";
import "./globals.css";
import { indexingEnabled, publicOrigin } from "@/lib/site";
export const metadata: Metadata = {
  ...(publicOrigin() ? { metadataBase: new URL(publicOrigin()!) } : {}),
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
  title: {
    default: "FORMA WORKSPACES — Cape Town Workplace Design",
    template: "%s | FORMA WORKSPACES",
  },
  description:
    "A fictional Cape Town commercial interior design studio portfolio exploring modern office interiors and workplace design in South Africa.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <AnimationSystem />
      </body>
    </html>
  );
}
