/**
 * Native placeholder for recorded-announcement playback.
 *
 * On web (audioSpeech.web.ts) the app plays studio-quality recordings;
 * on iOS/Android (Expo Go) it reports "not supported" so the caller
 * falls back to the device's native text-to-speech, which works well
 * there. This keeps the native app free of extra audio dependencies.
 */
import type { SpeechRateSetting } from "./speech";
import type { AnnouncementItem } from "./audioUrls";

export type AudioPlaybackOptions = {
  rate: SpeechRateSetting;
  onStart?: () => void;
  onDone?: () => void;
  /** Called instead of onDone when playback cannot proceed; the argument
   * is the speech-segment index to resume from with TTS. */
  onFallback?: (fromSegmentIndex: number) => void;
};

export function playAnnouncement(
  _items: AnnouncementItem[],
  options: AudioPlaybackOptions
): void {
  options.onFallback?.(0);
}

/** Native builds have no recorded-audio player — speech relies on TTS. */
export function canPlayRecordings(): boolean {
  return false;
}

export function stopAnnouncement(): void {}

export function unlockAudioPlayback(): void {}
