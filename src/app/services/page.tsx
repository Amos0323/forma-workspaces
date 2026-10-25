import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { MagneticLink } from "@/components/magnetic-link";
export const metadata = pageMetadata(
  "Commercial Interior Design Cape Town — Services",
  "Explore six conceptual services, from office space planning to refurbishment and workplace transformation. FORMA is a fictional South African studio.",
  "/services"
);
const outcomes = [
  [
    "A listening brief",
    "Working-pattern observations, priorities for shared and focused settings, and a framework for testing the concept.",
  ],
  [
    "A coherent design language",
    "Spatial character, lighting intent, finish relationships and a clear direction for the workplace experience.",
  ],
  [
    "A layout with purpose",
    "Concept test fits, circulation studies and a balance of individual, shared and support spaces.",
  ],
  [
    "A considered material direction",
    "Furniture concepts, finish palettes and a selection rationale centred on use, care and local availability.",
  ],
  [
    "A thoughtful refresh",
    "An exploration of what to retain, what to adapt and how a phased approach could support occupation.",
  ],
  [
    "A connected workplace vision",
    "A spatial narrative that brings organisational goals, daily routines and a changing team together.",
  ],
];
export default function Services() {
  return (
    <>
      <section className="inner-page">
        <p className="micro">A HOLISTIC APPROACH</p>
        <h1 data-reveal>
          From strategy
          <br />
          to space.
        </h1>
        <p className="page-lead">
          Six connected services for modern South African workplaces. Explore
          the thinking behind each discipline.
        </p>
        <nav className="service-index" aria-label="Jump to a service">
          {services.map(([title], i) => (
            <a href={`#service-${i + 1}`} key={title}>
              <span>0{i + 1}</span>
              {title} ↘
            </a>
          ))}
        </nav>
      </section>
      {services.map(([title, subtitle, text], index) => (
        <section
          className="section service-feature"
          id={`service-${index + 1}`}
          key={title}
        >
          <div className="service-feature-image" data-reveal>
            <Image
              src={projects[index].image}
              alt={projects[index].alt}
              fill
              sizes="(max-width:700px) 90vw, 45vw"
            />
          </div>
          <div className="service-feature-copy">
            <p className="micro">
              0{index + 1} / {subtitle}
            </p>
            <h2 data-reveal>{title}</h2>
            <p>{text}</p>
            <div className="service-list">
              <details>
                <summary>
                  <span className="micro">↳</span>
                  <span>Inside {title}</span>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>
                  <strong>{outcomes[index][0]}.</strong> {outcomes[index][1]}{" "}
                  This is an illustrative scope for the fictional studio, not an
                  offer or completed service.
                </p>
              </details>
            </div>
            <Link
              className="related-project"
              href={`/projects/${projects[index].slug}`}
            >
              <span className="micro">RELATED CONCEPT</span>
              {projects[index].name} ↗
            </Link>
            <MagneticLink href="/contact">Discuss a workplace</MagneticLink>
          </div>
        </section>
      ))}
      <section className="section next-project">
        <p className="micro">ONE CONSIDERED WORKPLACE</p>
        <h2 data-reveal>
          Let’s connect
          <br />
          the possibilities.
        </h2>
        <p className="concept-note">
          Services describe a fictional design approach. No operating business,
          professional appointment or completed commission is represented.
        </p>
        <MagneticLink href="/contact">Start a conversation</MagneticLink>
      </section>
    </>
  );
}
