import { numberToWordsEn, numberToWordsHe } from "./numberToWords";
import { TYPE_NAMES_EN, TYPE_NAMES_HE } from "../localization/typeNames";
import type { TypeKey } from "../types/pokemon";

type SpeechParts = {
  id: number;
  types: TypeKey[];
  abilityName: string;
  description: string;
};

export function buildSpeechTextEn(
  englishName: string,
  { id, types, abilityName, description }: SpeechParts
): string {
  const typeNames = types.map((t) => TYPE_NAMES_EN[t]);
  const typePhrase =
    typeNames.length > 1
      ? `${typeNames.join(" and ")} type`
      : `${typeNames[0]} type`;
  return [
    `${englishName}.`,
    `Pokémon number ${numberToWordsEn(id)}.`,
    `${typePhrase}.`,
    `Its main ability is ${abilityName}.`,
    description,
  ].join(" ");
}

export function buildSpeechTextHe(
  hebrewName: string,
  { id, types, abilityName, description }: SpeechParts
): string {
  const typeNames = types.map((t) => TYPE_NAMES_HE[t]);
  const typePhrase =
    typeNames.length > 1
      ? `פוקימון מסוג ${typeNames[0]} ו${typeNames[1]}`
      : `פוקימון מסוג ${typeNames[0]}`;
  return [
    `${hebrewName}.`,
    `פוקימון מספר ${numberToWordsHe(id)}.`,
    `${typePhrase}.`,
    `היכולת המרכזית שלו היא ${abilityName}.`,
    description,
  ].join(" ");
}
