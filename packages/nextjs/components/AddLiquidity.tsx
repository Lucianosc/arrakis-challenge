"use client";

import React, { useState } from "react";
import { AddLiquidityCard } from "./AddLiquidityCard";
import { Token, TransactionModal } from "./TransactionModal";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { arbitrum } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { VAULT_CONFIG } from "~~/config/configs";
import { useTokenPrice } from "~~/hooks/useTokenPrice";
import { TokenState, useTokenState } from "~~/hooks/useTokenState";
import { useVaultRatio } from "~~/hooks/useVaultRatio";
import { calculateTokenAmounts, calculateTokenPrice } from "~~/utils/tokenCalculations";

const AddLiquidity: React.FC = () => {
  const { isConnected, chainId: currentChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { price: token0Price, isError: isToken0PriceError } = useTokenPrice(VAULT_CONFIG.token0.pricePairTicker);
  const { price: token1Price, isError: isToken1PriceError } = useTokenPrice(VAULT_CONFIG.token1.pricePairTicker);
  const [isTransactionProgressOpen, setIsTransactionProgressOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { tokens, setTokens } = useTokenState(VAULT_CONFIG.token0, VAULT_CONFIG.token1);
  const vaultTokenRatio = useVaultRatio(
    VAULT_CONFIG.vault.helper.address,
    VAULT_CONFIG.vault.helper.abi,
    VAULT_CONFIG.vault.address,
    VAULT_CONFIG.token0.decimals,
    VAULT_CONFIG.token1.decimals,
  );

  const validateAndUpdateTokens = (
    prevTokens: TokenState,
    changedIndex: number,
    newAmount: string,
    otherIndex: number,
    otherAmount: string,
  ): TokenState => {
    const numAmount = Number(newAmount || "0");
    const numOtherAmount = Number(otherAmount || "0");
    const tokenPrice = changedIndex === 0 ? token0Price : token1Price;
    const otherTokenPrice = changedIndex === 0 ? token1Price : token0Price;

    return {
      ...prevTokens,
      [changedIndex]: {
        ...prevTokens[changedIndex],
        amount: newAmount,
        usdValue: `$${calculateTokenPrice(numAmount, tokenPrice).toFixed(2)}`,
        isError: numAmount > prevTokens[changedIndex].balance,
      },
      [otherIndex]: {
        ...prevTokens[otherIndex],
        amount: otherAmount,
        usdValue: `$${calculateTokenPrice(numOtherAmount, otherTokenPrice).toFixed(2)}`,
        isError: numOtherAmount > prevTokens[otherIndex].balance,
      },
    };
  };

  const handleAmountChange = (tokenIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    const otherIndex = tokenIndex === 0 ? 1 : 0;
    const { newAmount: validatedAmount, otherAmount } = calculateTokenAmounts(newAmount, tokenIndex, vaultTokenRatio);

    const updatedTokens = validateAndUpdateTokens(tokens, tokenIndex, validatedAmount, otherIndex, otherAmount);

    setErrorMsg(Object.values(updatedTokens).some(token => token.isError) ? "Insufficient balance" : "");
    setTokens(updatedTokens);
  };

  const handleMaxClick = (tokenIndex: number) => () => {
    const balance = tokens[tokenIndex].balance;
    handleAmountChange(tokenIndex)({ target: { value: balance.toString() } } as React.ChangeEvent<HTMLInputElement>);
  };

  const buttonState = isConnected
    ? currentChainId !== arbitrum.id
      ? {
          text: "Switch to Arbitrum",
          action: () => switchChain({ chainId: arbitrum.id }),
          disabled: false,
        }
      : {
          text: "CONFIRM",
          action: () => setIsTransactionProgressOpen(true),
          disabled:
            !Number(tokens[0].amount) ||
            !Number(tokens[1].amount) ||
            Boolean(errorMsg) ||
            isToken0PriceError ||
            isToken1PriceError,
        }
    : {
        text: "Connect Wallet",
        action: openConnectModal,
        disabled: false,
      };

  const tokensToApprove: [Token, Token] = [
    { ...tokens[0], amount: tokens[0].amount },
    { ...tokens[1], amount: tokens[1].amount },
  ];

  return (
    <div className="w-full flex justify-center mt-12">
      <AddLiquidityCard
        tokens={tokens}
        onAmountChange={handleAmountChange}
        onMaxClick={handleMaxClick}
        errorMsg={errorMsg}
        buttonState={buttonState}
      />
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
