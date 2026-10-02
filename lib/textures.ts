import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function finish(key: string, canvas: HTMLCanvasElement, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  cache.set(key, texture);
  return texture;
}

const CODE_LINES = [
  ["#6f7db8", "def train(model, loader, epochs):"],
  ["#5b8cff", "    for epoch in range(epochs):"],
  ["#57e6ff", "        loss = model.step(loader)"],
  ["#6f7db8", "        if loss < best:"],
  ["#c9a6ff", "            best = save(model)"],
  ["#6f7db8", "    return best"],
  ["#4a5175", ""],
  ["#7cf5c4", "# it works on my machine"],
  ["#4a5175", "if __name__ == '__main__':"],
  ["#ffb86b", "    run(profile=True)"],
];

export function codeTexture(key: string, accent = "#5b8cff"): THREE.CanvasTexture {
  const cacheKey = `code:${key}:${accent}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const canvas = makeCanvas(512, 512);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(6,8,16,0.94)";
  ctx.fillRect(0, 0, 512, 512);
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, `${accent}22`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let y = 0; y < 512; y += 4) ctx.fillRect(0, y, 512, 1);

  ctx.font = "500 22px ui-monospace, monospace";
  CODE_LINES.forEach((line, index) => {
    ctx.fillStyle = line[0];
    ctx.fillText(line[1], 40, 96 + index * 36);
  });

  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 2;
  roundRect(ctx, 18, 18, 476, 476, 18);
  ctx.stroke();
  return finish(cacheKey, canvas);
}

export function labelTexture(
  key: string,
  options: { code: string; title: string; accent: string; meta?: string },
): THREE.CanvasTexture {
  const cacheKey = `label:${key}:${options.title}:${options.accent}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const canvas = makeCanvas(512, 180);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(5,7,14,0.9)";
  roundRect(ctx, 8, 8, 496, 164, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = options.accent;
  ctx.fillRect(8, 8, 5, 164);

  ctx.font = "600 18px ui-monospace, monospace";
  ctx.fillStyle = "rgba(233,236,255,0.55)";
  ctx.fillText(options.code, 34, 48);

  ctx.font = "700 40px system-ui, sans-serif";
  ctx.fillStyle = "#e9ecff";
  ctx.fillText(options.title, 34, 100);

  if (options.meta) {
    ctx.font = "400 20px ui-monospace, monospace";
    ctx.fillStyle = options.accent;
    ctx.fillText(options.meta, 34, 138);
  }
  return finish(cacheKey, canvas);
}

export function screenTexture(
  key: string,
  options: { title: string; rows: string[]; accent: string; bars: number[] },
): THREE.CanvasTexture {
  const cacheKey = `screen:${key}:${options.title}:${options.accent}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const canvas = makeCanvas(512, 384);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(4,6,12,0.92)";
  ctx.fillRect(0, 0, 512, 384);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, 0, 512, 44);
  ctx.fillStyle = options.accent;
  ctx.fillRect(0, 0, 512, 2);

  ctx.font = "600 20px ui-monospace, monospace";
  ctx.fillStyle = "#e9ecff";
  ctx.fillText(options.title, 24, 30);

  ctx.font = "400 16px ui-monospace, monospace";
  options.rows.forEach((row, index) => {
    ctx.fillStyle = index === 0 ? options.accent : "rgba(233,236,255,0.6)";
    ctx.fillText(row, 24, 84 + index * 30);
  });

  options.bars.forEach((value, index) => {
    const width = 300 * value;
    const y = 200 + index * 26;
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(24, y, 300, 12);
    ctx.fillStyle = index % 2 === 0 ? options.accent : "#e9ecff";
    ctx.globalAlpha = 0.8;
    ctx.fillRect(24, y, width, 12);
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  roundRect(ctx, 6, 6, 500, 372, 12);
  ctx.stroke();
  return finish(cacheKey, canvas);
}

export function globeTexture(accent = "#a06bff"): THREE.CanvasTexture {
  const cacheKey = `globe:${accent}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const canvas = makeCanvas(1024, 512);
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#060a18");
  grad.addColorStop(0.5, "#0b1430");
  grad.addColorStop(1, "#060a18");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 26; i += 1) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 40 + Math.random() * 120;
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, `${accent}44`);
    blob.addColorStop(0.6, `${accent}18`);
    blob.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = blob;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(120,170,255,0.14)";
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }
  return finish(cacheKey, canvas);
}

const FRAME_PALETTES = [
  ["#ffb86b", "#a06bff"],
  ["#57e6ff", "#5b8cff"],
  ["#c9a6ff", "#57e6ff"],
  ["#7cf5c4", "#5b8cff"],
];

export function filmFrameTexture(index: number): THREE.CanvasTexture {
  const cacheKey = `film:${index}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const canvas = makeCanvas(512, 288);
  const ctx = canvas.getContext("2d")!;
  const [a, b] = FRAME_PALETTES[index % FRAME_PALETTES.length];
  const grad = ctx.createLinearGradient(0, 0, 512, 288);
  grad.addColorStop(0, "#05070f");
  grad.addColorStop(1, "#0a1024");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 288);

  for (let i = 0; i < 5; i += 1) {
    const x = Math.random() * 512;
    const y = Math.random() * 288;
    const r = 40 + Math.random() * 150;
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, `${i % 2 === 0 ? a : b}33`);
    blob.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, 512, 288);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 260);
  ctx.font = "500 18px ui-monospace, monospace";
  ctx.fillStyle = "rgba(233,236,255,0.7)";
  ctx.fillText(`TC_${String(index + 1).padStart(2, "0")}`, 26, 268);
  return finish(cacheKey, canvas);
}

export function disposeTextures() {
  for (const texture of cache.values()) texture.dispose();
  cache.clear();
}