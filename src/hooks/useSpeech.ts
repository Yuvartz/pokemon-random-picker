import { useCallback, useEffect, useRef, useState } from "react";
import { speak, stopSpeech } from "../services/speech";
import { useSettings } from "../context/SettingsContext";
import { buildSpeechSegments } from "../utils/speechText";
import { pickRandomHype } from "../data/hypePhrases";
import type { PokemonData } from "../types/pokemon";

/**
 * Owns all speech state for a screen: speaking indicator, error flag,
 * and guaranteed cleanup when the screen unmounts or language changes.
 */
export function useSpeech() {
  const { settings } = useSettings();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechFailed, setSpeechFailed] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stopSpeech();
    };
  }, []);

  // Changing the app language must stop any speech in the old language.
  useEffect(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, [settings.language]);

  const speakPokemon = useCallback(
    (pokemon: PokemonData) => {
      // A different excited opener every time, then the name (always in
      // English — Hebrew voices misread transliterated names), then the
      // details in the app language.
      const segments = buildSpeechSegments(
        pokemon,
        settings.language,
        pickRandomHype(settings.language)
      );
      setSpeechFailed(false);
      speak(segments, {
        rate: settings.speechRate,
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
      });
    },
    [settings.language, settings.speechRate]
  );

  const stop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speechFailed, speakPokemon, stop };
}
