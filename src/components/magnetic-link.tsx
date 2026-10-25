"use client";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
export function MagneticLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      href={href}
      className={`text-link ${className}`}
      animate={offset}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({
          x: (event.clientX - rect.left - rect.width / 2) * 0.12,
          y: (event.clientY - rect.top - rect.height / 2) * 0.18,
        });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      onBlur={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </motion.a>
  );
}
