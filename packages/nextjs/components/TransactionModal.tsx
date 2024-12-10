import React, { useEffect, useState } from "react";
import { ApprovalToken, Step, TransactionStep } from "./TransactionStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address, Hash, erc20Abi, parseUnits } from "viem";
import { BaseError, useChainId, useSimulateContract, useTransactionConfirmations, useWriteContract } from "wagmi";
import { supportedChains } from "~~/config/wagmi";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: ApprovalToken[];
  spenderAddress: Address;
  onSuccess?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  tokens,
  spenderAddress,
  onSuccess,
}) => {
  const currentChainId = useChainId();
  const requiredConfirmations = supportedChains.find(chain => chain.id == currentChainId)?.requiredConfirmations || 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([
    { id: 0, title: `${tokens[0].symbol} approval`, status: "idle", confirmations: 0 },
    { id: 1, title: `${tokens[1].symbol} approval`, status: "idle", confirmations: 0 },
    { id: 2, title: "Add liquidity", status: "idle", confirmations: 0 },
  ]);

  // Create confirmation trackers for each step with proper query configuration
  const { data: confirmationsStep1, isError: isErrorStep1 } = useTransactionConfirmations({
    hash: steps[0].txHash,
    query: {
      enabled: !!steps[0].txHash && steps[0].status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  const { data: confirmationsStep2, isError: isErrorStep2 } = useTransactionConfirmations({
    hash: steps[1].txHash,
    query: {
      enabled: !!steps[1].txHash && steps[1].status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  const { data: confirmationsStep3, isError: isErrorStep3 } = useTransactionConfirmations({
    hash: steps[2].txHash,
    query: {
      enabled: !!steps[2].txHash && steps[2].status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  const { data: simulateToken0Approval } = useSimulateContract({
    address: tokens[0].address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, parseUnits(tokens[0].amount, tokens[0].decimals)],
  });

  const { data: simulateToken1Approval } = useSimulateContract({
    address: tokens[1].address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, parseUnits(tokens[1].amount, tokens[1].decimals)],
  });

  const addLiquidityArgs = [{}];

  const { data: simulateAddLiquidity } = useSimulateContract({
    address: ARRAKIS_CONTRACTS.router.address,
    abi: ARRAKIS_CONTRACTS.router.abi,
    functionName: "addLiquidity",
    args: addLiquidityArgs,
  });

  const { writeContractAsync: approveToken0, error: contractWriteError0 } = useWriteContract();
  const { writeContractAsync: approveToken1, error: contractWriteError1 } = useWriteContract();
  const { writeContractAsync: addLiquidity, error: contractWriteError2 } = useWriteContract();

  // Update steps based on confirmations and handle errors
  useEffect(() => {
    const updateStep = (stepIndex: number, confirmations: bigint | undefined, isError: boolean) => {
      if (confirmations !== undefined || isError) {
        setSteps(prev =>
          prev.map(step =>
            step.id === stepIndex
              ? {
                  ...step,
                  confirmations: Number(confirmations || 0),
                  status: isError
                    ? "error"
                    : Number(confirmations || 0) >= requiredConfirmations
                      ? "success"
                      : "waiting",
                  error: isError ? "Failed to confirm transaction" : undefined,
                }
              : step,
          ),
        );

        // Progress to next step if current step is complete
        if (stepIndex === currentStep && Number(confirmations || 0) >= requiredConfirmations) {
          if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
            setTimeout(() => {
              triggerTx(currentStep + 1);
            }, 1000);
          } else if (currentStep === 2) {
            onSuccess?.();
          }
        }
      }
    };

    updateStep(0, confirmationsStep1, isErrorStep1);
    updateStep(1, confirmationsStep2, isErrorStep2);
    updateStep(2, confirmationsStep3, isErrorStep3);
  }, [
    confirmationsStep1,
    confirmationsStep2,
    confirmationsStep3,
    isErrorStep1,
    isErrorStep2,
    isErrorStep3,
    currentStep,
    requiredConfirmations,
  ]);

  // Effect to handle contract errors
  useEffect(() => {
    if (contractWriteError0) {
      setSteps(prev =>
        prev.map(step =>
          step.id === 0
            ? {
                ...step,
                status: "error",
                error: (contractWriteError0 as BaseError).shortMessage || "Transaction Error",
              }
            : step,
        ),
      );
    }
    if (contractWriteError1) {
      setSteps(prev =>
        prev.map(step =>
          step.id === 1
            ? {
                ...step,
                status: "error",
                error: (contractWriteError1 as BaseError).shortMessage || "Transaction Error",
              }
            : step,
        ),
      );
    }
    if (contractWriteError2) {
      setSteps(prev =>
        prev.map(step =>
          step.id === 2
            ? {
                ...step,
                status: "error",
                error: (contractWriteError2 as BaseError).shortMessage || "Transaction Error",
              }
            : step,
        ),
      );
    }
  }, [contractWriteError0, contractWriteError1, contractWriteError2]);

  const triggerTx = async (txN: number) => {
    try {
      setSteps(prev => prev.map(step => (step.id === txN ? { ...step, status: "pending" } : step)));

      let txHash: Hash | undefined;

      switch (txN) {
        case 0:
          if (!simulateToken0Approval?.request) {
            throw new Error("Failed to simulate token0 approval");
          }
          txHash = await approveToken0(simulateToken0Approval.request);
          break;

        case 1:
          if (!simulateToken1Approval?.request) {
            throw new Error("Failed to simulate token1 approval");
          }
          txHash = await approveToken1(simulateToken1Approval.request);
          break;

        case 2:
          if (!simulateAddLiquidity?.request) {
            throw new Error("Failed to simulate addLiquidity");
          }
          txHash = await addLiquidity(simulateAddLiquidity.request);
          break;
      }

      if (txHash) {
        setSteps(prev =>
          prev.map(step =>
            step.id === txN
              ? {
                  ...step,
                  status: "waiting",
                  txHash: txHash,
                }
              : step,
          ),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Effect to initialize and start first transaction
  useEffect(() => {
    if (isOpen) {
      setSteps(prev => prev.map(step => (step.id === 0 ? { ...step, status: "idle" } : step)));
      triggerTx(0);
    }
  }, [isOpen]);

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
              <TransactionStep key={step.id} step={step} requiredConfirmations={requiredConfirmations} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
