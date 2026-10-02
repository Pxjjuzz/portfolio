export type Tier = "low" | "medium" | "high";

export type QualitySettings = {
  tier: Tier;
  dpr: [number, number];
  particles: number;
  streamParticles: number;
  networkNodes: number;
  postFx: boolean;
  bloom: number;
  environment: boolean;
  envResolution: number;
  contactShadows: boolean;
  sceneDetail: number;
  lensFlares: boolean;
};

const PRESETS: Record<Tier, QualitySettings> = {
  low: {
    tier: "low",
    dpr: [1, 1.25],
    particles: 900,
    streamParticles: 18,
    networkNodes: 34,
    postFx: false,
    bloom: 0,
    environment: false,
    envResolution: 64,
    contactShadows: false,
    sceneDetail: 0.5,
    lensFlares: false,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.6],
    particles: 2200,
    streamParticles: 34,
    networkNodes: 58,
    postFx: true,
    bloom: 0.42,
    environment: true,
    envResolution: 128,
    contactShadows: false,
    sceneDetail: 0.8,
    lensFlares: false,
  },
  high: {
    tier: "high",
    dpr: [1, 1.75],
    particles: 3400,
    streamParticles: 48,
    networkNodes: 84,
    postFx: true,
    bloom: 0.5,
    environment: true,
    envResolution: 256,
    contactShadows: true,
    sceneDetail: 1,
    lensFlares: true,
  },
};

export function detectTier(): Tier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = Math.min(window.innerWidth, window.innerHeight) < 760;

  if (coarse || compact) {
    if (cores >= 8 && memory >= 6) return "medium";
    return "low";
  }
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4) return "medium";
  return "low";
}

export function getQuality(tier?: Tier): QualitySettings {
  return PRESETS[tier ?? detectTier()] ?? PRESETS.medium;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}