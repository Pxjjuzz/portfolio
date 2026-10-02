export type ProjectObject =
  | "scanner"
  | "joint"
  | "rfid"
  | "globe"
  | "iot"
  | "chat";

export type Metric = { label: string; value: string };

export type Project = {
  id: string;
  name: string;
  code: string;
  year: string;
  tagline: string;
  accent: string;
  object: ProjectObject;
  position: [number, number, number];
  scale: number;
  summary: string;
  metrics: Metric[];
  tech: string[];
  hardware: { name: string; role: string }[];
  features: { title: string; body: string }[];
  problem: string;
  concept: string;
  build: string[];
  ai: string;
  interface: string[];
  challenge: string;
  outcome: string;
};

export const PROJECTS: Project[] = [
  {
    id: "snapbreed",
    name: "SnapBreed AI",
    code: "PRJ-01",
    year: "2025",
    tagline: "Point a camera. Get a dog.",
    accent: "#7cf5c4",
    object: "scanner",
    position: [-5.6, 0.3, 8],
    scale: 1,
    summary:
      "A dog-breed recognition app that turns a single photo into a confident breed guess, with breed traits layered on top of the raw prediction.",
    metrics: [
      { label: "classes", value: "120" },
      { label: "input", value: "1 photo" },
      { label: "stack", value: "CNN" },
    ],
    tech: ["Python", "TensorFlow", "Flask", "Pillow", "NumPy"],
    hardware: [{ name: "Smartphone camera", role: "capture + inference client" }],
    features: [
      {
        title: "Live scanning beam",
        body: "A sweep bar crosses the frame while the model works, so the wait feels like a process instead of a spinner.",
      },
      {
        title: "Confidence ladder",
        body: "Top-3 breeds with scores, so it says how sure it is instead of pretending to be right.",
      },
      {
        title: "Trait overlay",
        body: "Size, energy, grooming needs and temperament attached to the predicted breed.",
      },
    ],
    problem:
      "Most image classifiers give you one label and no confidence. For breed identification that is useless — a wrong answer with no hesitation is worse than no answer.",
    concept:
      "Turn classification into an instrument. The camera view becomes a scanning interface, predictions stream in, and the interface admits its own uncertainty.",
    build: [
      "Curated and augmented an image dataset into a clean 120-class training set.",
      "Trained a convolutional network, then added transfer learning to get accuracy up without a GPU rig.",
      "Wrapped inference in a Flask service so the phone stays a thin client.",
      "Designed the scan beam + confidence ladder UI around the model's real output shape.",
    ],
    ai:
      "CNN classifier with data augmentation and transfer learning, served through a lightweight Flask inference API.",
    interface: ["Camera viewfinder", "Animated scan bar", "Top-3 result ladder", "Breed trait card"],
    challenge:
      "Training on a normal laptop meant fighting overfitting. Augmentation plus transfer learning got me a model that generalises instead of memorising the dataset.",
    outcome:
      "A working end-to-end demo: photo in, ranked breed prediction plus traits out, running on a phone.",
  },
  {
    id: "osteosense",
    name: "OsteoSense NER",
    code: "PRJ-02",
    year: "2025",
    tagline: "Knee pain, measured like data.",
    accent: "#5b8cff",
    object: "joint",
    position: [5.9, 0.1, 5.4],
    scale: 1,
    summary:
      "An AI-assisted osteoarthritis assessment concept: phone screening, gait analysis, sit-to-stand tests and a biomechanical risk view of the joint.",
    metrics: [
      { label: "tests", value: "3" },
      { label: "input", value: "video" },
      { label: "aim", value: "triage" },
    ],
    tech: ["Python", "MediaPipe", "OpenCV", "NumPy", "Streamlit"],
    hardware: [{ name: "Phone camera", role: "motion capture at 30fps" }],
    features: [
      {
        title: "Gait analysis",
        body: "Camera tracks hip and knee landmarks through a walk cycle and scores stride symmetry.",
      },
      {
        title: "Sit-to-stand",
        body: "Timed repetitions become a functional strength score — the test clinicians already use.",
      },
      {
        title: "Joint visualisation",
        body: "An abstract 3D knee highlights the contact zone that carries the most load.",
      },
      {
        title: "Risk screening",
        body: "Signals combine into a triage score, clearly labelled as a screen, never a diagnosis.",
      },
    ],
    problem:
      "Knee pain gets assessed in clinics that are expensive and far away. Most people wait until it is bad. Early functional signals are cheap — nobody collects them.",
    concept:
      "Use the camera people already carry. Track joint landmarks during three simple movements and turn them into a screening signal that tells someone when to see a doctor.",
    build: [
      "Defined a landmark-tracking pipeline with MediaPipe pose estimation.",
      "Engineered sit-to-stand and gait feature extraction from 2D video.",
      "Built a Streamlit dashboard for clinicians to review scores and trends.",
      "Modelled the joint in 3D to visualise load distribution during flexion.",
    ],
    ai:
      "Pose-landmark estimation feeding biomechanical feature extraction — stride symmetry, flexion range, descent asymmetry — scored into a clinical-risk screen.",
    interface: ["Pose landmark overlay", "Sit-to-stand rep timer", "Gait symmetry bars", "Joint load view"],
    challenge:
      "Occlusion and camera angle ruin 2D landmark tracking. I had to reject clips instead of pretending the scores were clean — accuracy matters more here than a full dataset.",
    outcome:
      "A working prototype pipeline plus an interactive dashboard concept for early osteoarthritis screening.",
  },
  {
    id: "rfid-attendance",
    name: "Smart RFID Attendance",
    code: "PRJ-03",
    year: "2024",
    tagline: "Tap in. Done.",
    accent: "#57e6ff",
    object: "rfid",
    position: [-5.2, -0.4, 2.6],
    scale: 1,
    summary:
      "A hardware attendance system: RFID cards tap an ESP8266 + MFRC522 reader and the log lands on a live dashboard within seconds.",
    metrics: [
      { label: "read time", value: "<2s" },
      { label: "hardware", value: "ESP8266" },
      { label: "logs", value: "real-time" },
    ],
    tech: ["ESP8266", "MFRC522", "C++", "Arduino", "Firebase", "HTML/CSS"],
    hardware: [
      { name: "ESP8266 NodeMCU", role: "Wi-Fi + logic" },
      { name: "MFRC522 reader", role: "RFID card read" },
      { name: "RFID cards/tags", role: "user identity" },
      { name: "16x2 LCD + buzzer", role: "local feedback" },
    ],
    features: [
      {
        title: "Tap to log",
        body: "Card near the reader, buzzer confirms, entry is pushed immediately.",
      },
      {
        title: "Live dashboard",
        body: "A simple web view lists who is in, with timestamps, no app install.",
      },
      {
        title: "Offline safety",
        body: "Logs are held locally on the device and synced once Wi-Fi returns.",
      },
    ],
    problem:
      "Manual attendance rolls take minutes, invite proxy attendance, and the data is useless afterwards.",
    concept:
      "Make attendance a hardware event: one tap, instant confirmation, and the log exists somewhere useful.",
    build: [
      "Wired the MFRC522 over SPI to an ESP8266 and read card UIDs reliably.",
      "Fired timestamped entries to Firebase with reconnect handling.",
      "Built the attendance dashboard as a plain web page — no framework tax.",
      "Added LCD + buzzer feedback so a tap is confirmed even without Wi-Fi.",
    ],
    ai: "No AI here on purpose — the value is deterministic hardware, not a model.",
    interface: ["RFID tap target", "LCD status line", "Buzzer confirm", "Attendance table"],
    challenge:
      "Wi-Fi drops mid-class. Caching entries on the device and syncing later was the difference between a demo and something usable.",
    outcome:
      "A deployed-style prototype: tap a card, see the attendance dashboard update.",
  },
  {
    id: "weather-fusion",
    name: "Hybrid AI–NWP Forecasting",
    code: "PRJ-04",
    year: "2026",
    tagline: "Physics plus intuition, blended.",
    accent: "#a06bff",
    object: "globe",
    position: [5.4, 1.2, -0.6],
    scale: 1,
    summary:
      "A forecasting system that blends numerical weather prediction with an AI correction model, and lets you see the two disagree.",
    metrics: [
      { label: "models", value: "2 blended" },
      { label: "layers", value: "multi" },
      { label: "output", value: "48h" },
    ],
    tech: ["Python", "PyTorch", "XGBoost", "NumPy", "NetCDF", "Plotly"],
    hardware: [],
    features: [
      {
        title: "Dual model view",
        body: "NWP output and AI correction shown side by side — the disagreement is the interesting part.",
      },
      {
        title: "Forecast paths",
        body: "Animated trajectories for pressure systems across a 3D globe.",
      },
      {
        title: "Atmospheric layers",
        body: "Temperature, pressure and wind as toggleable shells around the planet.",
      },
      {
        title: "Error feedback",
        body: "Past forecasts feed back in as training signal, which is where the model earns trust.",
      },
    ],
    problem:
      "Physics-based forecasts stay physically consistent but miss local detail. Pure ML forecasts are sharp and confidently wrong.",
    concept:
      "Keep the physics, learn the bias. The AI model's job is to correct systematic NWP errors using historical forecast-versus-observation pairs.",
    build: [
      "Ingested historical forecast and observation data for training pairs.",
      "Built the NWP baseline and the AI correction model on the same features.",
      "Blended outputs with a learned weighting instead of a naive average.",
      "Visualised pressure systems, wind layers and forecast paths in 3D.",
    ],
    ai:
      "A gradient-boosted correction model trained on forecast error patterns, blended with NWP output through a learned weighting.",
    interface: ["3D globe", "Layer toggles", "NWP vs AI split", "Forecast path animation"],
    challenge:
      "Getting the blend to respect physical constraints. Unconstrained ML corrections produced plausible-looking but impossible pressure fields, so the blend needed sanity checks.",
    outcome:
      "A working hybrid pipeline with an interactive 3D forecast viewer and measurable improvement over the raw NWP baseline.",
  },
  {
    id: "fire-alert",
    name: "Fire Detection / IoT",
    code: "PRJ-05",
    year: "2024",
    tagline: "Smoke, heard before it is seen.",
    accent: "#ffb86b",
    object: "iot",
    position: [-5.4, 1.3, -4],
    scale: 1,
    summary:
      "An IoT alert system: an MQ2 gas sensor on an ESP32 watches for smoke signatures and pushes an instant alert before flames are visible.",
    metrics: [
      { label: "latency", value: "real-time" },
      { label: "sensors", value: "MQ2" },
      { label: "link", value: "MQTT" },
    ],
    tech: ["ESP32", "MQ2", "MQTT", "Arduino C++", "Node.js", "Blynk"],
    hardware: [
      { name: "ESP32", role: "sampling + Wi-Fi + alert" },
      { name: "MQ2 gas sensor", role: "smoke / LPG signature" },
      { name: "Buzzer + LED", role: "local alarm" },
      { name: "Relay", role: "cut power on trip" },
    ],
    features: [
      {
        title: "Signature sampling",
        body: "Continuous MQ2 readings tracked as a rolling baseline instead of a fixed threshold.",
      },
      {
        title: "Instant alert",
        body: "Push notification the moment the baseline breaks, before anyone smells smoke.",
      },
      {
        title: "Auto cutoff",
        body: "A relay trips to cut the load, so the alert does something.",
      },
    ],
    problem:
      "Gas leaks and early-stage fires are cheap to detect and expensive to ignore. Fixed-threshold alarms either cry wolf or sleep through the real event.",
    concept:
      "Watch the trend, not the number. A rolling baseline with deviation triggers catches the slow rise that a fixed threshold misses.",
    build: [
      "Calibrated the MQ2 against known smoke conditions to get a usable baseline.",
      "Implemented rolling-window deviation detection with hysteresis to stop false alarms.",
      "Pushed alerts over MQTT to a dashboard and a phone notification.",
      "Wired the relay cutoff and tested the whole chain under controlled conditions.",
    ],
    ai: "Signal processing over sensor data rather than a model — the trend is the algorithm.",
    interface: ["Live MQ2 trace", "Baseline band", "Alert banner", "Relay state"],
    challenge:
      "Humidity made the MQ2 readings drift all day. A rolling baseline plus hysteresis fixed most of the false alarms.",
    outcome:
      "A working alert system: detect a rising gas signature, notify instantly, and cut the circuit.",
  },
  {
    id: "aura-ai",
    name: "Aura AI",
    code: "PRJ-06",
    year: "2026",
    tagline: "A conversation interface that remembers tone.",
    accent: "#c9a6ff",
    object: "chat",
    position: [4.4, -0.3, -7.4],
    scale: 1,
    summary:
      "A conversational AI built around personality and context: it tracks the thread of a conversation, not just the last prompt.",
    metrics: [
      { label: "context", value: "long-form" },
      { label: "modes", value: "adaptive" },
      { label: "type", value: "conversational" },
    ],
    tech: ["Python", "FastAPI", "LLM APIs", "React", "WebSockets", "Redis"],
    hardware: [],
    features: [
      {
        title: "Thread memory",
        body: "Multi-turn context held properly, so follow-up questions don't restart the conversation.",
      },
      {
        title: "Adaptive tone",
        body: "The reply style shifts with the prompt — technical, casual, or concise on request.",
      },
      {
        title: "Streaming UI",
        body: "Token streaming over WebSockets, typed out live so it feels like a conversation, not a request.",
      },
      {
        title: "Prompt playground",
        body: "System prompt and temperature exposed in a small panel for testing behaviour.",
      },
    ],
    problem:
      "Most chat demos answer the prompt and forget everything else. It reads like a search box with manners.",
    concept:
      "Build the personality layer: durable conversation threads, streaming responses, and tunable tone — the interface should feel present, not transactional.",
    build: [
      "Designed the context management layer for long, multi-topic threads.",
      "Streamed responses token by token over WebSockets for a live feel.",
      "Built the frontend in React with a deliberately minimal chat surface.",
      "Added a prompt playground to inspect and tune behaviour fast.",
    ],
    ai:
      "An LLM-backed conversation engine with managed context, streaming inference, and adjustable personality and tone.",
    interface: ["Streaming chat stream", "Thread sidebar", "Tone controls", "Prompt playground"],
    challenge:
      "Context windows run out mid-thread. Summarising older turns without losing intent took more iteration than the UI did.",
    outcome:
      "A working conversational AI with long-term context, streaming replies and a tunable personality.",
  },
];

export const projectById = (id: string | null) =>
  id ? PROJECTS.find((project) => project.id === id) ?? null : null;