import { Abi, Address } from "viem";
import { ARRAKIS_CONTRACTS } from "~~/contracts/contracts";

// ======= Type Definitions =======
export const SUPPORTED_SYMBOLS = ["rETH", "WETH"] as const;
export type TokenSymbol = (typeof SUPPORTED_SYMBOLS)[number];
export type PricePairTicker = "ETHUSD" | "rETHETH";
export type IconSymbols = "eth" | "rpl";

export type TokenConfig = {
  symbol: TokenSymbol;
  address: Address;
  decimals: number;
  pricePairTicker: PricePairTicker;
  iconSymbol: IconSymbols;
};
export type VaultConfig = {
  token0: TokenConfig;
  token1: TokenConfig;
  vault: {
    address: Address;
    helper: {
      address: Address;
      abi: Abi;
    };
  };
};

// ======= Token Configurations =======
export const TOKENS: Record<TokenSymbol, TokenConfig> = {
  WETH: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    symbol: "WETH",
    pricePairTicker: "ETHUSD",
    iconSymbol: "eth",
  },
  rETH: {
    address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
    decimals: 18,
    symbol: "rETH",
    pricePairTicker: "rETHETH",
    iconSymbol: "rpl",
  },
} as const;

export const VAULT_CONFIG: VaultConfig = {
  token0: TOKENS.WETH,
  token1: TOKENS.rETH,
  vault: {
    address: ARRAKIS_CONTRACTS.vault.address,
    helper: {
      address: ARRAKIS_CONTRACTS.helper.address,
      abi: ARRAKIS_CONTRACTS.helper.abi,
    },
  },
};

// ======= Chainlink Configurations =======
export const CHAINLINK_FEEDS = {
  ETHUSD: {
    address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
    decimals: 8,
  },
  rETHETH: {
    address: "0xD6aB2298946840262FcC278fF31516D39fF611eF",
    decimals: 18,
  },
} as const;

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
