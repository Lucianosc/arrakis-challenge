"use client";

import React, { useEffect, useState } from "react";
import TokenInput from "./TokenInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TokenIcon } from "@web3icons/react";
import { formatUnits } from "viem";
import { arbitrum } from "viem/chains";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { TOKENS } from "~~/contracts/contracts";
import { useTokenPrice } from "~~/hooks/useTokenPrice";

interface TokenData {
  amount: string;
  balance: number;
  usdValue: string;
}

interface TokenState {
  [key: string]: TokenData;
}

const AddLiquidity: React.FC = () => {
  const { address: userAddress, isConnected, chainId: currentChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { price: ethPrice, isError: isPriceError } = useTokenPrice("WETH");
  const [tokens, setTokens] = useState<TokenState>({
    USDC: {
      amount: "",
      balance: 0,
      usdValue: "$0.00",
    },
    WETH: {
      amount: "",
      balance: 0,
      usdValue: "$0.00",
    },
  });

  // Fetch USDC balance
  const { data: usdcBalance } = useBalance({
    address: userAddress,
    token: TOKENS.USDC.address,
  });

  // Fetch WETH balance
  const { data: wethBalance } = useBalance({
    address: userAddress,
    token: TOKENS.WETH.address,
  });

  // Update USDC balance
  useEffect(() => {
    if (usdcBalance) {
      setTokens(prev => ({
        ...prev,
        USDC: {
          ...prev.USDC,
          balance: Number(formatUnits(usdcBalance.value, TOKENS.USDC.decimals)),
        },
      }));
    }
  }, [usdcBalance]);

  // Update WETH balance
  useEffect(() => {
    if (wethBalance) {
      setTokens(prev => ({
        ...prev,
        WETH: {
          ...prev.WETH,
          balance: Number(formatUnits(wethBalance.value, TOKENS.WETH.decimals)),
        },
      }));
    }
  }, [wethBalance]);

  const handleAmountChange = (token: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;

    // Validate input against balance
    const currentBalance = tokens[token].balance;
    if (Number(newAmount) > currentBalance) {
      return;
    }

    let usdValue = 0;

    if (token === "USDC") {
      usdValue = Number(newAmount); // USDC is pegged to USD
    } else {
      usdValue = Number(newAmount) * ethPrice;
    }

    setTokens(prev => ({
      ...prev,
      [token]: {
        ...prev[token],
        amount: newAmount,
        usdValue: `$${usdValue.toFixed(2)}`,
      },
    }));
  };

  const handleMaxClick = (token: string) => () => {
    const balance = tokens[token].balance;
    let usdValue = 0;

    if (token === "USDC") {
      usdValue = balance;
    } else {
      usdValue = balance * ethPrice;
    }

    setTokens(prev => ({
      ...prev,
      [token]: {
        ...prev[token],
        amount: balance.toString(),
        usdValue: `$${usdValue.toFixed(2)}`,
      },
    }));
  };

  const handleAddLiquidity = () => {
    console.log("add liquidity");
  };

  const buttonStates = {
    disconnected: {
      condition: !isConnected,
      text: "Connect Wallet",
      action: openConnectModal,
      disabled: false,
    },
    wrongNetwork: {
      condition: isConnected && currentChainId !== arbitrum.id,
      text: "Switch to Arbitrum",
      action: () => switchChain({ chainId: arbitrum.id }),
      disabled: false,
    },
    addLiquidity: {
      condition: isConnected && currentChainId === arbitrum.id,
      text: "CONFIRM",
      action: handleAddLiquidity,
      disabled:
        !Number(tokens.USDC.amount) ||
        !Number(tokens.WETH.amount) ||
        Number(tokens.USDC.amount) > tokens.USDC.balance ||
        Number(tokens.WETH.amount) > tokens.WETH.balance ||
        isPriceError,
    },
  };

  const currentState = Object.values(buttonStates).find(state => state.condition);

  return (
    <Card className="w-full max-w-md bg-neutral-900 border-amber-900/20 mt-12">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-semibold text-amber-50">Add liquidity</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
              <TokenIcon symbol="usdc" variant="branded" className="w-6 h-6" />
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
              <TokenIcon symbol="eth" variant="branded" />
            </div>
          </div>
          <span className="text-amber-100 font-medium">USDC/WETH</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {Object.entries(tokens).map(([token, data]) => (
          <TokenInput
            key={token}
            token={token}
            amount={data.amount}
            onAmountChange={handleAmountChange(token)}
            balance={data.balance}
            onMaxClick={handleMaxClick(token)}
            usdValue={data.usdValue}
          />
        ))}

        <Button
          className="w-full bg-amber-600 hover:bg-amber-700 text-neutral-900 font-medium text-sm"
          disabled={currentState?.disabled}
          onClick={currentState?.action}
        >
          {currentState?.text}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddLiquidity;
