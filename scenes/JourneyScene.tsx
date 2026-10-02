"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop, useHoverTarget } from "@/components/world/primitives";
import { MILESTONES } from "@/data/journey";
import { CHAPTERS } from "@/data/chapters";
import { labelTexture } from "@/lib/textures";
import { world } from "@/lib/world";

function Trail() {
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i += 1) {
      const t = i / 60;
      const z = 8 - t * 20;
      points.push(new THREE.Vector3(Math.sin(t * 6.2) * 1.6, Math.cos(t * 4.1) * 0.6 - 0.4, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const bead = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = bead.current;
    if (!mesh) return;
    const t = (world.time * 0.05) % 1;
    mesh.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 90, 0.028, 8, false]} />
        <meshBasicMaterial color="#57e6ff" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={bead}>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function MilestoneMarker({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const marker = MILESTONES[index];
  const anchor = CHAPTERS[7].anchor;
  const base = useMemo<[number, number, number]>(
    () => [anchor[0] + marker.side * 2.6, anchor[1] + marker.y, anchor[2] + marker.z],
    [anchor, marker],
  );
  const worldPos = useMemo(() => new THREE.Vector3(...base), [base]);
  const texture = useMemo(
    () =>
      labelTexture(marker.id, {
        code: marker.year,
        title: marker.title,
        accent: marker.accent,
      }),
    [marker],
  );

  const { hovered, handlers } = useHoverTarget(
    { title: `${marker.year} — ${marker.title}`, body: marker.body, accent: marker.accent },
    () => worldPos,
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.5;
    const scale = THREE.MathUtils.damp(g.scale.x, hovered ? 1.25 : 1, 8, Math.min(delta, 0.05));
    g.scale.setScalar(scale);
    void world.time;
  });

  return (
    <group position={base} {...handlers}>
      <mesh>
        <octahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color="#0a1020"
          emissive={marker.accent}
          emissiveIntensity={hovered ? 2.4 : 1}
          metalness={0.7}
          roughness={0.2}
          wireframe
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.54, 32]} />
        <meshBasicMaterial
          color={marker.accent}
          transparent
          opacity={hovered ? 0.9 : 0.3}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[marker.side * 1.9, -0.3, 0]}>
        <planeGeometry args={[2.3, 0.8]} />
        <meshBasicMaterial map={texture} transparent opacity={0.85} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color={marker.accent} intensity={hovered ? 3 : 0.6} distance={4.4} decay={2} />
    </group>
  );
}

export function JourneyScene() {
  const anchor = CHAPTERS[7].anchor;

  return (
    <ChapterGate index={7} pad={1.6}>
      <group position={anchor}>
        <Backdrop color="#20437e" deep="#04060d" opacity={0.4} />
        <Trail />
        {MILESTONES.map((milestone, index) => (
          <MilestoneMarker key={milestone.id} index={index} />
        ))}
        <pointLight position={[0, 3, 2]} intensity={6} color="#8fb4ff" distance={16} decay={2} />
      </group>
    </ChapterGate>
  );
}