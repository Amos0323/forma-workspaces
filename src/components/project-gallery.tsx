"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./project-grid";
export function ProjectGallery() {
  const [category, setCategory] = useState("All spaces");
  const reduce = useReducedMotion();
  const filtered = projects.filter(
    (project) => category === "All spaces" || project.category === category,
  );
  return (
    <div className="interactive-gallery">
      <h2 className="sr-only">Conceptual workplaces</h2>
      <div
        className="filter-bar"
        role="group"
        aria-label="Filter projects by category"
      >
        {["All spaces", ...projects.map((p) => p.category)].map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={category === label}
            onClick={() => setCategory(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="gallery-count" role="status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "concept" : "concepts"} /{" "}
        {category}
      </p>
      <motion.div
        layout={!reduce}
        className="project-grid filtered-grid"
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              layout={!reduce}
              key={project.slug}
              className="filtered-project"
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            >
              <ProjectCard
                project={project}
                index={projects.indexOf(project)}
                reveal={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
