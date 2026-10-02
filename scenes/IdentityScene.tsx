"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop, HoloPlane, useHoverTarget } from "@/components/world/primitives";
import { orbFragment, orbVertex } from "@/lib/shaders";
import { DISCIPLINES, IDENTITY } from "@/data/personal";
import { CHAPTERS } from "@/data/chapters";
import { triggerEgg } from "@/lib/easter-eggs";
import { useWorldState } from "@/lib/store";
import { world } from "@/lib/world";
import { useQuality } from "@/lib/use-env";

function DisciplineNode({
  index,
  accent,
}: {
  index: number;
  accent: string;
}) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const discipline = DISCIPLINES[index];
  const { hoveredDiscipline } = useWorldState();
  const angle = (index / DISCIPLINES.length) * Math.PI * 2 + 0.35;
  const radius = 3.5;
  const base = useMemo(
    () => new THREE.Vector3(Math.cos(angle) * radius, Math.sin(index * 1.7) * 0.85, Math.sin(angle) * radius),
    [angle, index],
  );
  const worldPos = useMemo(() => base.clone(), [base]);

  const { hovered: pointerHovered, handlers } = useHoverTarget(
    { title: discipline.label, body: discipline.body, accent: discipline.accent },
    () => worldPos,
  );

  const hovered = pointerHovered || hoveredDiscipline === discipline.id;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = world.time * 0.35 + index;
    g.position.set(
      base.x,
      base.y + Math.sin(t) * 0.22,
      base.z + Math.cos(t * 0.8) * 0.18,
    );
    g.rotation.y += delta * (hovered ? 1.4 : 0.5);
    const scale = THREE.MathUtils.damp(g.scale.x, hovered ? 1.5 : 1, 8, Math.min(delta, 0.05));
    g.scale.setScalar(scale);
    worldPos.copy(g.position);

    if (halo.current) {
      const haloScale = THREE.MathUtils.damp(
        halo.current.scale.x,
        hovered ? 1.6 : 0.8,
        8,
        Math.min(delta, 0.05),
      );
      halo.current.scale.setScalar(haloScale);
      const material = halo.current.material as THREE.MeshBasicMaterial;
      material.opacity = hovered ? 0.85 : 0.25;
    }
  });

  return (
    <group ref={group}>
      <mesh {...handlers}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial
          color="#0d1428"
          emissive={accent}
          emissiveIntensity={hovered ? 2.4 : 0.9}
          metalness={0.8}
          roughness={0.18}
          wireframe
        />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.25} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight color={accent} intensity={hovered ? 3.4 : 0.7} distance={4.2} decay={2} />
    </group>
  );
}

export function IdentityScene() {
  const quality = useQuality();
  const core = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const anchor = CHAPTERS[1].anchor;
  const coreWorld = useMemo(() => new THREE.Vector3(anchor[0], anchor[1], anchor[2]), [anchor]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color("#5b8cff") },
      uColorB: { value: new THREE.Color("#57e6ff") },
    }),
    [],
  );

  const coreHover = useHoverTarget(
    {
      title: IDENTITY.first,
      body: `${IDENTITY.study} — ${IDENTITY.location}. Click for a joke.`,
      accent: "#5b8cff",
    },
    () => coreWorld,
  );

  useFrame((_, delta) => {
    const mesh = core.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.24;
    mesh.rotation.x = Math.sin(world.time * 0.25) * 0.12;
    const target = coreHover.hovered ? 1.35 : 1;
    const scale = THREE.MathUtils.damp(mesh.scale.x, target, 7, Math.min(delta, 0.05));
    mesh.scale.setScalar(scale);
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = world.time;
      materialRef.current.uniforms.uHover.value = coreHover.hovered ? 1 : 0;
    }
  });

  return (
    <ChapterGate index={1} pad={1.55}>
      <group position={anchor}>
        <Backdrop color="#1f3a7a" deep="#05070f" opacity={0.5} />
        <HoloPlane width={9} height={6} color="#5b8cff" grid={0.8} opacity={0.35} position={[0, 0, -3.2]} />
        <mesh
          ref={core}
          {...coreHover.handlers}
          onClick={() => triggerEgg("localhost")}
        >
          <icosahedronGeometry args={[0.95, 2]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={orbVertex}
            fragmentShader={orbFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {[0, 1, 2].map((ring) => (
          <mesh key={ring} rotation={[ring * 0.7, ring * 1.1, ring * 0.4]}>
            <torusGeometry args={[1.45 + ring * 0.28, 0.008, 6, 72]} />
            <meshBasicMaterial
              color={ring % 2 === 0 ? "#57e6ff" : "#a06bff"}
              transparent
              opacity={0.4 - ring * 0.08}
              toneMapped={false}
            />
          </mesh>
        ))}

        {DISCIPLINES.map((discipline, index) => (
          <DisciplineNode key={discipline.id} index={index} accent={discipline.accent} />
        ))}

        <pointLight position={[0, 1.6, 2]} intensity={quality.tier === "low" ? 6 : 10} color="#8fb4ff" distance={12} decay={2} />
      </group>
    </ChapterGate>
  );
}