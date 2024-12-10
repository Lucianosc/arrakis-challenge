import React from "react";
import { Check, ExternalLink, Loader2, X } from "lucide-react";
import { Address, Hash } from "viem";

export interface ApprovalToken {
  address: Address;
  symbol: string;
  decimals: number;
  amount: string;
}

export interface Step {
  id: number;
  title: string;
  status: "idle" | "pending" | "waiting" | "success" | "error";
  confirmations?: number;
  error?: string;
  txHash?: Hash;
}

interface TransactionStepProps {
  step: Step;
  requiredConfirmations?: number;
}

export const TransactionStep: React.FC<TransactionStepProps> = ({ step, requiredConfirmations }) => {
  const renderStepIcon = (step: Step) => {
    switch (step.status) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-500" />
          </div>
        );
      case "waiting":
        return <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />;
      case "pending":
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case "error":
        return (
          <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
            <X className="w-5 h-5 text-red-500" />
          </div>
        );
      case "idle":
        return (
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <span className="text-md text-amber-500">{step.id}</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full border-2 border-neutral-600 flex items-center justify-center">
            <span className="text-md text-neutral-600">{step.id}</span>
          </div>
        );
    }
  };

  const renderStatusMessage = (step: Step) => {
    switch (step.status) {
      case "pending":
        return <span className="text-sm text-blue-400">Please sign the transaction in your wallet</span>;
      case "waiting":
        return (
          <div className="flex flex-col gap-1 sm:flex-row">
            <span className="text-sm text-amber-50">
              Waiting for confirmations ({step.confirmations || 0}/{requiredConfirmations})
            </span>
            <a
              href={`https://arbiscan.io/tx/${step.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View on Arbiscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        );
      case "success":
        return (
          <a
            href={`https://arbiscan.io/tx/${step.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-400 hover:text-green-300 flex items-center space-x-1"
          >
            <span>View on Arbiscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      case "error":
        return <span className="text-sm text-red-400">{step.error || "Transaction failed"}</span>;
      default:
        return null;
    }
  };
  return (
    <div className="flex items-center space-x-4 justify-center">
      <div className="flex-shrink-0">{renderStepIcon(step)}</div>
      <div className="flex-grow flex flex-col gap-1">
        <h3 className="text-amber-50 font-medium mb-1">{step.title}</h3>
        {renderStatusMessage(step)}
      </div>
    </div>
  );
};
