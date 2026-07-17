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

export type AnnouncementItem = {
  url: string;
  /**
   * Index into the buildSpeechSegments array to resume from with TTS if
   * this clip fails, or null for decorative clips (like the cry) that
   * are simply skipped on failure.
   */
  segmentIndex: number | null;
  /** Failure skips the clip instead of triggering the TTS fallback. */
  optional?: boolean;
  /** Playback volume 0..1 (cries are loud; they get lowered a bit). */
  volume?: number;
};

/**
 * The full announcement playlist: hype opener → name → details.
 * The segmentIndex fields keep it aligned with buildSpeechSegments so a
 * failure can continue from the same spot with text-to-speech.
 */
export function buildAnnouncementItems(
  pokemon: PokemonData,
  language: Language,
  hypeIndex: number
): AnnouncementItem[] {
  return [
    { url: hypeAudioUrl(language, hypeIndex), segmentIndex: 0 },
    { url: nameAudioUrl(pokemon.id), segmentIndex: 1 },
    { url: bodyAudioUrl(language, pokemon.id), segmentIndex: 2 },
  ];
}
