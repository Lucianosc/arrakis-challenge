export const TOKENS = {
  USDC: {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Native Arbitrum USDC
    decimals: 6,
  },
  WETH: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Arbitrum WETH
    decimals: 18,
  },
};

export const CHAINLINK_FEEDS = {
  WETH: {
    address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", // ETH/USD on Arbitrum
    decimals: 8,
  },
};

export const CHAINLINK_PRICE_FEED_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
