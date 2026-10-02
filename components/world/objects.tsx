"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HoloPlane } from "@/components/world/primitives";
import { codeTexture, screenTexture } from "@/lib/textures";
import { orbFragment, orbVertex } from "@/lib/shaders";
import { world } from "@/lib/world";

function Brackets({
  width,
  height,
  color,
  length = 0.22,
  opacity = 0.85,
}: {
  width: number;
  height: number;
  color: string;
  length?: number;
  opacity?: number;
}) {
  const w = width / 2;
  const h = height / 2;
  const bars = useMemo(() => {
    const horizontal = [0.045, 0.045, length, 1];
    const items: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        items.push({
          position: [sx * (w - horizontal[2] / 2), sy * h, 0],
          scale: horizontal as [number, number, number],
        });
        items.push({
          position: [sx * w, sy * (h - horizontal[2] / 2), 0],
          scale: [horizontal[1], horizontal[0], length] as [number, number, number],
        });
      }
    }
    return items;
  }, [w, h, length]);

  return (
    <group>
      {bars.map((bar, index) => (
        <mesh key={index} position={bar.position}>
          <boxGeometry args={bar.scale} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingPanel({
  keyId,
  accent = "#5b8cff",
  width = 2.4,
  height = 1.5,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  float = 0.14,
  speed = 0.5,
  phase = 0,
  interactive = true,
  children,
}: {
  keyId: string;
  accent?: string;
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  float?: number;
  speed?: number;
  phase?: number;
  interactive?: boolean;
  children?: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => codeTexture(keyId, accent), [keyId, accent]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = world.time * speed + phase;
    g.position.y = position[1] + Math.sin(t) * float;
    g.rotation.y = rotation[1] + Math.sin(t * 0.6) * 0.08 + world.pointer.x * 0.16;
    g.rotation.x = rotation[0] + Math.cos(t * 0.5) * 0.05 - world.pointer.y * 0.1;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.95}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <HoloPlane width={width * 1.06} height={height * 1.12} color={accent} grid={0.5} opacity={0.22} />
      <Brackets width={width} height={height} color={accent} length={Math.min(width, height) * 0.18} />
      {children}
      {interactive && (
        <mesh position={[0, -height / 2 - 0.22, 0]}>
          <boxGeometry args={[0.02, 0.12, 0.02]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

export function RingAssembly({
  radius = 3.2,
  accent = "#5b8cff",
  accentB = "#a06bff",
  position = [0, 0.6, -6] as [number, number, number],
  rings = 3,
}: {
  radius?: number;
  accent?: string;
  accentB?: string;
  position?: [number, number, number];
  rings?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 0.9 },
      uColorA: { value: new THREE.Color(accent) },
      uColorB: { value: new THREE.Color(accentB) },
    }),
    [accent, accentB],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.06;
    g.rotation.z = Math.sin(world.time * 0.2) * 0.05;
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <group ref={group} position={position}>
      {Array.from({ length: rings }).map((_, index) => {
        const r = radius * (1 - index * 0.22);
        return (
          <mesh key={index} rotation={[index * 0.9, index * 0.6, index * 0.3]}>
            <torusGeometry args={[r, 0.012 + index * 0.004, 8, 96]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? accent : accentB}
              transparent
              opacity={0.55 - index * 0.12}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      <mesh>
        <icosahedronGeometry args={[radius * 0.62, 1]} />
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
    </group>
  );
}

export function Workstation({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  accent = "#57e6ff",
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  accent?: string;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useMemo(
    () =>
      screenTexture("workstation", {
        title: "train.py — prajwal",
        rows: ["> epoch 24 / 120", "> loss 0.0412 ↓", "> val_acc 0.918"],
        accent,
        bars: [0.82, 0.64, 0.91, 0.47, 0.73],
      }),
    [accent],
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.position.y = position[1] + Math.sin(world.time * 0.4) * 0.05;
    g.rotation.y = rotation[1] + world.pointer.x * 0.12;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.4, 0.1, 2]} />
        <meshStandardMaterial color="#0b0f1c" roughness={0.42} metalness={0.62} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[3.6, 1, 0.12]} />
        <meshStandardMaterial color="#070a14" roughness={0.6} metalness={0.3} />
      </mesh>

      <group position={[0, 1.02, -0.34]} rotation={[-0.12, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.5, 1.4, 0.07]} />
          <meshStandardMaterial color="#0a0e1a" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.32, 1.22]} />
          <meshBasicMaterial map={screen} transparent opacity={0.96} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.82, 0.12]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.34, 12]} />
          <meshStandardMaterial color="#141a2c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1, 0.24]}>
          <boxGeometry args={[0.7, 0.03, 0.28]} />
          <meshStandardMaterial color="#141a2c" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <mesh position={[-1.55, 0.14, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh position={[1.7, 0.16, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.012, 8, 32]} />
        <meshBasicMaterial color="#a06bff" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function GeometryCluster({
  position = [0, 0, 0] as [number, number, number],
  accent = "#c9a6ff",
  count = 5,
}: {
  position?: [number, number, number];
  accent?: string;
  count?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.05;
    g.rotation.x = Math.sin(world.time * 0.18) * 0.08;
  });

  return (
    <group ref={group} position={position}>
      {Array.from({ length: count }).map((_, index) => {
        const t = index / count;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(t * Math.PI * 2) * (1.1 + t * 0.6),
              Math.sin(t * Math.PI * 3) * 0.7,
              Math.sin(t * Math.PI * 2) * (1.1 + t * 0.6),
            ]}
            rotation={[t * 3, t * 5, t * 2]}
          >
            {index % 3 === 0 ? (
              <octahedronGeometry args={[0.22 + t * 0.1, 0]} />
            ) : index % 3 === 1 ? (
              <boxGeometry args={[0.3 + t * 0.1, 0.3 + t * 0.1, 0.3 + t * 0.1]} />
            ) : (
              <torusGeometry args={[0.24, 0.03, 8, 24]} />
            )}
            <meshStandardMaterial
              color="#121a33"
              emissive={accent}
              emissiveIntensity={0.35}
              metalness={0.75}
              roughness={0.24}
              wireframe={index % 2 === 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}