import { getPokemonById } from "../data/pokemon";
import type { PokemonData } from "../types/pokemon";

/**
 * The Pokémon's full evolution family as stages, base form first:
 * e.g. [[Charmander], [Charmeleon], [Charizard]] or
 * [[Eevee], [Vaporeon, Jolteon, Flareon]] for branching families.
 * A Pokémon with no evolutions returns a single one-member stage.
 */
export function getEvolutionStages(pokemon: PokemonData): PokemonData[][] {
  // Walk up to the base form.
  let root = pokemon;
  while (root.evolvesFromId != null) {
    const parent = getPokemonById(root.evolvesFromId);
    if (!parent) break;
    root = parent;
  }

  // Walk down, stage by stage (handles branches like Eevee).
  const stages: PokemonData[][] = [[root]];
  for (;;) {
    const next = stages[stages.length - 1]
      .flatMap((p) => p.evolvesToIds)
      .map((id) => getPokemonById(id))
      .filter((p): p is PokemonData => p != null);
    if (next.length === 0) break;
    stages.push(next);
  }
  return stages;
}

/** True when the Pokémon belongs to a family with more than one member. */
export function hasEvolutionFamily(pokemon: PokemonData): boolean {
  return pokemon.evolvesFromId != null || pokemon.evolvesToIds.length > 0;
}
