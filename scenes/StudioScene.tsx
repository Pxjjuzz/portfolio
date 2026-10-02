"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChapterGate, Backdrop, HoloPlane, useHoverTarget } from "@/components/world/primitives";
import { filmFrameTexture } from "@/lib/textures";
import { CREATIVE_WORK } from "@/data/creative";
import { CHAPTERS } from "@/data/chapters";
import { world } from "@/lib/world";
import { useQuality } from "@/lib/use-env";

function FilmFrame({
  index,
  position,
  accent,
  rotation = [0, 0, 0] as [number, number, number],
}: {
  index: number;
  position: [number, number, number];
  accent: string;
  rotation?: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => filmFrameTexture(index), [index]);
  const work = CREATIVE_WORK[index % CREATIVE_WORK.length];
  const worldPos = useMemo(() => new THREE.Vector3(...position), [position]);

  const { hovered, handlers } = useHoverTarget(
    { title: work.label, body: work.body, accent: work.accent },
    () => worldPos,
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = world.time * 0.3 + index * 1.4;
    g.position.y = position[1] + Math.sin(t) * 0.2;
    g.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.3;
    g.rotation.z = rotation[2] + Math.cos(t * 0.4) * 0.06;
    const scale = THREE.MathUtils.damp(g.scale.x, hovered ? 1.12 : 1, 7, Math.min(delta, 0.05));
    g.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={position} rotation={rotation} {...handlers}>
      <mesh>
        <planeGeometry args={[2.5, 1.4]} />
        <meshBasicMaterial map={texture} transparent opacity={0.95} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.66, 1.56]} />
        <meshBasicMaterial color={accent} transparent opacity={hovered ? 0.28 : 0.1} toneMapped={false} />
      </mesh>
      {[-0.86, -0.62, -0.38, 0.38, 0.62, 0.86].map((x) => (
        <mesh key={x} position={[x, 0.78, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.02]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function EditTimeline() {
  const playhead = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clips = useMemo(() => {
    let x = -9;
    const items: { x: number; width: number; accent: string }[] = [];
    for (let i = 0; i < 16; i += 1) {
      const width = 0.6 + (i % 4) * 0.35;
      items.push({ x: x + width / 2, width, accent: CREATIVE_WORK[i % CREATIVE_WORK.length].accent });
      x += width + 0.12;
    }
    return items;
  }, []);

  const barCount = 42;

  useFrame(() => {
    const head = playhead.current;
    if (head) head.position.x = -9 + ((world.time * 0.6) % 18);
    const wave = waveRef.current;
    if (!wave) return;
    for (let i = 0; i < barCount; i += 1) {
      const t = i / barCount;
      const envelope = Math.sin(t * Math.PI) * (0.6 + 0.4 * Math.sin(t * 24 + world.time * 2));
      dummy.position.set(-9 + t * 18, -2.25 + Math.abs(envelope) * 0.45, 0.6);
      dummy.scale.set(0.06, Math.abs(envelope) * 0.9 + 0.02, 0.06);
      dummy.updateMatrix();
      wave.setMatrixAt(i, dummy.matrix);
    }
    wave.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, -1.7, 0]}>
        <boxGeometry args={[18.4, 0.06, 0.9]} />
        <meshBasicMaterial color="#0b1020" transparent opacity={0.75} toneMapped={false} />
      </mesh>
      {clips.map((clip, index) => (
        <mesh key={index} position={[clip.x, -1.35, 0]}>
          <boxGeometry args={[clip.width, 0.62 + (index % 3) * 0.14, 0.08]} />
          <meshStandardMaterial
            color="#101a30"
            emissive={clip.accent}
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      ))}
      <mesh ref={playhead} position={[-9, -1.1, 0.2]}>
        <boxGeometry args={[0.035, 1.7, 0.035]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} toneMapped={false} />
      </mesh>
      <instancedMesh ref={waveRef} args={[undefined, undefined, barCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#57e6ff" transparent opacity={0.6} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Lens({ position, accent }: { position: [number, number, number]; accent: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.25;
    g.rotation.x = Math.sin(world.time * 0.3) * 0.25;
  });

  return (
    <group ref={group} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.72, 0.62, 0.5, 32]} />
        <meshStandardMaterial color="#0a0f1c" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.27]}>
        <sphereGeometry args={[0.52, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={accent}
          metalness={0.1}
          roughness={0.05}
          transmission={0.7}
          thickness={0.4}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 8, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function StudioScene() {
  const quality = useQuality();
  const anchor = CHAPTERS[3].anchor;

  return (
    <ChapterGate index={3} pad={1.55}>
      <group position={anchor}>
        <Backdrop color="#4a2a72" deep="#08060f" opacity={0.45} />
        <HoloPlane width={30} height={16} color="#a06bff" grid={0.4} opacity={0.28} position={[0, 0.5, -12]} />

        <EditTimeline />

        <FilmFrame index={0} accent="#ffb86b" position={[-4.6, 2.1, -4]} rotation={[0, 0.35, 0.02]} />
        <FilmFrame index={1} accent="#57e6ff" position={[4.4, 1.6, -6]} rotation={[0, -0.4, -0.02]} />
        <FilmFrame index={2} accent="#c9a6ff" position={[-3.4, -0.4, -9]} rotation={[0, 0.25, 0.05]} />
        <FilmFrame index={3} accent="#7cf5c4" position={[3.8, -0.8, -11]} rotation={[0, -0.3, -0.04]} />
        {quality.sceneDetail > 0.5 && (
          <FilmFrame index={4} accent="#a06bff" position={[0.6, 3.4, -14]} rotation={[0, 0.1, 0]} />
        )}

        <Lens position={[-6.4, -0.6, -2]} accent="#57e6ff" />
        <Lens position={[6.2, 2.9, -13]} accent="#c9a6ff" />

        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            position={[-2 + index * 2.4, 4.2, -7 - index * 2]}
            rotation={[Math.PI / 2 + index * 0.4, index * 0.7, 0]}
          >
            <torusGeometry args={[0.9 + index * 0.3, 0.014, 6, 64, Math.PI * 1.4]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#ffb86b" : "#57e6ff"}
              transparent
              opacity={0.45}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </ChapterGate>
  );
}