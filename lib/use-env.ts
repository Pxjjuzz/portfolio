"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getQuality, type QualitySettings, type Tier } from "@/lib/quality";
import { useWorldState } from "@/lib/store";

export function useQuality(): QualitySettings {
  const { tier } = useWorldState();
  return useMemo(() => getQuality((tier as Tier) ?? "medium"), [tier]);
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}