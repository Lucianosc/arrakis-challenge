import { parseUnits } from "viem";

/**
 * Converts scientific notation to decimal string while preserving precision
 */
export const formatTokenAmount = (amount: string): string => {
  // Handle empty or whitespace-only strings
  if (!amount || !amount.trim()) return "";

  // Remove any commas and trim whitespace
  const cleanAmount = amount.replace(/[,\s]/g, "");

  // Handle scientific notation
  if (cleanAmount.toLowerCase().includes("e")) {
    const [mantissa, exponentStr] = cleanAmount.toLowerCase().split("e");
    const exponent = parseInt(exponentStr);

    if (isNaN(exponent)) {
      throw new Error("Invalid scientific notation");
    }

    // Parse mantissa parts
    const [, decimalPart = ""] = mantissa.split(".");
    const mantissaValue = parseFloat(mantissa);

    // Handle special case where mantissa is 0
    if (mantissaValue === 0) return "0";

    // Calculate significant digits and decimal position
    const originalDecimalLength = decimalPart.length;
    const finalExponent = exponent - originalDecimalLength;

    if (finalExponent >= 0) {
      // Move decimal point right
      return mantissaValue * Math.pow(10, exponent) + "";
    } else {
      // Move decimal point left
      const result = mantissaValue * Math.pow(10, exponent);
      return result.toFixed(Math.abs(finalExponent));
    }
  }

  return cleanAmount;
};

/**
 * Safely parses token amounts to bigint, handling scientific notation
 */
export const safeParseUnits = (amount: string, decimals: number): bigint => {
  try {
    const formattedAmount = formatTokenAmount(amount);
    if (!formattedAmount) return 0n;
    return parseUnits(formattedAmount, decimals);
  } catch (error) {
    console.error("Error parsing units:", error);
    return 0n;
  }
};
