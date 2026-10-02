import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const OUT = "C:/Users/PRAJWAL/AppData/Local/Temp/kilo/prajwal-shots";

mkdirSync(OUT, { recursive: true });

const args = [
  "--enable-unsafe-swiftshader",
  "--ignore-gpu-blocklist",
  "--enable-webgl",
  "--use-angle=swiftshader",
];

async function collect(page, bucket) {
  page.on("console", (message) => {
    const type = message.type();
    if (type === "error" || type === "warning") bucket.push(`[${type}] ${message.text()}`);
  });
  page.on("pageerror", (error) => bucket.push(`[pageerror] ${error.message}`));
  page.on("requestfailed", (request) =>
    bucket.push(`[requestfailed] ${request.url()} ${request.failure()?.errorText ?? ""}`),
  );
}

async function settle(page, ms = 1400) {
  await page.waitForTimeout(ms);
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  process.stdout.write(`shot: ${name}\n`);
}

async function scrollTo(page, ratio) {
  await page.evaluate((value) => {
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: limit * value, behavior: "auto" });
  }, ratio);
  await settle(page, 1800);
}

async function runDesktop() {
  const messages = [];
  const browser = await chromium.launch({ args });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();
  await collect(page, messages);

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await shot(page, "01-boot");

  await page.waitForSelector("canvas", { timeout: 20000 });
  await settle(page, 4000);
  await shot(page, "02-hero");

  await page.mouse.move(1100, 380);
  await page.mouse.move(700, 520, { steps: 12 });
  await settle(page, 900);
  await shot(page, "03-hero-pointer");

  const ratios = [0.12, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94, 1];
  const names = [
    "04-identity",
    "05-museum-a",
    "06-museum-b",
    "07-studio",
    "08-beyond",
    "09-constellation",
    "10-status",
    "11-journey",
    "12-contact",
  ];

  for (let i = 0; i < ratios.length; i += 1) {
    await scrollTo(page, ratios[i]);
    await shot(page, names[i]);
  }

  await scrollTo(page, 0.25);
  await page.waitForTimeout(1200);
  const enterButton = page.locator('button:has-text("PRJ-01")');
  if (await enterButton.count()) {
    await enterButton.click();
    await settle(page, 2200);
    await shot(page, "13-project-detail");
    const back = page.locator("button", { hasText: "BACK TO WORLD" });
    if (await back.count()) {
      await back.click();
      await settle(page, 1800);
      await shot(page, "14-back-to-world");
    }
  }

  const menuButton = page.locator('button[aria-label="Open menu"]');
  if (await menuButton.count()) {
    await menuButton.click();
    await settle(page, 900);
    await shot(page, "15-menu");
    await page.keyboard.press("Escape");
    await settle(page, 700);
  }

  const navTargets = [
    ["WORLD", "01 / ORIGIN"],
    ["ABOUT", "02 / IDENTITY"],
    ["PROJECTS", "03 / ARCHIVE"],
    ["CREATIVE", "04 / STUDIO"],
    ["BEYOND", "05 / BEYOND THE CODE"],
    ["SKILLS", "06 / CONSTELLATION"],
    ["STATUS", "07 / TELEMETRY"],
    ["JOURNEY", "08 / TRAJECTORY"],
    ["CONTACT", "09 / UPLINK"],
  ];
  const navResults = [];
  for (const [label, expected] of navTargets) {
    const toggle = page.locator('button[aria-label="Open menu"]');
    if (await toggle.count()) {
      await toggle.click();
      await settle(page, 500);
    }
    await page.locator(`nav[aria-label="Main menu"] button:has-text("${label}")`).click();
    await settle(page, 3200);
    const readout = await page.evaluate(() => {
      const node = [...document.querySelectorAll("p")].find((p) => /^\d\d \//.test(p.textContent ?? ""));
      return node?.textContent ?? null;
    });
    navResults.push(`${label} -> ${readout ?? "none"} (expected ${expected})`);
  }
  process.stdout.write(`navigation: ${navResults.join(", ")}\n`);

  await scrollTo(page, 0.25);
  await page.keyboard.type("sudo pra[j]wal", { delay: 30 });
  await settle(page, 900);
  await shot(page, "16-easter-egg");

  await page.goto(BASE + "/does-not-exist", { waitUntil: "networkidle" });
  await settle(page, 800);
  await shot(page, "17-not-found");

  await browser.close();
  return messages;
}

async function runMobile() {
  const messages = [];
  const browser = await chromium.launch({ args });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();
  await collect(page, messages);

  await page.goto(BASE, { waitUntil: "networkidle" });
  await settle(page, 4200);
  await shot(page, "20-mobile-hero");

  await scrollTo(page, 0.16);
  await shot(page, "21-mobile-identity");
  await scrollTo(page, 0.34);
  await shot(page, "22-mobile-museum");
  await scrollTo(page, 0.62);
  await shot(page, "23-mobile-constellation");
  await scrollTo(page, 1);
  await shot(page, "24-mobile-contact");

  await browser.close();
  return messages;
}

const desktop = await runDesktop();
const mobile = await runMobile();

const report = { desktop, mobile };
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);