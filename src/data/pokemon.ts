import baseData from "./generated/pokemonBase.json";
import { HEBREW_NAMES } from "./hebrewNames";
import { DESCRIPTIONS_1 } from "./descriptions1";
import { DESCRIPTIONS_2 } from "./descriptions2";
import { ABILITIES } from "./abilities";
import { TYPE_NAMES_EN, TYPE_NAMES_HE } from "../localization/typeNames";
import { buildSpeechTextEn, buildSpeechTextHe } from "../utils/speechText";
import type { PokemonData, PokemonStats, TypeKey } from "../types/pokemon";

type BaseEntry = {
  id: number;
  name: string;
  types: string[];
  ability: string;
  heightM: number;
  weightKg: number;
  stats: PokemonStats;
};

const DESCRIPTIONS = { ...DESCRIPTIONS_1, ...DESCRIPTIONS_2 };

const SPRITES_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function officialArtworkUrl(id: number): string {
  return `${SPRITES_BASE}/other/official-artwork/${id}.png`;
}

export function fallbackSpriteUrl(id: number): string {
  return `${SPRITES_BASE}/${id}.png`;
}

/** "farfetchd" → "Farfetch'd" style display names for the few special cases. */
const ENGLISH_NAME_OVERRIDES: Record<number, string> = {
  29: "Nidoran ♀",
  32: "Nidoran ♂",
  83: "Farfetch'd",
  122: "Mr. Mime",
};

function toDisplayName(apiName: string, id: number): string {
  const override = ENGLISH_NAME_OVERRIDES[id];
  if (override) return override;
  return apiName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

/** English name without symbols, safe to send to the TTS engine. */
const ENGLISH_SPEECH_NAME_OVERRIDES: Record<number, string> = {
  29: "Female Nidoran",
  32: "Male Nidoran",
  83: "Farfetch'd",
  122: "Mister Mime",
};

function buildPokemon(entry: BaseEntry): PokemonData | null {
  const hebrew = HEBREW_NAMES[entry.id];
  const description = DESCRIPTIONS[entry.id];
  const ability = ABILITIES[entry.ability];
  const types = entry.types.filter(
    (t): t is TypeKey => t in TYPE_NAMES_EN
  );

  if (!hebrew || !description || !ability || types.length === 0) {
    if (__DEV__) {
      console.warn(
        `[pokemon-data] Skipping invalid entry #${entry.id} (${entry.name}): ` +
          `${!hebrew ? "missing Hebrew name; " : ""}` +
          `${!description ? "missing description; " : ""}` +
          `${!ability ? `unknown ability "${entry.ability}"; ` : ""}` +
          `${types.length === 0 ? "no valid types; " : ""}`
      );
    }
    return null;
  }

  const englishName = toDisplayName(entry.name, entry.id);
  const englishSpeechName =
    ENGLISH_SPEECH_NAME_OVERRIDES[entry.id] ?? englishName;
  const hebrewPronunciation = hebrew.pronunciation ?? hebrew.name;

  return {
    id: entry.id,
    englishName,
    hebrewName: hebrew.name,
    hebrewPronunciation,
    types,
    typesEn: types.map((t) => TYPE_NAMES_EN[t]),
    typesHe: types.map((t) => TYPE_NAMES_HE[t]),
    abilityKey: entry.ability,
    primaryAbilityEn: ability.nameEn,
    primaryAbilityHe: ability.nameHe,
    abilityDescriptionEn: ability.descriptionEn,
    abilityDescriptionHe: ability.descriptionHe,
    descriptionEn: description.en,
    descriptionHe: description.he,
    speechTextEn: buildSpeechTextEn(englishSpeechName, {
      id: entry.id,
      types,
      abilityName: ability.nameEn,
      description: description.en,
    }),
    speechTextHe: buildSpeechTextHe(hebrewPronunciation, {
      id: entry.id,
      types,
      abilityName: ability.nameHe,
      description: description.he,
    }),
    imageUrl: officialArtworkUrl(entry.id),
    fallbackSpriteUrl: fallbackSpriteUrl(entry.id),
    heightM: entry.heightM,
    weightKg: entry.weightKg,
    stats: entry.stats,
  };
}

/** All 151 Pokémon, fully merged and validated. */
export const ALL_POKEMON: PokemonData[] = (baseData as BaseEntry[])
  .map(buildPokemon)
  .filter((p): p is PokemonData => p !== null);

const BY_ID = new Map(ALL_POKEMON.map((p) => [p.id, p]));

export function getPokemonById(id: number): PokemonData | undefined {
  return BY_ID.get(id);
}
