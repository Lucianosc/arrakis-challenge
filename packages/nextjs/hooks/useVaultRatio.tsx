import { Abi, Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";

export const useVaultRatio = (
  helperAddress: Address,
  helperAbi: Abi,
  vaultAddress: Address,
  token0Decimals: number,
  token1Decimals: number,
) => {
  const { data: totalUnderlying } = useReadContract({
    address: helperAddress,
    abi: helperAbi,
    functionName: "totalUnderlying",
    args: [vaultAddress],
  }) as { data: readonly [bigint, bigint] | undefined };

  const vaultTokenRatio = totalUnderlying
    ? Number(formatUnits(totalUnderlying[0], token0Decimals)) / Number(formatUnits(totalUnderlying[1], token1Decimals))
    : null;

  return vaultTokenRatio;
};
