import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { getStory } from "@/data/project-stories";
import { MagneticLink } from "@/components/magnetic-link";
import { BeforeAfterSlider } from "@/components/before-after-slider";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  return pageMetadata(
    project ? project.name + " — Conceptual Workplace" : "Project not found",
    project
      ? project.description +
          " Fictional design study in South Africa; photography is illustrative."
      : "This conceptual project could not be found.",
    project ? `/projects/${project.slug}` : undefined,
  );
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const story = getStory(project.slug);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="case-study">
      <section className="case-hero">
        <div className="detail-image">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="case-hero-copy">
          <p className="micro">FICTIONAL DESIGN STUDY</p>
          <h1>{project.name}</h1>
          <p>
            {story.location} / {project.year}
          </p>
          <a href="#project-introduction" className="text-link">
            Explore the concept <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section id="project-introduction" className="section case-intro">
        <p className="micro" data-reveal>
          01 / THE IDEA
        </p>
        <h2 data-reveal>{project.concept}</h2>
        <p className="page-lead" data-reveal>
          {project.description}
        </p>
        <dl className="detail-meta">
          <div>
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt>Concept year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Typology</dt>
            <dd>{project.category}</dd>
          </div>
        </dl>
        <p className="concept-note">
          Conceptual work only. No client, completed commission or verified
          project site. Photography illustrates the design direction, not the
          named location.
        </p>
      </section>
      <section className="section story-columns">
        <div data-reveal>
          <p className="micro">02 / DESIGN CHALLENGE</p>
          <h2>
            Start with
            <br />
            the everyday.
          </h2>
          <p>{story.challenge}</p>
        </div>
        <div data-reveal>
          <p className="micro">03 / CREATIVE APPROACH</p>
          <h2>
            Make space
            <br />
            for possibility.
          </h2>
          <p>{story.approach}</p>
        </div>
      </section>
      <section className="section palette-section">
        <div data-reveal>
          <p className="micro">04 / MATERIAL LANGUAGE</p>
          <h2>
            A tactile point
            <br />
            of view.
          </h2>
          <p>{project.materials}</p>
        </div>
        <div className="material-palette">
          {story.palette.map(([name, colour]) => (
            <figure key={name} data-reveal>
              <div style={{ backgroundColor: colour }} />
              <figcaption>
                {name}
                <span>Concept colour study</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="section story-gallery">
        <div className="section-heading" data-reveal>
          <div>
            <p className="micro">05 / SPATIAL REFERENCES</p>
            <h2>Light. Texture. Life.</h2>
          </div>
          <p>
            Illustrative reference photography.
            <br />
            Not views of a built FORMA project.
          </p>
        </div>
        <div className="case-gallery">
          {story.gallery.map((src, index) => (
            <figure key={src} data-reveal>
              <div>
                <Image
                  src={src}
                  alt={`Illustrative workplace reference for ${project.name}: ${index === 0 ? "shared working areas" : "informal gathering spaces"}`}
                  fill
                  sizes="(max-width:700px) 90vw, 45vw"
                />
              </div>
              <figcaption>
                0{index + 1} /{" "}
                {index === 0
                  ? "A place to connect"
                  : "A different working rhythm"}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="section comparison-section">
        <p className="micro">06 / A SPATIAL EXPERIMENT</p>
        <h2>
          Same footprint.
          <br />
          New possibilities.
        </h2>
        <p className="page-lead">
          An illustrative planning exercise: from fixed desks to a mix of focus,
          collaboration and quiet settings.
        </p>
        <BeforeAfterSlider
          before="/images/concepts/before.svg"
          after="/images/concepts/after.svg"
          beforeAlt="Conceptual before plan: fixed desk rows and an enclosed meeting room"
          afterAlt="Conceptual after plan: shared table, focus room, lounge and flexible desks"
          caption="Matched conceptual floor-plan visualisations, not a real before-and-after refurbishment. This reusable planning study is not a measured plan of this project."
        />
      </section>
      <section
        className="section concept-brief"
        aria-label="Fictional project brief"
      >
        <p className="micro">IMAGINED BRIEF / NOT AS-BUILT MEASUREMENTS</p>
        <dl className="detail-meta">
          <div>
            <dt>Concept floor area</dt>
            <dd>{project.areaSqm} m²</dd>
          </div>
          <div>
            <dt>Proposed workstations</dt>
            <dd>{project.workstations}</dd>
          </div>
        </dl>
        <p>{project.materials}</p>
      </section>
      <section className="section next-project" data-reveal>
        <p className="micro">THE NEXT PERSPECTIVE</p>
        <h2>{next.name}</h2>
        <div className="route-links">
          <MagneticLink href="/projects">All projects</MagneticLink>
          <MagneticLink href={`/projects/${next.slug}`}>
            Next: {next.name}
          </MagneticLink>
        </div>
      </section>
    </article>
  );
}
