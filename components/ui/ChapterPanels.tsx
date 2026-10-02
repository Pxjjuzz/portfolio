"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import { IDENTITY, DISCIPLINES, BEYOND, STATUS_LINES, STATUS_FOOTER } from "@/data/personal";
import { PROJECTS } from "@/data/projects";
import { CREATIVE_TOOLS, CREATIVE_WORK } from "@/data/creative";
import { SKILLS, SKILL_KIND_LABEL } from "@/data/skills";
import { MILESTONES } from "@/data/journey";
import { SITE } from "@/data/site";
import { HeroTitle } from "@/components/ui/Hero";
import { openProject, worldNav } from "@/lib/navigation";
import { setWorldState, useWorldState } from "@/lib/store";
import { sound } from "@/lib/audio";
import { useMagnetic } from "@/lib/hooks";

const variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function Shell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={`glass pointer-events-auto max-h-[64vh] w-full max-w-[420px] overflow-y-auto rounded-2xl px-5 py-5 md:max-h-none md:max-w-[380px] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mono-label">{children}</p>;
}

function IdentityPanel() {
  return (
    <Shell>
      <Kicker>{IDENTITY.focus}</Kicker>
      <h2 className="display mt-3 text-3xl text-white/92">{IDENTITY.first}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[10px] tracking-[0.2em] text-azure">{IDENTITY.study.toUpperCase()}</span>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/45">{IDENTITY.location.toUpperCase()}</span>
      </div>
      <div className="mt-4 space-y-1">
        {IDENTITY.lines.map((line) => (
          <p key={line} className="text-[12.5px] leading-relaxed text-white/55">
            {line}
          </p>
        ))}
      </div>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {DISCIPLINES.map((discipline) => (
          <li
            key={discipline.id}
            title={discipline.body}
            onMouseEnter={() => {
              setWorldState({ hoveredDiscipline: discipline.id });
              sound.play("hover");
            }}
            onMouseLeave={() => setWorldState({ hoveredDiscipline: null })}
            className="cursor-default"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] tracking-[0.16em] transition-colors duration-300"
              style={{
                borderColor: `color-mix(in srgb, ${discipline.accent} 45%, transparent)`,
                color: discipline.accent,
              }}
            >
              <span className="h-1 w-1 rounded-full" style={{ background: discipline.accent }} />
              {discipline.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11.5px] leading-relaxed text-white/40">
        Hover the floating nodes to wake them up.
      </p>
    </Shell>
  );
}

function MuseumPanel() {
  return (
    <Shell className="max-w-[440px]">
      <Kicker>6 artifacts · hover to inspect · click to enter</Kicker>
      <ul className="mt-4 space-y-1.5">
        {PROJECTS.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onMouseEnter={() => {
                setWorldState({ hoveredProject: project.id });
                sound.play("hover");
              }}
              onMouseLeave={() => setWorldState({ hoveredProject: null })}
              onFocus={() => setWorldState({ hoveredProject: project.id })}
              onBlur={() => setWorldState({ hoveredProject: null })}
              onClick={() => openProject(project.id)}
              className="focus-ring group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <span
                className="font-mono text-[9px] tracking-[0.2em]"
                style={{ color: project.accent }}
              >
                {project.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[13.5px] text-white/85">
                  {project.name}
                </span>
                <span className="block truncate text-[11px] text-white/40">{project.tagline}</span>
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-white/25 transition-colors group-hover:text-white/70">
                ENTER →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function StudioPanel() {
  return (
    <Shell>
      <Kicker>CREATIVE MODE — timeline armed</Kicker>
      <div className="mt-4 space-y-2.5">
        {CREATIVE_WORK.map((work) => (
          <div key={work.id} className="border-l pl-3" style={{ borderColor: work.accent }}>
            <p className="font-display text-[13px] tracking-[0.14em]" style={{ color: work.accent }}>
              {work.label}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/50">{work.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {CREATIVE_TOOLS.map((tool) => (
          <span
            key={tool.name}
            title={tool.role}
            className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-white/55"
          >
            {tool.name}
          </span>
        ))}
      </div>
    </Shell>
  );
}

function BeyondPanel() {
  return (
    <Shell>
      <Kicker>PERSONALITY LAYER — unlocked</Kicker>
      <ul className="mt-4 space-y-2">
        {BEYOND.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: item.accent, boxShadow: `0 0 12px ${item.accent}` }}
            />
            <div>
              <p className="font-display text-[13px] tracking-[0.16em] text-white/85">{item.label}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/50">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[9.5px] tracking-[0.22em] text-white/35">
        LEARN BY BUILDING · BREAK ON PURPOSE · FIX LATER
      </p>
    </Shell>
  );
}

function ConstellationPanel() {
  const kinds = ["ai", "web", "hardware", "creative"] as const;

  return (
    <Shell>
      <Kicker>Skill graph — 18 nodes, all still loading</Kicker>
      <div className="mt-4 space-y-2.5">
        {kinds.map((kind) => {
          const nodes = SKILLS.filter((skill) => skill.kind === kind);
          return (
            <div key={kind}>
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[9.5px] tracking-[0.24em] text-white/45">
                  {SKILL_KIND_LABEL[kind]}
                </p>
                <p className="font-mono text-[9.5px] tracking-[0.2em] text-white/25">
                  {nodes.length.toString().padStart(2, "0")}
                </p>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {nodes.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border px-2 py-0.5 text-[10px] tracking-wide text-white/60"
                    style={{ borderColor: `color-mix(in srgb, ${skill.accent} 32%, transparent)` }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

function StatusPanel() {
  return (
    <Shell>
      <Kicker>SYSTEM STATUS — live telemetry</Kicker>
      <div className="mt-4 space-y-1.5 font-mono text-[11px]">
        {STATUS_LINES.map((line) => (
          <button
            key={line.label}
            type="button"
            onClick={() => sound.play(line.state === "err" ? "glitch" : "select")}
            className="focus-ring flex w-full items-center justify-between rounded px-1 py-0.5 text-left transition-colors hover:bg-white/5"
          >
            <span className="tracking-[0.16em] text-white/55">{line.label}</span>
            <span
              className="tracking-[0.2em]"
              style={{
                color:
                  line.state === "err" ? "#ff8a5b" : line.state === "warn" ? "#ffb86b" : "#7cf5c4",
              }}
            >
              {line.value}
            </span>
          </button>
        ))}
      </div>
      <div className="hairline my-4" />
      <div className="space-y-1">
        {STATUS_FOOTER.map((line) => (
          <p key={line} className="font-mono text-[9.5px] tracking-[0.18em] text-white/35">
            {line}
          </p>
        ))}
      </div>
    </Shell>
  );
}

function JourneyPanel() {
  return (
    <Shell className="max-w-[400px]">
      <Kicker>Trajectory log</Kicker>
      <ol className="mt-4 space-y-3">
        {MILESTONES.map((milestone) => (
          <li key={milestone.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: milestone.accent, boxShadow: `0 0 10px ${milestone.accent}` }}
              />
              <span className="mt-1 w-px flex-1 bg-white/10" />
            </div>
            <div className="pb-1">
              <p className="font-mono text-[9.5px] tracking-[0.24em]" style={{ color: milestone.accent }}>
                {milestone.year}
              </p>
              <p className="mt-0.5 font-display text-[13px] text-white/85">{milestone.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-white/45">{milestone.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function ContactLinkCard({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(12, 70);
  const external = href.startsWith("http");

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      onMouseEnter={() => sound.play("hover")}
      className="magnetic focus-ring group flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
    >
      <span>
        <span className="block font-display text-[13px] tracking-[0.18em] text-white/85">{label}</span>
        <span className="block font-mono text-[9.5px] tracking-[0.16em] text-white/35">{handle}</span>
      </span>
      <span className="font-mono text-[10px] text-white/25 transition-colors group-hover:text-white/70">
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}

function ContactPanel() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
        exit="hidden"
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto"
      >
        <Kicker>Uplink open · one signal left</Kicker>
        <h2 className="display mt-4 text-[clamp(2rem,7vw,4.4rem)] text-aurora glow-soft">
          {SITE.closing}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-white/55">
          {SITE.closingLine}
        </p>
      </motion.div>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
        exit="hidden"
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="grid w-full gap-2 sm:grid-cols-2"
      >
        {SITE.links.map((link) => (
          <ContactLinkCard key={link.id} label={link.label} handle={link.handle} href={link.href} />
        ))}
      </motion.div>
      <motion.button
        type="button"
        variants={variants}
        initial="hidden"
        animate="show"
        exit="hidden"
        onClick={() => {
          worldNav.scrollToChapter(0);
        }}
        className="focus-ring pointer-events-auto font-mono text-[10px] tracking-[0.28em] text-white/35 transition-colors hover:text-white/70"
      >
        ↑ RE-ENTER THE WORLD
      </motion.button>
    </div>
  );
}

export function ChapterPanels() {
  const { chapter } = useWorldState();
  const entry = CHAPTERS[chapter] ?? CHAPTERS[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center px-4 pb-16 md:items-center md:justify-start md:px-8 md:pb-0">
      <AnimatePresence mode="wait">
        {entry.id === "world" && (
          <div key="world" className="flex h-full w-full items-center justify-center">
            <HeroTitle />
          </div>
        )}

        {entry.id === "identity" && (
          <div key="identity" className="flex w-full justify-center md:justify-start">
            <IdentityPanel />
          </div>
        )}

        {entry.id === "museum" && (
          <div key="museum" className="flex w-full justify-center md:justify-start">
            <MuseumPanel />
          </div>
        )}

        {entry.id === "studio" && (
          <div key="studio" className="flex w-full justify-center md:justify-start">
            <StudioPanel />
          </div>
        )}

        {entry.id === "beyond" && (
          <div key="beyond" className="flex w-full justify-center md:justify-end">
            <BeyondPanel />
          </div>
        )}

        {entry.id === "constellation" && (
          <div key="constellation" className="flex w-full justify-center md:justify-start">
            <ConstellationPanel />
          </div>
        )}

        {entry.id === "status" && (
          <div key="status" className="flex w-full justify-center md:justify-end">
            <StatusPanel />
          </div>
        )}

        {entry.id === "journey" && (
          <div key="journey" className="flex w-full justify-center md:justify-start">
            <JourneyPanel />
          </div>
        )}

        {entry.id === "contact" && (
          <div key="contact" className="flex h-full w-full items-center justify-center">
            <ContactPanel />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}