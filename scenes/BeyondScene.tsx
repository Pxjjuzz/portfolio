"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop, HoloPlane, useHoverTarget } from "@/components/world/primitives";
import { BEYOND } from "@/data/personal";
import { CHAPTERS } from "@/data/chapters";
import { orbFragment, orbVertex } from "@/lib/shaders";
import { world } from "@/lib/world";

function Glyph({ kind, color }: { kind: string; color: string }) {
  if (kind === "console") {
    return (
      <group>
        <mesh scale={[1.15, 0.42, 0.75]}>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
        </mesh>
        <mesh position={[0.22, 0.1, 0.2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.14, 12]} />
          <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
        </mesh>
        <mesh position={[-0.24, 0.02, 0.2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 4]} />
          <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
        </mesh>
      </group>
    );
  }
  if (kind === "timeline") {
    const bars: [number, number][] = [
      [0, 0.24],
      [0, 0.08],
      [0, -0.08],
      [0, -0.24],
    ];
    return (
      <group rotation={[0, 0, -0.35]}>
        {bars.map(([, y], index) => (
          <mesh key={index} position={[0, y, 0]}>
            <boxGeometry args={[0.9 - index * 0.12, 0.09, 0.09]} />
            <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
          </mesh>
        ))}
        <mesh position={[0.3, 0.12, 0.06]}>
          <boxGeometry args={[0.03, 1, 0.03]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (kind === "orb") {
    return (
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#0a1020" emissive={color} emissiveIntensity={1.2} metalness={0.3} roughness={0.2} wireframe />
      </mesh>
    );
  }
  if (kind === "tower") {
    const levels: [number, number, number][] = [
      [-0.16, 0.16, 0],
      [0.16, 0.46, 0],
      [-0.16, 0.76, 0],
    ];
    const sizes = [0.4, 0.34, 0.28];
    return (
      <group>
        {levels.map((position, index) => (
          <mesh key={index} position={position}>
            <boxGeometry args={[sizes[index], 0.28, sizes[index]]} />
            <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <group>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.46, 0.02, 8, 48]} />
        <meshStandardMaterial color="#0c1120" emissive={color} emissiveIntensity={0.5} metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0.46, 0.1, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PersonalityNode({ index, base }: { index: number; base: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const item = BEYOND[index];
  const worldPos = useMemo(() => new THREE.Vector3(...base), [base]);

  const { hovered, handlers } = useHoverTarget(
    { title: item.label, body: `${item.body} — ${item.stat}`, accent: item.accent },
    () => worldPos,
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = world.time * 0.45 + index * 1.9;
    g.position.y = base[1] + Math.sin(t) * 0.16;
    g.rotation.y += delta * (hovered ? 1.1 : 0.4);
    const scale = THREE.MathUtils.damp(g.scale.x, hovered ? 1.35 : 1, 8, Math.min(delta, 0.05));
    g.scale.setScalar(scale);
    worldPos.copy(g.position);
  });

  return (
    <group ref={group} position={base} {...handlers}>
      <Glyph kind={item.glyph} color={item.accent} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <ringGeometry args={[0.5, 0.56, 40]} />
        <meshBasicMaterial
          color={item.accent}
          transparent
          opacity={hovered ? 0.8 : 0.24}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={item.accent} intensity={hovered ? 2.4 : 0.5} distance={3.6} decay={2} />
    </group>
  );
}

export function BeyondScene() {
  const anchor = CHAPTERS[4].anchor;
  const core = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 0.85 },
      uColorA: { value: new THREE.Color("#c9a6ff") },
      uColorB: { value: new THREE.Color("#57e6ff") },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (core.current) {
      core.current.rotation.y -= delta * 0.18;
      core.current.rotation.x = Math.sin(world.time * 0.2) * 0.14;
    }
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <ChapterGate index={4} pad={1.55}>
      <group position={anchor}>
        <Backdrop color="#3a2b6e" deep="#05060f" opacity={0.4} />
        <HoloPlane width={26} height={15} color="#a06bff" grid={0.45} opacity={0.26} position={[0, 0.6, -14]} />

        <mesh ref={core} position={[0, 0.5, -7]} scale={1.5}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={orbVertex}
            fragmentShader={orbFragment}
            uniforms={uniforms}
            transparent
            wireframe
            depthWrite={false}
          />
        </mesh>

        {BEYOND.map((item, index) => {
          const angle = (index / BEYOND.length) * Math.PI * 2 + 0.6;
          return (
            <PersonalityNode
              key={item.id}
              index={index}
              base={[Math.cos(angle) * 4.6, Math.sin(angle * 1.7) * 0.9, Math.sin(angle) * 4.6 - 5]}
            />
          );
        })}
      </group>
    </ChapterGate>
  );
}