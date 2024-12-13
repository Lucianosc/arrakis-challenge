import { describe, expect, it } from "vitest";
import { calculateTokenAmounts, calculateTokenPrice, safeParseNumber } from "~~/utils/tokenCalculations";

describe("Token Calculation Utils", () => {
  describe("calculateTokenPrice", () => {
    it("should correctly calculate token price", () => {
      expect(calculateTokenPrice(100, 2)).toBe(200);
      expect(calculateTokenPrice(50.5, 1.5)).toBe(75.75);
    });

    it("should return 0 for invalid inputs", () => {
      expect(calculateTokenPrice(0, 100)).toBe(0);
      expect(calculateTokenPrice(100, 0)).toBe(0);
      expect(calculateTokenPrice(100, null)).toBe(0);
    });

    it("should handle decimal calculations", () => {
      expect(calculateTokenPrice(0.1, 0.1)).toBe(0.01);
      expect(calculateTokenPrice(1.23456, 2)).toBe(2.46912);
    });
  });

  describe("safeParseNumber", () => {
    it("should parse valid numbers", () => {
      expect(safeParseNumber("123")).toBe(123);
      expect(safeParseNumber("123.456")).toBe(123.456);
    });

    it("should handle invalid characters", () => {
      expect(safeParseNumber("123abc")).toBe(123);
      expect(safeParseNumber("$123.45")).toBe(123.45);
      expect(safeParseNumber("1,234.56")).toBe(1234.56);
    });

    it("should return null for invalid numbers", () => {
      expect(safeParseNumber(".")).toBe(null);
      expect(safeParseNumber("abc")).toBe(null);
      expect(safeParseNumber("")).toBe(null);
    });

    it("should handle multiple decimal points", () => {
      expect(safeParseNumber("123.456.789")).toBe(null);
    });
  });

  describe("calculateTokenAmounts", () => {
    it("should calculate correct token amounts for token0", () => {
      const result = calculateTokenAmounts("100", 0, 2); // ratio 2:1
      expect(result).toEqual({
        newAmount: "100",
        otherAmount: "50", // 100/2
      });
    });

    it("should calculate correct token amounts for token1", () => {
      const result = calculateTokenAmounts("50", 1, 2); // ratio 2:1
      expect(result).toEqual({
        newAmount: "50",
        otherAmount: "100", // 50*2
      });
    });

    it("should handle invalid vault token ratio", () => {
      const result = calculateTokenAmounts("100", 0, null);
      expect(result).toEqual({
        newAmount: "100",
        otherAmount: "",
      });
    });

    it("should handle empty amount input", () => {
      const result = calculateTokenAmounts("", 0, 2);
      expect(result).toEqual({
        newAmount: "",
        otherAmount: "",
      });
    });

    it("should handle invalid number input", () => {
      const result = calculateTokenAmounts("abc", 0, 2);
      expect(result).toEqual({
        newAmount: "abc",
        otherAmount: "0",
      });
    });

    it("should handle decimal inputs", () => {
      const result = calculateTokenAmounts("10.5", 0, 2);
      expect(result).toEqual({
        newAmount: "10.5",
        otherAmount: "5.25",
      });
    });

    it("should handle very small numbers", () => {
      const result = calculateTokenAmounts("0.0001", 1, 2);
      expect(result).toEqual({
        newAmount: "0.0001",
        otherAmount: "0.0002",
      });
    });

    it("should handle very large numbers", () => {
      const result = calculateTokenAmounts("1000000", 0, 2);
      expect(result).toEqual({
        newAmount: "1000000",
        otherAmount: "500000",
      });
    });
  });
});
