"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleFragment, particleVertex } from "@/lib/shaders";
import { world } from "@/lib/world";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleField({
  count,
  reducedMotion = false,
  seed = 7,
  spread = 34,
  height = 24,
  zStart = 24,
  zEnd = -320,
  colorA = "#8fb4ff",
  colorB = "#c9a6ff",
  opacity = 0.85,
  sizeScale = 1,
}: {
  count: number;
  reducedMotion?: boolean;
  seed?: number;
  spread?: number;
  height?: number;
  zStart?: number;
  zEnd?: number;
  colorA?: string;
  colorB?: string;
  opacity?: number;
  sizeScale?: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(seed);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const tints = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const bias = rand();
      const x = (bias - 0.5) * spread * (0.35 + rand() * 0.85);
      const y = (rand() - 0.5) * height;
      const z = zStart + (zEnd - zStart) * t;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      seeds[i] = rand();
      sizes[i] = (0.4 + rand() * 1.6) * sizeScale;
      tints[i] = rand();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, (zStart + zEnd) / 2), 400);
    return geo;
  }, [count, seed, spread, height, zStart, zEnd, sizeScale]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2) },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: opacity },
    }),
    [colorA, colorB, opacity],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = reducedMotion ? 0 : world.time;
    material.uniforms.uPointer.value.set(world.pointer.x, world.pointer.y);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}