import Experience from "@/components/experience/Experience";
import { PROJECTS } from "@/data/projects";
import { SITE } from "@/data/site";

export default function Page() {
  return (
    <>
      <Experience />
      <noscript>
        <main className="mx-auto max-w-3xl px-6 py-24">
          <h1 className="text-4xl font-semibold">{SITE.fullName}</h1>
          <p className="mt-2 font-mono text-xs tracking-[0.3em] text-white/50">{SITE.roleLine}</p>
          <p className="mt-6 text-white/70">{SITE.tagline}</p>
          <p className="mt-4 text-sm text-white/50">
            AIML engineering student in {SITE.location}. This portfolio is a WebGL experience — enable
            JavaScript to enter it, or reach me directly:
          </p>
          <ul className="mt-6 space-y-3">
            {PROJECTS.map((project) => (
              <li key={project.id}>
                <strong className="text-white/85">{project.name}</strong> — {project.summary}
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-2">
            {SITE.links.map((link) => (
              <li key={link.id}>
                <a href={link.href} className="underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </noscript>
    </>
  );
}