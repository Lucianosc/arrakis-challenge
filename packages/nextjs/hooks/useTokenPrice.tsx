import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { CHAINLINK_FEEDS, CHAINLINK_PRICE_FEED_ABI } from "~~/config/configs";

// Hook to fetch token prices from Chainlink price feeds
export const useTokenPrice = (token: keyof typeof CHAINLINK_FEEDS) => {
  // Fetch latest price data from Chainlink
  const { data, isError, isLoading } = useReadContract({
    address: CHAINLINK_FEEDS[token].address,
    abi: CHAINLINK_PRICE_FEED_ABI,
    functionName: "latestRoundData",
  });

  // Format price with correct decimals
  const formatPrice = () => {
    if (!data) return 0;

    const price = formatUnits(data[1], CHAINLINK_FEEDS[token].decimals);
    return Number(price);
  };

  return {
    price: formatPrice(),
    isError,
    isLoading,
    lastUpdate: data ? new Date(Number(data[3]) * 1000) : null,
  };
};
