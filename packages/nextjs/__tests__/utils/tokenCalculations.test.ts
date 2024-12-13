import { calculateTokenAmounts, calculateTokenPrice, safeParseNumber } from "../../utils/tokenCalculations";

describe("calculateTokenPrice", () => {
  it("calculates token price correctly", () => {
    expect(calculateTokenPrice(2, 1500)).toBe(3000);
    expect(calculateTokenPrice(0.5, 1500)).toBe(750);
  });

  it("handles zero and null values", () => {
    expect(calculateTokenPrice(0, 1500)).toBe(0);
    expect(calculateTokenPrice(100, null)).toBe(0);
  });
});

describe("safeParseNumber", () => {
  it("parses valid number strings", () => {
    expect(safeParseNumber("123.45")).toBe(123.45);
    expect(safeParseNumber("0.123")).toBe(0.123);
  });

  it("returns 0 for invalid inputs", () => {
    expect(safeParseNumber("abc")).toBe(0);
    expect(safeParseNumber("")).toBe(0);
  });
});

describe("calculateTokenAmounts", () => {
  it("calculates amounts correctly with valid ratio", () => {
    expect(calculateTokenAmounts("1", 0, 2)).toEqual({
      newAmount: "1",
      otherAmount: "0.5",
    });

    expect(calculateTokenAmounts("2", 1, 2)).toEqual({
      newAmount: "2",
      otherAmount: "4",
    });
  });

  it("handles invalid inputs", () => {
    expect(calculateTokenAmounts("", 0, 2)).toEqual({
      newAmount: "",
      otherAmount: "",
    });

    expect(calculateTokenAmounts("100", 0, null)).toEqual({
      newAmount: "100",
      otherAmount: "",
    });
  });
});
