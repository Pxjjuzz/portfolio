export const IDENTITY = {
  name: "PRAJWAL POOJARY",
  first: "PRAJWAL",
  study: "AIML Engineering Student",
  location: "Bangalore, India",
  focus: "AI systems, interfaces and hardware that talk to each other",
  lines: [
    "I build weird things until they work.",
    "AI, code, hardware and a questionable amount of caffeine.",
    "Currently turning ideas into prototypes.",
    "I don't wait for permission to start building.",
  ],
};

export const DISCIPLINES = [
  {
    id: "aiml",
    label: "AI / ML",
    body: "Training models that earn their accuracy, then wrapping them in something usable.",
    accent: "#5b8cff",
  },
  {
    id: "web",
    label: "Web Development",
    body: "Next.js, React and TypeScript. Fast interfaces, no ceremony.",
    accent: "#57e6ff",
  },
  {
    id: "creative-code",
    label: "Creative Coding",
    body: "Shaders, WebGL, generative systems. Code that behaves like an art material.",
    accent: "#c9a6ff",
  },
  {
    id: "video",
    label: "Video Editing",
    body: "After Effects, CapCut, Alight Motion. Car edits, cinematic cuts, reels.",
    accent: "#ffb86b",
  },
  {
    id: "iot",
    label: "IoT",
    body: "ESP32, ESP8266, sensors, MQTT. Devices that notice things and answer back.",
    accent: "#7cf5c4",
  },
  {
    id: "uiux",
    label: "UI / UX",
    body: "Making a model's confidence visible instead of hiding it behind a spinner.",
    accent: "#a06bff",
  },
  {
    id: "hackathons",
    label: "Hackathons",
    body: "48 hours, one goal, zero excuses. Where the best ideas actually get built.",
    accent: "#5b8cff",
  },
  {
    id: "gaming",
    label: "Gaming",
    body: "Systems, feedback loops and a reason to care about frame rate.",
    accent: "#c9a6ff",
  },
];

export const BEYOND = [
  {
    id: "gaming",
    label: "GAMING",
    body: "I care about frame rate the way some people care about grammar.",
    stat: "60 FPS OR IT DIDN'T HAPPEN",
    accent: "#c9a6ff",
    glyph: "console",
  },
  {
    id: "editing",
    label: "EDITING",
    body: "Every cut is a decision. Most of them are wrong, which is the point.",
    stat: "AVERAGE CUT: 11 PASSES",
    accent: "#57e6ff",
    glyph: "timeline",
  },
  {
    id: "ai",
    label: "AI",
    body: "Not a magic trick — a tool that needs taste to use well.",
    stat: "DATASETS > HYPE",
    accent: "#5b8cff",
    glyph: "orb",
  },
  {
    id: "building",
    label: "BUILDING",
    body: "Learning happens somewhere between the tutorial and the broken build.",
    stat: "SHIP IT, THEN FIX IT",
    accent: "#7cf5c4",
    glyph: "tower",
  },
  {
    id: "exploring",
    label: "EXPLORING",
    body: "New tools, new papers, new rabbit holes at an unreasonable hour.",
    stat: "ONE MORE COMMIT",
    accent: "#ffb86b",
    glyph: "orbit",
  },
] as const;

export const STATUS_LINES = [
  { label: "AI/ML STUDENT", value: "ACTIVE", state: "ok" as const },
  { label: "BUILDING", value: "ACTIVE", state: "ok" as const },
  { label: "LEARNING", value: "ACTIVE", state: "ok" as const },
  { label: "EXPERIMENTING", value: "ACTIVE", state: "ok" as const },
  { label: "HACKATHON MODE", value: "ARMED", state: "warn" as const },
  { label: "SLEEP", value: "ERROR", state: "err" as const },
];

export const STATUS_FOOTER = [
  "CPU: engineering student, heavily loaded",
  "GPU: curiosity, single core",
  "MEMORY: caffeine, variable",
  "UPTIME: awake since 2019",
];