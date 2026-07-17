import type { TypeKey } from "../types/pokemon";

export type TypeTheme = {
  /** Badge / strong accent color. Dark enough for white text. */
  accent: string;
  /** Very light tint used as the screen background behind the card. */
  background: string;
};

export const TYPE_THEMES: Record<TypeKey, TypeTheme> = {
  normal: { accent: "#6F7158", background: "#F3F4EA" },
  fire: { accent: "#B84C22", background: "#FBEDE5" },
  water: { accent: "#3F68B8", background: "#E9F0FC" },
  electric: { accent: "#806C00", background: "#FBF5D9" },
  grass: { accent: "#3F7D35", background: "#EAF5E6" },
  ice: { accent: "#267D7D", background: "#E5F5F5" },
  fighting: { accent: "#9E332C", background: "#F9E9E7" },
  poison: { accent: "#7C387D", background: "#F4E9F5" },
  ground: { accent: "#8B642F", background: "#F7EEDF" },
  flying: { accent: "#6259B4", background: "#EEECFA" },
  psychic: { accent: "#AD376D", background: "#FAE8F0" },
  bug: { accent: "#687816", background: "#F1F5DF" },
  rock: { accent: "#77692F", background: "#F4F0DE" },
  ghost: { accent: "#554A82", background: "#ECEAF6" },
  dragon: { accent: "#5034B4", background: "#ECE8FA" },
  dark: { accent: "#51443A", background: "#F0ECE9" },
  steel: { accent: "#5C6C7B", background: "#EBF0F3" },
  fairy: { accent: "#A94466", background: "#FAE9EF" },
};

export const DEFAULT_THEME: TypeTheme = {
  accent: "#4F56B8",
  background: "#EEF0FA",
};

export function getTypeTheme(type: TypeKey | undefined): TypeTheme {
  return type ? TYPE_THEMES[type] ?? DEFAULT_THEME : DEFAULT_THEME;
}
