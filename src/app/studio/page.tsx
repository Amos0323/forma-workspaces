import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { MagneticLink } from "@/components/magnetic-link";
export const metadata = pageMetadata(
  "Cape Town Design Studio Concept",
  "A fictional Cape Town studio exploring thoughtful commercial interiors, natural materials and a more human working day. Discover the FORMA approach and process.",
  "/studio"
);
export default function Studio() {
  return (
    <>
      <section className="inner-page studio-opening">
        <p className="micro">PEOPLE / PURPOSE / PLACE</p>
        <h1 data-reveal>
          Thoughtful spaces.
          <br />
          Better ways
          <br />
          of working.
        </h1>
        <div className="editorial-split">
          <p className="page-lead" data-reveal>
            We imagine workplaces that feel like they belong. To their people.
            To their purpose. To the place they call home.
          </p>
          <p>
            FORMA is a fictional commercial interior design and workplace
            transformation studio, imagined in Cape Town, Western Cape, South
            Africa. This portfolio explores an approach to design; it does not
            represent an established, registered or operating company.
          </p>
        </div>
      </section>
      <div className="studio-panorama">
        <Image
          src="/images/hero.jpg"
          alt="Imagined timber-lined workplace illustrating FORMA’s natural material direction"
          fill
          sizes="100vw"
        />
      </div>
      <section className="section story-columns">
        <div data-reveal>
          <p className="micro">OUR POINT OF DEPARTURE</p>
          <h2>
            Shaped by
            <br />
            the Cape.
          </h2>
        </div>
        <div data-reveal>
          <p>
            Cape Town is our conceptual starting point: shifting light, mountain
            silhouettes, tactile stone and the meeting of city and landscape. We
            translate those influences through proportion and material, rather
            than literal motifs.
          </p>
          <p>
            Warm sandstone tones sit beside natural timber. Muted olive brings
            softness to charcoal lines. An indigenous planting concept is
            considered alongside daylight and maintenance, never as decoration
            alone.
          </p>
        </div>
      </section>
      <section id="approach" className="section studio-philosophy">
        <p className="micro">OUR PHILOSOPHY</p>
        <h2 data-reveal>
          A workplace is more
          <br />
          than a floor plan.
        </h2>
        <div className="approach-grid">
          {[
            [
              "Listen closely.",
              "We begin with the routines that make up a working day. Where does a team find focus? Where does a conversation happen naturally? A useful brief starts with those questions.",
            ],
            [
              "Design thoughtfully.",
              "A space should be legible and comfortable before it becomes expressive. Circulation, light, acoustic intent and material character work together in our concepts.",
            ],
            [
              "Leave room.",
              "People and organisations change. We explore furniture, settings and spatial relationships that can be reconsidered without starting again.",
            ],
          ].map(([title, text]) => (
            <div key={title} data-reveal>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section process-section">
        <p className="micro">FROM QUESTION TO CONCEPT</p>
        <h2 data-reveal>A considered process.</h2>
        <ol>
          {[
            [
              "Discover",
              "Explore the team, its ambitions and the working patterns a space needs to support.",
            ],
            [
              "Define",
              "Translate those observations into a spatial brief, priorities and a clear design direction.",
            ],
            [
              "Develop",
              "Test layouts, material relationships and furniture settings against the brief.",
            ],
            [
              "Refine",
              "Review the proposal as a whole, question the details and leave room for future change.",
            ],
          ].map(([title, text], i) => (
            <li key={title} data-reveal>
              <span className="micro">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <p className="concept-note">
          This is the fictional studio’s proposed process, not a record of
          delivered professional services.
        </p>
      </section>
      <section className="section next-project" data-reveal>
        <p className="micro">A SHARED PERSPECTIVE</p>
        <h2>
          Imagine your
          <br />
          next working day.
        </h2>
        <div className="route-links">
          <MagneticLink href="/projects">Explore our concepts</MagneticLink>
          <MagneticLink href="/contact">Start a conversation</MagneticLink>
        </div>
      </section>
    </>
  );
}
