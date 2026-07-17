export type TypeKey =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type AbilityInfo = {
  nameEn: string;
  nameHe: string;
  descriptionEn: string;
  descriptionHe: string;
};

export type PokemonData = {
  id: number;
  englishName: string;
  hebrewName: string;
  /** Text sent to the Hebrew TTS engine for the name (may differ from display). */
  hebrewPronunciation: string;

  types: TypeKey[];
  typesEn: string[];
  typesHe: string[];

  abilityKey: string;
  primaryAbilityEn: string;
  primaryAbilityHe: string;
  abilityDescriptionEn: string;
  abilityDescriptionHe: string;

  descriptionEn: string;
  descriptionHe: string;

  speechTextEn: string;
  speechTextHe: string;

  imageUrl: string;
  fallbackSpriteUrl: string;

  heightM: number;
  weightKg: number;

  stats: PokemonStats;
};

export type Language = "he" | "en";
