"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { world } from "@/lib/world";
import type { QualitySettings } from "@/lib/quality";

function CameraLights({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.position.set(
      world.pointer.x * 3.2,
      1.4 + world.pointer.y * 2,
      0,
    );
  });

  return (
    <group ref={group}>
      <pointLight position={[4, 3, 6]} intensity={reducedMotion ? 12 : 22} color="#7f9dff" distance={38} decay={2} />
      <pointLight position={[-5, -1, 4]} intensity={reducedMotion ? 8 : 16} color="#a06bff" distance={32} decay={2} />
      <pointLight position={[0, 5, -8]} intensity={reducedMotion ? 6 : 11} color="#57e6ff" distance={30} decay={2} />
    </group>
  );
}

export function Atmosphere({
  quality,
  reducedMotion,
}: {
  quality: QualitySettings;
  reducedMotion: boolean;
}) {
  const lightformerPositions = useMemo(
    () =>
      [
        { position: [0, 6, -10] as [number, number, number], scale: [12, 6, 1] as [number, number, number], color: "#9fb8ff", intensity: 2.2 },
        { position: [-9, -2, 4] as [number, number, number], scale: [8, 8, 1] as [number, number, number], color: "#5b3f9e", intensity: 1.6 },
        { position: [8, 3, 6] as [number, number, number], scale: [6, 6, 1] as [number, number, number], color: "#1c4f6b", intensity: 1.2 },
      ] as const,
    [],
  );

  return (
    <>
      <ambientLight intensity={0.42} color="#8f9ad6" />
      <directionalLight position={[7, 11, 9]} intensity={0.6} color="#cfd9ff" />
      <directionalLight position={[-8, -4, -6]} intensity={0.25} color="#a06bff" />
      <CameraLights reducedMotion={reducedMotion} />
      {quality.environment && (
        <Environment resolution={quality.envResolution} frames={1}>
          {lightformerPositions.map((form, index) => (
            <Lightformer
              key={index}
              form="rect"
              intensity={form.intensity}
              color={form.color}
              position={form.position}
              scale={form.scale}
            />
          ))}
        </Environment>
      )}
    </>
  );
}