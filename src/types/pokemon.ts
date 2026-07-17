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
  /** Name as sent to the English TTS engine (no symbols, e.g. "Female Nidoran"). */
  englishSpeechName: string;
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
  /** Speech body without the name (number, type, ability, description). */
  speechBodyEn: string;
  speechBodyHe: string;

  imageUrl: string;
  fallbackSpriteUrl: string;

  heightM: number;
  weightKg: number;

  stats: PokemonStats;

  /** Previous evolution within Gen I (null for base forms). */
  evolvesFromId: number | null;
  /** Next evolutions within Gen I (empty for final forms). */
  evolvesToIds: number[];
  /** 0 = base form, 1 = first evolution, 2 = second evolution. */
  evolutionStage: number;
};

export type Language = "he" | "en";

/** One piece of a spoken announcement, with its own speech language. */
export type SpeechSegment = {
  text: string;
  language: Language;
};
