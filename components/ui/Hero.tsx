"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/data/site";
import { world } from "@/lib/world";
import { useRaf } from "@/lib/hooks";
import { usePrefersReducedMotion } from "@/lib/use-env";
import { worldNav } from "@/lib/navigation";
import { sound } from "@/lib/audio";
import { useWorldState } from "@/lib/store";

const LETTERS = "PRAJWAL".split("");

export function HeroTitle() {
  const reduced = usePrefersReducedMotion();
  const { phase } = useWorldState();
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const offsets = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      offsets.current = letterRefs.current.map((element) => element?.offsetLeft ?? 0);
    };
    measure();
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    const timer = window.setTimeout(measure, 600);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useRaf((time) => {
    if (reduced) return;
    const pointerX = world.pointer.x;
    const pointerY = world.pointer.y;
    const cursorX = (pointerX * 0.5 + 0.5) * window.innerWidth;
    letterRefs.current.forEach((element, index) => {
      if (!element) return;
      const offset = offsets.current[index] ?? index * 60;
      const proximity = Math.max(0, 1 - Math.abs(offset - cursorX) / 340);
      const y = Math.sin(time * 0.0011 + index * 0.44) * 4 - pointerY * (5 + proximity * 20);
      const x = pointerX * (2.5 + index * 1.1);
      const scale = 1 + proximity * 0.05;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      element.style.opacity = (0.8 + proximity * 0.2).toFixed(3);
    });
  });

  const reveal = phase === "live";

  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={reveal ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        className="mono-label mb-5"
      >
        {SITE.roleLine}
      </motion.p>

      <h1 className="display text-[clamp(3.4rem,15vw,12rem)] leading-[0.86]">
        {LETTERS.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            ref={(node) => {
              letterRefs.current[index] = node;
            }}
            initial={reduced ? false : { opacity: 0, y: 60, filter: "blur(16px)" }}
            animate={reveal ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{
              duration: 1.4,
              delay: 0.15 + index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block will-change-transform"
            style={{ willChange: "transform" }}
          >
            <span className="text-aurora glow-azure">{letter}</span>
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={reveal ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, delay: 0.7 }}
        className="mt-7 max-w-md text-[13px] leading-relaxed text-white/60 md:text-[15px]"
      >
        {SITE.tagline}
      </motion.p>

      <motion.button
        type="button"
        onClick={() => {
          worldNav.scrollToChapter(1);
          sound.play("whoosh");
        }}
        initial={{ opacity: 0 }}
        animate={reveal ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="focus-ring group pointer-events-auto mt-12 flex flex-col items-center gap-3"
        aria-label="Scroll to enter the world"
      >
        <span className="font-mono text-[10px] tracking-[0.4em] text-white/45 transition-colors group-hover:text-white/80">
          SCROLL TO ENTER
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-6 animate-[sweep_2.4s_cubic-bezier(0.16,1,0.3,1)_infinite] bg-gradient-to-b from-transparent via-white to-transparent" />
        </span>
      </motion.button>
    </div>
  );
}