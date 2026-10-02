"use client";

import * as THREE from "three";
import { CHAPTERS } from "@/data/chapters";
import { projectById } from "@/data/projects";
import { setWorldState } from "@/lib/store";
import { world } from "@/lib/world";

export type WorldNavApi = {
  scrollToProgress: (progress: number, immediate?: boolean) => void;
  scrollToChapter: (index: number) => void;
  scrollToTop: () => void;
  stop: () => void;
  start: () => void;
};

let api: WorldNavApi | null = null;

export const worldNav = {
  register(next: WorldNavApi | null) {
    api = next;
  },
  scrollToProgress(progress: number, immediate = false) {
    api?.scrollToProgress(progress, immediate);
  },
  scrollToChapter(index: number) {
    api?.scrollToChapter(index);
  },
  scrollToTop() {
    api?.scrollToTop();
  },
  stopScroll() {
    api?.stop();
  },
  startScroll() {
    api?.start();
  },
};

export function worldPositionFor(id: string): THREE.Vector3 | null {
  const project = projectById(id);
  if (!project) return null;
  const museum = CHAPTERS[2];
  return new THREE.Vector3(
    museum.anchor[0] + project.position[0],
    museum.anchor[1] + project.position[1],
    museum.anchor[2] + project.position[2],
  );
}

export function openProject(id: string) {
  const target = worldPositionFor(id);
  const project = projectById(id);
  if (!target || !project) return;
  const scale = Math.max(project.scale, 0.8);
  world.focus = {
    id,
    position: target.clone().add(new THREE.Vector3(0, 0.55 + scale * 0.3, 5.2 + scale * 2.4)),
    look: target.clone(),
    fov: 40,
  };
  api?.stop();
  setWorldState({ activeProject: id, menuOpen: false });
}

export function closeProject() {
  world.focus = null;
  setWorldState({ activeProject: null });
  window.setTimeout(() => api?.start(), 240);
}