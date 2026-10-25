"use client";
import Image from "next/image";
import { useId, useState } from "react";
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  caption,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}) {
  const [value, setValue] = useState(50);
  const id = useId();
  return (
    <figure className="comparison">
      <div className="comparison-stage">
        <Image
          src={after}
          alt={afterAlt}
          fill
          sizes="(max-width:700px) 90vw, 80vw"
        />
        <div
          className="comparison-before"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <Image
            src={before}
            alt={beforeAlt}
            fill
            sizes="(max-width:700px) 90vw, 80vw"
          />
        </div>
        <span className="comparison-label label-before">Before · concept</span>
        <span className="comparison-label label-after">After · concept</span>
        <div
          className="comparison-divider"
          style={{ left: `${value}%` }}
          aria-hidden="true"
        >
          <span>↔</span>
        </div>
        <input
          id={id}
          className="comparison-range"
          aria-label="Before and after comparison"
          aria-describedby={`${id}-caption`}
          aria-valuetext={`${value}% before concept visible`}
          type="range"
          min="0"
          max="100"
          step="1"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
      <figcaption id={`${id}-caption`}>
        {caption}{" "}
        <span>
          Drag or use the arrow keys. Home and End reveal either complete plan.
        </span>
      </figcaption>
      <div className="comparison-actions">
        <button onClick={() => setValue(100)}>Show before</button>
        <span aria-live="off">{value}% before</span>
        <button onClick={() => setValue(0)}>Show after</button>
      </div>
    </figure>
  );
}
