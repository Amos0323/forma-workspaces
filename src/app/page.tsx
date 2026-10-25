import Image from "next/image";
import { MagneticLink } from "@/components/magnetic-link";
import { ProjectGrid } from "@/components/project-grid";
import { services } from "@/data/services";
import { pageMetadata, portfolioSchema } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Cape Town Office Interior Design",
  "Explore commercial interior design Cape Town concepts by FORMA, a fictional South African workplace design studio. Thoughtful spaces. Better ways of working.",
  "/"
);
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="intro-screen" aria-hidden="true">
        <span>FORMA</span>
        <small>THOUGHTFUL SPACES. BETTER WAYS OF WORKING.</small>
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-parallax">
          <div className="hero-media">
            <Image
              src="/images/hero.jpg"
              alt="Imagined timber-lined workplace with a communal table, greenery and warm afternoon light"
              fill
              priority
              sizes="100vw"
            />
          </div>
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <h1
            id="hero-title"
            aria-label="DESIGNED IN CAPE TOWN. MADE FOR THE WAY WE WORK."
          >
            {["DESIGNED IN", "CAPE TOWN.", "MADE FOR THE", "WAY WE WORK."].map(
              (line) => (
                <span className="line-mask" key={line}>
                  <span className="hero-line">{line}</span>
                </span>
              ),
            )}
          </h1>
          <p className="hero-description">
            We create considered workplaces that bring people, purpose and
            possibility together. Based in Cape Town, FORMA transforms everyday
            offices into inspiring environments for modern South African
            businesses.
          </p>
          <p className="hero-disclosure">
            Fictional Cape Town studio · Portfolio demonstration
          </p>
          <div className="hero-bottom">
            <p>
              Thoughtful spaces.
              <br />
              Better ways of working.
            </p>
            <MagneticLink href="#projects">Explore our work</MagneticLink>
            <a
              className="scroll-cue"
              href="#studio"
              aria-label="Scroll to discover — studio introduction"
            >
              <span>SCROLL TO DISCOVER</span>
              <span className="scroll-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">
          CAPE TOWN / SOUTH AFRICA
        </div>
      </section>
      <section id="studio" className="section studio-intro">
        <p className="micro" data-reveal>
          01 / THE STUDIO
        </p>
        <div>
          <h2 data-reveal>
            Thoughtful spaces.
            <br />
            <span className="muted">Better ways of working.</span>
          </h2>
          <div className="intro-copy" data-reveal>
            <p>
              We believe the places we work should bring out the best in us.
              More connection. More possibility. More room to be human.
            </p>
            <div>
              <p>
                FORMA is a fictional commercial interior design studio imagined
                in Cape Town, Western Cape. Our portfolio explores workplaces
                for South African businesses, from corporate teams and
                technology companies to creative agencies, professional service
                firms and property developers.
              </p>
              <MagneticLink href="/studio">Meet the studio</MagneticLink>
            </div>
          </div>
        </div>
      </section>
      <section id="projects" className="section projects-section">
        <div className="section-heading" data-reveal>
          <div>
            <p className="micro">02 / SELECTED SPACES</p>
            <h2>Work, reimagined.</h2>
          </div>
          <MagneticLink href="/projects">
            All projects <small>(06)</small>
          </MagneticLink>
        </div>
        <ProjectGrid />
        <p className="concept-note">
          Six Western Cape workplace concepts. All projects are fictional design
          studies; photography is illustrative and does not depict these
          locations or completed commissions.
        </p>
      </section>
      <section id="services" className="section services-section">
        <div data-reveal>
          <p className="micro">03 / WHAT WE DO</p>
          <h2>
            From strategy
            <br />
            to space.
          </h2>
          <p className="services-intro">
            A holistic approach.
            <br />A considered outcome.
          </p>
          <MagneticLink href="/services">Our services</MagneticLink>
        </div>
        <div className="service-list">
          {services.map(([title, subtitle, description], i) => (
            <details key={title} data-reveal>
              <summary>
                <span className="micro">0{i + 1}</span>
                <span>
                  {title}
                  <small>{subtitle}</small>
                </span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{description}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="philosophy">
        <div className="philosophy-copy" data-reveal>
          <p className="micro">04 / OUR PHILOSOPHY</p>
          <h2>
            A more human
            <br />
            way to work.
          </h2>
          <p>
            Great workplaces do more than look good. They bring people together,
            support focus and leave space for the unexpected.
          </p>
          <p>
            Cape light, natural timber and warm sandstone tones. Muted olive,
            charcoal and indigenous planting concepts. A contemporary South
            African approach to minimalism, shaped around people.
          </p>
          <MagneticLink href="/studio#approach">
            Discover our approach
          </MagneticLink>
        </div>
        <div className="philosophy-image">
          <Image
            src="/images/ellis.jpg"
            alt="Natural materials and greenery creating a calm shared interior"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
      </section>
      <section className="section contact-cta" data-reveal>
        <p className="micro">05 / START SOMETHING GOOD</p>
        <h2>
          Make room for
          <br />
          what’s <em>next.</em>
        </h2>
        <div>
          <p>
            A new perspective starts
            <br />
            with a conversation.
          </p>
          <MagneticLink href="/contact" className="circle-link">
            Let’s talk
          </MagneticLink>
        </div>
      </section>
    </>
  );
}
