import {
  TYPE_NAMES_EN,
  TYPE_NAMES_HE,
  translateType,
} from "../localization/typeNames";
import type { TypeKey } from "../types/pokemon";

const ALL_TYPES: TypeKey[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

describe("type translations", () => {
  it("has an English and Hebrew name for all 18 types", () => {
    for (const type of ALL_TYPES) {
      expect(TYPE_NAMES_EN[type]).toBeTruthy();
      expect(TYPE_NAMES_HE[type]).toBeTruthy();
    }
  });

  it("translates by language", () => {
    expect(translateType("electric", "en")).toBe("Electric");
    expect(translateType("electric", "he")).toBe("חשמל");
    expect(translateType("grass", "he")).toBe("עשב");
  });
});
