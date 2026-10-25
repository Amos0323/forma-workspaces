import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact-form";
export const metadata = pageMetadata(
  "Cape Town — Contact Demo",
  "Explore the Cape Town location and Western Cape service-area concept for fictional studio FORMA. Demo enquiries are not sent; no physical office is verified.",
  "/contact"
);
export default function Contact() {
  return (
    <section className="inner-page">
      <p className="micro">START SOMETHING GOOD</p>
      <h1>
        Make room
        <br />
        for what’s next.
      </h1>
      <p className="page-lead">
        A new perspective starts with a conversation. What could your workplace
        become?
      </p>
      <section className="location-section" aria-labelledby="location-title">
        <div>
          <p className="micro">A CAPE TOWN PERSPECTIVE</p>
          <h2 id="location-title">
            Rooted in the Cape.
            <br />
            Open to possibility.
          </h2>
          <p>
            Cape Town, Western Cape, South Africa — the imagined home of FORMA
            WORKSPACES.
          </p>
        </div>
        <div>
          <h3>Concept service areas</h3>
          <p>
            Cape Town · Stellenbosch · Paarl
            <br />
            Western Cape · South Africa
          </p>
          <p>
            From city offices to Winelands workspaces, our conceptual approach
            explores natural light, honest materials and more human working
            environments.
          </p>
          <p className="preview-note">
            This is a fictional studio portfolio, not an operating business. No
            physical office is verified. A street address, telephone number and
            contact email are intentionally omitted.
          </p>
        </div>
      </section>
      <ContactForm />
    </section>
  );
}
