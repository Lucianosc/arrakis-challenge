import { render, screen } from "@testing-library/react";
import { Address } from "viem";
import { arbitrum } from "viem/chains";
import { type UseAccountReturnType } from "wagmi";
import AddLiquidity from "~~/components/AddLiquidity";
import { VAULT_CONFIG } from "~~/config/configs";

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: jest.fn(),
  useSwitchChain: jest.fn(),
}));

// Mock RainbowKit
jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => null,
}));

// Mock custom hooks
jest.mock("~~/hooks/useTokensPairState", () => ({
  useTokensPairState: jest.fn(),
}));

// Create base mock state
const createAccountMock = (props: Partial<UseAccountReturnType>): UseAccountReturnType =>
  ({
    address: "0x123" as Address,
    addresses: ["0x123" as Address],
    chain: arbitrum,
    chainId: arbitrum.id,
    connector: undefined,
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
    isReconnecting: false,
    status: "connected",
    ...props,
  }) as UseAccountReturnType;

describe("AddLiquidity", () => {
  const mockTokens = {
    0: {
      ...VAULT_CONFIG.token0,
      amount: "1.0",
      balance: 10,
      usdValue: "$2000",
      isError: false,
    },
    1: {
      ...VAULT_CONFIG.token1,
      amount: "1.0",
      balance: 5,
      usdValue: "$2200",
      isError: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock return values for this test suite
    jest.requireMock("wagmi").useAccount.mockReturnValue(createAccountMock({}));
    jest.requireMock("wagmi").useSwitchChain.mockReturnValue({
      switchChain: jest.fn(),
    });

    jest.requireMock("~~/hooks/useTokensPairState").useTokensPairState.mockReturnValue({
      tokens: mockTokens,
      setTokens: jest.fn(),
    });
  });

  it("shows switch network button when on wrong network", () => {
    jest.requireMock("wagmi").useAccount.mockReturnValue(
      createAccountMock({
        chainId: 1,
        chain: {
          ...arbitrum,
          id: 1,
          name: "Ethereum",
        },
      }),
    );

    render(<AddLiquidity />);
    expect(screen.getByText("Switch to Arbitrum")).toBeInTheDocument();
  });

  it("shows connect wallet button when wallet is not connected", () => {
    jest.requireMock("wagmi").useAccount.mockReturnValue(
      createAccountMock({
        address: undefined,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        isConnected: false,
        status: "disconnected",
        isDisconnected: true,
      }),
    );

    render(<AddLiquidity />);
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });
});
