import { useEffect, useState } from "react";
import { Address, parseUnits, zeroAddress } from "viem";
import { BaseError, useAccount, useReadContract, useTransactionConfirmations, useWriteContract } from "wagmi";
import { TransactionStatus } from "~~/components/TransactionStep";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";

type Token = {
  amount: string;
  decimals: number;
};

type AddLiquidityParams = {
  tokens: [Token, Token];
  onSuccess?: () => void;
  requiredConfirmations: number;
};

type AddLiquidityArgs = {
  amount0Max: bigint;
  amount1Max: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  amountSharesMin: bigint;
  vault: Address;
  receiver: Address;
  gauge: Address;
};

// Custom hook for managing liquidity addition to Arrakis vaults
export const useAddLiquidity = ({ tokens, onSuccess, requiredConfirmations }: AddLiquidityParams) => {
  const { address: userAddress } = useAccount();
  const { writeContractAsync, error: writeError } = useWriteContract();

  // Track transaction status and confirmations
  const [status, setStatus] = useState<TransactionStatus>({
    status: "idle",
    confirmations: 0,
  });

  // Convert token amounts to the correct decimal precision
  const amount0Max = tokens[0].amount ? parseUnits(tokens[0].amount, tokens[0].decimals) : 0n;
  const amount1Max = tokens[1].amount ? parseUnits(tokens[1].amount, tokens[1].decimals) : 0n;

  // Calculate minimum amounts (5% slippage tolerance)
  const amount0Min = (amount0Max * 95n) / 100n;
  const amount1Min = (amount1Max * 95n) / 100n;

  // Get expected LP token amounts from the resolver contract
  const { data: mintAmounts } = useReadContract({
    address: ARRAKIS_CONTRACTS.resolver.address,
    abi: ARRAKIS_CONTRACTS.resolver.abi,
    functionName: "getMintAmounts",
    args: [ARRAKIS_CONTRACTS.vault.address, amount0Max, amount1Max],
    query: {
      enabled: amount0Max > 0n && amount1Max > 0n,
    },
  }) as { data: readonly [bigint, bigint, bigint] | undefined };

  // Monitor transaction confirmations
  const { data: confirmations } = useTransactionConfirmations({
    hash: status.txHash,
    query: {
      enabled: !!status.txHash && status.status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  // Update status when transaction reaches required confirmations
  useEffect(() => {
    if (confirmations === undefined || status.status !== "waiting") return;

    const newConfirmations = Number(confirmations);
    const isComplete = newConfirmations >= requiredConfirmations;

    setStatus(prev => ({
      ...prev,
      confirmations: newConfirmations,
      status: isComplete ? "success" : "waiting",
    }));

    if (isComplete) {
      onSuccess?.();
    }
  }, [confirmations, requiredConfirmations, onSuccess]);

  // Handle contract write errors
  useEffect(() => {
    if (!writeError) return;

    setStatus(prev => ({
      ...prev,
      status: "error",
      error: (writeError as BaseError).shortMessage || "Transaction Error",
    }));
  }, [writeError]);

  // Main function to add liquidity
  const triggerAddLiquidity = async () => {
    try {
      setStatus(prev => ({ ...prev, status: "pending" }));

      if (!mintAmounts || !userAddress) {
        throw new Error("Required data not available");
      }

      // Prepare arguments for the addLiquidity contract call
      const args: AddLiquidityArgs = {
        amount0Max,
        amount1Max,
        amount0Min,
        amount1Min,
        amountSharesMin: mintAmounts[2],
        vault: ARRAKIS_CONTRACTS.vault.address as Address,
        receiver: userAddress,
        gauge: zeroAddress as Address,
      };

      // Execute the addLiquidity transaction
      const txHash = await writeContractAsync({
        address: ARRAKIS_CONTRACTS.router.address,
        abi: ARRAKIS_CONTRACTS.router.abi,
        functionName: "addLiquidity",
        args: [args],
      });

      setStatus({
        status: "waiting",
        confirmations: 0,
        txHash,
      });
    } catch (error) {
      console.error("Add liquidity error:", error);
      setStatus({
        status: "error",
        confirmations: 0,
        error: "Failed to add liquidity",
      });
    }
  };

  // Return hook interface with status and control functions
  return {
    status: status.status,
    confirmations: status.confirmations,
    error: status.error,
    txHash: status.txHash,
    triggerAddLiquidity,
    reset: () => setStatus({ status: "idle", confirmations: 0 }),
    isComplete: status.status === "success",
  };
};
