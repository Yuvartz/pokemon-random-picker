/**
 * Downloads the official in-game cry of each Gen I Pokémon from the
 * PokéAPI cries repository (OGG) and converts it to MP3 (iOS Safari
 * cannot play OGG), writing to public/audio/cry/{id}.mp3.
 *
 * Idempotent: existing non-empty MP3s are skipped.
 * Run with:  node scripts/fetch-cries.mjs
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");

const OUT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "audio",
  "cry"
);

const CRY_BASE =
  "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest";
const FIRST_ID = 1;
const LAST_ID = 151;

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return download(url, attempt + 1);
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let done = 0;
  let skipped = 0;
  const failures = [];

  for (let id = FIRST_ID; id <= LAST_ID; id++) {
    const target = join(OUT_DIR, `${id}.mp3`);
    if (existsSync(target) && statSync(target).size > 500) {
      skipped++;
      continue;
    }
    try {
      const ogg = await download(`${CRY_BASE}/${id}.ogg`);
      const tempOgg = join(OUT_DIR, `${id}.tmp.ogg`);
      writeFileSync(tempOgg, ogg);
      execFileSync(FFMPEG, [
        "-y",
        "-i",
        tempOgg,
        "-codec:a",
        "libmp3lame",
        "-b:a",
        "96k",
        "-ac",
        "1",
        target,
      ]);
      rmSync(tempOgg);
      if (statSync(target).size < 500) throw new Error("tiny output");
      done++;
    } catch (err) {
      failures.push(`${id}: ${err}`);
    }
    if ((done + skipped + failures.length) % 25 === 0) {
      console.log(`progress: ${done + skipped + failures.length}/${LAST_ID}`);
    }
  }

  console.log(`converted=${done} skipped=${skipped} failed=${failures.length}`);
  failures.forEach((f) => console.error(f));
  if (failures.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
