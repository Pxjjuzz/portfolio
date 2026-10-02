import { CHAPTERS, type Chapter } from "@/data/chapters";
import { clamp, inverseLerp, smoothstep } from "@/lib/math";

const weights = CHAPTERS.map((chapter) => chapter.weight);
export const TOTAL_WEIGHT = weights.reduce((sum, weight) => sum + weight, 0);

export const OFFSETS: number[] = (() => {
  const offsets: number[] = [];
  let acc = 0;
  for (const weight of weights) {
    offsets.push(acc / TOTAL_WEIGHT);
    acc += weight;
  }
  return offsets;
})();

export type PathSample = {
  index: number;
  local: number;
  eased: number;
  from: Chapter;
  to: Chapter;
};

export function samplePath(progress: number): PathSample {
  const p = clamp(progress);
  let index = CHAPTERS.length - 1;
  for (let i = 0; i < CHAPTERS.length - 1; i += 1) {
    if (p < OFFSETS[i + 1]) {
      index = i;
      break;
    }
  }
  const start = OFFSETS[index];
  const end = index < CHAPTERS.length - 1 ? OFFSETS[index + 1] : 1;
  const local = index < CHAPTERS.length - 1 ? inverseLerp(start, end, p) : 1;
  const to = CHAPTERS[Math.min(index + 1, CHAPTERS.length - 1)];
  return {
    index,
    local,
    eased: smoothstep(local),
    from: CHAPTERS[index],
    to,
  };
}

export function activeChapterIndex(progress: number): number {
  const sample = samplePath(progress);
  return Math.min(CHAPTERS.length - 1, sample.index + (sample.local > 0.42 ? 1 : 0));
}

export function progressForChapter(index: number): number {
  const clamped = clamp(index, 0, CHAPTERS.length - 1);
  if (clamped === 0) return 0;
  const start = OFFSETS[clamped];
  const span = clamped < CHAPTERS.length - 1 ? OFFSETS[clamped + 1] - start : 1 - start;
  return clamp(start + span * 0.12);
}

export function chapterFromOffset(index: number): number {
  const clamped = clamp(index, 0, CHAPTERS.length - 1);
  return OFFSETS[clamped] + 0.0001;
}