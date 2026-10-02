"use client";

import { useEffect, useRef } from "react";

export function useRaf(callback: (time: number) => void) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    let frame = 0;
    const loop = (time: number) => {
      saved.current(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
}

export function useMagnetic<T extends HTMLElement>(strength = 14, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const limit = Math.max(rect.width, rect.height) / 2 + radius;
      if (distance > limit) {
        node.style.setProperty("--mx", "0px");
        node.style.setProperty("--my", "0px");
        return;
      }
      const falloff = 1 - distance / limit;
      node.style.setProperty("--mx", `${(dx * falloff * strength) / 12}px`);
      node.style.setProperty("--my", `${(dy * falloff * strength) / 12}px`);
    };

    const onLeave = () => {
      node.style.setProperty("--mx", "0px");
      node.style.setProperty("--my", "0px");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, radius]);

  return ref;
}