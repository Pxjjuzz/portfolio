"use client";

type TipContent = { title: string; body: string; accent?: string };

let root: HTMLDivElement | null = null;

export const tooltip = {
  attach(node: HTMLDivElement) {
    root = node;
  },
  show({ title, body, accent }: TipContent) {
    if (!root) return;
    const titleEl = root.querySelector<HTMLElement>("[data-tip-title]");
    const bodyEl = root.querySelector<HTMLElement>("[data-tip-body]");
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;
    if (accent) root.style.setProperty("--tip-accent", accent);
    root.dataset.open = "true";
  },
  move(x: number, y: number) {
    if (!root) return;
    root.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  },
  hide() {
    if (!root) return;
    root.dataset.open = "false";
  },
};