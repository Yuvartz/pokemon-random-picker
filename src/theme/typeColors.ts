import type { TypeKey } from "../types/pokemon";

export type TypeTheme = {
  /** Badge / strong accent color. Dark enough for white text. */
  accent: string;
  /** Very light tint used as the screen background behind the card. */
  background: string;
};

export const TYPE_THEMES: Record<TypeKey, TypeTheme> = {
  normal: { accent: "#8A8A6D", background: "#F4F4EC" },
  fire: { accent: "#D2622A", background: "#FCEEE4" },
  water: { accent: "#4A76CF", background: "#E8EFFC" },
  electric: { accent: "#B39000", background: "#FBF4D5" },
  grass: { accent: "#4E9440", background: "#E9F5E4" },
  ice: { accent: "#3E9C9C", background: "#E4F5F5" },
  fighting: { accent: "#B0362C", background: "#F9E8E6" },
  poison: { accent: "#8E3E8E", background: "#F5E8F5" },
  ground: { accent: "#A5763A", background: "#F7EEDF" },
  flying: { accent: "#7168C9", background: "#EDEBFA" },
  psychic: { accent: "#C4407A", background: "#FAE7F0" },
  bug: { accent: "#7A8B1E", background: "#F1F5DE" },
  rock: { accent: "#8F7E3C", background: "#F4F0DF" },
  ghost: { accent: "#5E5290", background: "#ECEAF6" },
  dragon: { accent: "#5A3EC8", background: "#EBE7FA" },
  dark: { accent: "#584A3F", background: "#F0ECE8" },
  steel: { accent: "#6B7A8A", background: "#ECF0F3" },
  fairy: { accent: "#C05A78", background: "#FAEAEF" },
};

export const DEFAULT_THEME: TypeTheme = {
  accent: "#5A5FCF",
  background: "#F2F3F8",
};

export function getTypeTheme(type: TypeKey | undefined): TypeTheme {
  return type ? TYPE_THEMES[type] ?? DEFAULT_THEME : DEFAULT_THEME;
}
