import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { Address, Hash, erc20Abi } from "viem";
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface ApprovalToken {
  address: Address;
  symbol: string;
  decimals: number;
  amount: string;
}

interface TransactionProgressProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: ApprovalToken[];
  spenderAddress: Address;
  onSuccess?: () => void;
}

interface Step {
  id: number;
  title: string;
  status: "pending" | "loading" | "completed" | "idle";
  txHash?: Hash;
}

const TransactionProgress: React.FC<TransactionProgressProps> = ({
  isOpen,
  onClose,
  tokens,
  spenderAddress,
  onSuccess,
}) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: `${tokens[0].symbol} approval`,
      status: "idle",
    },
    {
      id: 2,
      title: `${tokens[1].symbol} approval`,
      status: "idle",
    },
    {
      id: 3,
      title: "Add liquidity",
      status: "idle",
    },
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [currentTxHash, setCurrentTxHash] = useState<Hash>();

  // Token0 Approval
  const { data: simulateToken0Approval } = useSimulateContract({
    address: tokens[0].address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, BigInt(tokens[0].amount) * BigInt(10 ** tokens[0].decimals)],
  });

  const { writeContractAsync: approveToken0 } = useWriteContract();

  // Token1 Approval
  const { data: simulateToken1Approval } = useSimulateContract({
    address: tokens[1].address,
    abi: erc20Abi,
    functionName: "approve",
    args: [spenderAddress, BigInt(tokens[1].amount) * BigInt(10 ** tokens[1].decimals)],
  });

  const { writeContractAsync: approveToken1 } = useWriteContract();

  // Transaction Receipt Watcher
  const { isLoading: isWaitingForTx, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: currentTxHash,
  });

  const triggerTx = async (txN: number) => {
    try {
      let txHash: Hash | undefined;

      switch (txN) {
        case 1: // Token0 Approval
          if (!simulateToken0Approval?.request) break;
          txHash = await approveToken0(simulateToken0Approval.request);
          break;

        case 2: // Token1 Approval
          if (!simulateToken1Approval?.request) break;
          txHash = await approveToken1(simulateToken1Approval.request);
          break;

        case 3: // Add Liquidity
          // Implement your add liquidity logic here
          onSuccess?.();
          break;

        default:
          break;
      }

      if (txHash) {
        setCurrentTxHash(txHash);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      // Handle error appropriately
    }
  };

  // Effect to handle transaction success and trigger next transaction
  useEffect(() => {
    if (isTxSuccess && currentTxHash) {
      setSteps(prev =>
        prev.map(step =>
          step.id === currentStep
            ? {
                ...step,
                status: "completed",
                txHash: currentTxHash,
              }
            : step,
        ),
      );

      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        setSteps(prev => prev.map(step => (step.id === currentStep + 1 ? { ...step, status: "pending" } : step)));
        setCurrentTxHash(undefined);
        // Add a small delay before triggering the next transaction
        // should wait for confirmations here
        setTimeout(() => {
          triggerTx(currentStep + 1);
        }, 1000);
      }
    }
  }, [isTxSuccess, currentTxHash, currentStep]);

  // Effect to update loading state
  useEffect(() => {
    if (isWaitingForTx && currentTxHash) {
      setSteps(prev => prev.map(step => (step.id === currentStep ? { ...step, status: "loading" } : step)));
    }
  }, [isWaitingForTx, currentTxHash, currentStep]);

  // Effect to initialize and start first transaction
  useEffect(() => {
    if (isOpen) {
      setSteps(prev => prev.map(step => (step.id === 1 ? { ...step, status: "pending" } : step)));
      triggerTx(1);
    }
  }, [isOpen]);

  const renderStepIcon = (step: Step) => {
    switch (step.status) {
      case "completed":
        return <Check className="w-6 h-6 text-green-500" />;
      case "loading":
        return <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />;
      case "pending":
        return (
          <div className="w-6 h-6 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <span className="text-sm text-amber-500">{step.id}</span>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-neutral-600 flex items-center justify-center">
            <span className="text-sm text-neutral-600">{step.id}</span>
          </div>
        );
    }
  };

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

        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map(step => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">{renderStepIcon(step)}</div>
                <div className="flex-grow">
                  <h3 className="text-amber-50 font-medium">{step.title}</h3>
                  {step.status === "completed" && step.txHash && (
                    <a
                      href={`https://arbiscan.io/tx/${step.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-400 hover:text-amber-300 flex items-center space-x-1 mt-1"
                    >
                      <span>View on Arbiscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionProgress;
