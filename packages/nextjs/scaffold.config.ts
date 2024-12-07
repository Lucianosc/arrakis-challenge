import { Chain } from "viem";
import { arbitrum } from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly Chain[];
  pollingInterval: number;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  tenderlyRpcUrl: string;
};

// Custom Tenderly-forked Arbitrum chain
const tenderlyArbitrum = {
  ...arbitrum,
  id: 42161,
  name: "Arbitrum (Tenderly Fork)",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TENDERLY_RPC_URL!],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_TENDERLY_RPC_URL!],
    },
  },
} as const satisfies Chain;

const scaffoldConfig = {
  // Using our Tenderly forked network
  targetNetworks: [tenderlyArbitrum],

  // Polling interval for network updates
  pollingInterval: 30000,

  // WalletConnect project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Burner wallet configuration
  onlyLocalBurnerWallet: false,

  // Tenderly RPC URL
  tenderlyRpcUrl: process.env.NEXT_PUBLIC_TENDERLY_RPC_URL || "",
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
