import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language } from "../types/pokemon";
import type { SpeechRateSetting } from "./speech";

export type Settings = {
  language: Language;
  autoSpeech: boolean;
  speechRate: SpeechRateSetting;
  haptics: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  language: "he",
  autoSpeech: true,
  speechRate: "normal",
  haptics: true,
};

export type HistoryEntry = {
  pokemonId: number;
  selectedAt: number; // epoch millis
};

export const MAX_HISTORY_ENTRIES = 20;

const SETTINGS_KEY = "@pokepicker/settings";
const HISTORY_KEY = "@pokepicker/history";

/**
 * Pure parser so settings restoration is unit-testable.
 * Unknown or malformed values fall back to defaults field-by-field.
 */
export function parseSettings(raw: string | null): Settings {
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      language:
        parsed.language === "en" || parsed.language === "he"
          ? parsed.language
          : DEFAULT_SETTINGS.language,
      autoSpeech:
        typeof parsed.autoSpeech === "boolean"
          ? parsed.autoSpeech
          : DEFAULT_SETTINGS.autoSpeech,
      speechRate:
        parsed.speechRate === "slow" ||
        parsed.speechRate === "normal" ||
        parsed.speechRate === "fast"
          ? parsed.speechRate
          : DEFAULT_SETTINGS.speechRate,
      haptics:
        typeof parsed.haptics === "boolean"
          ? parsed.haptics
          : DEFAULT_SETTINGS.haptics,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify(settings);
}

export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is HistoryEntry =>
          e != null &&
          typeof e.pokemonId === "number" &&
          typeof e.selectedAt === "number"
      )
      .slice(0, MAX_HISTORY_ENTRIES);
  } catch {
    return [];
  }
}

export async function loadSettings(): Promise<Settings> {
  try {
    return parseSettings(await AsyncStorage.getItem(SETTINGS_KEY));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, serializeSettings(settings));
  } catch {
    // Persistence failures should never break the app.
  }
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    return parseHistory(await AsyncStorage.getItem(HISTORY_KEY));
  } catch {
    return [];
  }
}

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES))
    );
  } catch {
    // Persistence failures should never break the app.
  }
}
