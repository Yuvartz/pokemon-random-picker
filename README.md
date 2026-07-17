# Pokémon Random Picker

A simple, playful mobile app that randomly picks one of the original 151
Generation I Pokémon and presents it with a large image, bilingual
(Hebrew/English) information, and native Text-to-Speech that reads the
Pokémon's details aloud.

**This is an unofficial, non-commercial, educational project.** Pokémon names
and imagery belong to their respective rights holders (Nintendo, Game Freak,
The Pokémon Company). Artwork is loaded from the free
[PokéAPI sprites](https://github.com/PokeAPI/sprites) project. All
descriptions in the app are short original summaries written for this app.

## Technology stack

- **Expo SDK 57** (React Native 0.86, React 19) with **TypeScript**
- **expo-speech** — native Text-to-Speech (Hebrew + English)
- **expo-image** — artwork loading with automatic disk caching
- **@react-native-async-storage/async-storage** — persistent settings & history
- **@react-navigation/native-stack** — 3 screens (Home / History / Settings)
- **expo-haptics** — optional light touch feedback
- **jest / jest-expo** — unit tests

## Installation & running

```bash
npm install
npx expo start
```

Then:

- **Expo Go (easiest)** — install the Expo Go app on your iPhone or Android
  phone, and scan the QR code printed in the terminal. Phone and computer must
  be on the same Wi-Fi network (or run `npx expo start --tunnel`).
- **Android emulator** — start an emulator via Android Studio, then press `a`
  in the Expo terminal (or run `npm run android`).
- **iOS simulator** (macOS only) — press `i` in the Expo terminal (or run
  `npm run ios`).

Other scripts:

```bash
npm test              # run unit tests
npm run typecheck     # TypeScript check
npm run generate:data # re-fetch base data (types/abilities/stats) from PokéAPI
```

## Folder structure

```text
App.tsx                     App entry: providers + navigation stack
scripts/
  fetch-pokemon-data.mjs    One-time generator for the committed base data
src/
  components/               PokemonCard, PokemonArtwork, TypeBadge,
                            PrimaryButton, SpeechControls, LoadingReveal,
                            ErrorMessage, HistoryItem, SettingRow
  context/                  SettingsContext, HistoryContext (app state)
  data/
    generated/pokemonBase.json  Committed PokéAPI data (types, ability,
                                height, weight, stats) for all 151 Pokémon
    hebrewNames.ts          Hebrew names + pronunciation overrides (151)
    descriptions1.ts        Original bilingual descriptions #001–#075
    descriptions2.ts        Original bilingual descriptions #076–#151
    abilities.ts            All 48 Gen-I primary abilities, translated
    pokemon.ts              Merges everything into the full data model
  hooks/                    useSpeech (speech state + cleanup)
  localization/             UI strings (he/en) + type-name translations
  navigation/               Navigation route types
  screens/                  HomeScreen, HistoryScreen, SettingsScreen
  services/                 speech.ts (TTS wrapper), storage.ts (persistence)
  theme/                    Colors, spacing, per-type accent themes
  types/                    Shared TypeScript models
  utils/                    random, numberToWords (he/en), speechText, haptics
  __tests__/                Unit tests
```

## Where the Pokémon data lives

The app is **fully offline for all text data**. It merges, at startup:

1. `src/data/generated/pokemonBase.json` — factual base data fetched once
   from PokéAPI and committed to the repo (names, types, primary ability,
   height, weight, base stats). Regenerate with `npm run generate:data`.
2. Hand-written local files — Hebrew names, bilingual descriptions, and
   ability translations.

Invalid entries are skipped with a development warning instead of crashing.
Only **artwork images** are loaded from the network (PokéAPI's sprites CDN),
and `expo-image` caches them on disk, so previously seen Pokémon show their
image offline too. If the official artwork fails, the app falls back to the
small game sprite, and then to a question-mark placeholder.

## How speech works

**On the web app, announcements are studio-quality recordings.** The
hype openers and Pokémon names were recorded with ElevenLabs
(eleven_v3, "Jessica" — `scripts/generate-audio-elevenlabs.ts`, requires
`ELEVENLABS_API_KEY`); the longer detail clips use Microsoft's neural
voices (he-IL-Hila / en-US-Jenny via the Edge TTS endpoint —
`scripts/generate-audio.ts`). Everything lands in `public/audio/**`,
which ships with the web build. With a paid ElevenLabs plan,
`npm run generate:audio:elevenlabs -- --all --force` re-records the
detail clips with ElevenLabs too (~70k credits). `src/services/audioSpeech.web.ts` plays the playlist
(hype → English name → details) through a pool of unlocked audio
elements; the speech-speed setting maps to `playbackRate`. Regenerate
new/missing clips with `npm run generate:audio` (idempotent).

**If a recording fails to load** (offline, missing file), playback falls
back — from the exact same segment — to the device's text-to-speech
described below. The native (Expo Go) app always uses device TTS.

`src/services/speech.ts` wraps `expo-speech`:

- Every new utterance **stops the previous one first** — speech never
  overlaps, guarded by an utterance token so stale callbacks are ignored.
- Speech text is pre-built for each Pokémon in both languages
  (`speechTextEn` / `speechTextHe`), including the Pokédex number written
  out **in words** (e.g. "twenty-five" / "עשרים וחמש").
- Hebrew speech uses the Hebrew transliteration of the name — English names
  are never sent to the Hebrew TTS engine.
- Speech speed (Slow/Normal/Fast) maps to safe rate values (0.8 / 1.0 / 1.25).
- Speech stops automatically when: a new Pokémon is chosen, Stop is pressed,
  the language changes, or the screen unmounts.
- If no voice exists for the selected language, a friendly message is shown
  and the rest of the app keeps working.

> **Note:** in the Android Expo Go app, make sure a Hebrew TTS voice is
> installed (Settings → General management → Text-to-speech) for Hebrew
> speech to sound right.

## How localization works

`SettingsContext` stores the selected language (`he` by default) and persists
it. `src/localization/strings.ts` holds every UI string in both languages,
and `typeNames.ts` translates all 18 Pokémon types (Gen I uses 15, the full
map makes future generations easy). Hebrew mode applies right-to-left
layout per-component (`row-reverse`, right text alignment, RTL writing
direction) so switching languages takes effect immediately without an app
restart.

## Adding another generation later

1. Widen the ID range in `scripts/fetch-pokemon-data.mjs` (`LAST_ID`) and run
   `npm run generate:data`.
2. Add Hebrew names for the new IDs in `src/data/hebrewNames.ts`.
3. Add bilingual descriptions in a new `descriptions3.ts` and merge it in
   `src/data/pokemon.ts`.
4. Add translations for any new abilities in `src/data/abilities.ts`
   (the generator script prints the list of unique abilities).
5. Raise `MAX_POKEMON_ID` in `src/utils/random.ts`.

The tests will immediately verify the new data is complete.

## Known limitations

- Artwork requires internet the first time each Pokémon is shown
  (cached afterwards).
- RTL is handled per-component rather than via the native `I18nManager`
  restart mechanism, which keeps language switching instant in Expo Go.
- Hebrew TTS quality depends on the device's installed voices; some Android
  devices ship without a Hebrew voice by default.
- The history stores the last 20 selections and allows duplicates by design.

## Rights & disclaimer

This project is unofficial and educational, is not affiliated with or
endorsed by Nintendo, Game Freak, or The Pokémon Company, and must not be
used commercially. Pokémon names and imagery belong to their respective
rights holders. The same notice appears in the app's Settings → About
section.
