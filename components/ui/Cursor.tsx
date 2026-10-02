"use client";

import { useRef } from "react";
import { useRaf } from "@/lib/hooks";
import { world } from "@/lib/world";

export function CursorGlow() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useRaf(() => {
    const x = (world.pointer.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-world.pointer.y * 0.5 + 0.5) * window.innerHeight;
    if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (ring.current) {
      const stretch = 1 + world.pointerSpeed * 0.5;
      ring.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${stretch.toFixed(3)})`;
    }
  });

  return (
    <div aria-hidden className="cursor-layer pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ring}
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-white/25"
        style={{ mixBlendMode: "screen" }}
      />
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_18px_4px_rgba(140,170,255,0.55)]"
      />
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useRaf(() => {
    const progress = Math.max(0, Math.min(1, world.progress));
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    if (label.current) label.current.textContent = `${Math.round(progress * 100)}%`;
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-px bg-white/5">
      <div
        ref={bar}
        className="h-px origin-left bg-gradient-to-r from-azure via-iris to-cyan shadow-[0_0_12px_rgba(120,160,255,0.8)]"
        style={{ transform: "scaleX(0)" }}
      />
      <span
        ref={label}
        className="absolute right-4 bottom-3 font-mono text-[10px] tracking-[0.3em] text-white/40"
      >
        0%
      </span>
    </div>
  );
}