import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TokenInputProps {
  token: string;
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  balance?: number;
  onMaxClick: () => void;
  isLoading?: boolean;
  usdValue?: string;
  isError?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  token,
  amount,
  onAmountChange,
  balance = 0,
  onMaxClick,
  isLoading = false,
  usdValue = "$0.00",
  isError = false,
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value) && value !== "") {
      return;
    }

    // Handle decimal numbers
    if (value.includes(".")) {
      const [whole, decimal] = value.split(".");
      if (whole.length + decimal.length > 20) {
        return;
      }
    }
    // Handle whole numbers
    else if (value.length > 20) {
      return;
    }

    // Handle scientific notation
    if (value.toLowerCase().includes("e")) {
      return;
    }

    onAmountChange(e);
  };

  return (
    <div className={cn("rounded-lg border p-4 bg-neutral-800", isError ? "border-red-500" : "border-amber-800/20")}>
      <div className="flex items-center justify-between mb-2">
        <Input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          className="mr-3 text-3xl bg-transparent border-none text-amber-50 p-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-amber-200/20"
          disabled={isLoading}
        />
        <div className="px-4 py-2 rounded-md bg-amber-900/40 text-amber-100 border border-amber-800/40">{token}</div>
      </div>
      <div className="flex justify-between text-sm text-amber-200/70">
        <span>{usdValue}</span>
        <div className="flex items-center space-x-2">
          <span>Balance: {balance.toPrecision(3)}</span>
          <Button
            variant="ghost"
            onClick={onMaxClick}
            disabled={isLoading}
            className="h-auto p-0 text-amber-400 hover:text-amber-300 hover:bg-transparent"
          >
            MAX
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
