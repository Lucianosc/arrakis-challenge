import { useEffect, useState } from "react";
import { Address, Hash, parseUnits } from "viem";
import {
  BaseError,
  useAccount,
  useChainId,
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import { TransactionStatus } from "~~/components/TransactionStep";
import { supportedChains } from "~~/config/wagmi";
import { SLIPPAGE } from "~~/contracts/constants";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";

interface UseAddLiquidityParams {
  tokens: [
    {
      amount: string;
      decimals: number;
    },
    {
      amount: string;
      decimals: number;
    },
  ];
  onSuccess?: () => void;
}

const calculateSlippage = (amount: string, decimals: number) => {
  if (!amount) return { min: 0n, max: 0n };

  const baseAmount = parseUnits(amount, decimals);
  const slippageAmount = (baseAmount * BigInt(Math.floor(SLIPPAGE * 100))) / 10000n;

  return {
    min: baseAmount - slippageAmount,
    max: baseAmount + slippageAmount,
  };
};

export const useAddLiquidity = ({ tokens, onSuccess }: UseAddLiquidityParams) => {
  const chainId = useChainId();
  const requiredConfirmations = supportedChains.find(chain => chain.id === chainId)?.requiredConfirmations || 0;
  const account = useAccount();

  const [addLiquidityStatus, setAddLiquidityStatus] = useState<TransactionStatus>({
    status: "idle",
    confirmations: 0,
  });

  const { writeContractAsync: writeContract, error: contractWriteError } = useWriteContract();

  const { min: amount0Min, max: amount0Max } = calculateSlippage(tokens[0].amount, tokens[0].decimals);
  const { min: amount1Min, max: amount1Max } = calculateSlippage(tokens[1].amount, tokens[1].decimals);

  // Read expected mint amounts from resolver
  const { data: mintAmounts } = useReadContract({
    address: ARRAKIS_CONTRACTS.resolver.address,
    abi: ARRAKIS_CONTRACTS.resolver.abi,
    functionName: "getMintAmounts",
    args: [ARRAKIS_CONTRACTS.vault.address, amount0Max, amount1Max],
    query: {
      enabled: amount0Max > 0n && amount1Max > 0n,
    },
  }) as { data: readonly [bigint, bigint, bigint] | undefined };

  // Track add liquidity confirmation
  const { data: confirmations } = useTransactionConfirmations({
    hash: addLiquidityStatus.txHash,
    query: {
      enabled: !!addLiquidityStatus.txHash && addLiquidityStatus.status === "waiting",
      refetchInterval: data => {
        const confirmations = Number(data || 0);
        return confirmations >= requiredConfirmations ? false : 1000;
      },
    },
  });

  // Update status based on confirmations
  useEffect(() => {
    if (confirmations !== undefined && addLiquidityStatus.status === "waiting") {
      const newConfirmations = Number(confirmations);
      setAddLiquidityStatus(prev => ({
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
      setAddLiquidityStatus(prev => ({
        ...prev,
        status: "error",
        error: (contractWriteError as BaseError).shortMessage || "Transaction Error",
      }));
    }
  }, [contractWriteError]);

  const triggerAddLiquidity = async () => {
    try {
      setAddLiquidityStatus(prev => ({
        ...prev,
        status: "pending",
      }));

      if (!mintAmounts) throw new Error("Could not fetch mintAmounts");
      const [amount0, amount1, expectedShares] = mintAmounts;

      const txHash = await writeContract({
        address: ARRAKIS_CONTRACTS.router.address,
        abi: ARRAKIS_CONTRACTS.router.abi,
        functionName: "addLiquidity",
        args: [
          {
            amount0Max,
            amount1Max,
            amount0Min,
            amount1Min,
            amountSharesMin: 1n,
            vault: ARRAKIS_CONTRACTS.vault.address as Address,
            receiver: account.address,
            gauge: "0x0000000000000000000000000000000000000000" as Address,
          },
        ],
      });

      if (txHash) {
        setAddLiquidityStatus(prev => ({
          ...prev,
          status: "waiting",
          txHash,
          error: undefined,
        }));
      }
    } catch (error) {
      console.error(error);
      setAddLiquidityStatus(prev => ({
        ...prev,
        status: "error",
        error: "Failed to add liquidity",
      }));
    }
  };

  const reset = () => {
    setAddLiquidityStatus({
      status: "idle",
      confirmations: 0,
    });
  };

  return {
    status: addLiquidityStatus.status,
    confirmations: addLiquidityStatus.confirmations,
    error: addLiquidityStatus.error,
    txHash: addLiquidityStatus.txHash,
    triggerAddLiquidity,
    reset,
    isComplete: addLiquidityStatus.status === "success",
  };
};
