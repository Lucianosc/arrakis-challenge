import React, { useEffect } from "react";
import { Step, TransactionStep } from "./TransactionStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { supportedChains } from "~~/config/wagmi";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";
import { useAddLiquidity } from "~~/hooks/useAddLiquidity";
import { useHandleAllowance } from "~~/hooks/useHandleAllowance";

export type Token = {
  address: Address;
  symbol: string;
  amount: string;
  decimals: number;
};

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tokens: readonly [Token, Token];
  onSuccess?: () => void;
};

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, tokens, onSuccess }) => {
  const chainId = useChainId();
  const requiredConfirmations = supportedChains.find(chain => chain.id === chainId)?.requiredConfirmations || 0;

  // Handle token approvals
  const token0Allowance = useHandleAllowance({
    token: {
      address: tokens[0].address,
      amount: tokens[0].amount,
      decimals: tokens[0].decimals,
    },
    spenderAddress: ARRAKIS_CONTRACTS.router.address,
    requiredConfirmations,
    onSuccess: () => {
      // When first token is approved, trigger second token approval
      token1Allowance.triggerApproval();
    },
  });

  const token1Allowance = useHandleAllowance({
    token: {
      address: tokens[1].address,
      amount: tokens[1].amount,
      decimals: tokens[1].decimals,
    },
    spenderAddress: ARRAKIS_CONTRACTS.router.address,
    requiredConfirmations,
    onSuccess: () => {
      // When second token is approved, proceed with adding liquidity
      addLiquidity.triggerAddLiquidity();
    },
  });

  const addLiquidity = useAddLiquidity({
    tokens: [
      { amount: tokens[0].amount, decimals: tokens[0].decimals },
      { amount: tokens[1].amount, decimals: tokens[1].decimals },
    ],
    requiredConfirmations,
    onSuccess,
  });

  // Start process when modal opens
  useEffect(() => {
    if (isOpen) {
      token0Allowance.reset();
      token1Allowance.reset();
      addLiquidity.reset();
      token0Allowance.triggerApproval();
    }
  }, [isOpen]);

  // Combine all steps for display
  const steps: Step[] = [
    {
      id: 0,
      title: `${tokens[0].symbol} approval`,
      status: token0Allowance.status,
      confirmations: token0Allowance.confirmations,
      error: token0Allowance.error,
      txHash: token0Allowance.txHash,
    },
    {
      id: 1,
      title: `${tokens[1].symbol} approval`,
      status: token1Allowance.status,
      confirmations: token1Allowance.confirmations,
      error: token1Allowance.error,
      txHash: token1Allowance.txHash,
    },
    {
      id: 2,
      title: "Add liquidity",
      status: addLiquidity.status,
      confirmations: addLiquidity.confirmations,
      error: addLiquidity.error,
      txHash: addLiquidity.txHash,
    },
  ];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 
      ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black/50" />
      <Card
        className="w-full max-w-md bg-neutral-900 border-amber-900/20 relative transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-semibold text-amber-50">Transaction Progress</CardTitle>
          <Button
            variant="ghost"
            className="text-amber-400 hover:text-amber-300 hover:bg-transparent text-xl"
            onClick={onClose}
          >
            ✕
          </Button>
        </CardHeader>

        <CardContent className="space-y-7">
          <div className="flex flex-col gap-7">
            {steps.map(step => (
              <TransactionStep key={`${step.id}_txStep`} {...step} requiredConfirmations={requiredConfirmations} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
