/**
 * Records every spoken line in the app as an MP3 using Microsoft's
 * neural voices (via the Edge TTS endpoint) and writes them to
 * public/audio/**, which Expo copies verbatim into the web build.
 *
 * Output layout (matched by src/services/audioUrls.ts):
 *   public/audio/he/hype-{index}.mp3   Hebrew hype openers
 *   public/audio/en/hype-{index}.mp3   English hype openers
 *   public/audio/name/{id}.mp3         Pokémon name (English voice)
 *   public/audio/he/body-{id}.mp3      Hebrew details
 *   public/audio/en/body-{id}.mp3      English details
 *
 * Idempotent: existing non-empty files are skipped, so re-running only
 * records what is new. Run with:  npm run generate:audio
 */
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_POKEMON } from "../src/data/pokemon";
import hypePhrases from "../src/data/hypePhrases.json";

const OUT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "audio"
);

const VOICES = {
  he: "he-IL-HilaNeural",
  en: "en-US-JennyNeural",
} as const;

const CONCURRENCY = 4;
const MAX_ATTEMPTS = 4;

type Job = { file: string; text: string; voice: string };

function collectJobs(): Job[] {
  const jobs: Job[] = [];

  hypePhrases.he.forEach((text, i) => {
    jobs.push({ file: join("he", `hype-${i}.mp3`), text, voice: VOICES.he });
  });
  hypePhrases.en.forEach((text, i) => {
    jobs.push({ file: join("en", `hype-${i}.mp3`), text, voice: VOICES.en });
  });

  for (const p of ALL_POKEMON) {
    jobs.push({
      file: join("name", `${p.id}.mp3`),
      text: `${p.englishSpeechName}!`,
      voice: VOICES.en,
    });
    jobs.push({
      file: join("he", `body-${p.id}.mp3`),
      text: p.speechBodyHe,
      voice: VOICES.he,
    });
    jobs.push({
      file: join("en", `body-${p.id}.mp3`),
      text: p.speechBodyEn,
      voice: VOICES.en,
    });
  }

  return jobs;
}

async function synthesizeToFile(job: Job): Promise<void> {
  const target = join(OUT_DIR, job.file);
  mkdirSync(dirname(target), { recursive: true });

  const tts = new MsEdgeTTS();
  await tts.setMetadata(job.voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const result: any = await Promise.resolve(tts.toStream(job.text));
  const stream = result.audioStream ?? result;

  await new Promise<void>((resolvePromise, reject) => {
    const out = createWriteStream(target);
    stream.pipe(out);
    stream.on("error", reject);
    out.on("error", reject);
    out.on("finish", resolvePromise);
  });

  const size = statSync(target).size;
  if (size < 1000) {
    throw new Error(`Suspiciously small file (${size}B): ${job.file}`);
  }
}

async function processJob(job: Job): Promise<"done" | "skipped"> {
  const target = join(OUT_DIR, job.file);
  if (existsSync(target) && statSync(target).size > 1000) return "skipped";

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await synthesizeToFile(job);
      return "done";
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error(`Failed after ${MAX_ATTEMPTS} attempts: ${job.file}\n${lastError}`);
}

async function main() {
  const jobs = collectJobs();
  console.log(`${jobs.length} audio files to ensure...`);

  let done = 0;
  let skipped = 0;
  let failed = 0;
  let cursor = 0;

  const worker = async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const result = await processJob(job);
        result === "done" ? done++ : skipped++;
      } catch (error) {
        failed++;
        console.error(String(error));
      }
      const total = done + skipped + failed;
      if (total % 25 === 0) {
        console.log(`progress: ${total}/${jobs.length}`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`recorded=${done} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
