"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { progressForChapter } from "@/lib/chapter-path";
import { world } from "@/lib/world";
import { sound } from "@/lib/audio";

export function useWorldScroll(enabled: boolean, reducedMotion: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const handleScroll = (progress: number) => {
      world.targetProgress = progress;
    };

    if (reducedMotion) {
      const onScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        handleScroll(limit > 0 ? window.scrollY / limit : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const loop = (time: number) => {
      lenis.raf(time);
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      handleScroll(limit > 0 ? window.scrollY / limit : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on("scroll", (instance: Lenis) => handleScroll(instance.progress));

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, reducedMotion]);

  const scrollToProgress = useCallback((progress: number, immediate = false) => {
    const target = Math.max(0, Math.min(1, progress));
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(target * lenis.limit, {
        immediate,
        duration: immediate ? 0 : 1.6,
        force: true,
      });
    } else {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: target * limit, behavior: immediate ? "auto" : "smooth" });
    }
    sound.play("whoosh");
  }, []);

  const scrollToChapter = useCallback(
    (index: number) => {
      scrollToProgress(progressForChapter(index));
    },
    [scrollToProgress],
  );

  const scrollToTop = useCallback(() => {
    scrollToProgress(0);
  }, [scrollToProgress]);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return useMemo(
    () => ({ scrollToProgress, scrollToChapter, scrollToTop, stop, start }),
    [scrollToProgress, scrollToChapter, scrollToTop, stop, start],
  );
}