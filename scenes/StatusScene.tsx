"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop, HoloPlane, useHoverTarget } from "@/components/world/primitives";
import { screenTexture } from "@/lib/textures";
import { triggerEgg } from "@/lib/easter-eggs";
import { CHAPTERS } from "@/data/chapters";
import { STATUS_LINES } from "@/data/personal";
import { world } from "@/lib/world";

export function StatusScene() {
  const anchor = CHAPTERS[6].anchor;
  const ring = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const beaconLight = useRef<THREE.PointLight>(null);

  const mainScreen = useMemo(
    () =>
      screenTexture("status", {
        title: "prajwal.os — telemetry",
        rows: STATUS_LINES.map((line) => `${line.label.padEnd(18, " ")} ${line.value}`),
        accent: "#57e6ff",
        bars: [0.92, 0.74, 0.88, 0.51, 0.96, 0.12],
      }),
    [],
  );

  const sideScreen = useMemo(
    () =>
      screenTexture("status-side", {
        title: "core",
        rows: ["AI/ML STUDENT  ONLINE", "LEARNING        ACTIVE", "SLEEP           ERROR"],
        accent: "#a06bff",
        bars: [0.6, 0.85, 0.3],
      }),
    [],
  );

  const beaconPos = useMemo(() => new THREE.Vector3(anchor[0] + 1.9, anchor[1] + 1.35, anchor[2] + 1.1), [anchor]);
  const { handlers } = useHoverTarget(
    {
      title: "SLEEP",
      body: "Module not found. Click for the official response.",
      accent: "#ff8a5b",
    },
    () => beaconPos,
  );

  useFrame((_, delta) => {
    const group = ring.current;
    if (group) group.rotation.z += delta * 0.18;
    const blink = Math.abs(Math.sin(world.time * 2.4));
    if (beacon.current) {
      const material = beacon.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.25 + blink * 0.75;
      beacon.current.scale.setScalar(0.9 + blink * 0.25);
    }
    if (beaconLight.current) beaconLight.current.intensity = 2 + blink * 8;
  });

  return (
    <ChapterGate index={6} pad={1.5}>
      <group position={anchor}>
        <Backdrop color="#14355f" deep="#04060d" opacity={0.4} />
        <HoloPlane width={13} height={7} color="#57e6ff" grid={0.9} opacity={0.24} position={[0, 0.2, -4]} />

        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[6.4, 4.5]} />
          <meshBasicMaterial map={mainScreen} transparent opacity={0.97} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.3, -0.02]}>
          <planeGeometry args={[7, 5.1]} />
          <meshBasicMaterial color="#57e6ff" transparent opacity={0.1} toneMapped={false} />
        </mesh>

        <group position={[-4.6, -0.2, -1.6]} rotation={[0, 0.7, 0]}>
          <mesh>
            <planeGeometry args={[2.6, 1.9]} />
            <meshBasicMaterial map={sideScreen} transparent opacity={0.95} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
        <group position={[4.8, 1.6, -2.4]} rotation={[0, -0.7, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 1.6]} />
            <meshBasicMaterial color="#0a1020" transparent opacity={0.6} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <HoloPlane width={2.4} height={1.8} color="#a06bff" grid={1.2} opacity={0.4} />
        </group>

        <group ref={ring} position={[0, 0.3, 1.2]}>
          {[0, 1, 2].map((index) => (
            <mesh key={index} rotation={[index * 0.6, index * 1.1, index * 0.3]}>
              <torusGeometry args={[3.6 + index * 0.5, 0.008, 6, 96, Math.PI * 1.1]} />
              <meshBasicMaterial color={index === 1 ? "#a06bff" : "#57e6ff"} transparent opacity={0.3} toneMapped={false} />
            </mesh>
          ))}
        </group>

        <group position={[1.9, 1.35, 1.1]}>
          <mesh ref={beacon} {...handlers} onClick={() => triggerEgg("sleep")}>
            <sphereGeometry args={[0.16, 20, 16]} />
            <meshBasicMaterial color="#ff8a5b" transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
            <ringGeometry args={[0.3, 0.34, 32]} />
            <meshBasicMaterial color="#ff8a5b" transparent opacity={0.4} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <pointLight ref={beaconLight} color="#ff8a5b" intensity={4} distance={6} decay={2} />
        </group>

        <pointLight position={[0, 2.6, 3]} intensity={7} color="#8fb4ff" distance={14} decay={2} />
      </group>
    </ChapterGate>
  );
}