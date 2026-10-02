"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { BootScreen } from "@/components/ui/BootScreen";
import { Nav } from "@/components/ui/Nav";
import { ChapterPanels } from "@/components/ui/ChapterPanels";
import { CursorGlow, ScrollProgress } from "@/components/ui/Cursor";
import { TooltipLayer, ToastStack } from "@/components/ui/Feedback";
import { ProjectDetail } from "@/components/ui/ProjectDetail";
import { StaticWorld } from "@/components/fallback/StaticWorld";
import { useWorldScroll } from "@/components/experience/useWorldScroll";
import { TOTAL_WEIGHT } from "@/lib/chapter-path";
import { worldNav } from "@/lib/navigation";
import { setWorldState, useWorldState } from "@/lib/store";
import { detectTier, prefersReducedMotion } from "@/lib/quality";
import { detectWebGL } from "@/lib/webgl";
import { attachKeyEggs } from "@/lib/easter-eggs";
import { world } from "@/lib/world";

const CanvasLayer = dynamic(() => import("@/components/experience/CanvasLayer"), { ssr: false });

export default function Experience() {
  const { phase, webgl, reducedMotion, activeProject, menuOpen } = useWorldState();

  const api = useWorldScroll(phase === "live" && webgl, reducedMotion);

  useEffect(() => {
    worldNav.register({
      scrollToProgress: api.scrollToProgress,
      scrollToChapter: api.scrollToChapter,
      scrollToTop: api.scrollToTop,
      stop: api.stop,
      start: api.start,
    });
    return () => worldNav.register(null);
  }, [api]);

  useEffect(() => {
    setWorldState({
      tier: detectTier(),
      reducedMotion: prefersReducedMotion(),
      webgl: detectWebGL(),
    });
  }, []);

  useEffect(() => {
    if (phase === "boot") {
      document.body.dataset.locked = "true";
      return;
    }
    document.body.dataset.locked = "false";
  }, [phase]);

  useEffect(() => {
    if (activeProject || menuOpen) api.stop();
    else if (phase === "live") api.start();
  }, [activeProject, menuOpen, phase, api]);

  useEffect(() => attachKeyEggs(), []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      world.pointerRaw.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      world.pointerRaw.set(
        (touch.clientX / window.innerWidth) * 2 - 1,
        -((touch.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const markReady = () => {
      world.ready = true;
    };
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(markReady);
    });
    const fallback = window.setTimeout(markReady, 3200);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, []);

  const spacerHeight = useMemo(() => `${Math.round(TOTAL_WEIGHT * 100 + 80)}vh`, []);

  if (!webgl) {
    return (
      <>
        <StaticWorld />
      </>
    );
  }

  return (
    <>
      <BootScreen />
      <CanvasLayer reducedMotion={reducedMotion} />
      <Nav />
      <ChapterPanels />
      <CursorGlow />
      <ScrollProgress />
      <TooltipLayer />
      <ToastStack />
      <ProjectDetail />
      <div aria-hidden className="pointer-events-none w-full" style={{ height: spacerHeight }} />
    </>
  );
}