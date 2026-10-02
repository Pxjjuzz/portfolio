"use client";

import { useSyncExternalStore } from "react";

export type Phase = "boot" | "live";

export type WorldState = {
  phase: Phase;
  chapter: number;
  activeProject: string | null;
  menuOpen: boolean;
  soundOn: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  tier: string;
  hoveredProject: string | null;
  hoveredDiscipline: string | null;
};

const initial: WorldState = {
  phase: "boot",
  chapter: 0,
  activeProject: null,
  menuOpen: false,
  soundOn: false,
  reducedMotion: false,
  webgl: true,
  tier: "medium",
  hoveredProject: null,
  hoveredDiscipline: null,
};

let state: WorldState = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setWorldState(patch: Partial<WorldState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof WorldState)[]) {
    if (state[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useWorldState(): WorldState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}

export function getWorldState() {
  return state;
}