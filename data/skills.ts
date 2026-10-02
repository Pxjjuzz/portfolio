export type Skill = {
  id: string;
  name: string;
  kind: "ai" | "web" | "hardware" | "creative";
  context: string;
  project?: string;
  level: number;
  angle: number;
  radius: number;
  y: number;
  accent: string;
};

const a = (name: string, kind: Skill["kind"], context: string, angle: number, radius: number, y: number, level: number, project?: string): Skill => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  kind,
  context,
  project,
  level,
  angle,
  radius,
  y,
  accent:
    kind === "ai"
      ? "#5b8cff"
      : kind === "web"
        ? "#57e6ff"
        : kind === "hardware"
          ? "#ffb86b"
          : "#c9a6ff",
});

export const SKILLS: Skill[] = [
  a("Python", "ai", "Every model I've trained starts here. NumPy, pandas, PyTorch.", 12, 4.6, 1.4, 92, "snapbreed"),
  a("AI / ML", "ai", "Image classification, pose estimation, forecasting correction models.", 42, 5.0, 0.4, 88, "weather-fusion"),
  a("TensorFlow", "ai", "Transfer learning on a laptop GPU — SnapBreed's backbone.", 74, 4.7, -0.6, 82, "snapbreed"),
  a("Computer Vision", "ai", "Landmark tracking, motion analysis, live scanning interfaces.", 104, 4.9, 0.8, 84, "osteosense"),
  a("Streamlit", "ai", "Turning a model into something a clinician could actually open.", 134, 4.4, 1.6, 80, "osteosense"),
  a("LLM Apps", "ai", "Context management, streaming replies, tunable personalities.", 166, 4.8, 0.2, 79, "aura-ai"),
  a("React", "web", "Interfaces for models — state, streaming, zero ceremony.", 196, 4.5, -1.0, 85, "aura-ai"),
  a("Next.js", "web", "App router, server components, shipping fast.", 226, 4.3, 1.2, 78),
  a("JavaScript", "web", "Ten years of it. Prototypes at 1am start here.", 256, 4.6, 0.5, 90),
  a("TypeScript", "web", "Types are documentation that refuses to rot.", 286, 4.4, -0.9, 84),
  a("WebGL / Three.js", "web", "Shaders, instancing, post-processing — this site is the demo.", 316, 5.2, 0.9, 76),
  a("UI / UX", "web", "Interfaces that explain what a model is actually doing.", 344, 4.7, 1.5, 80, "snapbreed"),
  a("ESP32", "hardware", "Sampling, Wi-Fi, MQTT and relays in one board.", 12, 4.5, -1.3, 83, "fire-alert"),
  a("ESP8266", "hardware", "My first board that pushed data to a server.", 44, 4.3, 1.8, 80, "rfid-attendance"),
  a("IoT", "hardware", "MQTT, sensors, dashboards, and devices that answer back.", 76, 4.6, 0.3, 81, "fire-alert"),
  a("After Effects", "creative", "Car edits, cinematic cuts, motion graphics on a timeline.", 108, 4.8, -0.4, 77),
  a("Motion Graphics", "creative", "Keyframes that carry meaning instead of noise.", 140, 4.4, 1.1, 74),
  a("CapCut / Alight", "creative", "Fast cuts for reels. Speed matters when the idea is fresh.", 172, 4.2, -1.1, 82),
];

export const SKILL_KIND_LABEL: Record<Skill["kind"], string> = {
  ai: "INTELLIGENCE",
  web: "INTERFACE",
  hardware: "HARDWARE",
  creative: "CREATIVE",
};