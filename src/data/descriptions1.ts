/**
 * Short, original, kid-friendly descriptions for Pokémon #001–#075.
 * Written specifically for this educational app — not copied from any
 * official Pokédex text.
 */
export type DescriptionEntry = { en: string; he: string };

export const DESCRIPTIONS_1: Record<number, DescriptionEntry> = {
  1: {
    en: "Bulbasaur carries a plant bulb on its back from the day it is born. The bulb grows bigger as it soaks up sunlight.",
    he: "בולבזאור נושא פקעת של צמח על הגב מהיום שבו נולד. הפקעת גדלה ככל שהיא סופגת אור שמש.",
  },
  2: {
    en: "Ivysaur's bulb has grown into a large flower bud. When the bud is ready to bloom, Ivysaur becomes much stronger.",
    he: "הפקעת של אייביזאור גדלה והפכה לניצן פרח גדול. כשהניצן מוכן לפרוח, אייביזאור נעשה חזק הרבה יותר.",
  },
  3: {
    en: "Venusaur has a huge flower blooming on its back. The flower spreads a calming sweet smell after rainy days.",
    he: "על הגב של ונוזאור פורח פרח ענק. אחרי ימים גשומים הפרח מפיץ ריח מתוק ומרגיע.",
  },
  4: {
    en: "Charmander has a small flame burning on the tip of its tail. The flame shows how healthy and happy it feels.",
    he: "לצ'רמנדר בוערת להבה קטנה בקצה הזנב. הלהבה מראה כמה הוא בריא ושמח.",
  },
  5: {
    en: "Charmeleon has sharp claws and a fiery temper. Its tail flame burns brighter when it gets excited in battle.",
    he: "לצ'רמיליון יש טפרים חדים ומזג לוהט. להבת הזנב שלו בוערת חזק יותר כשהוא מתרגש בקרב.",
  },
  6: {
    en: "Charizard flies through the sky on powerful wings. It can breathe fire hot enough to melt solid rock.",
    he: "צ'ריזארד עף בשמיים בעזרת כנפיים חזקות. הוא יכול לנשוף אש חמה כל כך שהיא ממיסה סלעים.",
  },
  7: {
    en: "Squirtle hides inside its shell for protection. It sprays jets of water from its mouth with surprising power.",
    he: "סקוורטל מתחבא בתוך השריון שלו כדי להתגונן. הוא יורה סילוני מים מהפה בעוצמה מפתיעה.",
  },
  8: {
    en: "Wartortle has a furry tail that is a sign of long life. It swims fast and uses its ears to keep its balance.",
    he: "לוורטורטל יש זנב פרוותי שנחשב לסימן לחיים ארוכים. הוא שוחה מהר ומשתמש באוזניים כדי לשמור על שיווי משקל.",
  },
  9: {
    en: "Blastoise has two powerful water cannons on its shell. Their spray is strong enough to punch through thick metal.",
    he: "לבלסטויז יש שני תותחי מים חזקים על השריון. הסילון שלהם חזק מספיק כדי לחדור מתכת עבה.",
  },
  10: {
    en: "Caterpie is a small caterpillar Pokémon with a big appetite. It releases a bad smell from its antenna to scare enemies away.",
    he: "קטרפי הוא פוקימון זחל קטן עם תיאבון ענק. הוא מפיץ ריח רע מהמחוש שלו כדי להבריח אויבים.",
  },
  11: {
    en: "Metapod stays very still inside its hard shell. Inside, its body is slowly getting ready to become a butterfly.",
    he: "מטאפוד נשאר דומם בתוך קליפה קשה. בפנים, הגוף שלו מתכונן לאט להפוך לפרפר.",
  },
  12: {
    en: "Butterfree is a beautiful butterfly Pokémon. Its wings are covered in dust that protects it from rain.",
    he: "באטרפרי הוא פוקימון פרפר יפהפה. הכנפיים שלו מכוסות באבקה שמגינה עליו מגשם.",
  },
  13: {
    en: "Weedle is a tiny larva with a sharp stinger on its head. It eats lots of leaves every single day.",
    he: "וידל הוא זחל זעיר עם עוקץ חד על הראש. הוא אוכל המון עלים בכל יום.",
  },
  14: {
    en: "Kakuna waits quietly inside its shell, almost without moving. It can still extend its stinger if it is attacked.",
    he: "קקונה מחכה בשקט בתוך הקליפה שלו כמעט בלי לזוז. הוא עדיין יכול לשלוף עוקץ אם תוקפים אותו.",
  },
  15: {
    en: "Beedrill is a fast wasp Pokémon with three sharp stingers. It defends its nest in large, buzzing groups.",
    he: "בידריל הוא פוקימון צרעה מהיר עם שלושה עוקצים חדים. הוא מגן על הקן שלו בקבוצות גדולות ומזמזמות.",
  },
  16: {
    en: "Pidgey is a gentle little bird that is easy to find in fields and forests. It flaps sand at enemies to protect itself.",
    he: "פידג'י הוא ציפור קטנה ועדינה שקל למצוא בשדות וביערות. הוא מעיף חול על אויבים כדי להגן על עצמו.",
  },
  17: {
    en: "Pidgeotto is a proud bird that patrols a large territory. It has sharp claws and amazing eyesight.",
    he: "פידג'וטו הוא ציפור גאה שמסיירת בשטח גדול. יש לו טפרים חדים וראייה מדהימה.",
  },
  18: {
    en: "Pidgeot flies at incredible speed with big, beautiful wings. Its feathers shine and its eyes can spot fish deep in the water.",
    he: "פידג'וט עף במהירות מדהימה עם כנפיים גדולות ויפות. הנוצות שלו מבריקות והעיניים שלו מזהות דגים עמוק במים.",
  },
  19: {
    en: "Rattata has big front teeth that never stop growing. It nibbles on hard things to keep them short.",
    he: "לרטאטה יש שיניים קדמיות גדולות שלא מפסיקות לצמוח. הוא מכרסם דברים קשים כדי לשמור עליהן קצרות.",
  },
  20: {
    en: "Raticate uses its long whiskers to keep its balance. Its strong teeth can gnaw through very hard materials.",
    he: "רטיקייט משתמש בשפם הארוך שלו כדי לשמור על שיווי משקל. השיניים החזקות שלו יכולות לכרסם חומרים קשים מאוד.",
  },
  21: {
    en: "Spearow has a loud cry that can be heard far away. It flaps its short wings very fast to chase off rivals.",
    he: "לספירו יש קריאה רועשת שנשמעת למרחקים. הוא מנפנף בכנפיו הקצרות מהר מאוד כדי להבריח יריבים.",
  },
  22: {
    en: "Fearow has a long neck and beak that are perfect for catching food. It can fly for a whole day without resting.",
    he: "לפירו יש צוואר ומקור ארוכים שמושלמים לתפיסת אוכל. הוא יכול לעוף יום שלם בלי לנוח.",
  },
  23: {
    en: "Ekans is a snake Pokémon that moves silently through grass. It curls into a spiral when it rests.",
    he: "אקאנס הוא פוקימון נחש שזוחל בשקט בין העשבים. הוא מתכרבל בצורת ספירלה כשהוא נח.",
  },
  24: {
    en: "Arbok has a scary pattern on its wide chest. It uses the pattern to frighten enemies before they get close.",
    he: "לארבוק יש דוגמה מפחידה על החזה הרחב. הוא משתמש בדוגמה כדי להפחיד אויבים לפני שהם מתקרבים.",
  },
  25: {
    en: "Pikachu stores electricity in its red cheeks and releases it when threatened. It is one of the most famous Pokémon in the world.",
    he: "פיקאצ'ו אוגר חשמל בלחיים האדומות שלו ומשחרר אותו כשהוא מרגיש בסכנה. הוא אחד הפוקימונים המפורסמים בעולם.",
  },
  26: {
    en: "Raichu's tail works like a ground wire for its powerful electricity. Its body glows faintly in the dark when fully charged.",
    he: "הזנב של רייצ'ו פועל כמו כבל הארקה לחשמל העוצמתי שלו. הגוף שלו זוהר קלות בחושך כשהוא טעון במלואו.",
  },
  27: {
    en: "Sandshrew lives in dry, sandy places. It rolls into a tight ball to protect its soft belly.",
    he: "סנדשרו חי במקומות יבשים וחוליים. הוא מתגלגל לכדור הדוק כדי להגן על הבטן הרכה שלו.",
  },
  28: {
    en: "Sandslash is covered in sharp spikes that protect it. It digs through the ground quickly with its strong claws.",
    he: "סנדסלאש מכוסה בקוצים חדים שמגינים עליו. הוא חופר באדמה במהירות עם הטפרים החזקים שלו.",
  },
  29: {
    en: "Nidoran (female) is a small, careful Pokémon with poisonous barbs. It has excellent hearing and senses danger early.",
    he: "נידוראן נקבה היא פוקימון קטן וזהיר עם קוצים רעילים. יש לה שמיעה מצוינת והיא מזהה סכנה מוקדם.",
  },
  30: {
    en: "Nidorina is calm and protective of its friends. Its spikes grow more slowly than those of its family members.",
    he: "נידורינה רגועה ומגוננת על חבריה. הקוצים שלה צומחים לאט יותר משל בני משפחתה.",
  },
  31: {
    en: "Nidoqueen has a body covered in tough scales like armor. It uses its power to protect its young.",
    he: "לנידוקווין יש גוף מכוסה קשקשים קשיחים כמו שריון. היא משתמשת בכוחה כדי להגן על הצאצאים שלה.",
  },
  32: {
    en: "Nidoran (male) has big ears that hear the quietest sounds. Its horn contains a strong poison.",
    he: "לנידוראן זכר יש אוזניים גדולות שקולטות את הצלילים השקטים ביותר. הקרן שלו מכילה רעל חזק.",
  },
  33: {
    en: "Nidorino is quick to react and always alert. Its hard horn grows sharper as it develops.",
    he: "נידורינו מגיב מהר ותמיד דרוך. הקרן הקשה שלו נעשית חדה יותר ככל שהוא מתפתח.",
  },
  34: {
    en: "Nidoking swings its powerful tail to defend itself. Despite its strength, it is very loyal to its trainer.",
    he: "נידוקינג מניף את הזנב העוצמתי שלו כדי להתגונן. למרות הכוח שלו, הוא נאמן מאוד למאמן שלו.",
  },
  35: {
    en: "Clefairy is a shy Pokémon that loves moonlight. On quiet nights, groups of Clefairy dance under the full moon.",
    he: "קלפיירי הוא פוקימון ביישן שאוהב אור ירח. בלילות שקטים, קבוצות של קלפיירי רוקדות מתחת לירח המלא.",
  },
  36: {
    en: "Clefable moves so lightly that it can walk without making a sound. It has very sensitive ears and avoids crowded places.",
    he: "קלפייבל נע בקלילות כזו שהוא יכול ללכת בלי להשמיע קול. יש לו אוזניים רגישות מאוד והוא מתרחק ממקומות הומים.",
  },
  37: {
    en: "Vulpix has six beautiful curled tails. Inside its body burns a small flame that never goes out.",
    he: "לוולפיקס יש שישה זנבות מסולסלים ויפים. בתוך גופו בוערת להבה קטנה שלעולם לא כבה.",
  },
  38: {
    en: "Ninetales is a graceful Pokémon with nine long tails. Legends say it can live for a very long time.",
    he: "נייןטיילס הוא פוקימון אצילי עם תשעה זנבות ארוכים. האגדות מספרות שהוא יכול לחיות שנים רבות מאוד.",
  },
  39: {
    en: "Jigglypuff sings a gentle song that makes everyone sleepy. It puffs up its round body to sing longer.",
    he: "ג'יגליפאף שר שיר עדין שמרדים את כולם. הוא מנפח את גופו העגול כדי לשיר זמן רב יותר.",
  },
  40: {
    en: "Wigglytuff has soft, stretchy fur that feels wonderful to touch. Its body can expand like a big balloon.",
    he: "לוויגליטאף יש פרווה רכה וגמישה שנעים מאוד לגעת בה. הגוף שלו יכול להתנפח כמו בלון גדול.",
  },
  41: {
    en: "Zubat sleeps in dark caves during the day. It uses sound waves instead of eyes to find its way.",
    he: "זובאט ישן במערות חשוכות במהלך היום. הוא משתמש בגלי קול במקום בעיניים כדי למצוא את דרכו.",
  },
  42: {
    en: "Golbat flies through the night sky with big, quick wings. It becomes tired at sunrise and returns to its cave.",
    he: "גולבאט עף בשמי הלילה עם כנפיים גדולות ומהירות. עם הזריחה הוא מתעייף וחוזר למערה שלו.",
  },
  43: {
    en: "Oddish buries itself in soil during the day. At night it walks around and spreads its seeds.",
    he: "אודיש טומן את עצמו באדמה במהלך היום. בלילה הוא מסתובב ומפזר את הזרעים שלו.",
  },
  44: {
    en: "Gloom releases a very strong smell from the flower on its head. Surprisingly, some people actually like the scent.",
    he: "גלום מפיץ ריח חזק מאוד מהפרח שעל ראשו. באופן מפתיע, יש אנשים שדווקא אוהבים את הריח.",
  },
  45: {
    en: "Vileplume has one of the largest flowers in the Pokémon world. It shakes its petals to spread clouds of pollen.",
    he: "לוויילפלום יש אחד הפרחים הגדולים בעולם הפוקימונים. הוא מנער את עלי הכותרת כדי לפזר ענני אבקה.",
  },
  46: {
    en: "Paras has small mushrooms growing on its back. The mushrooms grow by drawing energy from the bug beneath them.",
    he: "על הגב של פאראס צומחות פטריות קטנות. הפטריות גדלות בעזרת אנרגיה מהחרק שמתחתיהן.",
  },
  47: {
    en: "Parasect is controlled by the big mushroom on its back. It prefers damp, dark places where mushrooms grow well.",
    he: "פראסקט נשלט על ידי הפטרייה הגדולה שעל גבו. הוא מעדיף מקומות לחים וחשוכים שבהם פטריות גדלות היטב.",
  },
  48: {
    en: "Venonat has big round eyes that work like radar. Its whole body is covered in soft, fuzzy hair.",
    he: "לוונונאט יש עיניים עגולות וגדולות שפועלות כמו מכ\"ם. כל גופו מכוסה בשיער רך ופלומתי.",
  },
  49: {
    en: "Venomoth's wings scatter tiny scales when it flaps them. It is most active at night around bright lights.",
    he: "הכנפיים של ונומות' מפזרות קשקשים זעירים כשהוא מנפנף בהן. הוא פעיל בעיקר בלילה סביב אורות חזקים.",
  },
  50: {
    en: "Diglett lives underground and pops its head out of the soil. Nobody knows for sure what the rest of its body looks like.",
    he: "דיגלט חי מתחת לאדמה ומציץ עם הראש מהקרקע. אף אחד לא יודע בוודאות איך נראה שאר הגוף שלו.",
  },
  51: {
    en: "Dugtrio is three Diglett working together as one team. Together they can dig deep tunnels amazingly fast.",
    he: "דאגטריו הוא שלושה דיגלטים שעובדים יחד כצוות אחד. יחד הם חופרים מנהרות עמוקות במהירות מדהימה.",
  },
  52: {
    en: "Meowth loves anything round and shiny. At night it wanders around looking for coins and sparkly objects.",
    he: "מיאוט' אוהב כל דבר עגול ונוצץ. בלילה הוא משוטט ומחפש מטבעות וחפצים מבריקים.",
  },
  53: {
    en: "Persian walks with proud, elegant steps. The red jewel on its forehead glows softly in the light.",
    he: "פרשן צועד בצעדים גאים ואלגנטיים. האבן האדומה שעל מצחו זוהרת בעדינות באור.",
  },
  54: {
    en: "Psyduck always has a headache, which builds up strange power. When the headache gets strong, it can use surprising psychic abilities.",
    he: "לסייקדאק תמיד כואב הראש, וזה צובר כוח מוזר. כשכאב הראש מתחזק, הוא מסוגל להשתמש בכוחות על-חושיים מפתיעים.",
  },
  55: {
    en: "Golduck is a super swimmer, faster than the best human athletes. It appears near lakes at dusk, gliding gracefully through the water.",
    he: "גולדאק הוא שחיין-על, מהיר יותר מהספורטאים הטובים ביותר. הוא מופיע ליד אגמים בשקיעה וגולש במים בחן.",
  },
  56: {
    en: "Mankey gets angry very easily and very quickly. When it calms down, it is actually quite friendly.",
    he: "מנקי מתעצבן בקלות ובמהירות רבה. כשהוא נרגע, הוא בעצם די ידידותי.",
  },
  57: {
    en: "Primeape never stops being angry, even when it sleeps. Chasing it will only make it angrier.",
    he: "פריימאייפ אף פעם לא מפסיק לכעוס, אפילו כשהוא ישן. מי שירדוף אחריו רק יעצבן אותו יותר.",
  },
  58: {
    en: "Growlithe is brave, loyal, and friendly to people it trusts. It barks fearlessly to protect its territory.",
    he: "גראוליט' אמיץ, נאמן וידידותי לאנשים שהוא סומך עליהם. הוא נובח ללא פחד כדי להגן על השטח שלו.",
  },
  59: {
    en: "Arcanine runs so fast that it seems to fly over the ground. In old stories it is admired for its beauty and speed.",
    he: "ארקניין רץ כל כך מהר שהוא נראה כאילו הוא מרחף מעל הקרקע. בסיפורים עתיקים מעריצים אותו על יופיו ומהירותו.",
  },
  60: {
    en: "Poliwag has a spiral pattern on its belly. Its new legs are still weak, so it prefers swimming to walking.",
    he: "לפוליוואג יש דוגמת ספירלה על הבטן. הרגליים החדשות שלו עדיין חלשות, ולכן הוא מעדיף לשחות ולא ללכת.",
  },
  61: {
    en: "Poliwhirl can live both in water and on land. It keeps its skin wet so it stays comfortable outside the water.",
    he: "פוליווירל יכול לחיות גם במים וגם ביבשה. הוא שומר על עור רטוב כדי להרגיש בנוח מחוץ למים.",
  },
  62: {
    en: "Poliwrath is a powerful swimmer with strong muscles. It can swim across a whole ocean without getting tired.",
    he: "פולירת' הוא שחיין עוצמתי עם שרירים חזקים. הוא יכול לחצות אוקיינוס שלם בשחייה בלי להתעייף.",
  },
  63: {
    en: "Abra sleeps about eighteen hours every day. Even while sleeping, it can teleport away from danger in a blink.",
    he: "אברה ישן בערך שמונה עשרה שעות ביום. אפילו בזמן שינה הוא יכול להישגר הרחק מסכנה בהרף עין.",
  },
  64: {
    en: "Kadabra holds a silver spoon that strengthens its psychic powers. Strange things happen to machines when it is nearby.",
    he: "קדברה מחזיק כפית כסף שמחזקת את הכוחות העל-חושיים שלו. דברים מוזרים קורים למכשירים כשהוא בסביבה.",
  },
  65: {
    en: "Alakazam has an amazing brain and remembers everything it has ever learned. It is said to be smarter than any computer.",
    he: "לאלקזאם יש מוח מדהים והוא זוכר כל דבר שאי פעם למד. אומרים שהוא חכם יותר מכל מחשב.",
  },
  66: {
    en: "Machop trains its muscles every single day. It can lift things much heavier than itself.",
    he: "מאצ'ופ מאמן את השרירים שלו כל יום. הוא יכול להרים דברים כבדים ממנו בהרבה.",
  },
  67: {
    en: "Machoke has an incredibly strong body and helps people with heavy work. It wears a special belt that keeps its power under control.",
    he: "למאצ'וק יש גוף חזק במיוחד והוא עוזר לאנשים בעבודות כבדות. הוא לובש חגורה מיוחדת ששומרת על הכוח שלו בשליטה.",
  },
  68: {
    en: "Machamp has four powerful arms that can throw a thousand punches. It moves them so fast they become a blur.",
    he: "למאצ'אמפ יש ארבע זרועות עוצמתיות שיכולות להנחית אלף אגרופים. הוא מזיז אותן כל כך מהר שהן נראות כמו טשטוש.",
  },
  69: {
    en: "Bellsprout has a body like a thin vine that bends in the wind. It loves damp places and drinks a lot of water.",
    he: "לבלספראוט יש גוף כמו גבעול דק שמתנועע ברוח. הוא אוהב מקומות לחים ושותה הרבה מים.",
  },
  70: {
    en: "Weepinbell hangs from tree branches using its hook-shaped stem. It sprays a powder that makes opponents dizzy.",
    he: "ויפינבל נתלה על ענפי עצים בעזרת הגבעול דמוי הקרס שלו. הוא מתיז אבקה שמסחררת יריבים.",
  },
  71: {
    en: "Victreebel has a long vine that it waves like a lure. It lives deep in jungles where big plants grow.",
    he: "לוויקטריבל יש קנוקנת ארוכה שהוא מנופף בה כמו פיתיון. הוא חי עמוק בג'ונגלים שבהם צומחים צמחים ענקיים.",
  },
  72: {
    en: "Tentacool drifts in the sea like a floating jelly. Its body is almost entirely made of water.",
    he: "טנטקול נסחף בים כמו ג'לי צף. הגוף שלו עשוי כמעט כולו ממים.",
  },
  73: {
    en: "Tentacruel has many long tentacles that it uses to catch food. Its red orbs glow when it senses danger.",
    he: "לטנטקרואל יש הרבה זרועות ארוכות שבעזרתן הוא תופס אוכל. הכדורים האדומים שלו זוהרים כשהוא חש בסכנה.",
  },
  74: {
    en: "Geodude looks exactly like a round rock on the ground. Hikers sometimes step on it by mistake.",
    he: "ג'יאודוד נראה בדיוק כמו סלע עגול על הקרקע. מטיילים לפעמים דורכים עליו בטעות.",
  },
  75: {
    en: "Graveler rolls down mountain slopes to move around quickly. It doesn't mind bumping into things on the way.",
    he: "גרבלר מתגלגל במורדות הרים כדי לנוע במהירות. לא אכפת לו להיתקל בדברים בדרך.",
  },
};
