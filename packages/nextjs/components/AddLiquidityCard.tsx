import TokenInput from "./TokenInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenIcon } from "@web3icons/react";
import { Settings2 } from "lucide-react";
import { TokenState } from "~~/hooks/useTokensPairState";

// Props interface for the card component
export type AddLiquidityCardProps = {
  tokens: TokenState;
  onAmountChange: (tokenIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxClick: (tokenIndex: number) => () => void;
  errorMsg: string;
  buttonState: {
    text: string;
    action?: () => void;
    disabled: boolean;
  };
};

// Card component for adding liquidity to token pair pool
export const AddLiquidityCard: React.FC<AddLiquidityCardProps> = ({
  tokens,
  onAmountChange,
  onMaxClick,
  errorMsg,
  buttonState,
}) => (
  <Card className="w-full max-w-md bg-neutral-900 border-amber-900/20">
    {/* Header with title and token pair display */}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
      <CardTitle className="text-2xl font-semibold text-amber-50">Add liquidity</CardTitle>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
            <TokenIcon symbol={tokens[0].iconSymbol} variant="branded" />
          </div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
            <TokenIcon symbol={tokens[1].iconSymbol} variant="branded" />
          </div>
        </div>
        <p className="text-amber-100 font-medium">
          {tokens[0].symbol}/{tokens[1].symbol}
        </p>
      </div>
    </CardHeader>

    {/* Main content */}
    <CardContent className="space-y-3">
      {/* Token input fields */}
      {Object.entries(tokens).map(([index, data]) => (
        <TokenInput
          key={`${data.symbol}_input${index}`}
          token={data.symbol}
          amount={data.amount}
          onAmountChange={onAmountChange(Number(index))}
          balance={data.balance}
          onMaxClick={onMaxClick(Number(index))}
          usdValue={data.usdValue}
          isError={data.isError}
        />
      ))}

      <Button
        className="w-full bg-amber-600 hover:bg-amber-700 text-neutral-900 font-medium text-sm"
        disabled={buttonState.disabled}
        onClick={buttonState.action}
      >
        {buttonState.text}
      </Button>

      <div className="py-1.5 text-sm text-red-500 font-medium">{errorMsg}</div>

      {/* Slippage settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-100 text-sm">
          <Settings2 size={16} />
          <p>Slippage</p>
        </div>
        <p className="text-amber-100 text-sm">0.5%</p>
      </div>
    </CardContent>
  </Card>
);
