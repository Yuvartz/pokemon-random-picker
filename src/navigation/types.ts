export type RootStackParamList = {
  Home: { pokemonId?: number } | undefined;
  History: undefined;
  Settings: undefined;
  Evolutions: { pokemonId: number };
};
