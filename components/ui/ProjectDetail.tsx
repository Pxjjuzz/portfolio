"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { projectById } from "@/data/projects";
import { closeProject } from "@/lib/navigation";
import { setWorldState, useWorldState } from "@/lib/store";
import { sound } from "@/lib/audio";
import { useMagnetic } from "@/lib/hooks";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-white/8 pt-6">
      <p className="mono-label">{label}</p>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  const animatable = !Number.isNaN(numeric) && numeric > 0;
  const [display, setDisplay] = useState(animatable ? `0${suffix}` : value);

  useEffect(() => {
    if (!inView || !animatable) return;
    const start = performance.now();
    let frame = 0;
    const loop = () => {
      const t = Math.min(1, (performance.now() - start) / 1200);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${Math.round(numeric * eased)}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [inView, animatable, numeric, suffix]);

  return <span ref={ref}>{display}</span>;
}

function PipelineDiagram({ accent }: { accent: string }) {
  return (
    <div className="relative mt-6 h-24 w-full overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
      <svg viewBox="0 0 400 96" className="h-full w-full" aria-hidden>
        <path
          d="M28 48 H150 M250 48 H372"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <rect x="140" y="26" width="120" height="44" rx="10" fill="none" stroke={accent} strokeOpacity="0.5" />
        {[
          { cx: 28, cy: 48, color: "#57e6ff" },
          { cx: 200, cy: 48, color: accent },
          { cx: 372, cy: 48, color: "#c9a6ff" },
        ].map((node, index) => (
          <g key={index}>
            <circle cx={node.cx} cy={node.cy} r="7" fill={node.color} opacity="0.85" />
            <circle cx={node.cx} cy={node.cy} r="7" fill="none" stroke={node.color} strokeOpacity="0.5">
              <animate attributeName="r" values="7;16;7" dur="2.4s" begin={`${index * 0.5}s`} repeatCount="indefinite" />
              <animate
                attributeName="stroke-opacity"
                values="0.6;0;0.6"
                dur="2.4s"
                begin={`${index * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        <text x="150" y="20" fill="rgba(233,236,255,0.45)" fontSize="9" letterSpacing="2.4" fontFamily="monospace">
          MODEL CORE
        </text>
      </svg>
    </div>
  );
}

export function ProjectDetail() {
  const { activeProject } = useWorldState();
  const project = projectById(activeProject);
  const scroller = useRef<HTMLDivElement>(null);
  const closeRef = useMagnetic<HTMLButtonElement>(12, 60);

  useEffect(() => {
    if (!project) return;
    scroller.current?.scrollTo({ top: 0 });
    document.body.dataset.locked = "true";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.dataset.locked = "false";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[85]"
        >
          <button
            type="button"
            aria-label="Back to the world"
            onClick={closeProject}
            className="absolute inset-0 cursor-default bg-void/85 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.99 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong absolute inset-x-0 bottom-0 top-0 mx-auto flex max-w-5xl flex-col overflow-hidden rounded-t-3xl md:inset-6 md:rounded-3xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.28em]" style={{ color: project.accent }}>
                  {project.code} · {project.year} · IMMERSIVE BRIEF
                </p>
                <h2 className="display mt-2 truncate text-2xl text-white/92 md:text-3xl">{project.name}</h2>
                <p className="mt-1 text-[12.5px] text-white/50">{project.tagline}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeProject}
                className="magnetic focus-ring shrink-0 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.22em] text-white/65 transition-colors hover:border-white/40 hover:text-white"
              >
                BACK TO WORLD
              </button>
            </header>

            <div
              ref={scroller}
              className="flex-1 overflow-y-auto overscroll-contain px-6 pb-24 pt-6"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-8">
                  <Reveal>
                    <div className="flex flex-wrap gap-3">
                      {project.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                        >
                          <p className="font-display text-xl" style={{ color: project.accent }}>
                            <Counter value={metric.value} />
                          </p>
                          <p className="mt-0.5 font-mono text-[9px] tracking-[0.22em] text-white/35">
                            {metric.label.toUpperCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/65">
                      {project.summary}
                    </p>
                    <PipelineDiagram accent={project.accent} />
                  </Reveal>

                  <Section label="01 / PROBLEM">
                    <p className="text-[15px] leading-relaxed text-white/80">{project.problem}</p>
                  </Section>

                  <Section label="02 / CONCEPT">
                    <p className="text-[14px] leading-relaxed text-white/60">{project.concept}</p>
                  </Section>

                  <Section label="03 / THE INTELLIGENCE">
                    <p className="text-[14px] leading-relaxed text-white/70">{project.ai}</p>
                  </Section>

                  <Section label="04 / WHAT I BUILT">
                    <ol className="space-y-2.5">
                      {project.build.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span
                            className="mt-0.5 font-mono text-[10px]"
                            style={{ color: project.accent }}
                          >
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="text-[13.5px] leading-relaxed text-white/65">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Section>

                  <Section label="05 / CHALLENGE">
                    <p className="text-[14px] leading-relaxed text-white/70">{project.challenge}</p>
                  </Section>

                  <Section label="06 / OUTCOME">
                    <p className="text-[14px] leading-relaxed text-white/70">{project.outcome}</p>
                  </Section>
                </div>

                <div className="space-y-8">
                  <Section label="STACK">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/65"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </Section>

                  {project.hardware.length > 0 && (
                    <Section label="HARDWARE">
                      <ul className="space-y-2">
                        {project.hardware.map((item) => (
                          <li
                            key={item.name}
                            className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2"
                          >
                            <p className="font-display text-[13px] text-white/85">{item.name}</p>
                            <p className="text-[11.5px] text-white/45">{item.role}</p>
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  <Section label="INTERFACE">
                    <ul className="space-y-2">
                      {project.interface.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            className="h-1 w-1 rounded-full"
                            style={{ background: project.accent }}
                          />
                          <span className="text-[13px] text-white/65">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Section label="FEATURES">
                    <ul className="space-y-3">
                      {project.features.map((feature) => (
                        <li key={feature.title}>
                          <p className="font-display text-[13.5px] tracking-[0.08em] text-white/88">
                            {feature.title}
                          </p>
                          <p className="mt-1 text-[12px] leading-relaxed text-white/50">{feature.body}</p>
                        </li>
                      ))}
                    </ul>
                  </Section>

                  <Reveal>
                    <button
                      type="button"
                      onClick={() => {
                        closeProject();
                        setTimeout(() => setWorldState({ menuOpen: false }), 120);
                        sound.play("whoosh");
                      }}
                      className="focus-ring w-full rounded-xl border px-4 py-3 font-mono text-[10px] tracking-[0.24em] transition-colors duration-300"
                      style={{
                        borderColor: `color-mix(in srgb, ${project.accent} 45%, transparent)`,
                        color: project.accent,
                      }}
                    >
                      ← RETURN TO THE ARCHIVE
                    </button>
                  </Reveal>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}