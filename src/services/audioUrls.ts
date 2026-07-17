import type { Language, PokemonData } from "../types/pokemon";

/**
 * Recorded studio-quality announcements, generated once by
 * scripts/generate-audio.ts and hosted with the web app.
 * Absolute URLs so they work in dev, on the published site, and in
 * the native app alike.
 */
export const AUDIO_BASE_URL =
  "https://yuvartz.github.io/pokemon-random-picker/audio";

export function hypeAudioUrl(language: Language, index: number): string {
  return `${AUDIO_BASE_URL}/${language}/hype-${index}.mp3`;
}

export function nameAudioUrl(pokemonId: number): string {
  return `${AUDIO_BASE_URL}/name/${pokemonId}.mp3`;
}

export function bodyAudioUrl(language: Language, pokemonId: number): string {
  return `${AUDIO_BASE_URL}/${language}/body-${pokemonId}.mp3`;
}

/**
 * The full announcement playlist, parallel to the speech segments built
 * by buildSpeechSegments (hype → name → body), so a playback failure at
 * index N can fall back to TTS from segment N.
 */
export function buildAnnouncementUrls(
  pokemon: PokemonData,
  language: Language,
  hypeIndex: number
): string[] {
  return [
    hypeAudioUrl(language, hypeIndex),
    nameAudioUrl(pokemon.id),
    bodyAudioUrl(language, pokemon.id),
  ];
}
