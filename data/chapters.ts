export type ChapterId =
  | "world"
  | "identity"
  | "museum"
  | "studio"
  | "beyond"
  | "constellation"
  | "status"
  | "journey"
  | "contact";

export type Vec3 = [number, number, number];

export type Chapter = {
  id: ChapterId;
  index: number;
  nav: string;
  label: string;
  kicker: string;
  title: string;
  body: string;
  anchor: Vec3;
  cam: Vec3;
  look: Vec3;
  fov: number;
  fog: number;
  tone: "deep" | "lab" | "studio" | "void";
  weight: number;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "world",
    index: 0,
    nav: "WORLD",
    label: "01 / ORIGIN",
    kicker: "PRAJWAL.OS — BOOT SEQUENCE",
    title: "PRAJWAL",
    body: "I build things that shouldn't feel like websites.",
    anchor: [0, 0, 0],
    cam: [0, 1.15, 9.4],
    look: [0, 0.6, 0],
    fov: 46,
    fog: 0.019,
    tone: "deep",
    weight: 1.4,
  },
  {
    id: "identity",
    index: 1,
    nav: "ABOUT",
    label: "02 / IDENTITY",
    kicker: "HOLO-INTERFACE — SUBJECT LOADED",
    title: "WHO AM I?",
    body: "AIML engineering student. Bangalore, India. Currently turning ideas into prototypes.",
    anchor: [0, 0.4, -30],
    cam: [0, 1.5, -19.5],
    look: [0, 0.5, -31],
    fov: 44,
    fog: 0.024,
    tone: "lab",
    weight: 1.25,
  },
  {
    id: "museum",
    index: 2,
    nav: "PROJECTS",
    label: "03 / ARCHIVE",
    kicker: "PROJECT MUSEUM — 6 ARTIFACTS ON DISPLAY",
    title: "THE ARCHIVE",
    body: "Every project is an object. Hover to wake it up, click to step inside.",
    anchor: [0, 0, -62],
    cam: [0, 1.9, -51],
    look: [0, 0.2, -63],
    fov: 45,
    fog: 0.021,
    tone: "lab",
    weight: 1.95,
  },
  {
    id: "studio",
    index: 3,
    nav: "CREATIVE",
    label: "04 / STUDIO",
    kicker: "CREATIVE MODE — TIMELINE ARMED",
    title: "CREATIVE MODE",
    body: "The lab is a workplace too. Car edits, cinematic cuts, motion graphics, reels.",
    anchor: [0, 0.2, -100],
    cam: [0, 1.4, -89],
    look: [0, 0.2, -101],
    fov: 43,
    fog: 0.017,
    tone: "studio",
    weight: 1.35,
  },
  {
    id: "beyond",
    index: 4,
    nav: "BEYOND",
    label: "05 / BEYOND THE CODE",
    kicker: "PERSONALITY LAYER — UNLOCKED",
    title: "BEYOND THE CODE",
    body: "Not another engineering student. Someone who learns by breaking things on purpose.",
    anchor: [0, 0.3, -136],
    cam: [0, 1.3, -125],
    look: [0, 0.3, -137],
    fov: 44,
    fog: 0.022,
    tone: "deep",
    weight: 1.4,
  },
  {
    id: "constellation",
    index: 5,
    nav: "SKILLS",
    label: "06 / CONSTELLATION",
    kicker: "SKILL GRAPH — 16 NODES LINKED",
    title: "SKILL CONSTELLATION",
    body: "Tools change. The habit of learning them doesn't.",
    anchor: [0, 0.6, -172],
    cam: [0, 1.4, -161],
    look: [0, 0.6, -173],
    fov: 45,
    fog: 0.02,
    tone: "lab",
    weight: 1.25,
  },
  {
    id: "status",
    index: 6,
    nav: "STATUS",
    label: "07 / TELEMETRY",
    kicker: "SYSTEM STATUS — LIVE TELEMETRY",
    title: "SYSTEM STATUS",
    body: "Live readout of what I'm doing at 2am.",
    anchor: [0, 0.5, -206],
    cam: [0, 1.1, -195.5],
    look: [0, 0.6, -207],
    fov: 43,
    fog: 0.023,
    tone: "deep",
    weight: 1.4,
  },
  {
    id: "journey",
    index: 7,
    nav: "JOURNEY",
    label: "08 / TRAJECTORY",
    kicker: "TRAJECTORY LOG — SEQUENCE RECONSTRUCTED",
    title: "THE TRAJECTORY",
    body: "Gamer → editor → developer → AI/ML engineer → builder of bigger systems.",
    anchor: [0, 0.2, -240],
    cam: [0, 1.6, -228],
    look: [0, 0.2, -241],
    fov: 46,
    fog: 0.018,
    tone: "lab",
    weight: 1.25,
  },
  {
    id: "contact",
    index: 8,
    nav: "CONTACT",
    label: "09 / UPLINK",
    kicker: "UPLINK — ONE SIGNAL LEFT",
    title: "LET'S BUILD SOMETHING.",
    body: "Got an idea? Let's turn it into something people can interact with.",
    anchor: [0, 0.4, -276],
    cam: [0, 1.15, -265.5],
    look: [0, 0.45, -277],
    fov: 44,
    fog: 0.03,
    tone: "void",
    weight: 1.15,
  },
];

export const CHAPTER_COUNT = CHAPTERS.length;

export const chapterById = (id: ChapterId) =>
  CHAPTERS.find((chapter) => chapter.id === id) ?? CHAPTERS[0];