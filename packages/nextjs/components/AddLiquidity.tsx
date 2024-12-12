"use client";

import React, { useEffect, useState } from "react";
import TokenInput from "./TokenInput";
import { Token, TransactionModal } from "./TransactionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TokenIcon } from "@web3icons/react";
import { Settings2 } from "lucide-react";
import { Abi, Address, formatUnits } from "viem";
import { arbitrum } from "viem/chains";
import { useAccount, useBalance, useReadContract, useSwitchChain } from "wagmi";
import { TOKENS as CONTRACT_TOKENS, TokenConfig } from "~~/config/configs";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";
import { useTokenPrice } from "~~/hooks/useTokenPrice";

type VaultConfig = {
  token0: TokenConfig;
  token1: TokenConfig;
  vault: {
    address: Address;
    helper: {
      address: Address;
      abi: Abi;
    };
  };
};

export type TokenData = TokenConfig & {
  amount: string;
  balance: number;
  usdValue: string;
  isError: boolean;
};

type TokenState = {
  [key: number]: TokenData;
};

const VAULT_CONFIG: VaultConfig = {
  token0: CONTRACT_TOKENS.WETH,
  token1: CONTRACT_TOKENS.rETH,
  vault: {
    address: ARRAKIS_CONTRACTS.vault.address,
    helper: {
      address: ARRAKIS_CONTRACTS.helper.address,
      abi: ARRAKIS_CONTRACTS.helper.abi,
    },
  },
};

const AddLiquidity: React.FC = () => {
  const { address: userAddress, isConnected, chainId: currentChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { price: token0Price, isError: isToken0PriceError } = useTokenPrice(VAULT_CONFIG.token0.pricePairTicker);
  const { price: token1Price, isError: isToken1PriceError } = useTokenPrice(VAULT_CONFIG.token1.pricePairTicker);
  const [isTransactionProgressOpen, setIsTransactionProgressOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [tokens, setTokens] = useState<TokenState>({
    0: {
      ...VAULT_CONFIG.token0,
      amount: "",
      balance: 0,
      usdValue: "$0.00",
      isError: false,
    },
    1: {
      ...VAULT_CONFIG.token1,
      amount: "",
      balance: 0,
      usdValue: "$0.00",
      isError: false,
    },
  });

  // Fetch token balances
  const { data: token0Balance } = useBalance({
    address: userAddress,
    token: VAULT_CONFIG.token0.address,
  });

  const { data: token1Balance } = useBalance({
    address: userAddress,
    token: VAULT_CONFIG.token1.address,
  });

  // Read total underlying from vault
  const { data: totalUnderlying } = useReadContract({
    address: VAULT_CONFIG.vault.helper.address,
    abi: VAULT_CONFIG.vault.helper.abi,
    functionName: "totalUnderlying",
    args: [VAULT_CONFIG.vault.address],
  }) as { data: readonly [bigint, bigint] | undefined };

  // Calculate vault token ratio
  const vaultTokenRatio = totalUnderlying
    ? Number(formatUnits(totalUnderlying[0], VAULT_CONFIG.token0.decimals)) /
      Number(formatUnits(totalUnderlying[1], VAULT_CONFIG.token1.decimals))
    : null;

  // Update balances when they change
  useEffect(() => {
    if (token0Balance) {
      setTokens(prev => ({
        ...prev,
        0: {
          ...prev[0],
          balance: Number(formatUnits(token0Balance.value, VAULT_CONFIG.token0.decimals)),
        },
      }));
    }
  }, [token0Balance]);

  useEffect(() => {
    if (token1Balance) {
      setTokens(prev => ({
        ...prev,
        1: {
          ...prev[1],
          balance: Number(formatUnits(token1Balance.value, VAULT_CONFIG.token1.decimals)),
        },
      }));
    }
  }, [token1Balance]);

  // Calculate USD value for a token amount
  const calculateTokenPrice = (tokenIndex: number, amount: number): number => {
    if (!amount) return 0;
    if (tokenIndex === 0) {
      return amount * (token0Price ?? 0);
    }
    return amount * (token0Price ?? 0) * (token1Price ?? 0);
  };

  // Validate and update token amounts
  const validateAndUpdateTokens = (
    prevTokens: TokenState,
    changedIndex: number,
    newAmount: string,
    otherIndex: number,
    otherAmount: string,
  ): [TokenState, boolean] => {
    const numAmount = Number(newAmount || "0");
    const numOtherAmount = Number(otherAmount || "0");

    const updatedTokens = {
      ...prevTokens,
      [changedIndex]: {
        ...prevTokens[changedIndex],
        amount: newAmount,
        usdValue: `$${calculateTokenPrice(changedIndex, numAmount).toFixed(2)}`,
        isError: numAmount > prevTokens[changedIndex].balance,
      },
      [otherIndex]: {
        ...prevTokens[otherIndex],
        amount: otherAmount,
        usdValue: `$${calculateTokenPrice(otherIndex, numOtherAmount).toFixed(2)}`,
        isError: numOtherAmount > prevTokens[otherIndex].balance,
      },
    };

    const hasError = Object.values(updatedTokens).some(tokenData => tokenData.isError);
    return [updatedTokens, hasError];
  };

  // Helper function to safely convert string to number
  const safeParseNumber = (value: string): number | null => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const parsedValue = Number(sanitizedValue);
    return isNaN(parsedValue) ? null : parsedValue;
  };

  // Helper function to handle token amount updates with ratio calculations
  const calculateTokenAmounts = (
    amount: string,
    tokenIndex: number,
    vaultTokenRatio: number | null,
  ): { newAmount: string; otherAmount: string } => {
    if (!vaultTokenRatio || !amount) {
      return {
        newAmount: amount,
        otherAmount: "",
      };
    }

    const numAmount = safeParseNumber(amount);

    // If conversion failed, return empty other amount
    if (numAmount === null) {
      return {
        newAmount: amount,
        otherAmount: "",
      };
    }

    const otherAmount =
      tokenIndex === 0 ? (numAmount / vaultTokenRatio).toString() : (numAmount * vaultTokenRatio).toString();

    return {
      newAmount: amount,
      otherAmount,
    };
  };

  // Common update logic for both handlers
  const updateTokenAmounts = (
    currentTokens: TokenState,
    tokenIndex: number,
    newAmount: string,
    vaultTokenRatio: number | null,
    setErrorMsg: (msg: string) => void,
  ): TokenState => {
    const otherIndex = tokenIndex === 0 ? 1 : 0;
    const { newAmount: validatedAmount, otherAmount } = calculateTokenAmounts(newAmount, tokenIndex, vaultTokenRatio);

    const [updatedTokens, hasError] = validateAndUpdateTokens(
      currentTokens,
      tokenIndex,
      validatedAmount,
      otherIndex,
      otherAmount || currentTokens[otherIndex].amount,
    );

    setErrorMsg(hasError ? "Insufficient balance" : "");
    return updatedTokens;
  };

  // Refactored handlers using the common update logic
  const handleAmountChange = (tokenIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;

    setTokens(prev => updateTokenAmounts(prev, tokenIndex, newAmount, vaultTokenRatio, setErrorMsg));
  };

  const handleMaxClick = (tokenIndex: number) => () => {
    const balance = tokens[tokenIndex].balance;

    setTokens(prev => updateTokenAmounts(prev, tokenIndex, balance.toString(), vaultTokenRatio, setErrorMsg));
  };

  // Button states
  const btnStates = {
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
        !Number(tokens[0].amount) ||
        !Number(tokens[1].amount) ||
        Boolean(errorMsg) ||
        isToken0PriceError ||
        isToken1PriceError,
    },
  };

  const currentBtnState = Object.values(btnStates).find(state => state.condition);

  const tokensToApprove: [Token, Token] = [
    {
      address: tokens[0].address,
      symbol: tokens[0].symbol,
      decimals: tokens[0].decimals,
      amount: tokens[0].amount,
    },
    {
      address: tokens[1].address,
      symbol: tokens[1].symbol,
      decimals: tokens[1].decimals,
      amount: tokens[1].amount,
    },
  ];

  return (
    <div className="w-full flex justify-center mt-12">
      <Card className="w-full max-w-md bg-neutral-900 border-amber-900/20">
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

        <CardContent className="space-y-3">
          {Object.entries(tokens).map(([index, data]) => (
            <TokenInput
              key={index}
              token={data.symbol}
              amount={data.amount}
              onAmountChange={handleAmountChange(Number(index))}
              balance={data.balance}
              onMaxClick={handleMaxClick(Number(index))}
              usdValue={data.usdValue}
              isError={data.isError}
            />
          ))}
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700 text-neutral-900 font-medium text-sm"
            disabled={currentBtnState?.disabled}
            onClick={currentBtnState?.action}
          >
            {currentBtnState?.text}
          </Button>
          <div className="py-1.5 text-sm text-red-500 font-medium">{errorMsg}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-100 text-sm">
              <Settings2 size={16} />
              <p>Slippage</p>
            </div>
            <p className="text-amber-100 text-sm">0.5%</p>
          </div>
        </CardContent>
      </Card>
      <TransactionModal
        isOpen={isTransactionProgressOpen}
        onClose={() => setIsTransactionProgressOpen(false)}
        tokens={tokensToApprove}
        onSuccess={() => console.log("Liquidity Added")}
      />
    </div>
  );
};

export default AddLiquidity;
