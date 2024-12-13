import { TransactionModal } from "@/components/TransactionModal";
import { cleanup, render } from "@testing-library/react";
import { type Address } from "viem";
import { afterEach, describe, expect, test, vi } from "vitest";

// Mock wagmi config
vi.mock("wagmi", () => ({
  useChainId: vi.fn(() => 42161),
  createConfig: vi.fn(() => ({
    chains: [],
    client: {},
  })),
}));

// Mock supported chains
vi.mock("~~/config/wagmi", () => ({
  supportedChains: [
    {
      id: 42161,
      requiredConfirmations: 1,
    },
  ],
  wagmiConfig: {},
}));

// Mock contract addresses
vi.mock("~~/contracts/contracts", () => ({
  ARRAKIS_CONTRACTS: {
    router: {
      address: "0x6aC8Bab8B775a03b8B72B2940251432442f61B94" as Address,
    },
  },
}));

// Mock hooks
vi.mock("~~/hooks/useHandleAllowance", () => ({
  useHandleAllowance: () => ({
    status: "idle",
    confirmations: 0,
    error: undefined,
    txHash: undefined,
    triggerApproval: vi.fn(),
    reset: vi.fn(),
  }),
}));

vi.mock("~~/hooks/useAddLiquidity", () => ({
  useAddLiquidity: () => ({
    status: "idle",
    confirmations: 0,
    error: undefined,
    txHash: undefined,
    triggerAddLiquidity: vi.fn(),
    reset: vi.fn(),
  }),
}));

describe("TransactionModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    tokens: [
      {
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as Address,
        symbol: "WETH",
        amount: "1.0",
        decimals: 18,
      },
      {
        address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8" as Address,
        symbol: "rETH",
        amount: "1.0",
        decimals: 18,
      },
    ],
    onSuccess: vi.fn(),
  } as const;

  // Clean up after each test
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("renders when open", () => {
    const { container } = render(<TransactionModal {...defaultProps} />);
    const modalRoot = container.querySelector(".fixed.inset-0");
    expect(modalRoot).toBeDefined();
    expect(modalRoot?.className).includes("opacity-100");
  });

  test("is hidden when closed", () => {
    const { container } = render(<TransactionModal {...defaultProps} isOpen={false} />);
    const modalRoot = container.querySelector(".fixed.inset-0");
    expect(modalRoot?.className).includes("opacity-0");
    expect(modalRoot?.className).includes("pointer-events-none");
  });

  test("renders all steps", () => {
    const { container } = render(<TransactionModal {...defaultProps} />);
    const steps = container.querySelectorAll(".flex.items-center.space-x-4");
    expect(steps.length).toBe(3); // WETH approval, rETH approval, Add liquidity
  });

  test("renders close button", () => {
    const { getByText } = render(<TransactionModal {...defaultProps} />);
    const closeButton = getByText("✕");
    expect(closeButton.className).includes("text-amber-400");
  });

  test("renders token approval steps", () => {
    const { getByText } = render(<TransactionModal {...defaultProps} />);
    expect(getByText("WETH approval")).toBeDefined();
    expect(getByText("rETH approval")).toBeDefined();
    expect(getByText("Add liquidity")).toBeDefined();
  });

  test("renders with custom tokens", () => {
    const customTokens = [
      { ...defaultProps.tokens[0], symbol: "CustomToken1" },
      { ...defaultProps.tokens[1], symbol: "CustomToken2" },
    ] as const;

    const { getByText } = render(<TransactionModal {...defaultProps} tokens={customTokens} />);

    expect(getByText("CustomToken1 approval")).toBeDefined();
    expect(getByText("CustomToken2 approval")).toBeDefined();
  });

  test("renders modal with correct styling", () => {
    const { container } = render(<TransactionModal {...defaultProps} />);
    const modalCard = container.querySelector(".bg-neutral-900");
    expect(modalCard).toBeDefined();
    expect(modalCard?.className).includes("border-amber-900/20");
  });

  test("renders backdrop", () => {
    const { container } = render(<TransactionModal {...defaultProps} />);
    const backdrop = container.querySelector(".absolute.inset-0.bg-black\\/50");
    expect(backdrop).toBeDefined();
  });

  test("displays transaction progress title", () => {
    const { getByText } = render(<TransactionModal {...defaultProps} />);
    expect(getByText("Transaction Progress")).toBeDefined();
  });
});
