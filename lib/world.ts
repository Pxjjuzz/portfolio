"use client";

import * as THREE from "three";

export type WorldFocus = {
  id: string;
  position: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
};

export const world = {
  progress: 0,
  targetProgress: 0,
  chapterFloat: 0,
  chapter: 0,
  local: 0,
  velocity: 0,
  time: 0,
  pointer: new THREE.Vector2(0, 0),
  pointerRaw: new THREE.Vector2(0, 0),
  pointerSpeed: 0,
  intro: 0,
  focus: null as WorldFocus | null,
  ready: false,
};

export function setPointer(x: number, y: number) {
  world.pointerRaw.set(x, y);
}