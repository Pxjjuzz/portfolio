"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS } from "@/data/chapters";
import type { Project } from "@/data/projects";
import { labelTexture } from "@/lib/textures";
import { openProject } from "@/lib/navigation";
import { sound } from "@/lib/audio";
import { world } from "@/lib/world";
import { useWorldState } from "@/lib/store";
import { useHoverTarget } from "@/components/world/primitives";
import {
  ChatObject,
  GlobeObject,
  IotObject,
  JointObject,
  RfidObject,
  ScannerObject,
} from "@/components/projects/objects";

const OBJECT_MAP = {
  scanner: ScannerObject,
  joint: JointObject,
  rfid: RfidObject,
  globe: GlobeObject,
  iot: IotObject,
  chat: ChatObject,
} as const;

export function ProjectArtifact({ project }: { project: Project }) {
  const group = useRef<THREE.Group>(null);
  const labelMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const anchor = CHAPTERS[2].anchor;

  const position = useMemo<[number, number, number]>(
    () => [
      anchor[0] + project.position[0],
      anchor[1] + project.position[1],
      anchor[2] + project.position[2],
    ],
    [anchor, project.position],
  );

  const worldPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const texture = useMemo(
    () =>
      labelTexture(project.id, {
        code: `${project.code} · ${project.year}`,
        title: project.name,
        accent: project.accent,
        meta: project.tagline.toUpperCase(),
      }),
    [project],
  );

  const { hovered: pointerHovered, handlers } = useHoverTarget(
    {
      title: project.name,
      body: `${project.tagline} — click to step inside`,
      accent: project.accent,
    },
    () => worldPos,
  );

  const { hoveredProject } = useWorldState();
  const hovered = pointerHovered || hoveredProject === project.id;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = world.time * 0.4 + position[0];
    g.position.y = position[1] + Math.sin(t) * 0.14;
    g.rotation.y = Math.sin(t * 0.4) * 0.18 + world.pointer.x * 0.1;

    if (labelMaterial.current) {
      labelMaterial.current.opacity = THREE.MathUtils.damp(
        labelMaterial.current.opacity,
        hovered ? 1 : 0.32,
        7,
        Math.min(delta, 0.05),
      );
    }
    if (ring.current) {
      const material = ring.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + 0.5 * Math.sin(world.time * 1.4);
      material.opacity = 0.16 + pulse * (hovered ? 0.42 : 0.14);
      ring.current.rotation.z += delta * (hovered ? 0.6 : 0.12);
    }
  });

  const Body = OBJECT_MAP[project.object];

  return (
    <group
      ref={group}
      position={position}
      {...handlers}
      onClick={(event) => {
        event.stopPropagation();
        sound.play("select");
        openProject(project.id);
      }}
    >
      <Body color={project.accent} active={hovered} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <ringGeometry args={[0.85, 1.5, 64]} />
        <meshBasicMaterial
          color={project.accent}
          transparent
          opacity={0.24}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshBasicMaterial color={project.accent} transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.35, 0]}>
        <planeGeometry args={[2.9, 1.02]} />
        <meshBasicMaterial
          ref={labelMaterial}
          map={texture}
          transparent
          opacity={0.32}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}