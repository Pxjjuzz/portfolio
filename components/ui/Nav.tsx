"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CHAPTERS } from "@/data/chapters";
import { SITE } from "@/data/site";
import { worldNav } from "@/lib/navigation";
import { setWorldState, useWorldState } from "@/lib/store";
import { sound } from "@/lib/audio";
import { useMagnetic } from "@/lib/hooks";

function Brand() {
  const ref = useMagnetic<HTMLButtonElement>(10, 60);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        setWorldState({ menuOpen: false });
        worldNav.scrollToTop();
        sound.play("select");
      }}
      className="magnetic focus-ring group flex items-center gap-2.5 rounded-full px-1 py-1"
      aria-label="Back to the start of the world"
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/5">
        <span className="font-display text-[13px] font-semibold text-white/85">P</span>
        <span className="absolute inset-0 rounded-full bg-azure/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="font-display text-[12px] tracking-[0.36em] text-white/70">
        {SITE.first}
        <span className="text-white/30">.OS</span>
      </span>
    </button>
  );
}

function SoundToggle() {
  const { soundOn } = useWorldState();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      aria-label={soundOn ? "Mute ambient sound" : "Enable ambient sound"}
      aria-pressed={soundOn}
      onClick={async () => {
        setPending(true);
        if (soundOn) {
          sound.disable();
          setWorldState({ soundOn: false });
        } else {
          await sound.enable();
          sound.play("boot");
          setWorldState({ soundOn: true });
        }
        setPending(false);
      }}
      className="focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.22em] text-white/60 transition-colors hover:border-white/25 hover:text-white/90"
    >
      <span className="flex h-2.5 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="w-[2px] bg-current transition-all duration-300"
            style={{
              height: soundOn ? `${6 + ((index * 5) % 9)}px` : "3px",
              opacity: soundOn ? 1 : 0.4,
            }}
          />
        ))}
      </span>
      {pending ? "..." : soundOn ? "SOUND ON" : "SOUND OFF"}
    </button>
  );
}

function ChapterRail() {
  const { chapter } = useWorldState();

  return (
    <nav
      aria-label="Chapters"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {CHAPTERS.map((entry, index) => {
        const active = index === chapter;
        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => {
              setWorldState({ menuOpen: false });
              worldNav.scrollToChapter(index);
            }}
            className="focus-ring group pointer-events-auto flex items-center gap-2.5"
            aria-current={active ? "true" : undefined}
          >
            <span
              className={`font-mono text-[9px] tracking-[0.24em] transition-all duration-500 ${
                active ? "text-white/80" : "text-white/0 group-hover:text-white/45"
              }`}
            >
              {entry.nav}
            </span>
            <span
              className="block h-px transition-all duration-500"
              style={{
                width: active ? 26 : 10,
                background: active ? "#9fb8ff" : "rgba(255,255,255,0.28)",
                boxShadow: active ? "0 0 12px rgba(140,170,255,0.9)" : "none",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}

function ChapterReadout() {
  const { chapter } = useWorldState();
  const entry = CHAPTERS[chapter] ?? CHAPTERS[0];

  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-40 hidden md:block">
      <p className="mono-label">{entry.label}</p>
      <p className="mt-1 font-display text-[13px] tracking-[0.2em] text-white/50">
        {entry.nav}
      </p>
    </div>
  );
}

function MenuOverlay() {
  const { menuOpen } = useWorldState();

  useEffect(() => {
    if (!menuOpen) return;
    worldNav.stopScroll();
    document.body.dataset.locked = "true";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWorldState({ menuOpen: false });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.dataset.locked = "false";
      worldNav.startScroll();
    };
  }, [menuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setWorldState({ menuOpen: false })}
            className="absolute inset-0 cursor-default bg-void/70 backdrop-blur-xl"
          />
          <motion.nav
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative w-full max-w-2xl rounded-3xl px-8 py-10"
            aria-label="Main menu"
          >
            <p className="mono-label">NAVIGATION // PRAJWAL.OS</p>
            <ul className="mt-7 grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2">
              {CHAPTERS.map((entry, index) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setWorldState({ menuOpen: false });
                      worldNav.scrollToChapter(index);
                      sound.play("select");
                    }}
                    className="focus-ring group flex w-full items-baseline justify-between gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="font-display text-lg tracking-tight text-white/80 transition-transform duration-500 group-hover:translate-x-1">
                      {entry.nav}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">
                      {entry.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {SITE.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="focus-ring font-mono text-[10px] tracking-[0.24em] text-white/45 transition-colors hover:text-white/90"
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Nav() {
  const { menuOpen } = useWorldState();

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 py-5 md:px-8">
        <div className="pointer-events-auto">
          <Brand />
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <SoundToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setWorldState({ menuOpen: !menuOpen });
              sound.play("select");
            }}
            className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-white/30"
          >
            <span className="flex w-4 flex-col gap-[5px]">
              <span
                className="block h-px w-full bg-white/80 transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none" }}
              />
              <span
                className="block h-px w-full bg-white/80 transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(-3px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>
      <ChapterRail />
      <ChapterReadout />
      <MenuOverlay />
    </>
  );
}