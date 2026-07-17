import type { Language } from "../types/pokemon";

/**
 * Fun opening lines spoken before the Pokémon's name — a different one is
 * picked at random on every announcement. Written with plain, dictionary
 * words so TTS engines pronounce them naturally (no stretched letters,
 * which some voices spell out letter by letter).
 */
export const HYPE_PHRASES_HE: string[] = [
  "וואו! זה פוקימון חבל על הזמן!",
  "איזה מגניב! זה פוקימון תותח!",
  "או הו! איזה פוקימון אדיר!",
  "שימו לב! זה פוקימון טיל!",
  "בום! הגיע פוקימון בומבה!",
  "יש! פוקימון אלוף הגיע!",
  "מדהים! זה פוקימון מהאגדות!",
  "איזה כיף! פוקימון מנצח!",
  "תראו תראו! איזה פוקימון חזק!",
  "וואו וואו וואו! פוקימון על רמה!",
  "יא ראבינת! איזה פוקימון!",
  "אלוהים אדירים! איזה פוקימון הגיע!",
  "מסי הקדוש! זה פוקימון עולמי!",
  "אינעל דינק! איזה פוקימון מטורף!",
  "יא אללה! פוקימון סוף הדרך!",
  "וואלה וואלה! איזה פוקימון!",
  "יא חביבי! פוקימון על הכיפאק!",
  "אש אש אש! פוקימון פצצה!",
  "סוף הדרך! איזה פוקימון!",
  "מטורף! זה פוקימון ברמות!",
];

export const HYPE_PHRASES_EN: string[] = [
  "Wow! This one is awesome!",
  "Amazing! What a super Pokémon!",
  "Boom! Here comes a champion!",
  "Incredible! This Pokémon rocks!",
  "Yes! A winning pick!",
  "Whoa! What a powerful Pokémon!",
  "Look at that! A legendary catch!",
  "Fantastic! This one is a star!",
];

export function pickRandomHype(language: Language): string {
  const phrases = language === "he" ? HYPE_PHRASES_HE : HYPE_PHRASES_EN;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
