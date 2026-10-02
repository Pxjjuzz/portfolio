"use client";

import { BEYOND, IDENTITY, STATUS_LINES } from "@/data/personal";
import { CREATIVE_TOOLS, CREATIVE_WORK } from "@/data/creative";
import { MILESTONES } from "@/data/journey";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";
import { SKILLS, SKILL_KIND_LABEL } from "@/data/skills";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`glass rounded-2xl px-6 py-7 ${className}`}>{children}</section>;
}

export function StaticWorld() {
  return (
    <main className="noise relative mx-auto max-w-3xl px-5 py-24">
      <header className="mb-16 text-center">
        <p className="mono-label">AIML ENGINEERING STUDENT · BANGALORE, INDIA</p>
        <h1 className="display mt-6 text-[clamp(2.6rem,12vw,6rem)] text-aurora">{SITE.first}</h1>
        <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-white/50">{SITE.roleLine}</p>
        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-white/60">{SITE.tagline}</p>
      </header>

      <div className="space-y-5">
        <Card>
          <p className="mono-label">WHO AM I</p>
          <h2 className="display mt-3 text-3xl text-white/90">{SITE.fullName}</h2>
          <div className="mt-4 space-y-1.5">
            {IDENTITY.lines.map((line) => (
              <p key={line} className="text-[13.5px] leading-relaxed text-white/60">
                {line}
              </p>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mono-label">THE ARCHIVE</p>
          <div className="mt-4 space-y-3">
            {PROJECTS.map((project) => (
              <article key={project.id} className="border-l pl-4" style={{ borderColor: project.accent }}>
                <h3 className="font-display text-lg text-white/90">
                  {project.name}{" "}
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">{project.year}</span>
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-white/55">{project.summary}</p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-white/35">
                  {project.tech.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mono-label">CREATIVE MODE</p>
          <div className="mt-4 space-y-2">
            {CREATIVE_WORK.map((work) => (
              <p key={work.id} className="text-[13px] leading-relaxed text-white/60">
                <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: work.accent }}>
                  {work.label}
                </span>{" "}
                — {work.body}
              </p>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-white/35">
            {CREATIVE_TOOLS.map((tool) => tool.name).join(" · ")}
          </p>
        </Card>

        <Card>
          <p className="mono-label">BEYOND THE CODE</p>
          <ul className="mt-4 space-y-2">
            {BEYOND.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.accent }} />
                <span className="font-display text-[13px] tracking-[0.14em] text-white/80">{item.label}</span>
                <span className="text-[12.5px] text-white/45">{item.body}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="mono-label">SKILL CONSTELLATION</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["ai", "web", "hardware", "creative"] as const).map((kind) => (
              <div key={kind}>
                <p className="font-mono text-[9.5px] tracking-[0.24em] text-white/40">
                  {SKILL_KIND_LABEL[kind]}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                  {SKILLS.filter((skill) => skill.kind === kind)
                    .map((skill) => skill.name)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="mono-label">SYSTEM STATUS</p>
          <ul className="mt-3 space-y-1 font-mono text-[12px]">
            {STATUS_LINES.map((line) => (
              <li key={line.label} className="flex justify-between">
                <span className="tracking-[0.14em] text-white/55">{line.label}</span>
                <span
                  className="tracking-[0.18em]"
                  style={{
                    color:
                      line.state === "err" ? "#ff8a5b" : line.state === "warn" ? "#ffb86b" : "#7cf5c4",
                  }}
                >
                  {line.value}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <p className="mono-label">TRAJECTORY</p>
          <ol className="mt-4 space-y-3">
            {MILESTONES.map((milestone) => (
              <li key={milestone.id}>
                <p className="font-mono text-[9.5px] tracking-[0.24em]" style={{ color: milestone.accent }}>
                  {milestone.year}
                </p>
                <p className="font-display text-[14px] text-white/85">{milestone.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/50">{milestone.body}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <p className="mono-label">UPLINK</p>
          <h2 className="display mt-3 text-3xl text-white/90">{SITE.closing}</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">{SITE.closingLine}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {SITE.links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="focus-ring rounded-xl border border-white/10 px-4 py-3 transition-colors hover:border-white/30"
              >
                <span className="block font-display text-[13px] tracking-[0.16em] text-white/85">
                  {link.label}
                </span>
                <span className="block font-mono text-[9.5px] tracking-[0.14em] text-white/35">
                  {link.handle}
                </span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      <p className="mt-12 text-center font-mono text-[10px] tracking-[0.24em] text-white/25">
        3D unavailable on this device — you are reading the lightweight edition.
      </p>
    </main>
  );
}