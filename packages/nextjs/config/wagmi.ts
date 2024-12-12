import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createClient } from "viem";
import { createConfig, http } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";

const tenderlyArbitrum = {
  ...arbitrum,
  id: 42161,
  name: "Arbitrum (Tenderly Fork)",
  network: "arbitrum-fork",
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
};

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, coinbaseWallet, rainbowWallet, trustWallet],
    },
    {
      groupName: "Other",
      wallets: [walletConnectWallet, injectedWallet],
    },
  ],
  {
    appName: "Arrakis challenge",
    projectId,
  },
);

export const supportedChains = [
  { ...tenderlyArbitrum, requiredConfirmations: 1 }, // hardcoded to 1 because Tenderly fork does not run on time intervals
  { ...mainnet, requiredConfirmations: 1 },
];

export const wagmiConfig = createConfig({
  chains: [tenderlyArbitrum, mainnet],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(process.env.NEXT_PUBLIC_TENDERLY_RPC_URL),
    });
  },
  connectors,
});
