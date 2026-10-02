"use client";

import { EASTER_EGG_KEYS } from "@/data/site";
import { pushToast } from "@/lib/toast";

const KEY_BUFFER_LIMIT = 48;

let buffer = "";

export const EGGS = {
  sudo: {
    title: "ROOT ACCESS GRANTED",
    body: "sudo pra[j]wal accepted. Privilege escalated: you now have full read access to the builder.",
    tone: "system" as const,
  },
  localhost: {
    title: "WHY IS THIS RUNNING ON LOCALHOST?",
    body: "Because it hasn't decided what it's allowed to touch yet.",
    tone: "info" as const,
  },
  machine: {
    title: "IT WORKS ON MY MACHINE",
    body: "Your machine has never seen this many particles. Respect its boundaries.",
    tone: "info" as const,
  },
  sleep: {
    title: "SLEEP MODULE NOT FOUND",
    body: "SLEEP was deprecated in v0.3. Patch it whenever you feel like it.",
    tone: "warn" as const,
  },
  coffee: {
    title: "CAFFEINE BUFFER OVERFLOW",
    body: "Stack depth exceeded, but somehow it still compiles.",
    tone: "warn" as const,
  },
  wifi: {
    title: "WIFI FOUND, PASSWORD NOT FOUND",
    body: "Honestly, consistent behaviour across networks.",
    tone: "info" as const,
  },
};

export type EggId = keyof typeof EGGS;

export function triggerEgg(id: EggId) {
  const egg = EGGS[id];
  pushToast(egg.title, egg.body, egg.tone);
}

const NEEDLES: { needle: string; id: EggId }[] = [
  { needle: EASTER_EGG_KEYS.toLowerCase(), id: "sudo" },
  { needle: "it works on my machine", id: "machine" },
  { needle: "sudo make me a coffee", id: "coffee" },
];

export function attachKeyEggs() {
  const handler = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    ) {
      return;
    }
    if (event.key.length !== 1) return;
    buffer = (buffer + event.key.toLowerCase()).slice(-KEY_BUFFER_LIMIT);
    for (const { needle, id } of NEEDLES) {
      if (buffer.endsWith(needle)) {
        buffer = "";
        triggerEgg(id);
        return;
      }
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}