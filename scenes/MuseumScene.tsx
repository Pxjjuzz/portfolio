"use client";

import { ChapterGate, Backdrop, HoloPlane } from "@/components/world/primitives";
import { ParticleField } from "@/components/world/ParticleField";
import { ProjectArtifact } from "@/components/projects/ProjectArtifact";
import { PROJECTS } from "@/data/projects";
import { CHAPTERS } from "@/data/chapters";
import { useQuality } from "@/lib/use-env";

export function MuseumScene() {
  const quality = useQuality();
  const anchor = CHAPTERS[2].anchor;

  return (
    <ChapterGate index={2} pad={1.7}>
      <group position={anchor}>
        <Backdrop color="#26357e" deep="#05070f" opacity={0.42} />
        <HoloPlane
          width={40}
          height={30}
          color="#5b8cff"
          grid={0.55}
          opacity={0.3}
          position={[0, -2.4, -8]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        {PROJECTS.map((project) => (
          <ProjectArtifact key={project.id} project={project} />
        ))}
      </group>
      <ParticleField
        count={Math.round(quality.particles * 0.4)}
        seed={23}
        spread={30}
        height={18}
        zStart={anchor[2] + 16}
        zEnd={anchor[2] - 22}
        colorA="#7f9dff"
        colorB="#57e6ff"
        opacity={0.55}
        sizeScale={0.8}
      />
    </ChapterGate>
  );
}