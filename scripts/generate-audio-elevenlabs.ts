/**
 * Re-records the high-personality clips (hype openers + Pokémon names)
 * with ElevenLabs (eleven_v3, "Jessica" voice), overwriting the
 * Microsoft-generated files in public/audio. The long body clips stay
 * on the Microsoft voice to fit the ElevenLabs free-tier quota
 * (~2,500 credits used here vs ~70,000 for everything).
 *
 * Requires the ELEVENLABS_API_KEY environment variable (user scope).
 * Run with:  npm run generate:audio:elevenlabs
 *   --all        also re-record the body clips (needs a paid plan)
 *   --force      re-record even if an ElevenLabs file already exists
 *
 * A .elevenlabs marker is written next to each recorded file so reruns
 * (and the Microsoft generator's skip logic) know which files are which.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
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

const VOICE_ID = "cgSgspJ2msm6clMCkdW9"; // Jessica — playful, bright, warm
// multilingual_v2 rather than the newer eleven_v3: v3 is alpha and
// sometimes hallucinates spelled-out gibberish on very short clips
// (e.g. single Pokémon names).
const MODEL_ID = "eleven_multilingual_v2";
const OUTPUT_FORMAT = "mp3_44100_128";
const CONCURRENCY = 2; // free-tier concurrency limit
const MAX_ATTEMPTS = 4;

const API_KEY = process.env.ELEVENLABS_API_KEY;
const RECORD_ALL = process.argv.includes("--all");
const FORCE = process.argv.includes("--force");

type Job = { file: string; text: string };

function collectJobs(): Job[] {
  const jobs: Job[] = [];
  // ENGLISH ONLY. eleven_multilingual_v2 does not support Hebrew at all
  // (it reads Hebrew text as a wrong language), and eleven_v3 — which
  // does — hallucinates on short clips. All Hebrew audio is therefore
  // recorded by scripts/generate-audio.ts with Microsoft's he-IL voice.
  hypePhrases.en.forEach((text, i) => {
    jobs.push({ file: join("en", `hype-${i}.mp3`), text });
  });
  for (const p of ALL_POKEMON) {
    jobs.push({ file: join("name", `${p.id}.mp3`), text: `${p.englishSpeechName}!` });
    if (RECORD_ALL) {
      jobs.push({ file: join("en", `body-${p.id}.mp3`), text: p.speechBodyEn });
    }
  }
  return jobs;
}

function markerPath(file: string): string {
  return join(OUT_DIR, `${file}.elevenlabs`);
}

async function synthesize(job: Job): Promise<void> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({ text: job.text, model_id: MODEL_ID }),
    }
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${job.file}: ${detail.slice(0, 300)}`);
  }
  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length < 1000) {
    throw new Error(`Suspiciously small audio (${audio.length}B): ${job.file}`);
  }
  const target = join(OUT_DIR, job.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, audio);
  writeFileSync(markerPath(job.file), MODEL_ID);
}

async function processJob(job: Job): Promise<"done" | "skipped"> {
  // Skip only clips already recorded with the CURRENT model, so a rerun
  // after a quota reset automatically upgrades leftovers from older
  // models (e.g. eleven_v3 clips that had gibberish artifacts).
  if (!FORCE && existsSync(markerPath(job.file))) {
    const recordedWith = readFileSync(markerPath(job.file), "utf8").trim();
    if (recordedWith === MODEL_ID) return "skipped";
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await synthesize(job);
      return "done";
    } catch (error) {
      lastError = error;
      const message = String(error);
      // Quota exhausted — no point retrying; surface immediately.
      if (message.includes("quota_exceeded") || message.includes("payment_required")) {
        throw error;
      }
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error(`Failed after ${MAX_ATTEMPTS} attempts: ${job.file}\n${lastError}`);
}

async function main() {
  if (!API_KEY) {
    console.error("ELEVENLABS_API_KEY is not set.");
    process.exit(1);
  }
  const jobs = collectJobs();
  const totalChars = jobs.reduce((sum, j) => sum + j.text.length, 0);
  console.log(`${jobs.length} clips, ~${totalChars} ElevenLabs credits...`);

  let done = 0;
  let skipped = 0;
  let failed = 0;
  let cursor = 0;
  let abort = false;

  const worker = async () => {
    while (!abort && cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const result = await processJob(job);
        result === "done" ? done++ : skipped++;
      } catch (error) {
        failed++;
        console.error(String(error));
        const message = String(error);
        if (message.includes("quota_exceeded") || message.includes("payment_required")) {
          abort = true; // keep existing Microsoft audio for the rest
        }
      }
      const total = done + skipped + failed;
      if (total % 20 === 0) console.log(`progress: ${total}/${jobs.length}`);
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
