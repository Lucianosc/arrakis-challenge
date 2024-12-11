import { useEffect, useState } from "react";
import { Address, erc20Abi, parseUnits } from "viem";
import { BaseError, useTransactionConfirmations, useWriteContract } from "wagmi";
import { TransactionStatus } from "~~/components/TransactionStep";

interface UseHandleAllowanceParams {
  token: {
    address: Address;
    amount: string;
    decimals: number;
  };
  requiredConfirmations: number;
  spenderAddress: Address;
  onSuccess?: () => void;
}

export const useHandleAllowance = ({
  token,
  spenderAddress,
  onSuccess,
  requiredConfirmations,
}: UseHandleAllowanceParams) => {
  const [txState, setTxState] = useState<TransactionStatus>({
    status: "idle",
    confirmations: 0,
  });

  const { writeContractAsync: writeContract, error: contractWriteError } = useWriteContract();

  // Confirmation tracking
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

  // Confirmations and success effect
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

  // Error handling effect
  useEffect(() => {
    if (!contractWriteError) return;

    setTxState(current => ({
      ...current,
      status: "error",
      error: (contractWriteError as BaseError).shortMessage || "Transaction Error",
    }));
  }, [contractWriteError]);

  const triggerApproval = async () => {
    try {
      // Start approval
      setTxState(current => ({
        ...current,
        status: "pending",
      }));

      // Send transaction
      const txHash = await writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, parseUnits(token.amount, token.decimals)],
      });

      // Update state with transaction hash
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

  const reset = () => {
    setTxState({
      status: "idle",
      confirmations: 0,
    });
  };

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
