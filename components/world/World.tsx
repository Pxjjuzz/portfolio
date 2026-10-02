"use client";

import { Suspense } from "react";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { CameraRig, SceneSetup } from "@/components/world/SceneSetup";
import { Atmosphere } from "@/components/world/Atmosphere";
import { ParticleField } from "@/components/world/ParticleField";
import { HeroScene } from "@/scenes/HeroScene";
import { IdentityScene } from "@/scenes/IdentityScene";
import { MuseumScene } from "@/scenes/MuseumScene";
import { StudioScene } from "@/scenes/StudioScene";
import { BeyondScene } from "@/scenes/BeyondScene";
import { ConstellationScene } from "@/scenes/ConstellationScene";
import { StatusScene } from "@/scenes/StatusScene";
import { JourneyScene } from "@/scenes/JourneyScene";
import { ContactScene } from "@/scenes/ContactScene";
import { useQuality } from "@/lib/use-env";

export function World({ reducedMotion }: { reducedMotion: boolean }) {
  const quality = useQuality();

  return (
    <>
      <SceneSetup reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />
      <Atmosphere quality={quality} reducedMotion={reducedMotion} />
      <ParticleField
        count={quality.particles}
        seed={5}
        spread={42}
        height={26}
        zStart={28}
        zEnd={-300}
        opacity={0.8}
      />

      <HeroScene />
      <IdentityScene />
      <MuseumScene />
      <StudioScene />
      <BeyondScene />
      <ConstellationScene />
      <StatusScene />
      <JourneyScene />
      <ContactScene />

      {quality.postFx && (
        <Suspense fallback={null}>
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom
              intensity={quality.bloom}
              luminanceThreshold={0.22}
              luminanceSmoothing={0.65}
              mipmapBlur
              radius={0.7}
            />
            <Vignette offset={0.26} darkness={0.78} eskil={false} />
          </EffectComposer>
        </Suspense>
      )}
    </>
  );
}