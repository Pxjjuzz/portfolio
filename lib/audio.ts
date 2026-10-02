"use client";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let padGain: GainNode | null = null;
let enabled = false;
let built = false;

function build() {
  if (built || typeof window === "undefined") return;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  built = true;
  ctx = new AudioCtor();
  const context = ctx;
  const output = ctx.createGain();
  master = output;
  output.gain.value = 0;
  output.connect(context.destination);

  const pad = context.createGain();
  pad.gain.value = 0.32;
  padGain = pad;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 1.2;
  pad.connect(filter);
  filter.connect(output);

  const base = 55;
  [1, 1.5, 2.005, 3.01].forEach((ratio, index) => {
    const osc = context.createOscillator();
    osc.type = index === 0 ? "sine" : "triangle";
    osc.frequency.value = base * ratio;
    const gain = context.createGain();
    gain.gain.value = index === 0 ? 0.5 : 0.16 / index;
    osc.connect(gain);
    gain.connect(pad);
    osc.start();

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.05 + index * 0.021;
    const lfoGain = context.createGain();
    lfoGain.gain.value = index === 0 ? 6 : 3;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    lfo.start();
  });

  const sweep = context.createOscillator();
  sweep.frequency.value = 0.04;
  const sweepGain = context.createGain();
  sweepGain.gain.value = 180;
  sweep.connect(sweepGain);
  sweepGain.connect(filter.frequency);
  sweep.start();

  const noiseLength = context.sampleRate * 2;
  const buffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 900;
  noiseFilter.Q.value = 0.6;
  const noiseGain = context.createGain();
  noiseGain.gain.value = 0.035;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(output);
  noise.start();
}

export type SoundKind = "hover" | "select" | "whoosh" | "boot" | "glitch";

export const sound = {
  get enabled() {
    return enabled;
  },
  async enable() {
    build();
    if (!ctx || !master) return;
    await ctx.resume();
    enabled = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.14, ctx.currentTime, 1.4);
  },
  disable() {
    if (!ctx || !master) return;
    enabled = false;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  },
  play(kind: SoundKind = "hover") {
    if (!enabled || !ctx || !master) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);

    const profile: Record<SoundKind, { freq: number; to: number; dur: number; type: OscillatorType; vol: number }> = {
      hover: { freq: 1180, to: 1320, dur: 0.09, type: "sine", vol: 0.05 },
      select: { freq: 520, to: 880, dur: 0.22, type: "triangle", vol: 0.11 },
      whoosh: { freq: 240, to: 900, dur: 0.5, type: "sine", vol: 0.06 },
      boot: { freq: 180, to: 720, dur: 0.7, type: "sawtooth", vol: 0.05 },
      glitch: { freq: 90, to: 60, dur: 0.32, type: "square", vol: 0.05 },
    };
    const p = profile[kind];
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.freq, now);
    osc.frequency.exponentialRampToValueAtTime(p.to, now + p.dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(p.vol, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
    osc.start(now);
    osc.stop(now + p.dur + 0.05);
  },
  setIntensity(value: number) {
    if (!enabled || !padGain || !ctx) return;
    padGain.gain.setTargetAtTime(0.16 + value * 0.4, ctx.currentTime, 0.8);
  },
};