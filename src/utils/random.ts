export const MIN_POKEMON_ID = 1;
export const MAX_POKEMON_ID = 151;

/** Uniform random Pokédex ID between 1 and 151 inclusive. */
export function getRandomPokemonId(): number {
  return (
    Math.floor(Math.random() * (MAX_POKEMON_ID - MIN_POKEMON_ID + 1)) +
    MIN_POKEMON_ID
  );
}
