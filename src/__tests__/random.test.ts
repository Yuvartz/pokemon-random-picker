import {
  getRandomPokemonId,
  MAX_POKEMON_ID,
  MIN_POKEMON_ID,
} from "../utils/random";

describe("getRandomPokemonId", () => {
  it("always returns an integer between 1 and 151 inclusive", () => {
    for (let i = 0; i < 10_000; i++) {
      const id = getRandomPokemonId();
      expect(Number.isInteger(id)).toBe(true);
      expect(id).toBeGreaterThanOrEqual(MIN_POKEMON_ID);
      expect(id).toBeLessThanOrEqual(MAX_POKEMON_ID);
    }
  });

  it("can reach both boundaries", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 100_000 && seen.size < 151; i++) {
      seen.add(getRandomPokemonId());
    }
    expect(seen.has(MIN_POKEMON_ID)).toBe(true);
    expect(seen.has(MAX_POKEMON_ID)).toBe(true);
  });
});
