"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOADER_LINES, SITE } from "@/data/site";
import { setWorldState } from "@/lib/store";
import { world } from "@/lib/world";
import { usePrefersReducedMotion } from "@/lib/use-env";
import { sound } from "@/lib/audio";

const LINES = ["CORE", "RENDERER", "AUDIO BUS", "PARTICLES", "PROJECTS", "CURIOSITY"];

export function BootScreen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const loop = () => {
      const elapsed = performance.now() - start;
      const target = reduced ? 1 : world.ready ? 1 : Math.min(0.9, elapsed / 2400);
      setProgress((current) => (target > current ? target : current));
      if (target >= 1) {
        setFinished(true);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  useEffect(() => {
    if (!finished) return;
    const timeout = window.setTimeout(() => {
      setWorldState({ phase: "live" });
      setVisible(false);
    }, reduced ? 60 : 620);
    return () => window.clearTimeout(timeout);
  }, [finished, reduced]);

  const percent = Math.round(progress * 100);
  const statusIndex = Math.floor(progress * LOADER_LINES.length);
  const revealed = Math.min(LINES.length - 1, Math.floor(progress * LINES.length));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="noise fixed inset-0 z-[90] flex flex-col justify-between bg-void px-6 py-8 md:px-12 md:py-12"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.34em] text-white/40">
                {SITE.fullName.toUpperCase()}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.34em] text-white/25">
                BANGALORE, INDIA
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setProgress(1);
                setFinished(true);
              }}
              className="focus-ring rounded-full border border-white/15 px-4 py-1.5 font-mono text-[10px] tracking-[0.26em] text-white/50 transition-colors hover:border-white/40 hover:text-white/90"
            >
              SKIP
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="display text-[clamp(1.6rem,6vw,4rem)] text-white/90"
            >
              INITIALIZING <span className="text-aurora">{SITE.first}.OS</span>
            </motion.p>

            <div className="mt-8 h-px w-full bg-white/10">
              <div
                className="h-px bg-gradient-to-r from-azure via-iris to-cyan shadow-[0_0_16px_rgba(140,170,255,0.9)]"
                style={{ width: `${percent}%`, transition: "width 240ms linear" }}
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.26em]">
              <span className="text-white/35">LOADING EXPERIENCE</span>
              <span className="text-white/70">{percent.toString().padStart(3, "0")}%</span>
            </div>

            <div className="mt-10 grid gap-1.5 sm:grid-cols-2">
              {LINES.map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-6">
                  <span
                    className="font-mono text-[10px] tracking-[0.22em] transition-colors duration-500"
                    style={{ color: index <= revealed ? "rgba(233,236,255,0.65)" : "rgba(233,236,255,0.16)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-[0.22em] transition-colors duration-500"
                    style={{
                      color:
                        index < statusIndex
                          ? "rgba(124,245,196,0.9)"
                          : index === statusIndex
                            ? "rgba(255,184,107,0.95)"
                            : "rgba(233,236,255,0.16)",
                    }}
                  >
                    {index < statusIndex
                      ? "READY"
                      : index === statusIndex
                        ? "LOADING"
                        : "QUEUED"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <div className="hairline mb-4" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-5">
              {LOADER_LINES.map((line, index) => (
                <p
                  key={line.label}
                  className="font-mono text-[9px] tracking-[0.2em]"
                  style={{
                    color:
                      index <= statusIndex
                        ? line.value === "ERROR"
                          ? "rgba(255,138,91,0.85)"
                          : "rgba(124,245,196,0.75)"
                        : "rgba(233,236,255,0.16)",
                  }}
                >
                  {line.label} <span className="opacity-70">{line.value}</span>
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function startAudioOnFirstGesture() {
  const handler = () => {
    sound.play("boot");
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("keydown", handler);
  };
  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("keydown", handler, { once: true });
}