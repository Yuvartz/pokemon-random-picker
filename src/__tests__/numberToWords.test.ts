import { numberToWordsEn, numberToWordsHe } from "../utils/numberToWords";

describe("numberToWordsEn", () => {
  it("converts Pokédex-range numbers", () => {
    expect(numberToWordsEn(1)).toBe("one");
    expect(numberToWordsEn(25)).toBe("twenty-five");
    expect(numberToWordsEn(100)).toBe("one hundred");
    expect(numberToWordsEn(151)).toBe("one hundred and fifty-one");
  });
});

describe("numberToWordsHe", () => {
  it("converts Pokédex-range numbers", () => {
    expect(numberToWordsHe(1)).toBe("אחת");
    expect(numberToWordsHe(25)).toBe("עשרים וחמש");
    expect(numberToWordsHe(100)).toBe("מאה");
    expect(numberToWordsHe(151)).toBe("מאה חמישים ואחת");
  });

  it("produces non-empty words for every Pokédex ID", () => {
    for (let i = 1; i <= 151; i++) {
      expect(numberToWordsHe(i).length).toBeGreaterThan(0);
      expect(numberToWordsEn(i).length).toBeGreaterThan(0);
    }
  });
});
