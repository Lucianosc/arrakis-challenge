import { useEffect, useState } from "react";
import { Address, erc20Abi, parseUnits } from "viem";
import { BaseError, useTransactionConfirmations, useWriteContract } from "wagmi";
import { TransactionStatus } from "~~/components/TransactionStep";

// Parameters for the allowance hook
type UseHandleAllowanceParams = {
  token: {
    address: Address;
    amount: string;
    decimals: number;
  };
  requiredConfirmations: number;
  spenderAddress: Address;
  onSuccess?: () => void;
};

// Hook to handle token approval process
export const useHandleAllowance = ({
  token,
  spenderAddress,
  onSuccess,
  requiredConfirmations,
}: UseHandleAllowanceParams) => {
  // Track transaction state
  const [txState, setTxState] = useState<TransactionStatus>({
    status: "idle",
    confirmations: 0,
  });

  const { writeContractAsync: writeContract, error: contractWriteError } = useWriteContract();

  // Watch for transaction confirmations
  const { data: confirmations } = useTransactionConfirmations({
    hash: txState.txHash,
    query: {
      enabled: Boolean(txState.txHash) && txState.status === "waiting",
      refetchInterval: data => {
        const confirmedBlocks = Number(data || 0);
        return confirmedBlocks >= requiredConfirmations ? false : 1000;
      },
    },
  });

  // Handle confirmation updates
  useEffect(() => {
    if (!confirmations || txState.status !== "waiting") return;

    const confirmedBlocks = Number(confirmations);
    const isConfirmed = confirmedBlocks >= requiredConfirmations;

    setTxState(current => ({
      ...current,
      confirmations: confirmedBlocks,
      status: isConfirmed ? "success" : "waiting",
    }));

    if (isConfirmed) {
      onSuccess?.();
    }
  }, [confirmations, requiredConfirmations, onSuccess, txState.status]);

  // Handle transaction errors
  useEffect(() => {
    if (!contractWriteError) return;

    setTxState(current => ({
      ...current,
      status: "error",
      error: (contractWriteError as BaseError).shortMessage || "Transaction Error",
    }));
  }, [contractWriteError]);

  // Initiate token approval transaction
  const triggerApproval = async () => {
    try {
      setTxState(current => ({
        ...current,
        status: "pending",
      }));

      const txHash = await writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, parseUnits(token.amount, token.decimals)],
      });

      if (txHash) {
        setTxState(current => ({
          ...current,
          status: "waiting",
          txHash,
          error: undefined,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Reset hook state
  const reset = () => {
    setTxState({
      status: "idle",
      confirmations: 0,
    });
  };

  // Return hook state and functions
  return {
    status: txState.status,
    confirmations: txState.confirmations,
    error: txState.error,
    txHash: txState.txHash,
    triggerApproval,
    reset,
    isComplete: txState.status === "success",
  };
};
