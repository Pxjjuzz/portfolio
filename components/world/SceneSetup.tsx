"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS } from "@/data/chapters";
import { samplePath } from "@/lib/chapter-path";
import { getWorldState, setWorldState } from "@/lib/store";
import { damp, lerp } from "@/lib/math";
import { world } from "@/lib/world";

export const TONE_COLOR: Record<string, string> = {
  deep: "#04060d",
  lab: "#060a18",
  studio: "#080611",
  void: "#010206",
};

const COMPACT_QUERY = "(max-width: 820px), (pointer: coarse)";

function isCompactViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COMPACT_QUERY).matches;
}

export function SceneSetup({ reducedMotion }: { reducedMotion: boolean }) {
  const scene = useThree((state) => state.scene);
  const fog = useMemo(() => new THREE.FogExp2("#04060d", 0.02), []);
  const colorFrom = useMemo(() => new THREE.Color(), []);
  const colorTo = useMemo(() => new THREE.Color(), []);
  const colorNow = useMemo(() => new THREE.Color(TONE_COLOR.deep), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.25);
    const dtRaw = dt;
    world.time += dtRaw;

    world.progress = damp(world.progress, world.targetProgress, reducedMotion ? 20 : 4.6, dtRaw);

    const sample = samplePath(world.progress);
    world.chapterFloat = sample.index + sample.eased;
    world.local = sample.local;
    world.chapter = Math.min(CHAPTERS.length - 1, sample.index + (sample.local > 0.5 ? 1 : 0));
    if (getWorldState().chapter !== world.chapter) setWorldState({ chapter: world.chapter });

    world.pointerSpeed = damp(world.pointerSpeed, world.pointer.distanceTo(world.pointerRaw) * 9, 6, dt);
    world.pointer.x = damp(world.pointer.x, world.pointerRaw.x, 3.4, dt);
    world.pointer.y = damp(world.pointer.y, world.pointerRaw.y, 3.4, dt);
    world.intro = damp(world.intro, 1, reducedMotion ? 8 : 1.15, dt);

    const from = CHAPTERS[sample.index];
    const to = sample.to;
    colorFrom.set(TONE_COLOR[from.tone]);
    colorTo.set(TONE_COLOR[to.tone]);
    colorNow.lerpColors(colorFrom, colorTo, sample.eased);
    fog.color.copy(colorNow);
    fog.density = lerp(from.fog, to.fog, sample.eased) * (reducedMotion ? 0.65 : 1);
    scene.background = colorNow;
  });

  return null;
}

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const clock = useThree((state) => state.clock);

  const scratch = useMemo(() => {
    const camA = new THREE.Vector3();
    const camB = new THREE.Vector3();
    const lookA = new THREE.Vector3();
    const lookB = new THREE.Vector3();
    return {
      camA,
      camB,
      lookA,
      lookB,
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      cur: new THREE.Vector3(0, 2.6, 24),
      curLook: new THREE.Vector3(0, 0.6, 0),
    };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.2);
    const sample = samplePath(world.progress);
    const { from, to } = sample;
    const t = sample.eased;

    scratch.camA.set(...from.cam);
    scratch.camB.set(...to.cam);
    scratch.lookA.set(...from.look);
    scratch.lookB.set(...to.look);

    scratch.pos.copy(scratch.camA).lerp(scratch.camB, t);
    scratch.look.copy(scratch.lookA).lerp(scratch.lookB, t);

    const time = clock.elapsedTime;
    if (!reducedMotion) {
      const drift = Math.min(1, world.progress * 3);
      scratch.pos.x += Math.sin(time * 0.14) * 0.3 * drift + world.pointer.x * 1.2;
      scratch.pos.y += Math.sin(time * 0.19) * 0.18 * drift + world.pointer.y * 0.65;
      scratch.pos.z += Math.sin(time * 0.09) * 0.55 * drift;
      scratch.look.x += world.pointer.x * 0.55;
      scratch.look.y += world.pointer.y * 0.32;
    }

    const introGap = 1 - world.intro;
    if (introGap > 0.001) {
      const eased = Math.pow(introGap, 2.2);
      scratch.pos.z += eased * 14;
      scratch.pos.y += eased * 2.8;
      scratch.pos.x += eased * 3.6;
      scratch.look.z -= eased * 2;
    }

    const focus = world.focus;
    if (focus) {
      const blend = 1 - Math.exp(-(reducedMotion ? 30 : 2.8) * dt);
      scratch.pos.lerp(focus.position, blend);
      scratch.look.lerp(focus.look, blend);
    }

    const lambda = focus ? 3.4 : reducedMotion ? 24 : 4.4;
    scratch.cur.lerp(scratch.pos, 1 - Math.exp(-lambda * dt));
    scratch.curLook.lerp(scratch.look, 1 - Math.exp(-lambda * dt));

    camera.position.copy(scratch.cur);
    camera.lookAt(scratch.curLook);

    const targetFov = (focus ? focus.fov : lerp(from.fov, to.fov, t)) *
      (isCompactViewport() ? 1.42 : 1);
    const nextFov = damp(camera.fov, targetFov, 3, dt);
    if (Math.abs(nextFov - camera.fov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}