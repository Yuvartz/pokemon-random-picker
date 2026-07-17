import { buildSpeechSegments } from "../utils/speechText";
import {
  HYPE_PHRASES_EN,
  HYPE_PHRASES_HE,
  pickRandomHype,
} from "../data/hypePhrases";
import { ALL_POKEMON, getPokemonById } from "../data/pokemon";

describe("buildSpeechSegments", () => {
  it("speaks the name in English even in Hebrew mode", () => {
    const pikachu = getPokemonById(25)!;
    const segments = buildSpeechSegments(pikachu, "he", "וואו!");
    expect(segments).toEqual([
      { text: "וואו!", language: "he" },
      { text: "Pikachu.", language: "en" },
      { text: pikachu.speechBodyHe, language: "he" },
    ]);
  });

  it("builds pure-English segments in English mode", () => {
    const pikachu = getPokemonById(25)!;
    const segments = buildSpeechSegments(pikachu, "en", "Wow!");
    expect(segments.every((s) => s.language === "en")).toBe(true);
    expect(segments[1].text).toBe("Pikachu.");
    expect(segments[2].text).toContain("Pokémon number twenty-five");
  });

  it("omits the hype segment when not provided", () => {
    const mew = getPokemonById(151)!;
    const segments = buildSpeechSegments(mew, "he");
    expect(segments).toHaveLength(2);
    expect(segments[0].language).toBe("en");
  });

  it("uses symbol-free English speech names (e.g. Nidoran)", () => {
    const nidoranF = getPokemonById(29)!;
    const segments = buildSpeechSegments(nidoranF, "he");
    expect(segments[0].text).toBe("Female Nidoran.");
    expect(segments[0].text).not.toMatch(/[♀♂]/);
  });

  it("every Pokémon has a speech body in both languages", () => {
    for (const p of ALL_POKEMON) {
      expect(p.englishSpeechName.length).toBeGreaterThan(0);
      expect(p.speechBodyHe).toContain("פוקימון מספר");
      expect(p.speechBodyEn).toContain("Pokémon number");
    }
  });
});

describe("hype phrases", () => {
  it("has multiple phrases per language", () => {
    expect(HYPE_PHRASES_HE.length).toBeGreaterThanOrEqual(5);
    expect(HYPE_PHRASES_EN.length).toBeGreaterThanOrEqual(5);
  });

  it("pickRandomHype returns a phrase from the right language list", () => {
    for (let i = 0; i < 50; i++) {
      expect(HYPE_PHRASES_HE).toContain(pickRandomHype("he"));
      expect(HYPE_PHRASES_EN).toContain(pickRandomHype("en"));
    }
  });
});
