import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Header } from "~~/components/Header";

// Mock dependencies
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock RainbowKit
vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => (
    <div data-testid="connect-button">
      <button>Connect Wallet</button>
    </div>
  ),
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  connectorsForWallets: () => [],
}));

// Mock wagmi
vi.mock("wagmi", () => ({
  WagmiConfig: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  createConfig: () => ({}),
  http: () => ({}),
}));

// Mock wallets
vi.mock("@rainbow-me/rainbowkit/wallets", () => ({
  coinbaseWallet: () => ({}),
  injectedWallet: () => ({}),
  metaMaskWallet: () => ({}),
  rainbowWallet: () => ({}),
  trustWallet: () => ({}),
  walletConnectWallet: () => ({}),
}));

// Mock viem
vi.mock("viem", () => ({
  createClient: () => ({}),
}));

// Mock wagmi/chains
vi.mock("wagmi/chains", () => ({
  arbitrum: {},
  mainnet: {},
}));

describe("Header", () => {
  test("renders the header with logo", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    const logo = container.querySelector("h2");

    expect(header).toBeDefined();
    expect(logo?.textContent).toBe("Arrakis challenge");
  });

  test("renders connect wallet button", () => {
    const { container } = render(<Header />);
    const connectButton = container.querySelector('[data-testid="connect-button"] button');

    expect(connectButton?.textContent).toBe("Connect Wallet");
  });

  test("renders mobile menu button", () => {
    const { container } = render(<Header />);
    const mobileMenuButton = container.querySelector('button[class*="lg:hidden"]');

    expect(mobileMenuButton).toBeDefined();
  });

  test("renders navigation list", () => {
    const { container } = render(<Header />);
    const navigationList = container.querySelector("ul.hidden.lg\\:flex");

    expect(navigationList).toBeDefined();
  });
});
