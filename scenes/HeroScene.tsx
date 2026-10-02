"use client";

import { ChapterGate, Backdrop, DataStreams } from "@/components/world/primitives";
import {
  FloatingPanel,
  GeometryCluster,
  RingAssembly,
  Workstation,
} from "@/components/world/objects";
import { useQuality } from "@/lib/use-env";

export function HeroScene() {
  const quality = useQuality();

  return (
    <ChapterGate index={0} pad={1.6}>
      <Backdrop color="#2c4098" deep="#04060d" opacity={0.55} />
      <DataStreams count={quality.streamParticles} color="#57e6ff" radius={10} length={24} seed={11} />
      <RingAssembly radius={3.7} accent="#5b8cff" accentB="#a06bff" position={[0, 0.7, -9]} />

      <FloatingPanel
        keyId="hero-1"
        accent="#5b8cff"
        width={2.5}
        height={1.6}
        position={[-5.4, 2.3, -7]}
        rotation={[0, 0.42, 0]}
        phase={0.4}
      />
      <FloatingPanel
        keyId="hero-2"
        accent="#57e6ff"
        width={2.1}
        height={1.35}
        position={[5.6, 1.5, -9.5]}
        rotation={[0, -0.5, 0]}
        phase={1.9}
      />
      <FloatingPanel
        keyId="hero-3"
        accent="#ffb86b"
        width={1.9}
        height={1.2}
        position={[-4.4, -1.9, -12]}
        rotation={[0, 0.3, -0.08]}
        phase={2.7}
      />
      <FloatingPanel
        keyId="hero-4"
        accent="#c9a6ff"
        width={1.6}
        height={1}
        position={[4.6, -2.3, -4.5]}
        rotation={[0, -0.34, 0.06]}
        phase={3.6}
      />

      <Workstation position={[6.6, -2.4, -2.2]} rotation={[0, -0.72, 0]} accent="#57e6ff" />
      <GeometryCluster position={[-6.8, 2.4, -16]} accent="#c9a6ff" />
      <GeometryCluster position={[7.4, 3.2, -20]} accent="#5b8cff" count={3} />
    </ChapterGate>
  );
}