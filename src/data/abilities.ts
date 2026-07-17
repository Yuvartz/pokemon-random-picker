import type { AbilityInfo } from "../types/pokemon";

/**
 * Every primary ability that appears among the original 151 Pokémon.
 * Descriptions are short, original, kid-friendly summaries.
 */
export const ABILITIES: Record<string, AbilityInfo> = {
  overgrow: {
    nameEn: "Overgrow",
    nameHe: "צמיחת יתר",
    descriptionEn: "Powers up grass moves when the Pokémon is in trouble.",
    descriptionHe: "מחזקת מתקפות עשב כשהפוקימון נמצא בצרה.",
  },
  blaze: {
    nameEn: "Blaze",
    nameHe: "להט",
    descriptionEn: "Powers up fire moves when the Pokémon is in trouble.",
    descriptionHe: "מחזקת מתקפות אש כשהפוקימון נמצא בצרה.",
  },
  torrent: {
    nameEn: "Torrent",
    nameHe: "שיטפון",
    descriptionEn: "Powers up water moves when the Pokémon is in trouble.",
    descriptionHe: "מחזקת מתקפות מים כשהפוקימון נמצא בצרה.",
  },
  "shield-dust": {
    nameEn: "Shield Dust",
    nameHe: "אבקת מגן",
    descriptionEn: "Its protective dust blocks the extra effects of attacks.",
    descriptionHe: "האבקה המגינה שלו חוסמת השפעות לוואי של מתקפות.",
  },
  "shed-skin": {
    nameEn: "Shed Skin",
    nameHe: "השלת עור",
    descriptionEn: "May heal its problems by shedding its skin.",
    descriptionHe: "עשוי להחלים מבעיות על ידי השלת העור שלו.",
  },
  "compound-eyes": {
    nameEn: "Compound Eyes",
    nameHe: "עיניים מורכבות",
    descriptionEn: "Its big eyes help its attacks hit the target more often.",
    descriptionHe: "העיניים הגדולות שלו עוזרות למתקפות לפגוע לעיתים קרובות יותר.",
  },
  swarm: {
    nameEn: "Swarm",
    nameHe: "נחיל",
    descriptionEn: "Powers up bug moves when the Pokémon is in trouble.",
    descriptionHe: "מחזקת מתקפות חרק כשהפוקימון נמצא בצרה.",
  },
  "keen-eye": {
    nameEn: "Keen Eye",
    nameHe: "עין חדה",
    descriptionEn: "Its sharp eyes always stay accurate and cannot be tricked.",
    descriptionHe: "העיניים החדות שלו נשארות תמיד מדויקות ואי אפשר לבלבל אותן.",
  },
  "run-away": {
    nameEn: "Run Away",
    nameHe: "בריחה",
    descriptionEn: "Can always escape safely from wild battles.",
    descriptionHe: "תמיד מצליח לברוח בבטחה מקרבות.",
  },
  intimidate: {
    nameEn: "Intimidate",
    nameHe: "הפחדה",
    descriptionEn: "Scares opponents and makes their attacks weaker.",
    descriptionHe: "מפחידה יריבים והופכת את המתקפות שלהם לחלשות יותר.",
  },
  static: {
    nameEn: "Static",
    nameHe: "חשמל סטטי",
    descriptionEn: "May paralyze attackers that touch the Pokémon.",
    descriptionHe: "עלולה לשתק תוקפים שנוגעים בפוקימון.",
  },
  "sand-veil": {
    nameEn: "Sand Veil",
    nameHe: "מעטה חול",
    descriptionEn: "Makes the Pokémon hard to hit during sandstorms.",
    descriptionHe: "מקשה לפגוע בפוקימון בזמן סופות חול.",
  },
  "poison-point": {
    nameEn: "Poison Point",
    nameHe: "דקירה רעילה",
    descriptionEn: "Its poisonous spikes may poison attackers on contact.",
    descriptionHe: "הקוצים הרעילים שלו עלולים להרעיל תוקפים במגע.",
  },
  "cute-charm": {
    nameEn: "Cute Charm",
    nameHe: "קסם חמוד",
    descriptionEn: "Its cuteness may charm Pokémon that touch it.",
    descriptionHe: "החמידות שלו עלולה להקסים פוקימונים שנוגעים בו.",
  },
  "flash-fire": {
    nameEn: "Flash Fire",
    nameHe: "אש מתלקחת",
    descriptionEn: "Fire attacks make it stronger instead of hurting it.",
    descriptionHe: "מתקפות אש מחזקות אותו במקום לפגוע בו.",
  },
  chlorophyll: {
    nameEn: "Chlorophyll",
    nameHe: "כלורופיל",
    descriptionEn: "Moves much faster in bright sunshine.",
    descriptionHe: "נע מהר הרבה יותר באור שמש חזק.",
  },
  "effect-spore": {
    nameEn: "Effect Spore",
    nameHe: "נבגי השפעה",
    descriptionEn: "Contact may poison, paralyze, or put the attacker to sleep.",
    descriptionHe: "מגע בו עלול להרעיל, לשתק או להרדים את התוקף.",
  },
  "inner-focus": {
    nameEn: "Inner Focus",
    nameHe: "ריכוז פנימי",
    descriptionEn: "Stays focused and never flinches from attacks.",
    descriptionHe: "נשאר מרוכז ולעולם לא נרתע ממתקפות.",
  },
  damp: {
    nameEn: "Damp",
    nameHe: "לחות",
    descriptionEn: "Its moisture prevents explosions around it.",
    descriptionHe: "הלחות שלו מונעת פיצוצים בסביבתו.",
  },
  limber: {
    nameEn: "Limber",
    nameHe: "גמישות",
    descriptionEn: "Its flexible body cannot be paralyzed.",
    descriptionHe: "הגוף הגמיש שלו לא יכול להיות משותק.",
  },
  pickup: {
    nameEn: "Pickup",
    nameHe: "איסוף",
    descriptionEn: "Sometimes picks up useful items it finds along the way.",
    descriptionHe: "לפעמים אוסף חפצים שימושיים שהוא מוצא בדרך.",
  },
  guts: {
    nameEn: "Guts",
    nameHe: "אומץ",
    descriptionEn: "Gets stronger when it has a problem like a burn.",
    descriptionHe: "נהיה חזק יותר כשיש לו בעיה כמו כווייה.",
  },
  "vital-spirit": {
    nameEn: "Vital Spirit",
    nameHe: "רוח חיונית",
    descriptionEn: "Full of energy, so it can never fall asleep.",
    descriptionHe: "מלא אנרגיה ולכן לעולם לא נרדם.",
  },
  "water-absorb": {
    nameEn: "Water Absorb",
    nameHe: "ספיגת מים",
    descriptionEn: "Heals itself when hit by water attacks.",
    descriptionHe: "מרפא את עצמו כשהוא נפגע ממתקפות מים.",
  },
  synchronize: {
    nameEn: "Synchronize",
    nameHe: "סנכרון",
    descriptionEn: "Passes on poison, burns, or paralysis to the opponent.",
    descriptionHe: "מעביר ליריב הרעלה, כווייה או שיתוק שפגעו בו.",
  },
  "no-guard": {
    nameEn: "No Guard",
    nameHe: "ללא הגנה",
    descriptionEn: "Makes every attack hit, both its own and the opponent's.",
    descriptionHe: "גורמת לכל מתקפה לפגוע, גם שלו וגם של היריב.",
  },
  oblivious: {
    nameEn: "Oblivious",
    nameHe: "שוויון נפש",
    descriptionEn: "Too calm and relaxed to be distracted or charmed.",
    descriptionHe: "רגוע ושליו מכדי שיסיחו את דעתו או יקסימו אותו.",
  },
  "clear-body": {
    nameEn: "Clear Body",
    nameHe: "גוף צלול",
    descriptionEn: "Prevents other Pokémon from weakening it.",
    descriptionHe: "מונעת מפוקימונים אחרים להחליש אותו.",
  },
  levitate: {
    nameEn: "Levitate",
    nameHe: "ריחוף",
    descriptionEn: "Floats in the air, so ground attacks cannot reach it.",
    descriptionHe: "מרחף באוויר ולכן מתקפות אדמה לא מגיעות אליו.",
  },
  stench: {
    nameEn: "Stench",
    nameHe: "צחנה",
    descriptionEn: "Its terrible smell may make opponents flinch.",
    descriptionHe: "הריח הנוראי שלו עלול לגרום ליריבים להירתע.",
  },
  "shell-armor": {
    nameEn: "Shell Armor",
    nameHe: "שריון קונכייה",
    descriptionEn: "Its hard shell protects it from critical hits.",
    descriptionHe: "הקונכייה הקשה שלו מגינה עליו מפגיעות קריטיות.",
  },
  "cursed-body": {
    nameEn: "Cursed Body",
    nameHe: "גוף מקולל",
    descriptionEn: "May disable a move that hits it.",
    descriptionHe: "עלול לנטרל מתקפה שפוגעת בו.",
  },
  "rock-head": {
    nameEn: "Rock Head",
    nameHe: "ראש סלע",
    descriptionEn: "Never hurts itself, even when using reckless moves.",
    descriptionHe: "לעולם לא נפגע מעצמו, גם במתקפות פזיזות.",
  },
  insomnia: {
    nameEn: "Insomnia",
    nameHe: "נדודי שינה",
    descriptionEn: "Cannot fall asleep, no matter what.",
    descriptionHe: "לא מסוגל להירדם, לא משנה מה.",
  },
  "hyper-cutter": {
    nameEn: "Hyper Cutter",
    nameHe: "חותך-על",
    descriptionEn: "Its powerful pincers can never be weakened.",
    descriptionHe: "הצבתות החזקות שלו לעולם לא נחלשות.",
  },
  soundproof: {
    nameEn: "Soundproof",
    nameHe: "אטום לרעש",
    descriptionEn: "Sound-based attacks do not affect it.",
    descriptionHe: "מתקפות המבוססות על קול לא משפיעות עליו.",
  },
  "magnet-pull": {
    nameEn: "Magnet Pull",
    nameHe: "משיכה מגנטית",
    descriptionEn: "Uses magnetism to pull steel Pokémon toward it.",
    descriptionHe: "משתמש במגנטיות כדי למשוך אליו פוקימוני פלדה.",
  },
  "lightning-rod": {
    nameEn: "Lightning Rod",
    nameHe: "כליא ברק",
    descriptionEn: "Attracts electric attacks toward itself like a lightning rod.",
    descriptionHe: "מושך אליו מתקפות חשמל כמו כליא ברק.",
  },
  "early-bird": {
    nameEn: "Early Bird",
    nameHe: "משכים קום",
    descriptionEn: "Wakes up from sleep very quickly.",
    descriptionHe: "מתעורר משינה במהירות רבה.",
  },
  "thick-fat": {
    nameEn: "Thick Fat",
    nameHe: "שומן עבה",
    descriptionEn: "Its thick fat protects it from heat and cold.",
    descriptionHe: "השומן העבה שלו מגן עליו מחום ומקור.",
  },
  immunity: {
    nameEn: "Immunity",
    nameHe: "חסינות",
    descriptionEn: "Its natural immunity prevents it from being poisoned.",
    descriptionHe: "החסינות הטבעית שלו מונעת ממנו להיות מורעל.",
  },
  "swift-swim": {
    nameEn: "Swift Swim",
    nameHe: "שחייה מהירה",
    descriptionEn: "Swims much faster when it is raining.",
    descriptionHe: "שוחה מהר הרבה יותר כשיורד גשם.",
  },
  illuminate: {
    nameEn: "Illuminate",
    nameHe: "הארה",
    descriptionEn: "Lights up dark surroundings with its glow.",
    descriptionHe: "מאיר את הסביבה החשוכה בזוהר שלו.",
  },
  "natural-cure": {
    nameEn: "Natural Cure",
    nameHe: "ריפוי טבעי",
    descriptionEn: "Heals its problems naturally when it rests.",
    descriptionHe: "מחלים מבעיות בצורה טבעית כשהוא נח.",
  },
  "own-tempo": {
    nameEn: "Own Tempo",
    nameHe: "קצב משלו",
    descriptionEn: "Moves at its own pace and never gets confused.",
    descriptionHe: "מתנהל בקצב שלו ולעולם לא מתבלבל.",
  },
  trace: {
    nameEn: "Trace",
    nameHe: "חיקוי",
    descriptionEn: "Copies the ability of the Pokémon it faces.",
    descriptionHe: "מעתיק את היכולת של הפוקימון שמולו.",
  },
  "volt-absorb": {
    nameEn: "Volt Absorb",
    nameHe: "ספיגת חשמל",
    descriptionEn: "Heals itself when hit by electric attacks.",
    descriptionHe: "מרפא את עצמו כשהוא נפגע ממתקפות חשמל.",
  },
  "flame-body": {
    nameEn: "Flame Body",
    nameHe: "גוף להבה",
    descriptionEn: "Its burning-hot body may burn attackers that touch it.",
    descriptionHe: "הגוף הלוהט שלו עלול לצרוב תוקפים שנוגעים בו.",
  },
  pressure: {
    nameEn: "Pressure",
    nameHe: "לחץ",
    descriptionEn: "Makes opponents use up more energy for their moves.",
    descriptionHe: "גורם ליריבים לבזבז יותר אנרגיה על המתקפות שלהם.",
  },
};

export function getAbility(key: string): AbilityInfo | undefined {
  return ABILITIES[key];
}
