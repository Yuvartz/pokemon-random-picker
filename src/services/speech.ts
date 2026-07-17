import * as Speech from "expo-speech";
import type { Language } from "../types/pokemon";

export type SpeechRateSetting = "slow" | "normal" | "fast";

/** Safe rates that stay understandable on both iOS and Android engines. */
export const SPEECH_RATE_VALUES: Record<SpeechRateSetting, number> = {
  slow: 0.8,
  normal: 1.0,
  fast: 1.25,
};

const SPEECH_LOCALES: Record<Language, string> = {
  he: "he-IL",
  en: "en-US",
};

export type SpeakOptions = {
  language: Language;
  rate: SpeechRateSetting;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
};

const LANGUAGE_PREFIXES: Record<Language, string[]> = {
  he: ["he", "iw"], // "iw" is the legacy Hebrew code some engines report
  en: ["en"],
};

/**
 * No-op on native platforms. On web (see speech.web.ts) this must be
 * called inside a user tap to satisfy the browser's autoplay policy.
 */
export function unlockSpeech(): void {}

/** True when a voice for the language exists (optimistic when unknown). */
export async function getSpeechAvailability(
  language: Language
): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    // Some engines report an empty list even when speech works; assume OK
    // and rely on runtime onError handling instead of blocking the feature.
    if (voices.length === 0) return true;
    return voices.some((voice) => {
      const lang = (voice.language ?? "").toLowerCase().replace("_", "-");
      return LANGUAGE_PREFIXES[language].some((p) => lang.startsWith(p));
    });
  } catch {
    return true;
  }
}

// Incremented on every speak/stop so callbacks from an interrupted
// utterance can never overwrite the state of a newer one.
let utteranceToken = 0;

/**
 * Stops any current speech and starts a new utterance.
 * Guarantees speech never overlaps.
 */
export function speak(text: string, options: SpeakOptions): void {
  const token = ++utteranceToken;
  const isCurrent = () => token === utteranceToken;

  try {
    Speech.stop();
    Speech.speak(text, {
      language: SPEECH_LOCALES[options.language],
      rate: SPEECH_RATE_VALUES[options.rate],
      onStart: () => {
        if (isCurrent()) options.onStart?.();
      },
      onDone: () => {
        if (isCurrent()) options.onDone?.();
      },
      onStopped: () => {
        if (isCurrent()) options.onDone?.();
      },
      onError: (error) => {
        if (isCurrent()) options.onError?.(error);
      },
    });
  } catch (error) {
    options.onError?.(error);
  }
}

/** Stops speech immediately. Safe to call even when nothing is playing. */
export function stopSpeech(): void {
  utteranceToken++;
  try {
    Speech.stop();
  } catch {
    // Stopping must never crash the app.
  }
}
