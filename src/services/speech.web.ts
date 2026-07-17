/**
 * Web implementation of the speech service (Metro picks *.web.ts on web).
 *
 * Uses the browser's SpeechSynthesis API directly instead of expo-speech,
 * because mobile browsers need special care:
 *
 * 1. Autoplay policy — speech that does not start inside a user tap is
 *    blocked. `unlockSpeech()` is called synchronously from the main
 *    button's press handler and speaks a silent utterance, which unlocks
 *    the engine so the delayed automatic speech is allowed afterwards.
 * 2. Lazy voice loading — `getVoices()` returns an empty list until the
 *    `voiceschanged` event fires, so availability is checked only after
 *    voices actually load (with a timeout fallback).
 * 3. Long utterances get cut off (~15s in Chrome) — text is split into
 *    short sentence chunks spoken back-to-back.
 * 4. Hebrew may be reported as "he", "he-IL", "he_IL" or the legacy "iw"
 *    code depending on the platform — all are matched.
 */
import type { Language, SpeechSegment } from "../types/pokemon";
import { splitSpeechText } from "../utils/speechChunks";

export type SpeechRateSetting = "slow" | "normal" | "fast";

export const SPEECH_RATE_VALUES: Record<SpeechRateSetting, number> = {
  slow: 0.8,
  normal: 1.0,
  fast: 1.25,
};

const SPEECH_LOCALES: Record<Language, string> = {
  he: "he-IL",
  en: "en-US",
};

const LANGUAGE_PREFIXES: Record<Language, string[]> = {
  he: ["he", "iw"],
  en: ["en"],
};

export type SpeakOptions = {
  rate: SpeechRateSetting;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
};

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return "speechSynthesis" in window ? window.speechSynthesis : null;
}

let utteranceToken = 0;
// Chrome garbage-collects utterances that lose their JS reference,
// which kills their callbacks mid-speech. Keep the current ones alive.
let liveUtterances: SpeechSynthesisUtterance[] = [];
let unlocked = false;

function normalizeLang(lang: string | undefined): string {
  return (lang ?? "").toLowerCase().replace("_", "-");
}

function voiceMatches(voice: SpeechSynthesisVoice, language: Language): boolean {
  const lang = normalizeLang(voice.lang);
  return LANGUAGE_PREFIXES[language].some((p) => lang.startsWith(p));
}

/** Waits for the async voice list (empty until `voiceschanged` on Chrome). */
function loadVoices(timeoutMs = 2500): Promise<SpeechSynthesisVoice[]> {
  const synth = getSynth();
  if (!synth) return Promise.resolve([]);

  const immediate = synth.getVoices();
  if (immediate.length > 0) return Promise.resolve(immediate);

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener?.("voiceschanged", finish);
      resolve(synth.getVoices());
    };
    synth.addEventListener?.("voiceschanged", finish);
    setTimeout(finish, timeoutMs);
  });
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  language: Language
): SpeechSynthesisVoice | undefined {
  const matching = voices.filter((v) => voiceMatches(v, language));
  if (matching.length === 0) return undefined;
  return (
    matching.find((v) => v.default) ??
    matching.find((v) => v.localService) ??
    matching[0]
  );
}

/**
 * Must be called synchronously inside a user tap (button press).
 * Speaks a silent utterance so the browser counts speech as
 * user-initiated, allowing the delayed automatic speech that follows.
 */
export function unlockSpeech(): void {
  const synth = getSynth();
  if (!synth || unlocked) return;
  try {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    utterance.rate = 2;
    synth.speak(utterance);
    unlocked = true;
  } catch {
    // Unlocking is best-effort.
  }
}

/** True when a voice for the language exists (optimistic when unknown). */
export async function getSpeechAvailability(
  language: Language
): Promise<boolean> {
  const synth = getSynth();
  if (!synth) return false;
  const voices = await loadVoices();
  // Some engines never report their voice list; assume speech works and
  // rely on runtime onError handling instead of blocking the feature.
  if (voices.length === 0) return true;
  return voices.some((v) => voiceMatches(v, language));
}

/**
 * Stops any current speech and speaks the segments one after another,
 * each with its own language voice (e.g. the Pokémon name in English,
 * the details in Hebrew). Speech never overlaps (utterance token guard).
 */
export function speak(segments: SpeechSegment[], options: SpeakOptions): void {
  const synth = getSynth();
  if (!synth) {
    options.onError?.(new Error("Speech synthesis is not supported"));
    return;
  }

  const token = ++utteranceToken;
  const isCurrent = () => token === utteranceToken;

  try {
    synth.cancel();
  } catch {
    // Ignore: some engines throw when nothing is queued.
  }

  void loadVoices().then((voices) => {
    if (!isCurrent()) return;

    // Flatten segments into short language-tagged chunks.
    const queue = segments
      .filter((s) => s.text.trim().length > 0)
      .flatMap((s) =>
        splitSpeechText(s.text).map((chunk) => ({
          text: chunk,
          language: s.language,
        }))
      );
    if (queue.length === 0) {
      options.onDone?.();
      return;
    }

    liveUtterances = [];
    let started = false;
    let index = 0;

    const speakNext = () => {
      if (!isCurrent()) return;
      if (index >= queue.length) {
        options.onDone?.();
        return;
      }
      const item = queue[index++];
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = SPEECH_LOCALES[item.language];
      const voice = pickVoice(voices, item.language);
      if (voice) utterance.voice = voice;
      utterance.rate = SPEECH_RATE_VALUES[options.rate];
      utterance.onstart = () => {
        if (isCurrent() && !started) {
          started = true;
          options.onStart?.();
        }
      };
      utterance.onend = () => speakNext();
      utterance.onerror = (event) => {
        if (!isCurrent()) return;
        // cancel() fires "canceled"/"interrupted" — that is a stop, not a failure.
        if (event.error === "canceled" || event.error === "interrupted") {
          options.onDone?.();
          return;
        }
        options.onError?.(event.error ?? event);
      };
      liveUtterances.push(utterance);
      synth.speak(utterance);
    };

    // Chrome needs a short beat after cancel() before speaking again,
    // otherwise the new utterance is silently dropped.
    setTimeout(speakNext, 60);
  });
}

/** Stops speech immediately. Safe to call even when nothing is playing. */
export function stopSpeech(): void {
  utteranceToken++;
  liveUtterances = [];
  try {
    getSynth()?.cancel();
  } catch {
    // Stopping must never crash the app.
  }
}
