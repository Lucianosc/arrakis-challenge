import React from "react";
import { Check, ExternalLink, Loader2, X } from "lucide-react";
import { Hash } from "viem";

// Define types for transaction status and steps
export type TransactionStatus = {
  status: "idle" | "pending" | "waiting" | "success" | "error";
  confirmations: number;
  txHash?: Hash;
  error?: string;
};

export type Step = TransactionStatus & {
  id: number;
  title: string;
};

export type TransactionStepProps = Step & {
  requiredConfirmations: number;
};

// Main component for displaying transaction step status
export const TransactionStep = ({
  id,
  title,
  status,
  confirmations,
  txHash,
  error,
  requiredConfirmations,
}: TransactionStepProps) => {
  return (
    <div className="flex items-center space-x-4 justify-center">
      <div className="flex-shrink-0">
        <StepIcon id={id} status={status} />
      </div>
      <div className="flex-grow flex flex-col gap-1">
        <h3 className="text-amber-50 font-medium mb-1">{title}</h3>
        <StatusMessage
          status={status}
          txHash={txHash}
          error={error}
          confirmations={confirmations}
          requiredConfirmations={requiredConfirmations}
        />
      </div>
    </div>
  );
};

// Props for status message component
type StatusMessageProps = {
  status: TransactionStatus["status"];
  txHash?: Hash;
  error?: string;
  confirmations: number;
  requiredConfirmations: number;
};

// Component to display appropriate message based on transaction status
const StatusMessage = ({ status, txHash, error, confirmations, requiredConfirmations }: StatusMessageProps) => {
  switch (status) {
    case "pending":
      return <span className="text-sm text-blue-400">Please sign the transaction in your wallet</span>;
    case "waiting":
      return (
        <div className="flex flex-col gap-1 sm:flex-row">
          <span className="text-sm text-amber-50">
            Waiting for confirmations ({confirmations || 0}/{requiredConfirmations})
          </span>
          {txHash && (
            <TransactionLink txHash={txHash} className="text-sm text-amber-400 hover:text-amber-300">
              View on Arbiscan
            </TransactionLink>
          )}
        </div>
      );
    case "success":
      return txHash ? (
        <TransactionLink txHash={txHash} className="text-sm text-green-400 hover:text-green-300">
          View on Arbiscan
        </TransactionLink>
      ) : null;
    case "error":
      return <span className="text-sm text-red-400">{error || "Transaction failed"}</span>;
    default:
      return null;
  }
};

// Props for step icon component
type StepIconProps = {
  id: number;
  status: TransactionStatus["status"];
};

// Component to render appropriate icon based on transaction status
const StepIcon = ({ id, status }: StepIconProps) => {
  switch (status) {
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
          <span className="text-md text-amber-500">{id + 1}</span>
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full border-2 border-neutral-600 flex items-center justify-center">
          <span className="text-md text-neutral-600">{id + 1}</span>
        </div>
      );
  }
};

// Props for transaction link component
type TransactionLinkProps = {
  txHash: Hash;
  children: React.ReactNode;
  className?: string;
};

// Component to render transaction link to Arbiscan
const TransactionLink = ({ txHash, children, className }: TransactionLinkProps) => (
  <a
    href={`https://arbiscan.io/tx/${txHash}`}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center space-x-1 ${className}`}
  >
    <span>{children}</span>
    <ExternalLink className="w-3 h-3" />
  </a>
);
