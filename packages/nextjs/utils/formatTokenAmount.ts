import { parseUnits } from "viem";

/**
 * Converts scientific notation to decimal string while preserving precision
 */
export const formatTokenAmount = (amount: string): string => {
  if (!amount) return "0";

  // Remove any commas or whitespace
  const cleanAmount = amount.replace(/[,\s]/g, "");

  // Handle scientific notation
  if (cleanAmount.toLowerCase().includes("e")) {
    const [mantissa, exponentStr] = cleanAmount.toLowerCase().split("e");
    const exponent = parseInt(exponentStr);

    if (isNaN(exponent)) {
      throw new Error("Invalid scientific notation");
    }

    // Remove decimal point from mantissa and track its position
    const [integerPart, decimalPart = ""] = mantissa.split(".");
    const mantissaWithoutDecimal = integerPart + decimalPart;

    // Calculate the final decimal position
    const originalDecimalLength = decimalPart.length;
    const newPosition = originalDecimalLength ? exponent + originalDecimalLength : exponent;

    if (newPosition >= 0) {
      // Need to add zeros to the end
      return mantissaWithoutDecimal + "0".repeat(newPosition - mantissaWithoutDecimal.length + integerPart.length);
    } else {
      // Need to add zeros at the start
      return "0." + "0".repeat(Math.abs(newPosition) - 1) + mantissaWithoutDecimal;
    }
  }

  // If no scientific notation, return as is
  return cleanAmount;
};

/**
 * Safely parses token amounts to bigint, handling scientific notation
 */
export const safeParseUnits = (amount: string, decimals: number): bigint => {
  try {
    const formattedAmount = formatTokenAmount(amount);
    return parseUnits(formattedAmount, decimals);
  } catch (error) {
    console.error("Error parsing units:", error);
    return 0n;
  }
};
