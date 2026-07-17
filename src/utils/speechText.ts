import { numberToWordsEn, numberToWordsHe } from "./numberToWords";
import { TYPE_NAMES_EN, TYPE_NAMES_HE } from "../localization/typeNames";
import type {
  Language,
  PokemonData,
  SpeechSegment,
  TypeKey,
} from "../types/pokemon";

type SpeechParts = {
  id: number;
  types: TypeKey[];
  abilityName: string;
  description: string;
};

/** Everything after the name: number, type, ability, description. */
export function buildSpeechBodyEn({
  id,
  types,
  abilityName,
  description,
}: SpeechParts): string {
  const typeNames = types.map((t) => TYPE_NAMES_EN[t]);
  const typePhrase =
    typeNames.length > 1
      ? `${typeNames.join(" and ")} type`
      : `${typeNames[0]} type`;
  return [
    `Pokémon number ${numberToWordsEn(id)}.`,
    `${typePhrase}.`,
    `Its main ability is ${abilityName}.`,
    description,
  ].join(" ");
}

export function buildSpeechBodyHe({
  id,
  types,
  abilityName,
  description,
}: SpeechParts): string {
  const typeNames = types.map((t) => TYPE_NAMES_HE[t]);
  const typePhrase =
    typeNames.length > 1
      ? `פוקימון מסוג ${typeNames[0]} ו${typeNames[1]}`
      : `פוקימון מסוג ${typeNames[0]}`;
  return [
    `פוקימון מספר ${numberToWordsHe(id)}.`,
    `${typePhrase}.`,
    `היכולת המרכזית שלו היא ${abilityName}.`,
    description,
  ].join(" ");
}

export function buildSpeechTextEn(englishName: string, parts: SpeechParts): string {
  return `${englishName}. ${buildSpeechBodyEn(parts)}`;
}

export function buildSpeechTextHe(hebrewName: string, parts: SpeechParts): string {
  return `${hebrewName}. ${buildSpeechBodyHe(parts)}`;
}

/**
 * Builds the spoken announcement as language-tagged segments:
 * an optional hype opener, then the Pokémon name always spoken by the
 * ENGLISH voice (Hebrew voices misread transliterated names, sometimes
 * spelling out letters), then the details in the app language.
 */
export function buildSpeechSegments(
  pokemon: PokemonData,
  language: Language,
  hypePhrase?: string
): SpeechSegment[] {
  const segments: SpeechSegment[] = [];
  if (hypePhrase) {
    segments.push({ text: hypePhrase, language });
  }
  segments.push({ text: `${pokemon.englishSpeechName}.`, language: "en" });
  segments.push({
    text: language === "he" ? pokemon.speechBodyHe : pokemon.speechBodyEn,
    language,
  });
  return segments;
}
