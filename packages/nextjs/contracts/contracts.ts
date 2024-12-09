import { Address } from "viem";

type Contract = { address: Address };

export const ARRAKIS_CONTRACTS: { [key: string]: Contract } = {
  vault: {
    address: "0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723", // Arbitrum WETH/rETH Arrakis vault
  },
  helper: {
    address: "0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6", // Arbitrum Arrakis helper
  },
  router: {
    address: "0x6aC8Bab8B775a03b8B72B2940251432442f61B94", // Arbitrum Arrakis router
  },
  resolver: {
    address: "0x535c5fdf31477f799366df6e4899a12a801cc7b8", // Arbitrum Arrakis resolver
  },
};

export const TOKENS = {
  rETH: {
    address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8", // Arbitrum rETH
    decimals: 18,
    symbol: "reth",
  },
  WETH: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Arbitrum WETH
    decimals: 18,
    symbol: "weth",
  },
};

export const CHAINLINK_FEEDS = {
  ETHUSD: {
    address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", // ETH/USD on Arbitrum
    decimals: 8,
  },
  rETHETH: {
    address: "0xD6aB2298946840262FcC278fF31516D39fF611eF", // rETH/ETH on Arbitrum
    decimals: 18,
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
