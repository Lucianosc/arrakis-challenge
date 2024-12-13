import { formatTokenAmount, safeParseUnits } from "@/utils/formatTokenAmount";

describe("formatTokenAmount", () => {
  describe("basic formatting", () => {
    it("handles regular decimal numbers", () => {
      expect(formatTokenAmount("123.456")).toBe("123.456");
      expect(formatTokenAmount("0.123")).toBe("0.123");
      expect(formatTokenAmount("1000")).toBe("1000");
    });

    it("removes commas and whitespace", () => {
      expect(formatTokenAmount("1,000.50")).toBe("1000.50");
      expect(formatTokenAmount("1 000.50")).toBe("1000.50");
      expect(formatTokenAmount(" 1000.50 ")).toBe("1000.50");
    });

    it("handles empty or whitespace inputs", () => {
      expect(formatTokenAmount("")).toBe("");
      expect(formatTokenAmount("  ")).toBe("");
    });
  });

  describe("scientific notation", () => {
    it("handles basic scientific notation", () => {
      expect(formatTokenAmount("1e2")).toBe("100");
      expect(formatTokenAmount("1e-2")).toBe("0.01");
      expect(formatTokenAmount("1.23e2")).toBe("123");
    });

    it("handles small numbers in scientific notation", () => {
      expect(formatTokenAmount("1e-18")).toBe("0.000000000000000001");
      expect(formatTokenAmount("1.23e-8")).toBe("0.0000000123");
    });

    it("throws error for invalid scientific notation", () => {
      expect(() => formatTokenAmount("1.23eX")).toThrow("Invalid scientific notation");
      expect(() => formatTokenAmount("1.23e")).toThrow("Invalid scientific notation");
    });
  });
});

describe("safeParseUnits", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("valid inputs", () => {
    it("parses whole numbers correctly", () => {
      expect(safeParseUnits("1", 18).toString()).toBe("1000000000000000000");
      expect(safeParseUnits("100", 18).toString()).toBe("100000000000000000000");
    });

    it("parses decimal numbers correctly", () => {
      expect(safeParseUnits("1.0", 18).toString()).toBe("1000000000000000000");
      expect(safeParseUnits("0.5", 18).toString()).toBe("500000000000000000");
      expect(safeParseUnits("0.1", 18).toString()).toBe("100000000000000000");
    });

    it("handles scientific notation", () => {
      expect(safeParseUnits("1e-18", 18).toString()).toBe("1");
      expect(safeParseUnits("1e-9", 18).toString()).toBe("1000000000");
    });

    it("handles different decimal places", () => {
      expect(safeParseUnits("1.0", 6).toString()).toBe("1000000");
      expect(safeParseUnits("0.1", 8).toString()).toBe("10000000");
    });
  });

  describe("invalid inputs", () => {
    it("returns 0 for empty inputs", () => {
      expect(safeParseUnits("", 18).toString()).toBe("0");
      expect(safeParseUnits("  ", 18).toString()).toBe("0");
    });

    it("returns 0 for invalid numbers", () => {
      expect(safeParseUnits("abc", 18).toString()).toBe("0");
      expect(safeParseUnits("12.34.56", 18).toString()).toBe("0");
    });

    it("returns 0 for invalid scientific notation", () => {
      expect(safeParseUnits("1.23eX", 18).toString()).toBe("0");
      expect(safeParseUnits("1.23e", 18).toString()).toBe("0");
    });
  });
});
