import { supportedChains } from "./config/wagmi";
import { Chain } from "viem";

export type ScaffoldConfig = {
  targetNetworks: readonly Chain[];
  pollingInterval: number;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  tenderlyRpcUrl: string;
};

const scaffoldConfig = {
  // Using our Tenderly forked network
  targetNetworks: supportedChains,

  // WalletConnect project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Tenderly RPC URL
  tenderlyRpcUrl: process.env.NEXT_PUBLIC_TENDERLY_RPC_URL || "",
};

export default scaffoldConfig;
