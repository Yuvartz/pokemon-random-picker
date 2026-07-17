import { splitSpeechText } from "../utils/speechChunks";
import { ALL_POKEMON } from "../data/pokemon";

describe("splitSpeechText", () => {
  it("keeps short text as a single chunk", () => {
    expect(splitSpeechText("Hello there.")).toEqual(["Hello there."]);
  });

  it("splits long text into chunks under the limit", () => {
    const long =
      "First sentence about something. Second sentence about something else. " +
      "Third sentence that keeps going and going. Fourth one to push it over.";
    const chunks = splitSpeechText(long, 80);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(80 + 40); // one sentence may overflow
      expect(chunk.trim().length).toBeGreaterThan(0);
    }
  });

  it("never loses words", () => {
    const text = "One two three. Four five six! Seven eight nine? Ten.";
    const rejoined = splitSpeechText(text, 20).join(" ");
    expect(rejoined.replace(/\s+/g, " ")).toBe(text);
  });

  it("chunks every Pokémon speech text without dropping content", () => {
    for (const p of ALL_POKEMON) {
      for (const text of [p.speechTextEn, p.speechTextHe]) {
        const chunks = splitSpeechText(text);
        expect(chunks.length).toBeGreaterThan(0);
        expect(chunks.join(" ").replace(/\s+/g, " ")).toBe(
          text.replace(/\s+/g, " ")
        );
      }
    }
  });
});
