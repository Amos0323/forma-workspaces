"use client";
import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/data/projects";
import { projectStories } from "@/data/project-stories";
export function CapeProjectMap() {
  const [selected, setSelected] = useState(0);
  const [overview, setOverview] = useState(true);
  const reduce = useReducedMotion();
  const id = useId();
  const story = projectStories[selected];
  const project = projects[selected];
  const choose = (index: number) => {
    setSelected(index);
    setOverview(false);
  };
  return (
    <section className="cape-map-section" aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <div>
          <p className="micro">A SENSE OF PLACE</p>
          <h2 id={`${id}-title`}>
            Six places.
            <br />
            One Cape perspective.
          </h2>
        </div>
        <p className="map-disclaimer">
          Approximate regional diagram, not a street map.
          <br />
          Concept settings only; no building addresses.
        </p>
      </div>
      <div className="map-layout">
        <div className="map-canvas">
          <svg
            viewBox="0 0 800 440"
            role="group"
            aria-labelledby={`${id}-map-title`}
          >
            <title id={`${id}-map-title`}>
              Schematic overview of six conceptual Western Cape project
              locations
            </title>
            <rect width="800" height="440" fill="#dedfd3" />
            <motion.g
              animate={{
                scale: overview ? 1 : 1.28,
                x: overview ? 0 : (400 - story.x) * 0.25,
                y: overview ? 0 : (220 - story.y) * 0.2,
              }}
              style={{ transformOrigin: "400px 220px" }}
              transition={{ duration: reduce ? 0 : 0.65 }}
            >
              <path
                d="M0 0H270L240 70 185 120 150 165 163 200 140 235 150 280 110 340 125 390 90 440H0Z"
                fill="#becac6"
              />
              <path
                d="M190 260Q240 240 265 280L310 365 260 400 200 355Z"
                fill="#b5bba5"
              />
              <path
                d="M155 190L310 120 470 145 650 180M185 195L235 320M230 205L400 260 650 180"
                fill="none"
                stroke="#f3f1e9"
                strokeWidth="5"
              />
              <text x="32" y="270" className="map-water">
                ATLANTIC
              </text>
              <text x="35" y="289" className="map-water">
                OCEAN
              </text>
              <text x="200" y="355" className="map-land">
                TABLE MOUNTAIN
              </text>
              <text x="570" y="90" className="map-land">
                CAPE WINELANDS
              </text>
              {projectStories.map((point, index) => (
                <g
                  key={point.location}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${point.location} — ${index + 1}`}
                  aria-pressed={selected === index}
                  onClick={() => choose(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      choose(index);
                    }
                  }}
                  className={`map-marker ${selected === index ? "is-selected" : ""}`}
                >
                  <circle cx={point.x} cy={point.y} r="22" fill="transparent" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={selected === index ? 12 : 8}
                    fill={selected === index ? "#555c42" : "#937351"}
                    stroke="#f3f1e9"
                    strokeWidth="3"
                  />
                  <text
                    x={point.x}
                    y={point.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
            </motion.g>
            <text x="740" y="36" className="map-land">
              N ↑
            </text>
          </svg>
          <button className="map-reset" onClick={() => setOverview(true)}>
            Reset overview ↗
          </button>
        </div>
        <div className="map-preview" aria-live="polite" aria-atomic="true">
          <div className="map-preview-image">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width:700px) 90vw, 30vw"
            />
          </div>
          <p className="micro">
            CONCEPT {String(selected + 1).padStart(2, "0")} / {story.location}
          </p>
          <h3>{project.name}</h3>
          <p>{project.concept}</p>
          <Link className="text-link" href={`/projects/${project.slug}`}>
            Explore this concept <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div
        className="map-locations"
        role="group"
        aria-label="Choose a project location"
      >
        {projectStories.map((point, index) => (
          <button
            key={point.location}
            aria-pressed={selected === index}
            onClick={() => choose(index)}
          >
            <span>0{index + 1}</span>
            {point.location}
          </button>
        ))}
      </div>
    </section>
  );
}
