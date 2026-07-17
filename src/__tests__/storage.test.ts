jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import {
  DEFAULT_SETTINGS,
  parseHistory,
  parseSettings,
  serializeSettings,
  type Settings,
} from "../services/storage";

describe("settings serialization", () => {
  it("round-trips settings", () => {
    const settings: Settings = {
      language: "en",
      autoSpeech: false,
      speechRate: "fast",
      haptics: false,
    };
    expect(parseSettings(serializeSettings(settings))).toEqual(settings);
  });

  it("returns defaults for null or malformed input", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("not json {{")).toEqual(DEFAULT_SETTINGS);
  });

  it("fixes invalid fields one by one", () => {
    const parsed = parseSettings(
      JSON.stringify({ language: "fr", autoSpeech: false, speechRate: "warp" })
    );
    expect(parsed.language).toBe(DEFAULT_SETTINGS.language);
    expect(parsed.autoSpeech).toBe(false);
    expect(parsed.speechRate).toBe(DEFAULT_SETTINGS.speechRate);
    expect(parsed.haptics).toBe(DEFAULT_SETTINGS.haptics);
  });

  it("defaults to Hebrew with auto-speech on", () => {
    expect(DEFAULT_SETTINGS.language).toBe("he");
    expect(DEFAULT_SETTINGS.autoSpeech).toBe(true);
  });
});

describe("history parsing", () => {
  it("parses valid history and drops malformed entries", () => {
    const raw = JSON.stringify([
      { pokemonId: 25, selectedAt: 1000 },
      { bogus: true },
      { pokemonId: "1", selectedAt: 2000 },
      { pokemonId: 151, selectedAt: 3000 },
    ]);
    expect(parseHistory(raw)).toEqual([
      { pokemonId: 25, selectedAt: 1000 },
      { pokemonId: 151, selectedAt: 3000 },
    ]);
  });

  it("returns an empty list for null or malformed input", () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory("oops")).toEqual([]);
    expect(parseHistory(JSON.stringify({ nope: 1 }))).toEqual([]);
  });

  it("caps history at 20 entries", () => {
    const raw = JSON.stringify(
      Array.from({ length: 40 }, (_, i) => ({
        pokemonId: (i % 151) + 1,
        selectedAt: i,
      }))
    );
    expect(parseHistory(raw)).toHaveLength(20);
  });
});
