import { useCallback, useEffect, useRef, useState } from "react";
import { speak, stopSpeech } from "../services/speech";
import {
  playAnnouncement,
  stopAnnouncement,
} from "../services/audioSpeech";
import { buildAnnouncementUrls } from "../services/audioUrls";
import { useSettings } from "../context/SettingsContext";
import { buildSpeechSegments } from "../utils/speechText";
import { getHypePhrases, pickRandomHypeIndex } from "../data/hypePhrases";
import type { PokemonData } from "../types/pokemon";

/**
 * Owns all speech state for a screen: speaking indicator, error flag,
 * and guaranteed cleanup when the screen unmounts or language changes.
 *
 * Announcements prefer the studio-quality recordings (see audioSpeech);
 * if playback fails at any point, the device's text-to-speech continues
 * from the same segment.
 */
export function useSpeech() {
  const { settings } = useSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechFailed, setSpeechFailed] = useState(false);
  const mounted = useRef(true);

  const stopAll = useCallback(() => {
    stopAnnouncement();
    stopSpeech();
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stopAll();
    };
  }, [stopAll]);

  // Changing the app language must stop any speech in the old language.
  useEffect(() => {
    stopAll();
    setIsSpeaking(false);
  }, [settings.language, stopAll]);

  const speakPokemon = useCallback(
    (pokemon: PokemonData) => {
      const language = settings.language;
      // A different excited opener every time, then the name (always in
      // English — Hebrew voices misread transliterated names), then the
      // details in the app language.
      const hypeIndex = pickRandomHypeIndex(language);
      const segments = buildSpeechSegments(
        pokemon,
        language,
        getHypePhrases(language)[hypeIndex]
      );
      setSpeechFailed(false);

      const callbacks = {
        onStart: () => {
          if (mounted.current) setIsSpeaking(true);
        },
        onDone: () => {
          if (mounted.current) setIsSpeaking(false);
        },
        onError: () => {
          if (mounted.current) {
            setIsSpeaking(false);
            setSpeechFailed(true);
          }
        },
      };

      playAnnouncement(buildAnnouncementUrls(pokemon, language, hypeIndex), {
        rate: settings.speechRate,
        onStart: callbacks.onStart,
        onDone: callbacks.onDone,
        onFallback: (fromIndex) => {
          // Recording unavailable — continue from the same spot with TTS.
          speak(segments.slice(fromIndex), {
            rate: settings.speechRate,
            ...callbacks,
          });
        },
      });
    },
    [settings.language, settings.speechRate]
  );

  const stop = useCallback(() => {
    stopAll();
    setIsSpeaking(false);
  }, [stopAll]);

  return { isSpeaking, speechFailed, speakPokemon, stop };
}
