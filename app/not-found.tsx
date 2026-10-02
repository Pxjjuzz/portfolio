import Link from "next/link";

export default function NotFound() {
  return (
    <main className="noise relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="mono-label">ERROR 404 // SECTOR NOT FOUND</p>
      <h1 className="display mt-6 text-[clamp(2.4rem,10vw,6rem)] text-aurora">
        THIS SECTOR IS EMPTY.
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
        You navigated outside the world. Everything interesting is back at the origin.
      </p>
      <Link
        href="/"
        className="focus-ring mt-9 rounded-full border border-white/20 px-6 py-3 font-mono text-[10px] tracking-[0.28em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
      >
        ← RETURN TO PRAJWAL.OS
      </Link>
    </main>
  );
}