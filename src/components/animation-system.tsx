"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
export function AnimationSystem() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/experience") return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ anchors: true, smoothWheel: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      lenis.on("scroll", ScrollTrigger.update);
      // Filtering and native disclosures change page height after initial layout.
      let refreshFrame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      const main = document.querySelector("main");
      if (main) observer.observe(main);
      if (document.querySelector(".hero")) {
        gsap.from(".hero-line", {
          yPercent: 110,
          duration: 1.15,
          stagger: 0.11,
          ease: "power3.out",
          delay: 0.5,
        });
        gsap.from(".hero-media", {
          scale: 1.09,
          duration: 1.8,
          ease: "power2.out",
        });
        gsap.to(".hero-parallax", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) =>
        gsap.from(element, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        }),
      );
      return () => {
        observer.disconnect();
        cancelAnimationFrame(refreshFrame);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [pathname]);
  return null;
}
