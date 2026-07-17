import type { Language, TypeKey } from "../types/pokemon";

/**
 * Full 18-type mapping so future generations can be added
 * even though Gen I only uses 15 of these.
 */
export const TYPE_NAMES_EN: Record<TypeKey, string> = {
  normal: "Normal",
  fire: "Fire",
  water: "Water",
  electric: "Electric",
  grass: "Grass",
  ice: "Ice",
  fighting: "Fighting",
  poison: "Poison",
  ground: "Ground",
  flying: "Flying",
  psychic: "Psychic",
  bug: "Bug",
  rock: "Rock",
  ghost: "Ghost",
  dragon: "Dragon",
  dark: "Dark",
  steel: "Steel",
  fairy: "Fairy",
};

export const TYPE_NAMES_HE: Record<TypeKey, string> = {
  normal: "רגיל",
  fire: "אש",
  water: "מים",
  electric: "חשמל",
  grass: "עשב",
  ice: "קרח",
  fighting: "לחימה",
  poison: "רעל",
  ground: "אדמה",
  flying: "מעופף",
  psychic: "על-חושי",
  bug: "חרק",
  rock: "סלע",
  ghost: "רוח",
  dragon: "דרקון",
  dark: "אופל",
  steel: "פלדה",
  fairy: "פיה",
};

export function translateType(type: TypeKey, language: Language): string {
  return language === "he" ? TYPE_NAMES_HE[type] : TYPE_NAMES_EN[type];
}
