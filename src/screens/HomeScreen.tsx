import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PokemonCard } from "../components/PokemonCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { LoadingReveal } from "../components/LoadingReveal";
import { ErrorMessage } from "../components/ErrorMessage";
import { useSettings } from "../context/SettingsContext";
import { useHistory } from "../context/HistoryContext";
import { useSpeech } from "../hooks/useSpeech";
import { getSpeechAvailability, unlockSpeech } from "../services/speech";
import {
  canPlayRecordings,
  unlockAudioPlayback,
} from "../services/audioSpeech";
import { getPokemonById } from "../data/pokemon";
import { getRandomPokemonId } from "../utils/random";
import { getTypeTheme, DEFAULT_THEME } from "../theme/typeColors";
import { COLORS, MIN_TOUCH, SPACING } from "../theme/colors";
import { lightTap } from "../utils/haptics";
import type { PokemonData } from "../types/pokemon";
import type { RootStackParamList } from "../navigation/types";

const REVEAL_DURATION_MS = 1000;
const SPEECH_DELAY_MS = 500;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation, route }: Props) {
  const { settings, strings, isRTL } = useSettings();
  const { addToHistory } = useHistory();
  const { isSpeaking, speechFailed, speakPokemon, stop } = useSpeech();

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechAvailable, setSpeechAvailable] = useState(true);
  // Previously shown Pokémon in this session, most recent last.
  const [backStack, setBackStack] = useState<number[]>([]);
  const pokemonRef = useRef<PokemonData | null>(null);

  const showPokemon = useCallback((next: PokemonData) => {
    const previous = pokemonRef.current;
    if (previous && previous.id !== next.id) {
      setBackStack((stack) => [...stack.slice(-49), previous.id]);
    }
    pokemonRef.current = next;
    setPokemon(next);
  }, []);

  const cardOpacity = useRef(new Animated.Value(1)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Ref mirror of isRevealing so rapid taps are blocked synchronously.
  const revealingRef = useRef(false);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Best-effort check that a voice exists for the selected language.
  useEffect(() => {
    let cancelled = false;
    getSpeechAvailability(settings.language)
      .then((available) => {
        if (!cancelled) setSpeechAvailable(available);
      })
      .catch(() => {
        // If the check itself fails, keep speech enabled and rely on onError.
      });
    return () => {
      cancelled = true;
    };
  }, [settings.language]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const revealPokemon = useCallback(
    (id: number, withRevealAnimation: boolean) => {
      if (revealingRef.current) return;

      stop();
      setError(null);
      const selected = getPokemonById(id);
      if (!selected) {
        setError(strings.errorGeneric);
        return;
      }

      revealingRef.current = true;
      setIsRevealing(true);
      lightTap(settings.haptics);

      const finish = () => {
        showPokemon(selected);
        addToHistory(selected.id);
        setIsRevealing(false);
        revealingRef.current = false;

        cardOpacity.setValue(0);
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Recorded announcements play regardless of installed TTS voices,
        // so only skip auto-speech when neither recordings nor a voice
        // can produce sound.
        if (settings.autoSpeech && (speechAvailable || canPlayRecordings())) {
          schedule(() => speakPokemon(selected), SPEECH_DELAY_MS);
        }
      };

      if (withRevealAnimation) {
        schedule(finish, REVEAL_DURATION_MS);
      } else {
        finish();
      }
    },
    [
      stop,
      strings.errorGeneric,
      settings.haptics,
      settings.autoSpeech,
      speechAvailable,
      addToHistory,
      cardOpacity,
      schedule,
      speakPokemon,
      showPokemon,
    ]
  );

  const chooseRandom = useCallback(() => {
    // Must run synchronously inside the tap: unlocks browser speech and
    // audio playback so the delayed automatic reading is allowed
    // (both are no-ops on iOS/Android native).
    unlockSpeech();
    unlockAudioPlayback();
    revealPokemon(getRandomPokemonId(), true);
  }, [revealPokemon]);

  // Opened from the history screen with a specific Pokémon.
  useEffect(() => {
    const requestedId = route.params?.pokemonId;
    if (requestedId != null) {
      navigation.setParams({ pokemonId: undefined });
      const selected = getPokemonById(requestedId);
      if (selected) {
        stop();
        setError(null);
        showPokemon(selected);
        cardOpacity.setValue(1);
      }
    }
  }, [route.params?.pokemonId, navigation, stop, cardOpacity, showPokemon]);

  const goBackToPrevious = useCallback(() => {
    if (revealingRef.current || backStack.length === 0) return;
    const previous = getPokemonById(backStack[backStack.length - 1]);
    setBackStack((stack) => stack.slice(0, -1));
    if (previous) {
      stop();
      setError(null);
      pokemonRef.current = previous;
      setPokemon(previous);
      cardOpacity.setValue(1);
    }
  }, [backStack, stop, cardOpacity]);

  const theme = pokemon ? getTypeTheme(pokemon.types[0]) : DEFAULT_THEME;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <Text style={styles.title} accessibilityRole="header">
          {strings.appTitle}
        </Text>
        <View style={[styles.headerButtons, isRTL && styles.headerRTL]}>
          <Pressable
            onPress={() => navigation.navigate("History")}
            accessibilityRole="button"
            accessibilityLabel={strings.historyButton}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonIcon}>🕘</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Settings")}
            accessibilityRole="button"
            accessibilityLabel={strings.settingsButton}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && <ErrorMessage message={error} />}
        {!speechAvailable && !canPlayRecordings() && (
          <ErrorMessage message={strings.speechUnavailable} />
        )}
        {speechFailed && (speechAvailable || canPlayRecordings()) && (
          <ErrorMessage message={strings.speechErrorShort} />
        )}

        {isRevealing ? (
          <LoadingReveal />
        ) : pokemon ? (
          <Animated.View style={{ opacity: cardOpacity, width: "100%" }}>
            <PokemonCard
              pokemon={pokemon}
              isSpeaking={isSpeaking}
              onReplaySpeech={() => speakPokemon(pokemon)}
              onStopSpeech={stop}
              onShowEvolutions={() => {
                stop();
                navigation.navigate("Evolutions", { pokemonId: pokemon.id });
              }}
            />
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyMark}>?</Text>
            <Text style={styles.tagline}>{strings.tagline}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.footerButtons, isRTL && styles.headerRTL]}>
          {backStack.length > 0 && (
            <Pressable
              onPress={goBackToPrevious}
              disabled={isRevealing}
              accessibilityRole="button"
              accessibilityLabel={strings.previousButton}
              accessibilityState={{ disabled: isRevealing }}
              style={({ pressed }) => [
                styles.backButtonFooter,
                {
                  borderColor: theme.accent,
                  opacity: isRevealing ? 0.5 : pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.backButtonFooterText, { color: theme.accent }]}>
                ↩️ {strings.previousButton}
              </Text>
            </Pressable>
          )}
          <PrimaryButton
            label={
              isRevealing
                ? strings.choosing
                : pokemon
                  ? strings.chooseAnotherButton
                  : strings.chooseButton
            }
            onPress={chooseRandom}
            color={theme.accent}
            disabled={isRevealing}
            style={styles.mainButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    flexShrink: 1,
  },
  headerButtons: {
    flexDirection: "row",
    gap: SPACING.s,
  },
  headerButton: {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonIcon: {
    fontSize: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyMark: {
    fontSize: 140,
    fontWeight: "800",
    color: COLORS.placeholder,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.m,
    paddingHorizontal: SPACING.l,
  },
  footer: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.s,
    paddingBottom: SPACING.l,
  },
  footerButtons: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: SPACING.s,
  },
  mainButton: {
    flex: 1,
  },
  backButtonFooter: {
    minHeight: 56,
    minWidth: MIN_TOUCH,
    borderRadius: 28,
    borderWidth: 2,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonFooterText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
