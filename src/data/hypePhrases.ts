import phrases from "./hypePhrases.json";
import type { Language } from "../types/pokemon";

/**
 * Fun opening lines spoken before the Pokémon's name — a different one is
 * picked at random on every announcement. The JSON file is the single
 * source of truth: the audio generation script records one file per
 * phrase, matched to the app by array index. After adding phrases, run
 * `npm run generate:audio` to record the new ones.
 */
export const HYPE_PHRASES_HE: string[] = phrases.he;
export const HYPE_PHRASES_EN: string[] = phrases.en;

export function getHypePhrases(language: Language): string[] {
  return language === "he" ? HYPE_PHRASES_HE : HYPE_PHRASES_EN;
}

/** Index into the language's phrase list (also selects the audio file). */
export function pickRandomHypeIndex(language: Language): number {
  return Math.floor(Math.random() * getHypePhrases(language).length);
}

export function pickRandomHype(language: Language): string {
  return getHypePhrases(language)[pickRandomHypeIndex(language)];
}
