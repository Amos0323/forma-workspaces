import Link from "next/link";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>
          Thoughtful spaces.
          <br />
          Better ways of working.
        </p>
        <nav aria-label="Footer navigation">
          <Link href="/projects">Projects</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/services">Services</Link>
          <Link href="/experience">3D Experience</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p className="footer-note">
          Cape Town · Western Cape
          <br />
          South Africa · Fictional studio
        </p>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        FORMA
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FORMA WORKSPACES</span>
        <span>Fictional studio · Not an operating business</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
