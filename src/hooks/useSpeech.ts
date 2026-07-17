import { useCallback, useEffect, useRef, useState } from "react";
import { speak, stopSpeech } from "../services/speech";
import { useSettings } from "../context/SettingsContext";
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
      const text =
        settings.language === "he"
          ? pokemon.speechTextHe
          : pokemon.speechTextEn;
      setSpeechFailed(false);
      speak(text, {
        language: settings.language,
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
