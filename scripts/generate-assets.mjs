/**
 * Generates the app's illustrated icon assets with OpenAI gpt-image-1
 * (transparent PNGs in a consistent cute sticker style), then downscales
 * them to 256px with the bundled ffmpeg for a small app bundle.
 *
 * Requires the OPENAI_API_KEY environment variable (user scope).
 * Idempotent: assets that already exist are skipped.
 * Run with:  node scripts/generate-assets.mjs [--only name]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "assets", "icons", "raw");
const OUT_DIR = join(ROOT, "assets", "icons");

const API_KEY =
  process.env.OPENAI_API_KEY ?? null;

const STYLE =
  "Cute kawaii sticker icon, thick rounded dark-navy outline, vibrant glossy " +
  "colors with white shine highlights, playful style of a Japanese " +
  "monster-catching adventure game for kids, single centered object, " +
  "clean transparent background, no text, no letters, no watermark";

const ASSETS = {
  question: `A big playful golden-yellow question mark standing on a small red-and-white capsule ball. ${STYLE}`,
  dice: `A tilted white game die with red pips and tiny yellow sparkle stars around it. ${STYLE}`,
  back: `A chunky rounded U-turn arrow pointing left, sky blue. ${STYLE}`,
  speaker: `A cheerful yellow megaphone speaker with colorful rainbow sound waves coming out. ${STYLE}`,
  stop: `A rounded glossy red stop button with a white square symbol in the middle. ${STYLE}`,
  mute: `A gray speaker icon with a bold red diagonal slash across it, showing muted sound. ${STYLE}`,
  note: `A happy glossy purple musical eighth-note with tiny sparkles. ${STYLE}`,
  evolutions: `A twisting green DNA double-helix strand with golden sparkle stars. ${STYLE}`,
  history: `A round teal pocket watch with a curved arrow circling around it. ${STYLE}`,
  gear: `A friendly round blue-gray gear cog with a glossy shine. ${STYLE}`,
  ball: `Retro 16-bit pixel art sprite of a closed glossy red-and-white capsule ball with a central white button, crisp clean pixels, slight shine highlight, centered, transparent background, no text`,
  logo: `A red-and-white capsule ball, slightly open with golden light and a question mark glowing inside. ${STYLE}`,
  buttonplate: `Wide horizontal rounded-rectangle video game UI button in retro 16-bit pixel art style: glossy red top half and creamy white bottom half separated by a dark navy horizontal band, thick golden pixel border, subtle shine pixels in the corner, the button shape fills the entire canvas edge to edge, flat front view, transparent background outside the button, no text, no letters, no icons`,
};

/** Per-asset overrides: generation size and output width. */
const ASSET_OPTIONS = {
  buttonplate: { size: "1536x1024", outWidth: 640 },
};

const only = (() => {
  const i = process.argv.indexOf("--only");
  return i >= 0 ? process.argv[i + 1] : null;
})();

async function generate(name, prompt) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: ASSET_OPTIONS[name]?.size ?? "1024x1024",
      quality: "medium",
      background: "transparent",
      output_format: "png",
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${name}: ${detail.slice(0, 400)}`);
  }
  const payload = await response.json();
  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) throw new Error(`No image data for ${name}`);

  const rawPath = join(RAW_DIR, `${name}.png`);
  writeFileSync(rawPath, Buffer.from(b64, "base64"));

  // Downscale so the app bundle stays small (keeps aspect ratio).
  const outWidth = ASSET_OPTIONS[name]?.outWidth ?? 256;
  const outPath = join(OUT_DIR, `${name}.png`);
  execFileSync(FFMPEG, [
    "-y",
    "-i",
    rawPath,
    "-vf",
    `scale=${outWidth}:-1:flags=lanczos`,
    outPath,
  ]);
  const kb = Math.round(statSync(outPath).size / 1024);
  console.log(`${name}: ok (${kb}KB)`);
}

async function main() {
  if (!API_KEY) {
    console.error("OPENAI_API_KEY is not set.");
    process.exit(1);
  }
  mkdirSync(RAW_DIR, { recursive: true });

  let failed = 0;
  for (const [name, prompt] of Object.entries(ASSETS)) {
    if (only && name !== only) continue;
    const outPath = join(OUT_DIR, `${name}.png`);
    if (!only && existsSync(outPath) && statSync(outPath).size > 1000) {
      console.log(`${name}: skipped (exists)`);
      continue;
    }
    try {
      await generate(name, prompt);
    } catch (error) {
      failed++;
      console.error(String(error));
    }
  }
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
