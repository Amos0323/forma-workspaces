import { pageMetadata } from "@/lib/metadata";
import { ProjectGallery } from "@/components/project-gallery";
import { CapeProjectMap } from "@/components/cape-project-map";
export const metadata = pageMetadata(
  "Cape Town Workplace Design Concepts",
  "Explore six fictional Western Cape workplaces by category and approximate location. Interactive design studies by FORMA, a fictional Cape Town studio.",
  "/projects"
);
export default function Projects() {
  return (
    <div className="inner-page">
      <p className="micro">THE COLLECTION / 01—06</p>
      <h1>Work, reimagined.</h1>
      <p className="page-lead">
        Six conceptual workplaces across Cape Town and Stellenbosch. Every
        project is a fictional design study: no real clients, completed
        commissions or verified project sites are represented.
      </p>
      <ProjectGallery />
      <p className="concept-note">
        All projects are fictional. Photography illustrates the design direction
        and does not depict these South African locations or commissioned FORMA
        work.
      </p>
      <CapeProjectMap />
    </div>
  );
}
