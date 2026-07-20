"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch devices — a mouse-follow ring makes no sense there.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || reducedMotion) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.left = `${e.clientX}px`;
      ref.current.style.top = `${e.clientY}px`;
    };

    const grow = () => {
      if (!ref.current) return;
      ref.current.style.width = "52px";
      ref.current.style.height = "52px";
      ref.current.style.backgroundColor = "rgba(225,6,0,0.15)";
    };
    const shrink = () => {
      if (!ref.current) return;
      ref.current.style.width = "28px";
      ref.current.style.height = "28px";
      ref.current.style.backgroundColor = "transparent";
    };

    window.addEventListener("mousemove", move);
    const hoverables = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  if (!enabled) return null;
  return <div ref={ref} className="cursor-ring hidden md:block" />;
}
