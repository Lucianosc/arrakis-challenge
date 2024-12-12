import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { TokenConfig } from "~~/config/configs";

// Types for token data management
export type TokenData = TokenConfig & {
  amount: string;
  balance: number;
  usdValue: string;
  isError: boolean;
};

export type TokenState = {
  [key: number]: TokenData;
};

// Hook to manage state for a pair of tokens
export const useTokensPairState = (token0Config: TokenConfig, token1Config: TokenConfig) => {
  const { address: userAddress } = useAccount();

  // Initialize token pair state
  const [tokens, setTokens] = useState<TokenState>({
    0: {
      ...token0Config,
      amount: "",
      balance: 0,
      usdValue: "$0.00",
      isError: false,
    },
    1: {
      ...token1Config,
      amount: "",
      balance: 0,
      usdValue: "$0.00",
      isError: false,
    },
  });

  // Fetch token balances for the user
  const { data: token0Balance } = useBalance({
    address: userAddress,
    token: token0Config.address,
  });

  const { data: token1Balance } = useBalance({
    address: userAddress,
    token: token1Config.address,
  });

  // Update token0 balance when data changes
  useEffect(() => {
    if (token0Balance) {
      setTokens(prev => ({
        ...prev,
        0: {
          ...prev[0],
          balance: Number(formatUnits(token0Balance.value, token0Config.decimals)),
        },
      }));
    }
  }, [token0Balance, token0Config.decimals]);

  // Update token1 balance when data changes
  useEffect(() => {
    if (token1Balance) {
      setTokens(prev => ({
        ...prev,
        1: {
          ...prev[1],
          balance: Number(formatUnits(token1Balance.value, token1Config.decimals)),
        },
      }));
    }
  }, [token1Balance, token1Config.decimals]);

  return { tokens, setTokens };
};