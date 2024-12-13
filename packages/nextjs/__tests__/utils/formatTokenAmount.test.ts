import { formatTokenAmount, safeParseUnits } from "../../utils/formatTokenAmount";
import { describe, expect, it } from "vitest";

describe("formatTokenAmount", () => {
  describe("basic functionality", () => {
    it("should handle empty input", () => {
      expect(formatTokenAmount("")).toBe("");
      expect(formatTokenAmount("   ")).toBe("");
    });

    it("should remove commas and whitespace", () => {
      expect(formatTokenAmount("1,000,000")).toBe("1000000");
      expect(formatTokenAmount("1 000 000")).toBe("1000000");
    });

    it("should handle regular decimal numbers", () => {
      expect(formatTokenAmount("123.456")).toBe("123.456");
      expect(formatTokenAmount("0.123")).toBe("0.123");
    });
  });

  describe("scientific notation", () => {
    it("should handle positive exponents", () => {
      expect(formatTokenAmount("1.23e3")).toBe("1230");
      expect(formatTokenAmount("1.23E6")).toBe("1230000");
      expect(formatTokenAmount("1e3")).toBe("1000");
    });

    it("should handle negative exponents", () => {
      expect(formatTokenAmount("1.23e-3")).toBe("0.00123");
      expect(formatTokenAmount("1.23E-6")).toBe("0.00000123");
      expect(formatTokenAmount("1e-3")).toBe("0.001");
    });

    it("should handle zero decimal part in scientific notation", () => {
      expect(formatTokenAmount("1.0e3")).toBe("1000");
      expect(formatTokenAmount("1.0e-3")).toBe("0.001");
      expect(formatTokenAmount("1.00e-3")).toBe("0.001");
      expect(formatTokenAmount("1.0000e2")).toBe("100");
    });

    it("should handle large numbers", () => {
      expect(formatTokenAmount("1.23456789e20")).toBe("123456789000000000000");
      expect(formatTokenAmount("1.23456789e-20")).toBe("0.0000000000000000000123456789");
    });
  });

  describe("error handling", () => {
    it("should throw error for invalid scientific notation", () => {
      expect(() => formatTokenAmount("1.23eX")).toThrow("Invalid scientific notation");
      expect(() => formatTokenAmount("1.23e")).toThrow("Invalid scientific notation");
    });
  });
});

describe("safeParseUnits", () => {
  describe("successful parsing", () => {
    it("should parse regular numbers", () => {
      expect(safeParseUnits("1000", 18)).toBe(1000n * 10n ** 18n);
      expect(safeParseUnits("0.5", 18)).toBe(5n * 10n ** 17n);
    });

    it("should parse scientific notation", () => {
      expect(safeParseUnits("1e3", 18)).toBe(1000n * 10n ** 18n);
      expect(safeParseUnits("1.5e3", 18)).toBe(1500n * 10n ** 18n);
    });

    it("should handle different decimal places", () => {
      expect(safeParseUnits("1000", 6)).toBe(1000n * 10n ** 6n);
      expect(safeParseUnits("0.5", 6)).toBe(5n * 10n ** 5n);
    });
  });

  describe("error handling", () => {
    it("should handle empty input", () => {
      expect(safeParseUnits("", 18)).toBe(0n);
    });
  });

  describe("edge cases", () => {
    it("should handle very small numbers", () => {
      expect(safeParseUnits("0.000000001", 18)).toBe(1n * 10n ** 9n);
      expect(safeParseUnits("1e-9", 18)).toBe(1n * 10n ** 9n);
    });

    it("should handle very large numbers", () => {
      const largeNumber = "1000000000000000000"; // 1e18
      expect(safeParseUnits(largeNumber, 18)).toBe(1000000000000000000n * 10n ** 18n);
    });

    it("should handle numbers with many decimal places", () => {
      expect(safeParseUnits("1.234567890123456789", 18)).toBe(1234567890123456789n);
    });
  });
});
