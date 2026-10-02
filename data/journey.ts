export type Milestone = {
  id: string;
  year: string;
  title: string;
body: string;
  z: number;
  y: number;
  side: 1 | -1;
  accent: string;
};

export const MILESTONES: Milestone[] = [
  {
    id: "play",
    y: 0.9,
    year: "2019",
    title: "Gamer first",
    body: "Started on a console, learned how systems feel from the inside. Everything since has been the same instinct applied to hardware and code.",
    z: 4,
    side: -1,
    accent: "#c9a6ff",
  },
  {
    id: "edit",
    y: -0.6,
    year: "2021",
    title: "Cut the frames",
    body: "Learned editing to give ideas a shape. After Effects, motion graphics, car edits, reels — visual storytelling became a second language.",
    z: -2,
    side: 1,
    accent: "#57e6ff",
  },
  {
    id: "dev",
    y: 0.7,
    year: "2022",
    title: "Wrote the first line",
    body: "HTML, CSS, JavaScript. Built things that existed only in a browser tab and a very tired person.",
    z: -8,
    side: -1,
    accent: "#7cf5c4",
  },
  {
    id: "hardware",
    y: -0.8,
    year: "2023",
    title: "Wires appeared",
    body: "ESP8266 and RFID. Discovered that physical devices fail in ways software never does — and that fixing them is deeply satisfying.",
    z: -14,
    side: 1,
    accent: "#ffb86b",
  },
  {
    id: "ai",
    y: 0.5,
    year: "2024",
    title: "Into AI/ML",
    body: "Python properly. Datasets, training loops, evaluation. Started AIML engineering and stopped guessing about models.",
    z: -20,
    side: -1,
    accent: "#5b8cff",
  },
  {
    id: "hackathons",
    y: -0.5,
    year: "2024",
    title: "Hackathon mode",
    body: "48-hour builds, harsh deadlines, demo-or-it-didn't-happen. Where the weird ideas stop being hypothetical.",
    z: -26,
    side: 1,
    accent: "#a06bff",
  },
  {
    id: "health",
    y: 0.8,
    year: "2025",
    title: "AI meets healthcare",
    body: "OsteoSense NER. Real stakes, real data problems, and the moment building stopped being about grades.",
    z: -32,
    side: -1,
    accent: "#5b8cff",
  },
  {
    id: "systems",
    y: -0.7,
    year: "2026",
    title: "Bigger systems",
    body: "Hybrid forecasting, LLM conversation systems, and this site. Less demo, more architecture.",
    z: -38,
    side: 1,
    accent: "#7cf5c4",
  },
];