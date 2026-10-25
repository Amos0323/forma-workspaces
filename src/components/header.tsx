"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const links = [
  ["Projects", "/projects"],
  ["Studio", "/studio"],
  ["Services", "/services"],
  ["Journal", "/journal"],
] as const;
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, body > footer"));
    const inertStates = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          button.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && index === items.length - 1) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    }
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element, index) => { element.inert = inertStates[index]; });
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <header
      className={`header ${path === "/" ? "header-home" : ""} ${open ? "menu-is-open" : ""}`}
    >
      <Link
        href="/"
        className="brand"
        aria-label="Forma Workspaces home"
        onClick={() => setOpen(false)}
      >
        FORMA{" "}<span>WORKSPACES</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
        <Link href="/contact" className="nav-contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <button
        ref={button}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        ref={panel}
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {[
          ...links,
          ["3D Experience", "/experience"],
          ["Contact", "/contact"],
        ].map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}>
            {label}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
