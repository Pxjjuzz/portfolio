"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { backdropFragment, holoFragment, holoVertex } from "@/lib/shaders";
import { sound } from "@/lib/audio";
import { tooltip } from "@/lib/tooltip";
import { world } from "@/lib/world";

export function ChapterGate({
  index,
  pad = 1.55,
  children,
}: {
  index: number;
  pad?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const distance = Math.abs(world.chapterFloat - index);
    const visible = distance < pad;
    if (group.visible !== visible) group.visible = visible;
    if (!visible) return;
    const closeness = 1 - Math.min(1, distance / pad);
    const target = 0.82 + closeness * 0.18;
    const next = THREE.MathUtils.damp(group.scale.x, target, 6, Math.min(delta, 0.05));
    group.scale.setScalar(next);
  });

  return <group ref={ref}>{children}</group>;
}

export function HoloPlane({
  width = 4,
  height = 2.4,
  color = "#5b8cff",
  grid = 1,
  opacity = 1,
  renderOrder = -1,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}: {
  width?: number;
  height?: number;
  color?: string;
  grid?: number;
  opacity?: number;
  renderOrder?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uGrid: { value: grid },
      uColor: { value: new THREE.Color(color) },
    }),
    [color, grid, opacity],
  );

  useFrame(() => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={holoVertex}
        fragmentShader={holoFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Backdrop({
  width = 120,
  height = 70,
  color = "#2a3f86",
  deep = "#04060d",
  opacity = 0.5,
}: {
  width?: number;
  height?: number;
  color?: string;
  deep?: string;
  opacity?: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
      uColorDeep: { value: new THREE.Color(deep) },
    }),
    [color, deep, opacity],
  );

  useFrame(() => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = world.time;
  });

  return (
    <mesh position={[0, 4, -26]} renderOrder={-2}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={holoVertex}
        fragmentShader={backdropFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function DataStreams({
  count = 30,
  length = 26,
  color = "#57e6ff",
  radius = 7,
  seed = 3,
}: {
  count?: number;
  length?: number;
  color?: string;
  radius?: number;
  seed?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const paths = useMemo(() => {
    const rand = (() => {
      let a = seed * 991;
      return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
    return Array.from({ length: Math.max(1, Math.floor(count / 5)) }, () => {
      const angle = rand() * Math.PI * 2;
      const x = Math.cos(angle) * radius * (0.5 + rand() * 0.7);
      const z = Math.sin(angle) * radius * (0.5 + rand() * 0.7);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, -length * 0.5, z),
        new THREE.Vector3(x * 1.15, 0, z * 1.15),
        new THREE.Vector3(x, length * 0.5, z),
      ]);
      return { curve, offset: rand(), speed: 0.04 + rand() * 0.08 };
    });
  }, [count, length, radius, seed]);

  const perStream = Math.max(2, Math.floor(count / paths.length));

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = world.time;
    let index = 0;
    for (const path of paths) {
      for (let i = 0; i < perStream; i += 1) {
        const t = (path.offset + (time * path.speed * perStream) / perStream + i / perStream) % 1;
        const point = path.curve.getPoint(t);
        dummy.position.copy(point);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        index += 1;
      }
    }
    mesh.count = index;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.max(1, paths.length * perStream)]}>
      <boxGeometry args={[0.03, 0.5, 0.03]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export type TooltipContent = { title: string; body: string; accent?: string };

export function useHoverTarget(content: TooltipContent, getPosition: () => THREE.Vector3) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const active = useRef(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!active.current) return;
    scratch.copy(getPosition()).project(camera);
    const x = (scratch.x * 0.5 + 0.5) * size.width;
    const y = (-scratch.y * 0.5 + 0.5) * size.height;
    tooltip.move(x, y);
  });

  const onPointerOver = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      active.current = true;
      setHovered(true);
      const coarse =
        typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
      if (!coarse) {
        tooltip.show(content);
        document.body.style.cursor = "pointer";
      }
      sound.play("hover");
    },
    [content],
  );

  const onPointerOut = useCallback(() => {
    active.current = false;
    setHovered(false);
    tooltip.hide();
    if (typeof document !== "undefined") document.body.style.cursor = "";
  }, []);

  return { hovered, handlers: { onPointerOver, onPointerOut } };
}