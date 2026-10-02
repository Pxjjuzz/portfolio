"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tooltip } from "@/lib/tooltip";
import { useToasts } from "@/lib/toast";

export function TooltipLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) tooltip.attach(ref.current);
    return () => tooltip.attach(null as unknown as HTMLDivElement);
  }, []);

  return (
    <div
      ref={ref}
      data-open="false"
      className="glass-strong tooltip-card pointer-events-none fixed left-0 top-0 z-[65] w-[248px] rounded-xl px-3.5 py-3"
      style={{ ["--tip-accent" as string]: "#5b8cff" }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--tip-accent)" }} />
        <p data-tip-title className="font-mono text-[10px] tracking-[0.22em] text-white/85" />
      </div>
      <p data-tip-body className="text-[12px] leading-relaxed text-white/60" />
    </div>
  );
}

export function ToastStack() {
  const toasts = useToasts();

  return (
    <div className="pointer-events-none fixed left-4 top-20 z-[80] flex w-[min(320px,80vw)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-xl px-4 py-3"
            style={{
              borderColor:
                toast.tone === "warn" ? "rgba(255,184,107,0.35)" : "rgba(140,170,255,0.28)",
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.26em] text-white/70">
              {toast.tone === "system" ? "SYS //" : toast.tone === "warn" ? "WARN //" : "LOG //"}
              {toast.title}
            </p>
            {toast.body && <p className="mt-1 text-[12px] leading-relaxed text-white/60">{toast.body}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}