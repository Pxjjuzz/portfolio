"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { world } from "@/lib/world";

export function useBob(
  ref: React.RefObject<THREE.Object3D | null>,
  amplitude = 0.12,
  speed = 0.6,
  phase = 0,
  enabled = true,
) {
  useFrame(() => {
    const object = ref.current;
    if (!object) return;
    const t = enabled ? world.time * speed + phase : phase;
    object.position.y = object.position.y * 0.0 + (object.userData.baseY ?? 0) + Math.sin(t) * amplitude;
  });
}

export function useSpin(
  ref: React.RefObject<THREE.Object3D | null>,
  speed = 0.2,
  axis: "x" | "y" | "z" = "y",
  enabled = true,
) {
  useFrame((_, delta) => {
    const object = ref.current;
    if (!object || !enabled) return;
    object.rotation[axis] += delta * speed;
  });
}

export function usePointerParallax(
  ref: React.RefObject<THREE.Object3D | null>,
  strength = 0.35,
  base?: [number, number, number],
) {
  const basePos = useRef<[number, number, number]>(base ?? [0, 0, 0]);

  useEffect(() => {
    if (base) basePos.current = base;
  }, [base]);

  useFrame(() => {
    const object = ref.current;
    if (!object) return;
    object.rotation.y = world.pointer.x * strength;
    object.rotation.x = -world.pointer.y * strength * 0.6;
  });

  return basePos;
}