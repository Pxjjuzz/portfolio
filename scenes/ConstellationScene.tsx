"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { ChapterGate, Backdrop, useHoverTarget } from "@/components/world/primitives";
import { SKILLS } from "@/data/skills";
import { CHAPTERS } from "@/data/chapters";
import { projectById } from "@/data/projects";
import { orbFragment, orbVertex } from "@/lib/shaders";
import { world } from "@/lib/world";

function skillPosition(skill: (typeof SKILLS)[number]) {
  const angle = (skill.angle * Math.PI) / 180;
  return [
    Math.cos(angle) * skill.radius,
    skill.y,
    Math.sin(angle) * skill.radius,
  ] as [number, number, number];
}

function SkillNode({ skill }: { skill: (typeof SKILLS)[number] }) {
  const group = useRef<THREE.Group>(null);
  const base = useMemo(() => skillPosition(skill), [skill]);
  const worldPos = useMemo(() => new THREE.Vector3(...base), [base]);
  const project = projectById(skill.project ?? null);

  const { hovered, handlers } = useHoverTarget(
    {
      title: skill.name,
      body: `${skill.context}${project ? ` → ${project.name}` : ""}`,
      accent: skill.accent,
    },
    () => worldPos,
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime * 0.35 + skill.angle * 0.02;
    g.position.set(
      base[0] * (1 + Math.sin(t) * 0.02),
      base[1] + Math.sin(t) * 0.28,
      base[2] * (1 + Math.cos(t * 0.8) * 0.02),
    );
    const scale = THREE.MathUtils.damp(g.scale.x, hovered ? 1.7 : 1, 9, Math.min(delta, 0.05));
    g.scale.setScalar(scale);
    worldPos.copy(g.position);
    void world.time;
  });

  return (
    <group ref={group} position={base} {...handlers}>
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          color="#0a0f1e"
          emissive={skill.accent}
          emissiveIntensity={hovered ? 3 : 1.1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.21, 32]} />
        <meshBasicMaterial
          color={skill.accent}
          transparent
          opacity={hovered ? 0.9 : 0.3}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function ConstellationScene() {
  const anchor = CHAPTERS[5].anchor;
  const core = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color("#57e6ff") },
      uColorB: { value: new THREE.Color("#a06bff") },
    }),
    [],
  );

  const lines = useMemo(
    () =>
      SKILLS.map((skill) => ({
        color: skill.accent,
        points: [
          [0, 0, 0] as [number, number, number],
          skillPosition(skill),
        ],
      })),
    [],
  );

  useFrame((_, delta) => {
    const mesh = core.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.2;
    const pulse = 1 + Math.sin(world.time * 1.6) * 0.04;
    mesh.scale.setScalar(pulse);
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <ChapterGate index={5} pad={1.55}>
      <group position={anchor}>
        <Backdrop color="#1c3f7a" deep="#05070f" opacity={0.42} />
        <mesh ref={core}>
          <icosahedronGeometry args={[0.62, 2]} />
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
        {[1, 2].map((index) => (
          <mesh key={index} rotation={[index * 0.8, index * 1.4, 0]}>
            <torusGeometry args={[1 + index * 0.5, 0.008, 6, 64]} />
            <meshBasicMaterial color="#57e6ff" transparent opacity={0.32} toneMapped={false} />
          </mesh>
        ))}
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            color={line.color}
            transparent
            opacity={0.16}
            lineWidth={0.7}
          />
        ))}
        {SKILLS.map((skill) => (
          <SkillNode key={skill.id} skill={skill} />
        ))}
        <pointLight position={[0, 1.4, 2]} intensity={8} color="#8fb4ff" distance={14} decay={2} />
      </group>
    </ChapterGate>
  );
}