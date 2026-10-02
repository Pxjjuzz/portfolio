"use client";

import { useSyncExternalStore } from "react";

export type Toast = {
  id: number;
  title: string;
  body?: string;
  tone: "info" | "warn" | "system";
};

let toasts: Toast[] = [];
let counter = 0;
const listeners = new Set<() => void>();
let removeTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

export function pushToast(title: string, body?: string, tone: Toast["tone"] = "system") {
  counter += 1;
  const toast: Toast = { id: counter, title, body, tone };
  toasts = [toast, ...toasts].slice(0, 3);
  emit();
  if (removeTimer) clearTimeout(removeTimer);
  removeTimer = setTimeout(() => {
    toasts = toasts.slice(1);
    emit();
  }, 4200);
}

export function clearToasts() {
  toasts = [];
  if (removeTimer) clearTimeout(removeTimer);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => toasts,
  );
}