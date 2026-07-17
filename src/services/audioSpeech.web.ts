/**
 * Web implementation of recorded-announcement playback.
 *
 * Plays a playlist of MP3 recordings (hype → name → body) through a
 * small pool of reusable HTMLAudioElements. Mobile browsers only allow
 * audio that a user gesture "unlocked"; unlockAudioPlayback() is called
 * from the pick button's tap and primes every pooled element (a muted
 * play/pause), after which delayed programmatic playback is permitted.
 *
 * Any element that fails (network, 404, decode) triggers onFallback with
 * the playlist index, so the caller can continue from the same spot with
 * the device's text-to-speech.
 */
import type { SpeechRateSetting } from "./speech";
import type { AnnouncementItem } from "./audioUrls";

export type AudioPlaybackOptions = {
  rate: SpeechRateSetting;
  onStart?: () => void;
  onDone?: () => void;
  onFallback?: (fromSegmentIndex: number) => void;
};

/** Playback speeds for recordings (slightly gentler than the TTS range). */
const PLAYBACK_RATES: Record<SpeechRateSetting, number> = {
  slow: 0.85,
  normal: 1.0,
  fast: 1.2,
};

const POOL_SIZE = 3; // hype, name, body

let pool: HTMLAudioElement[] | null = null;
let unlocked = false;
let playToken = 0;

function audioSupported(): boolean {
  return typeof window !== "undefined" && typeof window.Audio === "function";
}

function getPool(): HTMLAudioElement[] {
  if (!pool) {
    pool = Array.from({ length: POOL_SIZE }, () => {
      const el = new Audio();
      el.preload = "auto";
      return el;
    });
  }
  return pool;
}

/**
 * Must be called synchronously inside a user tap. Primes the pooled
 * elements so later programmatic playback is allowed by the browser.
 */
export function unlockAudioPlayback(): void {
  if (!audioSupported() || unlocked) return;
  try {
    for (const el of getPool()) {
      el.muted = true;
      const attempt = el.play();
      if (attempt && typeof attempt.then === "function") {
        attempt
          .then(() => {
            el.pause();
            el.muted = false;
          })
          .catch(() => {
            el.muted = false;
          });
      } else {
        el.pause();
        el.muted = false;
      }
    }
    unlocked = true;
  } catch {
    // Unlocking is best-effort; playback will fall back to TTS if blocked.
  }
}

/** Plays the playlist in order. Never overlaps (token guard). */
export function playAnnouncement(
  items: AnnouncementItem[],
  options: AudioPlaybackOptions
): void {
  if (!audioSupported() || items.length === 0) {
    options.onFallback?.(0);
    return;
  }

  const token = ++playToken;
  const isCurrent = () => token === playToken;
  const elements = getPool();
  stopPool();

  const rate = PLAYBACK_RATES[options.rate];
  let started = false;
  let index = 0;

  // Preload every clip up front so the sequence plays without gaps.
  items.forEach((item, i) => {
    const el = elements[i % elements.length];
    if (el.src !== item.url) {
      el.src = item.url;
      el.load();
    }
  });

  const playNext = () => {
    if (!isCurrent()) return;
    if (index >= items.length) {
      options.onDone?.();
      return;
    }
    const current = index;
    const item = items[current];
    const el = elements[current % elements.length];
    el.playbackRate = rate;
    el.currentTime = 0;
    el.muted = false;
    el.volume = item.volume ?? 1;

    const advance = () => {
      index = current + 1;
      playNext();
    };
    const fail = () => {
      if (item.optional) {
        // Decorative clip (e.g. the cry) — just move on.
        advance();
        return;
      }
      clearHandlers();
      options.onFallback?.(item.segmentIndex ?? 0);
    };

    el.onended = () => {
      if (isCurrent()) advance();
    };
    el.onerror = () => {
      if (isCurrent()) fail();
    };

    const attempt = el.play();
    if (attempt && typeof attempt.then === "function") {
      attempt
        .then(() => {
          if (isCurrent() && !started) {
            started = true;
            options.onStart?.();
          }
        })
        .catch(() => {
          if (isCurrent()) fail();
        });
    } else if (!started) {
      started = true;
      options.onStart?.();
    }
  };

  playNext();
}

function clearHandlers(): void {
  if (!pool) return;
  for (const el of pool) {
    el.onended = null;
    el.onerror = null;
  }
}

function stopPool(): void {
  if (!pool) return;
  for (const el of pool) {
    el.onended = null;
    el.onerror = null;
    try {
      el.pause();
    } catch {
      // Pausing must never throw upward.
    }
  }
}

/** Stops playback immediately. Safe to call when nothing is playing. */
export function stopAnnouncement(): void {
  playToken++;
  stopPool();
}

/** Recordings work on any browser with audio — no TTS voices needed. */
export function canPlayRecordings(): boolean {
  return audioSupported();
}
