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
import { hasEvolutionFamily } from "../utils/evolutions";
import { getTypeTheme, DEFAULT_THEME } from "../theme/typeColors";
import {
  COLORS,
  MIN_TOUCH,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../theme/colors";
import { lightTap } from "../utils/haptics";
import type { PokemonData } from "../types/pokemon";
import type { RootStackParamList } from "../navigation/types";

// Kept short on purpose — get to the Pokémon and its info fast.
const REVEAL_DURATION_MS = 600;
const SPEECH_DELAY_MS = 150;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation, route }: Props) {
  const { settings, strings, isRTL, updateSettings } = useSettings();
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
        // so only skip auto-speech when muted or when neither recordings
        // nor a voice can produce sound.
        if (
          settings.autoSpeech &&
          !settings.muted &&
          (speechAvailable || canPlayRecordings())
        ) {
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
      settings.muted,
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

  // Returning to a card (back button, history, evolutions) reads it
  // aloud right away, exactly like a fresh reveal.
  const speakIfEnabled = useCallback(
    (selected: PokemonData) => {
      if (
        settings.autoSpeech &&
        !settings.muted &&
        (speechAvailable || canPlayRecordings())
      ) {
        schedule(() => speakPokemon(selected), SPEECH_DELAY_MS);
      }
    },
    [
      settings.autoSpeech,
      settings.muted,
      speechAvailable,
      schedule,
      speakPokemon,
    ]
  );

  // Opened from the history or evolutions screen with a specific Pokémon.
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
        speakIfEnabled(selected);
      }
    }
  }, [
    route.params?.pokemonId,
    navigation,
    stop,
    cardOpacity,
    showPokemon,
    speakIfEnabled,
  ]);

  const goBackToPrevious = useCallback(() => {
    if (revealingRef.current || backStack.length === 0) return;
    unlockSpeech();
    unlockAudioPlayback();
    const previous = getPokemonById(backStack[backStack.length - 1]);
    setBackStack((stack) => stack.slice(0, -1));
    if (previous) {
      stop();
      setError(null);
      pokemonRef.current = previous;
      setPokemon(previous);
      cardOpacity.setValue(1);
      speakIfEnabled(previous);
    }
  }, [backStack, stop, cardOpacity, speakIfEnabled]);

  const toggleMute = useCallback(() => {
    if (!settings.muted) stop();
    updateSettings({ muted: !settings.muted });
  }, [settings.muted, stop, updateSettings]);

  const replay = useCallback(() => {
    if (!pokemon || isRevealing) return;
    unlockSpeech();
    unlockAudioPlayback();
    // Replay always makes sound — pressing it while muted unmutes.
    if (settings.muted) updateSettings({ muted: false });
    speakPokemon(pokemon);
  }, [pokemon, isRevealing, settings.muted, updateSettings, speakPokemon]);

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
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <Text style={styles.headerButtonIcon}>🕘</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Settings")}
            accessibilityRole="button"
            accessibilityLabel={strings.settingsButton}
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <Text style={styles.headerButtonIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      {/* All controls live up here so nothing requires scrolling. */}
      <View style={styles.controlBar}>
        <PrimaryButton
          label={`🎲 ${
            isRevealing
              ? strings.choosing
              : pokemon
                ? strings.chooseAnotherButton
                : strings.chooseButton
          }`}
          onPress={chooseRandom}
          color={theme.accent}
          disabled={isRevealing}
          style={styles.mainButton}
        />
        <View style={[styles.iconRow, isRTL && styles.headerRTL]}>
          <IconButton
            icon="↩️"
            label={strings.previousButton}
            onPress={goBackToPrevious}
            disabled={isRevealing || backStack.length === 0}
            accent={theme.accent}
          />
          <IconButton
            icon="🔊"
            label={strings.replayShort}
            onPress={replay}
            disabled={isRevealing || !pokemon}
            accent={theme.accent}
          />
          <IconButton
            icon="⏹️"
            label={strings.stopShort}
            onPress={stop}
            disabled={!isSpeaking}
            accent={theme.accent}
          />
          <IconButton
            icon={settings.muted ? "🔇" : "🎵"}
            label={settings.muted ? strings.unmuteButton : strings.muteButton}
            onPress={toggleMute}
            active={settings.muted}
            accent={theme.accent}
          />
          <IconButton
            icon="🧬"
            label={strings.evolutionsButton}
            onPress={() => {
              if (!pokemon) return;
              stop();
              navigation.navigate("Evolutions", { pokemonId: pokemon.id });
            }}
            disabled={isRevealing || !pokemon || !hasEvolutionFamily(pokemon)}
            accent={theme.accent}
          />
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
            <PokemonCard pokemon={pokemon} />
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyMarkWrap}>
              <Text style={styles.emptyMark}>?</Text>
            </View>
            <Text
              style={[
                styles.tagline,
                { writingDirection: isRTL ? "rtl" : "ltr" },
              ]}
            >
              {strings.tagline}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type IconButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  accent: string;
  disabled?: boolean;
  active?: boolean;
};

function IconButton({
  icon,
  label,
  onPress,
  accent,
  disabled,
  active,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, selected: !!active }}
      style={({ pressed }) => [
        styles.iconButton,
        active && { borderColor: accent, borderWidth: 2 },
        pressed && !disabled && styles.iconButtonPressed,
        disabled && styles.iconButtonDisabled,
      ]}
    >
      <Text style={styles.iconButtonIcon}>{icon}</Text>
      <Text style={styles.iconButtonLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
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
    minHeight: 64,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.whiteOverlay,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  title: {
    ...TYPOGRAPHY.screenTitle,
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
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    ...SHADOWS.subtle,
  },
  headerButtonPressed: {
    backgroundColor: COLORS.surfaceStrong,
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  headerButtonIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.l,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyMarkWrap: {
    width: 180,
    height: 180,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.whiteOverlay,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMark: {
    fontSize: 116,
    lineHeight: 132,
    fontWeight: "900",
    color: COLORS.placeholder,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.l,
    maxWidth: 440,
  },
  controlBar: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.s,
    gap: SPACING.s,
  },
  mainButton: {
    width: "100%",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.xs,
  },
  iconButton: {
    flex: 1,
    minHeight: MIN_TOUCH + 10,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xs,
    paddingHorizontal: 2,
    ...SHADOWS.subtle,
  },
  iconButtonPressed: {
    backgroundColor: COLORS.surfaceMuted,
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  iconButtonDisabled: {
    opacity: 0.35,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconButtonIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  iconButtonLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    lineHeight: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
