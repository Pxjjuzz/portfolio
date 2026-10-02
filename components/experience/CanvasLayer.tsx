"use client";

import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { World } from "@/components/world/World";
import { useQuality } from "@/lib/use-env";

function DprGuard({ max }: { max: number }) {
  const setDpr = useThree((state) => state.setDpr);
  return (
    <PerformanceMonitor
      factor={1}
      flipflops={3}
      onChange={({ factor }) => setDpr(Math.max(1, Math.min(max, Number((1 + factor * (max - 1)).toFixed(2)))))}
      onFallback={() => setDpr(1)}
    />
  );
}

export default function CanvasLayer({ reducedMotion }: { reducedMotion: boolean }) {
  const quality = useQuality();

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={quality.dpr}
        camera={{ fov: 46, near: 0.1, far: 420, position: [0, 2.6, 24] }}
        gl={{
          antialias: quality.tier !== "low",
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <Suspense fallback={null}>
          <World reducedMotion={reducedMotion} />
        </Suspense>
        <DprGuard max={quality.dpr[1]} />
      </Canvas>
    </div>
  );
}