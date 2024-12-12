export const calculateTokenPrice = (amount: number, tokenPrice: number | null): number => {
  if (!amount || !tokenPrice) return 0;
  return amount * tokenPrice;
};

export const safeParseNumber = (value: string): number | null => {
  const sanitizedValue = value.replace(/[^\d.]/g, "");
  const parsedValue = Number(sanitizedValue);
  return isNaN(parsedValue) ? null : parsedValue;
};

export const calculateTokenAmounts = (
  amount: string,
  tokenIndex: number,
  vaultTokenRatio: number | null,
): { newAmount: string; otherAmount: string } => {
  if (!vaultTokenRatio || !amount) {
    return { newAmount: amount, otherAmount: "" };
  }

  const numAmount = safeParseNumber(amount);
  if (numAmount === null) {
    return { newAmount: amount, otherAmount: "" };
  }

  const otherAmount =
    tokenIndex === 0 ? (numAmount / vaultTokenRatio).toString() : (numAmount * vaultTokenRatio).toString();

  return { newAmount: amount, otherAmount };
};
