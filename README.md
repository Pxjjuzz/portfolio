# PRAJWAL.OS

An immersive, scroll-driven WebGL portfolio for **Prajwal Poojary** — AIML engineering student, AI/ML builder, creative developer, video editor and hardware tinkerer based in Bangalore.

The site is a single continuous 3D world, not a stack of sections. Scrolling moves a camera through nine connected chapters, each with its own environment, lighting mood and interactive objects.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| 3D | Three.js + React Three Fiber + drei |
| Post-processing | `@react-three/postprocessing` (bloom + vignette, high tiers only) |
| Smooth scroll | Lenis |
| UI motion | Framer Motion |
| Styling | Tailwind CSS v4 + a small custom design system in `app/globals.css` |
| Audio | Web Audio API, opt-in only, no autoplay |

Every 3D asset is generated at runtime (procedural geometry, canvas textures, GLSL). No external models, HDRIs or textures are fetched, so the site works fully offline and ships very little.

---

## Chapters

| # | Chapter | Scene |
| --- | --- | --- |
| 01 | WORLD | Floating code panels, data streams, ring assembly, 3D workstation |
| 02 | IDENTITY | Holographic core with eight reactive discipline nodes |
| 03 | THE ARCHIVE | Six project artifacts in a walk-through museum |
| 04 | CREATIVE MODE | 3D edit timeline, film frames, camera lenses, motion arcs |
| 05 | BEYOND THE CODE | Personality glyphs (gaming, editing, AI, building, exploring) |
| 06 | SKILL CONSTELLATION | 18-node skill graph with reactive links |
| 07 | SYSTEM STATUS | Telemetry console with a sleeping/error beacon |
| 08 | THE TRAJECTORY | Spatial milestone path through time |
| 09 | UPLINK | One glowing object and the contact links |

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run verify     # optional headless smoke test (needs the server running)
```

`npm run verify` drives the built site with Playwright: it walks every chapter, opens and closes a project, opens the menu, triggers an easter egg, visits a 404 and repeats the pass on a phone viewport. Screenshots land in the system temp folder and console/page errors are printed at the end.

---

## Editing content

All copy and project data lives in `data/` and is completely decoupled from presentation:

- `data/site.ts` — name, roles, tagline, social links, loader lines.
- `data/projects.ts` — the six projects: camera placement, accent colour, object type, metrics, tech, hardware, features, problem/concept/build/challenge/outcome.
- `data/skills.ts` — skill constellation nodes (angle, radius, height, related project).
- `data/journey.ts` — timeline milestones.
- `data/personal.ts` — identity facts, disciplines, personality layer, status readout.
- `data/creative.ts` — creative tools and work.
- `data/chapters.ts` — chapter order, camera keyframes, fog density, scroll weights.

Adding a project: append an entry to `PROJECTS`, then either reuse one of the existing object types in `components/projects/objects.tsx` (`scanner`, `joint`, `rfid`, `globe`, `iot`, `chat`) or add a new builder and register it in the `OBJECT_MAP` inside `components/projects/ProjectArtifact.tsx`. Everything else — panel list, detail experience, tooltips — follows automatically.

> Update the social links in `data/site.ts` (and the domain in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`) before deploying.

---

## Architecture

```
app/                     routes, metadata, global design system
components/
  experience/            scroll driver, canvas host, orchestration
  world/                 camera rig, scene setup, atmosphere, particles,
                         chapter gates, reusable primitives, shared objects
  scenes/                one module per chapter
  projects/              project artifacts and their 3D objects
  ui/                    loader, navigation, chapter panels, project detail,
                         cursor, tooltips, toasts
  fallback/              no-WebGL edition
data/                    all content
lib/                     stores, math, quality tiers, shaders, procedural
                         textures, audio, navigation, easter eggs
scenes/                  chapter modules used by components/world/World.tsx
scripts/verify.mjs       optional headless smoke test
```

### State model

- **Continuous state** (`lib/world.ts`) — scroll progress, pointer, time, camera focus. It is a plain mutable object read inside `useFrame` and rAF loops, so nothing re-renders React 60 times a second.
- **Discrete state** (`lib/store.ts`) — phase, active chapter, open project, menu, sound, hover links. A tiny external store consumed with `useSyncExternalStore`.

### Camera and scroll

`data/chapters.ts` defines keyframes. `lib/chapter-path.ts` converts scroll progress into a weighted chapter segment; `CameraRig` interpolates position/look-at/fov with frame-rate-independent damping, adds idle drift and pointer parallax, and blends toward a project focus target when one is active. `ChapterGate` keeps only the current and neighbouring chapters mounted and visible.

### Performance

- Quality tiers in `lib/quality.ts` are detected from pointer type, viewport, CPU cores and device memory; they scale particle counts, device pixel ratio, environment resolution and post-processing.
- Only chapters within ±1.55 of the current one render.
- Particles are a single instanced `Points` draw call with a custom shader; data streams and edit timelines use `InstancedMesh`.
- `PerformanceMonitor` lowers the DPR automatically when frames get expensive.
- Bloom and vignette are disabled entirely on low tiers.
- Canvas is dynamically imported with `ssr: false`, so first paint does not wait on WebGL.

### Accessibility and fallbacks

- `prefers-reduced-motion` disables camera drift, long damping and the custom cursor, and collapses transitions.
- No WebGL (or no JavaScript) swaps to a readable static edition containing all of the same content.
- Reduced motion skips Lenis and uses native scrolling.
- Sound is opt-in through a single toggle; nothing plays on load.
- `sudo pra[j]wal` in the console-free keyboard buffer triggers a hidden easter egg; clicking the identity core, the status beacon or typing other phrases surfaces more.

---

## Easter eggs

| Trigger | Response |
| --- | --- |
| `sudo pra[j]wal` | Root access granted |
| `sudo make me a coffee` | Caffeine buffer overflow |
| `it works on my machine` | Respect your machine's boundaries |
| Click the identity core | "Why is this running on localhost?" |
| Click the status beacon | Sleep module not found |