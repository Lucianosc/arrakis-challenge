import { useEffect, useState } from "react";
import { Address, Hash, erc20Abi, parseUnits } from "viem";
import { BaseError, useChainId, useReadContract, useTransactionConfirmations, useWriteContract } from "wagmi";
import { TransactionStatus } from "~~/components/TransactionStep";
import { supportedChains } from "~~/config/wagmi";

interface UseHandleAllowanceParams {
  token: {
    address: Address;
    amount: string;
    decimals: number;
  };
  spenderAddress: Address;
  onSuccess?: () => void;
}

export const useHandleAllowance = ({ token, spenderAddress, onSuccess }: UseHandleAllowanceParams) => {
  const chainId = useChainId();
  const requiredConfirmations = supportedChains.find(chain => chain.id === chainId)?.requiredConfirmations || 0;

  const [allowanceStatus, setAllowanceStatus] = useState<TransactionStatus>({
    status: "idle",
    confirmations: 0,
  });

  const { writeContractAsync: writeContract, error: contractWriteError } = useWriteContract();

  // Track approval transaction confirmations
  const { data: confirmations } = useTransactionConfirmations({
    hash: allowanceStatus.txHash,
    query: {
      enabled: !!allowanceStatus.txHash && allowanceStatus.status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  // Update status based on confirmations
  useEffect(() => {
    if (confirmations !== undefined && allowanceStatus.status === "waiting") {
      const newConfirmations = Number(confirmations);
      setAllowanceStatus(prev => ({
        ...prev,
        confirmations: newConfirmations,
        status: newConfirmations >= requiredConfirmations ? "success" : "waiting",
      }));

      if (newConfirmations >= requiredConfirmations) {
        onSuccess?.();
      }
    }
  }, [confirmations, requiredConfirmations, onSuccess]);

  // Handle contract errors
  useEffect(() => {
    if (contractWriteError) {
      setAllowanceStatus(prev => ({
        ...prev,
        status: "error",
        error: (contractWriteError as BaseError).shortMessage || "Transaction Error",
      }));
    }
  }, [contractWriteError]);

  const triggerApproval = async () => {
    try {
      setAllowanceStatus(prev => ({
        ...prev,
        status: "pending",
      }));

      const txHash = await writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, parseUnits(token.amount, token.decimals)],
      });

      if (txHash) {
        setAllowanceStatus(prev => ({
          ...prev,
          status: "waiting",
          txHash,
          error: undefined,
        }));
      }
    } catch (error) {
      console.error(error);
      setAllowanceStatus(prev => ({
        ...prev,
        status: "error",
        error: "Failed to approve token",
      }));
    }
  };

  const reset = () => {
    setAllowanceStatus({
      status: "idle",
      confirmations: 0,
    });
  };

  return {
    status: allowanceStatus.status,
    confirmations: allowanceStatus.confirmations,
    error: allowanceStatus.error,
    txHash: allowanceStatus.txHash,
    triggerApproval,
    reset,
    isComplete: allowanceStatus.status === "success",
  };
};
