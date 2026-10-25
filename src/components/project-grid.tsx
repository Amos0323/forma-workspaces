import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
export function ProjectCard({
  project,
  index,
  reveal = true,
}: {
  project: (typeof projects)[number];
  index: number;
  reveal?: boolean;
}) {
  return (
    <article className="project" data-reveal={reveal ? "" : undefined}>
      <Link
        href={`/projects/${project.slug}`}
        className="project-image"
        aria-label={`Explore ${project.name}`}
      >
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width:700px) 92vw, 46vw"
        />
        <span className="project-view" aria-hidden="true">
          {project.concept}
          <br />
          Explore project ↗
        </span>
      </Link>
      <div className="project-caption">
        <div>
          <p className="micro">
            {project.location} / {project.year}
          </p>
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.name}</Link>
          </h3>
          <p className="project-category">{project.category}</p>
          <p className="project-status">Conceptual work · Fictional brief</p>
        </div>
        <span className="project-number">0{index + 1}</span>
      </div>
    </article>
  );
}
export function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
