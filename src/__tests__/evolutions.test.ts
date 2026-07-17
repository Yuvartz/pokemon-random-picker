import { ALL_POKEMON, getPokemonById } from "../data/pokemon";
import { getEvolutionStages, hasEvolutionFamily } from "../utils/evolutions";

describe("evolution data", () => {
  it("evolution links stay within Gen I and are consistent both ways", () => {
    for (const p of ALL_POKEMON) {
      if (p.evolvesFromId != null) {
        const parent = getPokemonById(p.evolvesFromId)!;
        expect(parent).toBeDefined();
        expect(parent.evolvesToIds).toContain(p.id);
      }
      for (const childId of p.evolvesToIds) {
        expect(childId).toBeGreaterThanOrEqual(1);
        expect(childId).toBeLessThanOrEqual(151);
        expect(getPokemonById(childId)!.evolvesFromId).toBe(p.id);
      }
      expect(p.evolvesToIds).not.toContain(p.id);
    }
  });

  it("knows the classic three-stage line (Charmander family)", () => {
    const stages = getEvolutionStages(getPokemonById(5)!); // Charmeleon
    expect(stages.map((s) => s.map((p) => p.id))).toEqual([[4], [5], [6]]);
    expect(getPokemonById(4)!.evolutionStage).toBe(0);
    expect(getPokemonById(5)!.evolutionStage).toBe(1);
    expect(getPokemonById(6)!.evolutionStage).toBe(2);
  });

  it("handles branching evolutions (Eevee family)", () => {
    const stages = getEvolutionStages(getPokemonById(134)!); // Vaporeon
    expect(stages[0].map((p) => p.id)).toEqual([133]);
    expect(stages[1].map((p) => p.id).sort((a, b) => a - b)).toEqual([
      134, 135, 136,
    ]);
  });

  it("treats Pikachu as a base form within Gen I (no Pichu)", () => {
    const pikachu = getPokemonById(25)!;
    expect(pikachu.evolvesFromId).toBeNull();
    expect(pikachu.evolutionStage).toBe(0);
    expect(pikachu.evolvesToIds).toEqual([26]);
  });

  it("identifies Pokémon without a family", () => {
    expect(hasEvolutionFamily(getPokemonById(115)!)).toBe(false); // Kangaskhan
    expect(hasEvolutionFamily(getPokemonById(151)!)).toBe(false); // Mew
    expect(hasEvolutionFamily(getPokemonById(25)!)).toBe(true);
  });

  it("every stage index stays within 0..2", () => {
    for (const p of ALL_POKEMON) {
      expect(p.evolutionStage).toBeGreaterThanOrEqual(0);
      expect(p.evolutionStage).toBeLessThanOrEqual(2);
    }
  });
});
