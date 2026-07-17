/**
 * Extra spoken lines for specific Pokémon, appended to the end of the
 * speech (not shown on the card). Add an entry by Pokédex ID.
 */
export type SpecialSpeechLine = { he: string; en: string };

export const SPECIAL_SPEECH_LINES: Record<number, SpecialSpeechLine> = {
  25: {
    he: "פיקאצ'ו הוא חבר יקר והוא מלך!",
    en: "Pikachu is a dear friend and a true king!",
  },
};
