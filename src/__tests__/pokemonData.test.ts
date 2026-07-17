import { ALL_POKEMON, getPokemonById } from "../data/pokemon";

describe("local Pokémon data", () => {
  it("contains all 151 Pokémon exactly once", () => {
    expect(ALL_POKEMON).toHaveLength(151);
    const ids = ALL_POKEMON.map((p) => p.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 151 }, (_, i) => i + 1));
  });

  it("every Pokémon has English and Hebrew names", () => {
    for (const p of ALL_POKEMON) {
      expect(p.englishName.length).toBeGreaterThan(0);
      expect(p.hebrewName.length).toBeGreaterThan(0);
      expect(p.hebrewPronunciation.length).toBeGreaterThan(0);
    }
  });

  it("every Pokémon has descriptions in both languages", () => {
    for (const p of ALL_POKEMON) {
      expect(p.descriptionEn.length).toBeGreaterThan(10);
      expect(p.descriptionHe.length).toBeGreaterThan(10);
    }
  });

  it("every Pokémon has speech text in both languages", () => {
    for (const p of ALL_POKEMON) {
      expect(p.speechTextEn).toContain("Pokémon number");
      expect(p.speechTextEn.length).toBeGreaterThan(20);
      expect(p.speechTextHe.length).toBeGreaterThan(20);
      expect(p.speechTextHe).toContain("פוקימון מספר");
    }
  });

  it("every Pokémon has an image URL and a fallback sprite URL", () => {
    for (const p of ALL_POKEMON) {
      expect(p.imageUrl).toMatch(/^https:\/\/.+\.png$/);
      expect(p.fallbackSpriteUrl).toMatch(/^https:\/\/.+\.png$/);
    }
  });

  it("every Pokémon has at least one type with translations", () => {
    for (const p of ALL_POKEMON) {
      expect(p.types.length).toBeGreaterThanOrEqual(1);
      expect(p.typesEn.length).toBe(p.types.length);
      expect(p.typesHe.length).toBe(p.types.length);
    }
  });

  it("every Pokémon has a translated ability with explanations", () => {
    for (const p of ALL_POKEMON) {
      expect(p.primaryAbilityEn.length).toBeGreaterThan(0);
      expect(p.primaryAbilityHe.length).toBeGreaterThan(0);
      expect(p.abilityDescriptionEn.length).toBeGreaterThan(0);
      expect(p.abilityDescriptionHe.length).toBeGreaterThan(0);
    }
  });

  it("spot-checks well-known entries", () => {
    const pikachu = getPokemonById(25);
    expect(pikachu?.englishName).toBe("Pikachu");
    expect(pikachu?.hebrewName).toBe("פיקאצ'ו");
    expect(pikachu?.types).toEqual(["electric"]);
    expect(pikachu?.primaryAbilityEn).toBe("Static");
    expect(pikachu?.speechTextEn).toContain("Pokémon number twenty-five");
    expect(pikachu?.speechTextHe).toContain("פוקימון מספר עשרים וחמש");

    const mew = getPokemonById(151);
    expect(mew?.englishName).toBe("Mew");
    expect(mew?.types).toEqual(["psychic"]);
  });
});
