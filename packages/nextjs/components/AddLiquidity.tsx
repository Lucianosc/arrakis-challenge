"use client";

import React, { useEffect, useState } from "react";
import TokenInput from "./TokenInput";
import TransactionProgress from "./TransactionProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TokenIcon } from "@web3icons/react";
import { formatUnits } from "viem";
import { arbitrum } from "viem/chains";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { ARRAKIS_CONTRACTS, TOKENS as CONTRACT_TOKENS } from "~~/contracts/contracts";
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
  const { price: ethPrice, isError: isEthPriceError } = useTokenPrice("ETHUSD");
  const { price: rethPrice, isError: isRethPriceError } = useTokenPrice("rETHETH");
  const [isTransactionProgressOpen, setIsTransactionProgressOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenState>({
    rETH: {
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

  // Fetch rETH balance
  const { data: rethBalance } = useBalance({
    address: userAddress,
    token: CONTRACT_TOKENS.rETH.address,
  });

  // Fetch WETH balance
  const { data: wethBalance } = useBalance({
    address: userAddress,
    token: CONTRACT_TOKENS.WETH.address,
  });

  // Update rETH balance
  useEffect(() => {
    if (rethBalance) {
      setTokens(prev => ({
        ...prev,
        rETH: {
          ...prev.rETH,
          balance: Number(formatUnits(rethBalance.value, CONTRACT_TOKENS.rETH.decimals)),
        },
      }));
    }
  }, [rethBalance]);

  // Update WETH balance
  useEffect(() => {
    if (wethBalance) {
      setTokens(prev => ({
        ...prev,
        WETH: {
          ...prev.WETH,
          balance: Number(formatUnits(wethBalance.value, CONTRACT_TOKENS.WETH.decimals)),
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

    if (token === "rETH") {
      usdValue = Number(newAmount) * rethPrice * ethPrice;
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

    if (token === "rETH") {
      usdValue = balance * rethPrice * ethPrice;
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
      action: () => setIsTransactionProgressOpen(true),
      disabled:
        !Number(tokens.rETH.amount) ||
        !Number(tokens.WETH.amount) ||
        Number(tokens.rETH.amount) > tokens.rETH.balance ||
        Number(tokens.WETH.amount) > tokens.WETH.balance ||
        isEthPriceError ||
        isRethPriceError,
    },
  };

  const currentState = Object.values(buttonStates).find(state => state.condition);

  const approvalTokens = [
    {
      address: CONTRACT_TOKENS.rETH.address,
      symbol: CONTRACT_TOKENS.rETH.symbol,
      decimals: CONTRACT_TOKENS.rETH.decimals,
      amount: tokens.rETH.amount,
    },
    {
      address: CONTRACT_TOKENS.WETH.address,
      symbol: CONTRACT_TOKENS.WETH.symbol,
      decimals: CONTRACT_TOKENS.WETH.decimals,
      amount: tokens.WETH.amount,
    },
  ];

  return (
    <div className="w-full flex justify-center mt-12">
      <Card className="w-full max-w-md bg-neutral-900 border-amber-900/20 ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-semibold text-amber-50">Add liquidity</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
                <TokenIcon symbol="eth" variant="branded" />
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-50">
                <TokenIcon symbol="rpl" variant="branded" />
              </div>
            </div>
            <span className="text-amber-100 font-medium">WETH/rETH</span>
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
      <TransactionProgress
        isOpen={isTransactionProgressOpen}
        onClose={() => setIsTransactionProgressOpen(false)}
        tokens={approvalTokens}
        spenderAddress={ARRAKIS_CONTRACTS.router.address}
        onSuccess={() => console.log("trigger add liquidity")}
      />
    </div>
  );
};

export default AddLiquidity;
