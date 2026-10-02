"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop } from "@/components/world/primitives";
import { ParticleField } from "@/components/world/ParticleField";
import { CHAPTERS } from "@/data/chapters";
import { orbFragment, orbVertex } from "@/lib/shaders";
import { world } from "@/lib/world";
import { useQuality } from "@/lib/use-env";

export function ContactScene() {
  const quality = useQuality();
  const anchor = CHAPTERS[8].anchor;
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const shellRef = useRef<THREE.MeshBasicMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0.35 },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color("#8fb4ff") },
      uColorB: { value: new THREE.Color("#c9a6ff") },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (core.current) {
      core.current.rotation.y += delta * 0.14;
      core.current.rotation.x += delta * 0.06;
      const pulse = 1 + Math.sin(world.time * 1.2) * 0.05;
      core.current.scale.setScalar(pulse);
    }
    if (shellRef.current) {
      shellRef.current.opacity = 0.14 + Math.abs(Math.sin(world.time * 0.6)) * 0.1;
    }
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <ChapterGate index={8} pad={1.7}>
      <group position={anchor}>
        <Backdrop color="#243a72" deep="#010206" opacity={0.28} width={160} height={90} />
        <mesh>
          <icosahedronGeometry args={[1.5, 3]} />
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
        <mesh ref={shell} scale={1.5}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial
            ref={shellRef}
            color="#8fb4ff"
            wireframe
            transparent
            opacity={0.18}
            toneMapped={false}
          />
        </mesh>
        {[1.9, 2.6, 3.4].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2 + index * 0.5, index * 1.2, index * 0.3]}>
            <torusGeometry args={[radius, 0.006, 6, 96]} />
            <meshBasicMaterial color="#57e6ff" transparent opacity={0.28 - index * 0.06} toneMapped={false} />
          </mesh>
        ))}
        <pointLight position={[0, 0.4, 2]} intensity={quality.tier === "low" ? 10 : 16} color="#9fb8ff" distance={18} decay={2} />
      </group>
      <ParticleField
        count={Math.round(quality.particles * 0.45)}
        seed={91}
        spread={22}
        height={14}
        zStart={anchor[2] + 10}
        zEnd={anchor[2] - 12}
        colorA="#8fb4ff"
        colorB="#c9a6ff"
        opacity={0.7}
        sizeScale={0.9}
      />
    </ChapterGate>
  );
}