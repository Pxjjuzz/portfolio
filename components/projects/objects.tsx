"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { holoVertex, scanFragment } from "@/lib/shaders";
import { globeTexture, screenTexture } from "@/lib/textures";
import { world } from "@/lib/world";

export function ScanPanel({
  width = 1.6,
  height = 2.4,
  color = "#7cf5c4",
  active = true,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}: {
  width?: number;
  height?: number;
  color?: string;
  active?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.85 },
      uProgress: { value: 0.5 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = active ? world.time : 0;
    material.uniforms.uProgress.value = active ? 0.5 + Math.sin(world.time * 0.6) * 0.45 : 0.2;
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={holoVertex}
        fragmentShader={scanFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function DogSilhouette({ color, active }: { color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = Math.sin(world.time * 0.4) * 0.3;
    g.position.y = Math.sin(world.time * 0.8) * 0.03;
    if (active) g.rotation.y += delta * 0.2;
  });

  const legs: [number, number, number][] = [
    [-0.18, -0.5, 0.24],
    [0.18, -0.5, 0.24],
    [-0.18, -0.5, -0.24],
    [0.18, -0.5, -0.24],
  ];

  return (
    <group ref={group} scale={0.62}>
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.28, 0.9, 6, 16]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, 0.16]}>
        <sphereGeometry args={[0.3, 20, 16]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[-0.19, 0.82, 0.1]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.12, 0.3, 12]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0.19, 0.82, 0.1]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.12, 0.3, 12]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.58, 0.36]}>
        <boxGeometry args={[0.16, 0.1, 0.34]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
      {legs.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.055, 0.05, 0.62, 10]} />
          <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, -0.52]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.05, 0.5, 8]} />
        <meshStandardMaterial color="#0c1424" emissive={color} emissiveIntensity={0.35} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function ScannerObject({ color, active }: { color: string; active: boolean }) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = ring.current;
    if (!mesh) return;
    const material = mesh.material as THREE.MeshBasicMaterial;
    const cycle = (world.time * (active ? 0.9 : 0.25)) % 1;
    mesh.scale.setScalar(0.7 + cycle * 1.5);
    material.opacity = (1 - cycle) * (active ? 0.55 : 0.2);
  });

  return (
    <group>
      <DogSilhouette color={color} active={active} />
      <ScanPanel width={2.6} height={2.6} color={color} active={active} position={[0, 0.2, 0.9]} />
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <ringGeometry args={[0.5, 0.56, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function JointObject({ color, active }: { color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const contact = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (g) g.rotation.y += delta * (active ? 0.45 : 0.12);
    const mesh = contact.current;
    if (mesh) {
      const material = mesh.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + 0.5 * Math.sin(world.time * (active ? 4.4 : 1.4));
      material.opacity = 0.25 + pulse * (active ? 0.6 : 0.2);
      mesh.scale.setScalar(1 + pulse * (active ? 0.14 : 0.03));
    }
  });

  const landmarks: [number, number, number][] = [
    [0, 2.3, 0.2],
    [0.55, 1.5, 0.3],
    [-0.5, 0.9, 0.25],
    [0, 0.2, 0.35],
    [0.4, -0.9, 0.2],
    [-0.35, -1.6, 0.25],
    [0, -2.2, 0.3],
  ];

  return (
    <group ref={group}>
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.15, 0.13, 1.5, 20]} />
        <meshStandardMaterial color="#dfe6ff" emissive={color} emissiveIntensity={0.18} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.2, 20, 16]} />
        <meshStandardMaterial color="#dfe6ff" emissive={color} emissiveIntensity={0.18} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.19, 0.15, 1.5, 20]} />
        <meshStandardMaterial color="#dfe6ff" emissive={color} emissiveIntensity={0.18} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 24, 20]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={color}
          emissiveIntensity={active ? 1.1 : 0.45}
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={contact} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.42, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {landmarks.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? "#57e6ff" : color}
            transparent
            opacity={active ? 0.95 : 0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function RfidObject({ color, active }: { color: string; active: boolean }) {
  const waves = useRef<THREE.Group>(null);
  const led = useRef<THREE.Mesh>(null);
  const dashboard = useMemo(
    () =>
      screenTexture("rfid", {
        title: "attendance.log",
        rows: ["#041 PRAJWAL  IN  09:04", "#042 AISHWARYA IN 09:06", "#043 ROHAN   OUT 09:11"],
        accent: color,
        bars: [0.7, 0.45, 0.9, 0.35],
      }),
    [color],
  );

  useFrame(() => {
    const group = waves.current;
    if (group) {
      const speed = active ? 1.6 : 0.5;
      for (const child of group.children) {
        const mesh = child as THREE.Mesh;
        const cycle = (world.time * speed + mesh.userData.offset) % 1;
        mesh.scale.setScalar(0.5 + cycle * 1.6);
        (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.6;
      }
    }
    if (led.current) {
      const material = led.current.material as THREE.MeshBasicMaterial;
      material.opacity = active ? 0.4 + Math.abs(Math.sin(world.time * 6)) * 0.6 : 0.3;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[0.9, 0.18, 0.7]} />
        <meshStandardMaterial color="#0a0f1c" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.5]} />
        <meshStandardMaterial color="#131b30" emissive={color} emissiveIntensity={0.25} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh ref={led} position={[0.3, 0.17, 0.18]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#ff5f7a" transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <group ref={waves} position={[0, 0.16, 0]}>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            userData={{ offset: index / 3 }}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.3, 0.34, 40]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.85, -1.4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.9, 1.35]} />
        <meshBasicMaterial map={dashboard} transparent opacity={0.95} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.4, -0.6]} rotation={[-0.5, 0, 0]}>
        <planeGeometry args={[0.5, 0.34]} />
        <meshStandardMaterial color="#e7ecff" emissive={color} emissiveIntensity={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function GlobeObject({ color, active }: { color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => globeTexture(color), [color]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * (active ? 0.28 : 0.08);
    if (clouds.current) clouds.current.rotation.y -= delta * 0.12;
  });

  return (
    <group scale={0.95}>
      <mesh>
        <sphereGeometry args={[1.15, 48, 32]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh ref={clouds} scale={1.045}>
        <sphereGeometry args={[1.15, 32, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.28 : 0.14}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[1.15, 32, 24]} />
        <meshBasicMaterial color="#8fb4ff" transparent opacity={0.12} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      {[0.4, 0.95, 1.5].map((radius, index) => (
        <mesh key={index} rotation={[1.1 + index * 0.3, index * 1.2, index * 0.6]}>
          <torusGeometry args={[radius, 0.008, 6, 64, Math.PI * 1.25]} />
          <meshBasicMaterial color={index === 1 ? "#57e6ff" : color} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
      <ScanPanel width={3} height={3} color={color} active={active} position={[0, 0, 0.9]} />
    </group>
  );
}

export function IotObject({ color, active }: { color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sensor = useRef<THREE.Mesh>(null);
  const alert = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (g) g.rotation.y = Math.sin(world.time * 0.3) * 0.25 + world.pointer.x * 0.2;
    if (sensor.current) {
      const material = sensor.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = active ? 0.9 + Math.abs(Math.sin(world.time * 3)) * 0.9 : 0.25;
    }
    if (alert.current) {
      for (const child of alert.current.children) {
        const mesh = child as THREE.Mesh;
        const cycle = ((world.time * (active ? 0.8 : 0.3)) + mesh.userData.offset) % 1;
        mesh.scale.setScalar(0.6 + cycle * 2.4);
        (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.55;
      }
    }
  });

  return (
    <group scale={1.05}>
      <mesh>
        <boxGeometry args={[0.8, 0.05, 1.1]} />
        <meshStandardMaterial color="#0a1424" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.05, 0]}>
        <boxGeometry args={[0.24, 0.06, 0.6]} />
        <meshStandardMaterial color="#0f1a2c" emissive="#57e6ff" emissiveIntensity={0.15} metalness={0.4} roughness={0.5} />
      </mesh>
      {[-0.32, -0.24, -0.16, 0.34, 0.26].map((x, index) => (
        <mesh key={index} position={[x, 0.06, -0.36]}>
          <boxGeometry args={[0.04, 0.16, 0.04]} />
          <meshStandardMaterial color="#c8b26a" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <mesh ref={sensor} position={[-0.2, 0.42, 0.24]}>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 18]} />
        <meshStandardMaterial color="#141c2c" emissive={color} emissiveIntensity={0.4} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[-0.2, 0.42, 0.24]}>
        <cylinderGeometry args={[0.12, 0.12, 0.62, 12]} />
        <meshStandardMaterial color="#0a0f18" wireframe metalness={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0.24, 0.12, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
        <meshStandardMaterial color="#1b2338" metalness={0.7} roughness={0.3} />
      </mesh>
      <ScanPanel width={1.9} height={1.2} color={color} active={active} position={[0, 0.95, -0.1]} rotation={[-0.2, 0, 0]} />
      <group ref={alert} position={[-0.2, 0.72, 0.24]}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} userData={{ offset: index / 3 }} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.36, 40]} />
            <meshBasicMaterial color="#ff8a5b" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function ChatObject({ color, active }: { color: string; active: boolean }) {
  const dots = useRef<THREE.Group>(null);
  const panel = useMemo(
    () =>
      screenTexture("aura", {
        title: "aura.assistant",
        rows: ["> context: 18 turns", "> tone: adaptive", "> latency: 240ms"],
        accent: color,
        bars: [0.9, 0.55, 0.8, 0.4, 0.68],
      }),
    [color],
  );

  useFrame(() => {
    const group = dots.current;
    if (!group) return;
    group.children.forEach((child, index) => {
      const offset = Math.sin(world.time * 3 + index * 0.7) * 0.06;
      child.position.y = offset;
      child.scale.setScalar(active ? 1 : 0.6);
    });
  });

  return (
    <group>
      <mesh>
        <planeGeometry args={[2.1, 1.5]} />
        <meshBasicMaterial map={panel} transparent opacity={0.96} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={dots} position={[-0.5, -0.45, 0.03]}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[index * 0.16, 0, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[1.32, 1.36, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}