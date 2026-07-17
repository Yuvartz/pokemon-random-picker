import {
  AUDIO_BASE_URL,
  bodyAudioUrl,
  buildAnnouncementItems,
  cryAudioUrl,
  hypeAudioUrl,
  nameAudioUrl,
} from "../services/audioUrls";
import { getHypePhrases, pickRandomHypeIndex } from "../data/hypePhrases";
import { buildSpeechSegments } from "../utils/speechText";
import { getPokemonById } from "../data/pokemon";
import { existsSync } from "fs";
import { join } from "path";

describe("recorded announcement URLs", () => {
  it("builds the playlist aligned with the speech segments", () => {
    const pikachu = getPokemonById(25)!;
    const items = buildAnnouncementItems(pikachu, "he", 3);
    const segments = buildSpeechSegments(pikachu, "he", "hype");
    expect(items.map((i) => i.url)).toEqual([
      `${AUDIO_BASE_URL}/he/hype-3.mp3`,
      `${AUDIO_BASE_URL}/name/25.mp3`,
      `${AUDIO_BASE_URL}/cry/25.mp3`,
      `${AUDIO_BASE_URL}/he/body-25.mp3`,
    ]);
    // Every non-optional item maps to a valid TTS segment; the cry is
    // optional and decorative.
    for (const item of items) {
      if (item.optional) {
        expect(item.segmentIndex).toBeNull();
      } else {
        expect(item.segmentIndex).toBeGreaterThanOrEqual(0);
        expect(item.segmentIndex).toBeLessThan(segments.length);
      }
    }
  });

  it("builds per-language URLs", () => {
    expect(hypeAudioUrl("en", 0)).toContain("/en/hype-0.mp3");
    expect(bodyAudioUrl("en", 151)).toContain("/en/body-151.mp3");
    expect(nameAudioUrl(1)).toContain("/name/1.mp3");
    expect(cryAudioUrl(25)).toContain("/cry/25.mp3");
  });

  it("pickRandomHypeIndex stays within the phrase list", () => {
    for (let i = 0; i < 200; i++) {
      const he = pickRandomHypeIndex("he");
      const en = pickRandomHypeIndex("en");
      expect(he).toBeGreaterThanOrEqual(0);
      expect(he).toBeLessThan(getHypePhrases("he").length);
      expect(en).toBeGreaterThanOrEqual(0);
      expect(en).toBeLessThan(getHypePhrases("en").length);
    }
  });

  it("has a recorded file for every URL the app can request (when generated)", () => {
    const audioDir = join(process.cwd(), "public", "audio");
    if (!existsSync(audioDir)) return; // recordings not generated in this checkout

    for (const language of ["he", "en"] as const) {
      getHypePhrases(language).forEach((_, i) => {
        expect(existsSync(join(audioDir, language, `hype-${i}.mp3`))).toBe(true);
      });
    }
    for (let id = 1; id <= 151; id++) {
      expect(existsSync(join(audioDir, "name", `${id}.mp3`))).toBe(true);
      expect(existsSync(join(audioDir, "he", `body-${id}.mp3`))).toBe(true);
      expect(existsSync(join(audioDir, "en", `body-${id}.mp3`))).toBe(true);
      expect(existsSync(join(audioDir, "cry", `${id}.mp3`))).toBe(true);
    }
  });
});
